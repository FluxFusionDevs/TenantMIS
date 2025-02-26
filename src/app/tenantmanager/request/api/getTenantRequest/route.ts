import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";

interface TenantResponse {
  tenant: any;
  contract: any;
  complaints: any[];
  message: string;
  status: number;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const tenantId = searchParams.get("tenantId");

  if (!tenantId) {
    return NextResponse.json({
      message: "Tenant ID is required",
      status: 400,
    });
  }

  try {
    // Fetch tenant details
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .select("*")
      .eq("tenant_id", tenantId)
      .single();

    if (tenantError) {
      logger.error(`Error fetching tenant: ${tenantError.message}`);
      throw new Error("Error fetching tenant");
    }

    // Fetch tenant's contract
    const { data: contract, error: contractError } = await supabase
      .from("contracts")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("contract_start", { ascending: false }) // Get latest contract
      .limit(1)
      .single();

    if (contractError) {
      logger.warn(`No contract found for tenant ${tenantId}`);
    }

    // Fetch tenant's complaints
    const { data: complaints, error: complaintsError } = await supabase
      .from("complaints")
      .select("*")
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false });

    if (complaintsError) {
      logger.warn(`No complaints found for tenant ${tenantId}`);
    }

    logger.info(`Successfully fetched data for tenant ${tenantId}`);
    return NextResponse.json<TenantResponse>({
      tenant,
      contract: contract || null,
      complaints: complaints || [],
      message: "Data fetched successfully",
      status: 200,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    logger.error(`Error fetching data: ${errorMessage}`);
    return NextResponse.json({
      message: "Error fetching data",
      status: 500,
    });
  }
}
