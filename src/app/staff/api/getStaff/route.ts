import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { StaffWithShifts } from "@/models/staff";

interface StaffResponse {
  staff: StaffWithShifts;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    logger.error("userId ID is required");
    return NextResponse.json({
      message: "userId ID is required",
      status: 400,
    });
  }

  const { data: staff, error: staffError } = await supabase
    .from("staff")
    .select(`
      *,
      staff_shifts (
      staff_id,
        shift_id,
        day_of_week,
        shift_start,
        shift_end
      )
    `)
    .eq("user_id", userId)
    .single();

  if (staffError) {
    logger.error(`Staff Error: ${staffError.message}`);
    return NextResponse.json({
      message: "Error fetching staff",
      status: staffError.code,
    });
  }

  if (!staff) {
    logger.error(`Staff not found with ID: ${userId}`);
    return NextResponse.json({
      message: "Staff not found",
      status: 404,
    });
  }

  logger.info(`Successfully fetched staff with ID ${userId}`);
  return NextResponse.json<StaffResponse>({
    staff,
    message: "Successfully fetched staff",
    status: 200,
  });
}