import { NextRequest, NextResponse } from "next/server";
import logger from "@/logger/logger";
import { createClient } from "@/lib/supabaseServer";

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
  .select(`
    *,
    complaints_attachments (
      attachment_id,
      file_name,
      file_type,
      file_size,
      file_url,
      uploaded_at
    )
  `, { count: "exact" })
  .range(start, end);

  if (searchQuery) {
    query = query.or(`subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  const { data: complaints, error: complaintsError, count } = await query;

  if (complaintsError) {
    logger.error(`Complaints Error: ${complaintsError.message}`);
    return NextResponse.json({
      message: "Error fetching complaints",
      status: complaintsError.code,
    });
  }

  logger.info(`Successfully fetched complaints`);
  return NextResponse.json<ComplaintsResponse>({
    complaints,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    message: "Complaints fetched successfully",
    status: 200,
  });
}