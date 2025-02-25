import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";

interface ContractResponse {
  contract: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const requestId = searchParams.get("requestId");

  if (!requestId) {
    return NextResponse.json({
      message: "Request ID is required",
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("contracts")
    .select(
      `
      *,
      contracts_attachments (
        attachment_id,
        file_name,
        file_type,
        file_size,
        file_url,
        uploaded_at
      )
    `
    )
    .eq("contract_id", requestId)
    .single();

  if (error) {
    logger.error(`Error fetching contract: ${error.message}`);
    return NextResponse.json({
      message: "Error fetching contract",
      status: error.code,
    });
  }

  logger.info(`Successfully fetched contract ${requestId}`);
  return NextResponse.json<ContractResponse>({
    contract: data,
    message: "Contract fetched successfully",
    status: 200,
  });
}
