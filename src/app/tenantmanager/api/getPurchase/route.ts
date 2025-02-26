import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Purchase } from "@/models/purchase";

interface StaffResponse {
  purchase: Purchase[];
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
    .from("purchase_orders")
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

  const { data: purchase, error: purchaseError, count } = await query;
  

  if (purchaseError) {
    logger.error(`Staffs Error: ${purchaseError.message}`);
    return NextResponse.json({
      message: "Error fetching purchase",
      status: purchaseError.code,
    });
  }

  return NextResponse.json<StaffResponse>({
    purchase: purchase,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    message: "Successfully fetched purchase",
    status: 200,
  });
}
