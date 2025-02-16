"use server";

import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToBucket } from "@/lib/supabaseUploader";
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
  complaint_id: z.string().optional(),
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
  const files = formData.getAll("attachments") as File[];
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
    const { data: complaintData, error } = await supabase
      .from("complaints")
      .insert(data)
      .select("*")
      .single();
    if (error) {
      logger.error(`Error adding request: ${error.message}`);
      throw new Error("Error adding request");
    }

    if (!complaintData) {
      logger.error("complaintData is undefined");
      throw new Error("complaint_id is undefined");
    }

    if (files && files.length > 0) {
      const fileUploads = await uploadFilesToBucket(
        files,
        complaintData.complaint_id,
        data.tenant_id,
        "tenant-mis",
        "complaints"
      );

      if (!fileUploads || fileUploads.length === 0) {
        logger.error("No files were uploaded successfully");
        await supabase
          .from("complaints")
          .delete()
          .eq("complaint_id", complaintData.complaint_id);
        throw new Error("No files were uploaded");
      }

      const { error: fileError } = await supabase
        .from("complaints_attachments")
        .insert(fileUploads);

      if (fileError) {
        logger.error(`Error saving file metadata: ${fileError.message}`);
        await supabase
          .from("complaints")
          .delete()
          .eq("complaint_id", complaintData.complaint_id);
        throw new Error("Error saving file metadata");
      }
    }
    logger.info("Request added successfully");
  }

  revalidatePath("/tenant/request");

  return result;
}
