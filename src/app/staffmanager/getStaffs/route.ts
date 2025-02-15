import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import logger from "@/logger/logger";
import { Staff } from "@/models/staff";


interface StaffResponse {
    staffs: Staff[];
    message: string;
    status: number;
    totalPages: number;
    currentPage: number;
    }

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role");
    const searchQuery = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 2;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  if (!role) {
    logger.error("Role is required");
    return NextResponse.json({
      message: "Role is required",
      status: 400,
    });
  }

 let query = supabase
  .from("staff")
  .select(`
    *,
    staff_shifts (
      shift_id,
      day_of_week,
      shift_start,
      shift_end
    )
  `, { count: "exact" })
  .eq("role", role)
  .range(start, end);

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%`);
  }

  const { data: staffs, error: staffsError, count } = await query;

  if (staffsError) {
    logger.error(`Staffs Error: ${staffsError.message}`);
    return NextResponse.json({
      message: "Error fetching staffs",
      status: staffsError.code,
    });
  }

  logger.info(`Successfully fetched staffs for role ${role}`);
  return NextResponse.json<StaffResponse>({
    staffs: staffs,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    message: "Successfully fetched staffs",
    status: 200,
  });
}