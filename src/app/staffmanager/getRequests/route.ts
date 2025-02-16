import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import logger from "@/logger/logger";

interface ComplaintsResponse {
  complaints: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
  const staffId = searchParams.get("staffId");

let query = supabase
  .from("staff_tasks")
  .select(`
    task_id,
    staff_id,
    status,
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
  `, { count: "exact" })
  .eq("staff_id", staffId)
  .eq("complaints.category", role)
  .order('task_id', { ascending: false })
  .limit(5);

  const { data: complaints, error: complaintsError, count } = await query;

  if (complaintsError) {
    logger.error(`Complaints Error: ${complaintsError.message}`);
    return NextResponse.json({
      message: "Error fetching complaints",
      status: complaintsError.code,
    });
  }

  logger.info(`Successfully fetched complaints for role ${role}`);
  return NextResponse.json<ComplaintsResponse>({
    complaints,
    message: "Complaints fetched successfully",
    status: 200,
  });
}