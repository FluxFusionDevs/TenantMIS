import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
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
  const pageSize = 15;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const supabase = await createClient();
  let query = supabase
    .from("staff")
    .select(
      `
    *,
    staff_shifts (
      staff_id,
      shift_id,
      day_of_week,
      shift_start,
      shift_end
    )
  `,
      { count: "exact" }
    )
    .range(start, end);

  if (role) {
    query = query.eq("role", role);
  }
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

  return NextResponse.json<StaffResponse>({
    staffs: staffs,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    message: "Successfully fetched staffs",
    status: 200,
  });
}
