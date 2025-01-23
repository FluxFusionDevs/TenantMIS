import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import logger from "@/logger/logger";

interface ComplaintsResponse {
  complaints: any;
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  // const { userId } = req.query;

  const { data: complaints, error: complaintsError } = await supabase
    .from("complaints")
    .select("*");

  if (complaintsError) {
    logger.error(`Complaints Error: ${complaintsError.message}`);
    return NextResponse.json({
      message: "Tenant not found",
      status: complaintsError.code,
    });
  }

  logger.info(`Successfully fetched complaints ${complaints}`);
  return NextResponse.json<ComplaintsResponse>({
    complaints,
    message: "Tenant found",
    status: 200,
  });
}
