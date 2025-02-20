import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";

interface ComplaintsResponse {
  complaint: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");
  if (!requestId) {
    return NextResponse.json({
      message: "Request ID is required",
      status: 400,
    });
  }

  const { data, error } = await supabase
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
  `)
  .eq("complaint_id", requestId)
  .single();

  if (error) {
    logger.error(`Error fetching complaint: ${error.message}`);
    return NextResponse.json({
      message: "Error fetching complaint",
      status: error.code,
    });
  }

  logger.info(`Successfully fetched complaint ${requestId}`);
  return NextResponse.json<ComplaintsResponse>({
    complaint: data,
    message: "Complaint fetched successfully",
    status: 200,
  });
}
