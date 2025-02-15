import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import logger from "@/logger/logger";
import { StaffWithShifts } from "@/models/staff";

interface StaffResponse {
  staff: StaffWithShifts;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get("staffId");
  const role = searchParams.get("role");

  if (!staffId) {
    logger.error("Staff ID is required");
    return NextResponse.json({
      message: "Staff ID is required",
      status: 400,
    });
  }

  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select(`
      *,
      staff_shifts (
        shift_id,
        day_of_week,
        shift_start,
        shift_end
      )
    `)
    .eq("staff_id", staffId)
    .eq("role", role)
    .single();


  if (staffError) {
    logger.error(`Staff Error: ${staffError.message}`);
    return NextResponse.json({
      message: "Error fetching staff",
      status: staffError.code,
    });
  }

  if (!staff) {
    logger.error(`Staff not found with ID: ${staffId}`);
    return NextResponse.json({
      message: "Staff not found",
      status: 404,
    });
  }

  logger.info(`Successfully fetched staff with ID ${staffId}`);
  return NextResponse.json<StaffResponse>({
    staff,
    message: "Successfully fetched staff",
    status: 200,
  });
}