import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Staff, StaffWithTasks } from "@/models/staff";

interface StaffResponse {
  staffs: StaffWithTasks[];
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const complaintId = searchParams.get("complaintId");

  if (!complaintId) {
    return NextResponse.json({
      message: "Complaint ID parameter is required",
      status: 400,
    });
  }

  const supabase = await createClient();
  try {
    const { data: staffs, error: staffsError } = await supabase
      .from("staff")
      .select(
        `
        *,
        staff_tasks!inner 
        (task_id, staff_id, priority, status, deadline, title, description)
      `
      )
      .eq("staff_tasks.complaint_id", complaintId);

    if (staffsError) {
      logger.error(`Staffs Error: ${staffsError.message}`);
      return NextResponse.json({
        message: "Error fetching assigned staffs",
        status: staffsError.code,
      });
    }

    if (!staffs || staffs.length === 0) {
      return NextResponse.json<StaffResponse>({
        staffs: [],
        message: "No staff assigned to this complaint",
        status: 200,
      });
    }

    const transformedStaffs = staffs.map(staff => {
      // Extract the first task (or null if there are none)
      const task = Array.isArray(staff.staff_tasks) && staff.staff_tasks.length > 0 
        ? staff.staff_tasks[0] 
        : null;

      // Return staff with staff_tasks as a single object
      return {
        ...staff,
        staff_tasks: task, 
      };
    });

    return NextResponse.json<StaffResponse>({
      staffs: transformedStaffs,
      message: "Successfully fetched assigned staffs",
      status: 200,
    });
  } catch (error: any) {
    logger.error(`Staffs Error: ${error.message}`);
    return NextResponse.json({
      message: "Error fetching assigned staffs",
      status: error.code || 500,
      error: error.message,
    });
  }
}
