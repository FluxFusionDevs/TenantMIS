import { NextRequest, NextResponse } from "next/server";
import logger from "@/logger/logger";
import { createClient } from "@/lib/supabaseServer";
import { Complaint, ComplaintWithStaffAssigned } from "@/models/complaint";
import { Staff } from "@/models/staff";

interface ComplaintsResponse {
  complaints: any;
  message: string;
  status: number;
  totalPages: number;
  currentPage: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 2;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const supabase = await createClient();

  let query = supabase
    .from("complaints")
    .select(
      `
    *,
    complaints_attachments (
      attachment_id,
      file_name,
      file_type,
      file_size,
      file_url,
      uploaded_at
    ),
    staff_tasks (
      staff_id,
      task_id,
      deadline,
      status,
        staff (
          staff_id,
          name,
          email,
          phone_number
        )
    )
  `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false }) // Order by newest complaints
    .range(start, end);

  if (searchQuery) {
    query = query.or(
      `subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`
    );
  }

  const { data: complaints, error: complaintsError, count } = await query;
  // console.log(complaints);

  if (complaintsError) {
    logger.error(`Complaints Error: ${complaintsError.message}`);
    return NextResponse.json({
      message: "Error fetching complaints",
      status: complaintsError.code,
    });
  }

  const complaintsResult: ComplaintWithStaffAssigned[] = complaints.map((complaint: any) => {
    return {
      ...complaint,
      staff_assigned:
        complaint.staff_tasks.length > 0 ? complaint.staff_tasks.map((task: any) => task.staff) : [],
    };
  });


  logger.info(`Successfully fetched complaints`);
  return NextResponse.json<ComplaintsResponse>({
    complaints: complaintsResult,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    message: "Complaints fetched successfully",
    status: 200,
  });
}
