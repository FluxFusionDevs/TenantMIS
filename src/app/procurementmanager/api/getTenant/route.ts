import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Tenant } from "@/models/tenant";

interface StaffResponse {
  tenant: Tenant[];
  message: string;
  status: number;
  totalPages: number;
  currentPage: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 15;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;
  const supabase = await createClient();
  let query = supabase
    .from("tenants")
    .select(
      `
    *
  `,
      { count: "exact" }
    )
    .range(start, end);

  if (searchQuery) {
    query = query.or(`name.ilike.%${searchQuery}%`);
  }

  const { data: tenants, error: tenantsError, count } = await query;
  

  if (tenantsError) {
    logger.error(`Staffs Error: ${tenantsError.message}`);
    return NextResponse.json({
      message: "Error fetching tenants",
      status: tenantsError.code,
    });
  }

  return NextResponse.json<StaffResponse>({
    tenant: tenants,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    message: "Successfully fetched tenants",
    status: 200,
  });
}
