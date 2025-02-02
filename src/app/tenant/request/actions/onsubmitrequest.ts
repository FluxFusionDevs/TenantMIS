"use server";

import { supabase } from "@/lib/supabaseClient";
import logger from "@/logger/logger";
import {
  Complaint,
  validateCategory,
  validatePriority,
  validateStatus,
} from "@/models/complaint";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const requestSchema = z.object({
  description: z.string().min(10, { message: "Description is too short" }),
  status: z.string().refine(validateStatus, { message: "Invalid status" }),
  priority: z
    .string()
    .refine(validatePriority, { message: "Invalid priority" }),
  category: z
    .string()
    .refine(validateCategory, { message: "Invalid category" }),
  tenant_id: z.string().min(1, { message: "Tenant ID is required" }),
  subject: z.string().min(1, { message: "Subject is required" }),
});

export async function onSubmitRequest(
  formData: FormData
): Promise<
  z.SafeParseReturnType<
    (typeof requestSchema)["_input"],
    (typeof requestSchema)["_output"]
  >
> {
  const data: Complaint = {
    subject: formData.get("subject") as string,
    category: validateCategory(formData.get("category") as string),
    description: formData.get("description") as string,
    priority: validatePriority(formData.get("priority") as string),
    status: validateStatus(formData.get("status") as string),
    tenant_id: formData.get("tenant_id") as string,
  };

  const result = requestSchema.safeParse(data);

  if (result.success) {
    // Save data to the database
    const { error } = await supabase.from("complaints").insert(data);
    if (error) {
      logger.error(`Error adding request: ${error.message}`);
      throw new Error("Error adding request");
    }
    logger.info("Request added successfully");
  }

  revalidatePath("/tenant/request");

  return result;
}
