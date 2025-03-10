import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { StaffShift } from "@/models/staff";

interface StaffResponse {
  shifts: StaffShift[];
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get("staffId");
  const supabase = await createClient();
 
  let query = supabase
  .from("staff_shifts")
  .select("*", { count: "exact" })
  .eq("staff_id", staffId);

  const { data: shifts, error: shiftsError, count } = await query;
  

  if (shiftsError) {
    logger.error(`shifts Error: ${shiftsError.message}`);
    return NextResponse.json({
      message: "Error fetching shifts",
      status: shiftsError.code,
    });
  }

  return NextResponse.json<StaffResponse>({
    shifts: shifts,
    message: "Successfully fetched shifts",
    status: 200,
  });
}
