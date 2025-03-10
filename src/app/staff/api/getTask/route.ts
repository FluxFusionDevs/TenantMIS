import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Complaint } from "@/models/complaint";
import { Task } from "@/models/task";

interface TaskResponse {
  task: Task | null;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");
  const supabase = await createClient();

  let query = supabase
    .from("staff_tasks")
    .select(
      `
    task_id,
    staff_id,
    deadline,
    status,
    priority,
    title,
    description,
    complaints!inner (
      *,
      complaints_attachments (
        attachment_id,
        file_name,
        file_type,
        file_size,
        file_url,
        uploaded_at
      )
    )
  `,
      { count: "exact" }
    )
    .eq("task_id", taskId)
    .order("task_id", { ascending: false });

  const { data: taskData, error: taskError } = await query.maybeSingle();

  if (taskError) {
    logger.error(`Task Error: ${taskError.message}`);
    return NextResponse.json({
      message: "Error fetching task",
      status: taskError.code,
    });
  }

  let task: Task | null = null;

  if (taskData) {
    let complaintId;
    let complaintData;

    if (Array.isArray(taskData.complaints)) {
      // If it's an array, get the complaint_id from the first item
      complaintId = taskData.complaints[0]?.complaint_id;
      complaintData = taskData.complaints[0];
    } else {
      // If it's an object, access directly
      complaintId = (taskData.complaints as { complaint_id: string }).complaint_id;
      complaintData = taskData.complaints;
    }

    task = {
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      task_id: taskData.task_id,
      deadline: taskData.deadline,
      status: taskData.status,
      complaints: complaintData, // Assuming Task interface expects a complaint property
    };
  }

  logger.info(`Successfully fetched task with ID ${taskId}`);
  return NextResponse.json<TaskResponse>({
    task,
    message: "Task fetched successfully",
    status: 200,
  });
}