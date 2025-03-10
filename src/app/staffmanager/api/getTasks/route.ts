import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Complaint } from "@/models/complaint";
import { Task } from "@/models/task";

interface ComplaintsResponse {
  complaints: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const staffId = searchParams.get("staffId");
  const supabase = await createClient();
  logger.info(`Fetching complaints for role ${role} ${staffId}`);

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
    )`,
      { count: "exact" }
    )
    .order("task_id", { ascending: false });

  if (staffId) {
    query = query.eq("staff_id", staffId);
  }


  const { data: complaintsData, error: complaintsError, count } = await query;


  if (complaintsError) {
    logger.error(`Complaints Error: ${complaintsError.message}`);
    return NextResponse.json({
      message: "Error fetching complaints",
      status: complaintsError.code,
    });
  }

  const groupedComplaints: Task[] = [];
  const complaintIdSet = new Set();

  if (complaintsData && complaintsData.length > 0) {
    complaintsData.forEach((item) => {
      // Check if complaints exists and get the complaint_id correctly
      if (item.complaints) {
        let complaintId;
        let complaintData;

        if (Array.isArray(item.complaints)) {
          // If it's an array, get the complaint_id from the first item
          complaintId = item.complaints[0]?.complaint_id;
          complaintData = item.complaints[0];
        } else {
          // If it's an object, access directly
          complaintId = (item.complaints as { complaint_id: string })
            .complaint_id;
          complaintData = item.complaints;
        }

        // Only add if we have a valid complaint ID and haven't seen it before
        if (complaintId && !complaintIdSet.has(complaintId)) {
          complaintIdSet.add(complaintId);

          const taskItem: Task = {
            title: item.title,
            description: item.description,
            priority: item.priority,
            task_id: item.task_id,
            deadline: item.deadline,
            status: item.status,
            complaints: complaintData, // Assuming Task interface expects a complaint property
          };

          groupedComplaints.push(taskItem);
        }
      }
    });
  }
  logger.info(`Successfully fetched complaints for role ${role}`);
  return NextResponse.json<ComplaintsResponse>({
    complaints: groupedComplaints,
    message: "Complaints fetched successfully",
    status: 200,
  });
}
