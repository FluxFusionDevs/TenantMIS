import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Staff } from "@/models/staff";

interface StaffResponse {
  staffs: Staff[];
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const complaintId = searchParams.get("complaintId");

  const supabase = await createClient();

  const staffTasksQuery = supabase
    .from("staff_tasks")
    .select("staff_id")
    .eq("complaint_id", complaintId);

  const { data: staffTasks, error: staffTasksError } = await staffTasksQuery;

  if (staffTasksError) {
    logger.error(`Staff Tasks Error: ${staffTasksError.message}`);
    return NextResponse.json({
      message: "Error fetching staff tasks",
      status: staffTasksError.code,
    });
  }


  let query = supabase
    .from("staff")
    .select(
      `
    *,
    staff_shifts (
      shift_id,
      day_of_week,
      shift_start,
      shift_end
    )
  `
    )
    .eq("status", "AVAILABLE") // Filter by status
    .not("staff_shifts.shift_id", "is", null) // Filter out staffs without shifts

  const { data: staffs, error: staffsError } = await query;

  if (staffsError) {
    logger.error(`Staffs Error: ${staffsError.message}`);
    return NextResponse.json({
      message: "Error fetching available staffs",
      status: staffsError.code,
    });
  }

  
  // Filter out staffs with tasks
  const availableStaffs = staffs.filter((staff) => {
    return !staffTasks.some((task) => task.staff_id === staff.staff_id);
  });

  return NextResponse.json<StaffResponse>({
    staffs: availableStaffs,
    message: "Successfully fetched available staffs",
    status: 200,
  });
}
