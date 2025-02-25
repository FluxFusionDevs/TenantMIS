import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";

interface ContractResponse {
  contracts: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const  { data: userData }= await supabase.auth.getUser();
  const user = userData.user;
  if (!user) {
    return NextResponse.json({
      message: "User is not authenticated",
      status: 401,
    });
  }
 

  const { data, error } = await supabase
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
    ),
    tenants (
     user_id
    )
  `)
  .eq("tenants.user_id", user.id).single();

  if (error) {
    logger.error(`Error fetching contract: ${error.message}`);
    return NextResponse.json({
      message: "Error fetching complaint",
      status: error.code,
    });
  }

  logger.info(`Successfully fetched contracts for tenant: ${user.id}`);

  return NextResponse.json<ContractResponse>({
    contracts: data,
    message: "Contract fetched successfully",
    status: 200,
  });
}
