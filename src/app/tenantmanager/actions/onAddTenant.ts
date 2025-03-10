"use server";

import { createClient } from "@/lib/supabaseServer";
import { uploadFilesToBucket } from "@/lib/supabaseUploader";
import { z } from "zod";
import logger from "@/logger/logger";
import { revalidatePath } from "next/cache";
import { Tenant } from "@/models/tenant";

const tenantSchema = z.object({
  first_name: z.string().max(50, { message: "First name is too long" }),
  last_name: z.string().max(50, { message: "Last name is too long" }),
  email: z.string().email(),
  contact_no: z
    .string()
    .regex(/^\d+$/, "Contact number must contain only digits")
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number cannot exceed 15 digits"),
  picture: z.string().optional(),
});

export async function onAddTenant(
  formData: FormData
): Promise<z.SafeParseReturnType<(typeof tenantSchema)["_input"], (typeof tenantSchema)["_output"]>> {
  const supabase = await createClient();
  const picture = formData.get("picture") as File | null;

  const data: Omit<Tenant, "tenant_id"> = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    email: formData.get("email") as string,
    contact_no: formData.get("contact_no") as string,
    picture: "",
  };

  const result = tenantSchema.safeParse(data);
  if (!result.success) {
    logger.warn(`Validation failed: ${JSON.stringify(result.error.issues)}`);
    return result;
  }

  try {
    // Insert tenant data without picture first
    const { data: insertedTenant, error: insertError } = await supabase
      .from("tenants")
      .insert([data])
      .select("*")
      .single();

    if (insertError) {
      if (insertError.code === "23505") {
        if (insertError.message.includes("tenants_email_key")) {
          throw new Error("Email already exists");
        }
        if (insertError.message.includes("tenants_contact_key")) {
          throw new Error("Contact number already exists");
        }
      }
      throw new Error("Error adding tenant");
    }

    if (!insertedTenant) {
      throw new Error("Tenant insertion failed, no data returned.");
    }

    // Handle picture upload if provided
    if (picture) {
      const fileUploads = await uploadFilesToBucket(
        [picture],
        insertedTenant.tenant_id!,
        formData.get("userId") as string,
        "tenant-mis",
        "tenant-profiles"
      );

      if (!fileUploads || fileUploads.length === 0) {
        logger.error("File upload failed, rolling back tenant record.");
        await supabase.from("tenants").delete().eq("tenant_id", insertedTenant.tenant_id);
        throw new Error("No files were uploaded");
      }

      const { error: fileError } = await supabase
        .from("tenants")
        .update({ picture: fileUploads[0].file_url })
        .eq("tenant_id", insertedTenant.tenant_id);

      if (fileError) {
        logger.error(`Error saving file metadata: ${fileError.message}`);
        await supabase.from("tenants").delete().eq("tenant_id", insertedTenant.tenant_id);
        throw new Error("Error saving file metadata");
      }
    }

    logger.info(`Tenant ${insertedTenant.tenant_id} added successfully`);
    revalidatePath("/tenants");

    return result;
  } catch (error) {
    logger.error(`Error adding tenant: ${error}`);
    return {
      success: false,
      error,
    } as unknown as z.SafeParseReturnType<(typeof tenantSchema)["_input"], (typeof tenantSchema)["_output"]>;
  }
}
