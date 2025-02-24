import { NextRequest, NextResponse } from "next/server";
import logger from "@/logger/logger";
import { createClient } from "@/lib/supabaseServer";

interface contractsResponse {
  contracts: any;
  message: string;
  status: number;
  totalPages: number;
  currentPage: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("search");
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = 2;
  const start = (page - 1) * pageSize;
  const end = start + pageSize - 1;

  const supabase = await createClient();
  
  let query = supabase
  .from("contracts")
  .select(`
    *,
    contracts_attachments (
      attachment_id,
      file_name,
      file_type,
      file_size,
      file_url,
      uploaded_at
    )
  `, { count: "exact" })
  .range(start, end);

  if (searchQuery) {
    query = query.or(`subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }

  const { data: contracts, error: contractsError, count } = await query;

  if (contractsError) {
    logger.error(`contracts Error: ${contractsError.message}`);
    return NextResponse.json({
      message: "Error fetching contracts",
      status: contractsError.code,
    });
  }

  logger.info(`Successfully fetched contracts`);
  return NextResponse.json<contractsResponse>({
    contracts,
    totalPages: Math.ceil((count || 0) / pageSize),
    currentPage: page,
    message: "contracts fetched successfully",
    status: 200,
  });
}