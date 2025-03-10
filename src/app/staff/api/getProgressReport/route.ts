import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Reports } from "@/models/report";

interface ReportsResponse {
  reports: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const taskId = searchParams.get("taskId");

  if (!taskId) {
    logger.error("taskId is required");
    return NextResponse.json({
      message: "taskId is required",
      status: 400,
    });
  }

  const { data: reportsData, error: reportsError } = await supabase
    .from("progress_report")
    .select(`
      progress_id,
      description,
      task_id,
      created_at,
      staff_tasks (
        task_id,
        staff_id,
        deadline,
        status,
        priority,
        title,
        description
      )
    `)
    .eq("task_id", taskId);

  if (reportsError) {
    logger.error(`Reports Error: ${reportsError.message}`);
    return NextResponse.json({
      message: "Error fetching reports",
      status: reportsError.code,
    });
  }

  if (!reportsData || reportsData.length === 0) {
    logger.error(`No reports found for task ID: ${taskId}`);
    return NextResponse.json({
      message: "No reports found",
      status: 404,
    });
  }


  logger.info(`Successfully fetched reports for task ID ${taskId}`);
  return NextResponse.json<ReportsResponse>({
    reports: reportsData,
    message: "Successfully fetched reports",
    status: 200,
  });
}