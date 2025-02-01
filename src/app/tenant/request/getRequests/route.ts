import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import logger from "@/logger/logger";

interface ComplaintsResponse {
  complaints: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");
  const searchQuery = searchParams.get("search");
  console.log("Tenant ID", tenantId);
  console.log("Search Query", searchQuery);
  if (!tenantId) {
    return NextResponse.json({
      message: "Tenant ID is required",
      status: 400,
    });
  }

  let query = supabase
    .from("complaints")
    .select("*")
    .eq("tenant_id", tenantId);

  if (searchQuery) {
    query = query.or(`subject.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
  }
  const { data: complaints, error: complaintsError } = await query;
  console.log("Complaints", complaints);
  if (complaintsError) {
    logger.error(`Complaints Error: ${complaintsError.message}`);
    return NextResponse.json({
      message: "Error fetching complaints",
      status: complaintsError.code,
    });
  }

  logger.info(`Successfully fetched complaints for tenant ${tenantId}`);
  return NextResponse.json<ComplaintsResponse>({
    complaints,
    message: "Complaints fetched successfully",
    status: 200,
  });
}