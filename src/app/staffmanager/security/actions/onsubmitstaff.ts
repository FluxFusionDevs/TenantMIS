"use server";

import { supabase } from "@/lib/supabaseClient";
import { uploadFilesToBucket } from "@/lib/supabaseUploader";
import logger from "@/logger/logger";
import {
  Staff,
  StaffShift,
  StaffWithShifts,
  validateCategory,
  validateStatus,
} from "@/models/staff";
import { PostgrestError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const staffSchema = z.object({
  staff_id: z.string().optional(),
  name: z.string().max(50, { message: "Name is too long" }),
  role: z.string().refine(validateCategory, { message: "Invalid role" }),
  phone_number: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number cannot exceed 11 digits"),
  email: z.string().email(),
  status: z.string().refine(validateStatus, { message: "Invalid status" }),
  picture: z.string().optional(),
  staff_shifts: z.array(
    z.object({
      shift_id: z.number(),
      staff_id: z.number(),
      day_of_week: z.string(),
      shift_start: z.string(),
      shift_end: z.string(),
    })
  ),
});

export async function onSubmitStaff(
  formData: FormData
): Promise<
  z.SafeParseReturnType<
    (typeof staffSchema)["_input"],
    (typeof staffSchema)["_output"]
  >
> {
  const files = formData.getAll("files") as File[];

  const data: StaffWithShifts = {
    name: formData.get("name") as string,
    role: validateCategory("SECURITY" as string),
    phone_number: formData.get("phone_number") as string,
    email: formData.get("email") as string,
    status: validateStatus(formData.get("status") as string),
    picture: "",
    staff_shifts: JSON.parse(
      formData.get("staff_shifts") as string
    ) as StaffShift[],
  };

  const result = staffSchema.safeParse(data);

  if (result.success) {
    const { staff_shifts, ...staffWithoutShifts } = data;
    // Save data to the database
    const { data: staffData, error } = (await supabase
      .from("staff")
      .insert(staffWithoutShifts)
      .select("*")
      .single()) as { data: Staff | null; error: PostgrestError | null };

    if (error) {
      if (error.code === "23505" && error.message.includes("staff_email_key")) {
        throw new Error("Email already exists");
      }
      if (error.code === "23505" && error.message.includes("staff_phone_key")) {
        throw new Error("Phone number already exists");
      }
      throw new Error("Error adding staff");
    }
    if (!staffData) {
      logger.error("staffData is undefined");
      throw new Error("staffData is undefined");
    }

    const shifts = staff_shifts.map(({ shift_id, ...shiftData }) => ({
      ...shiftData,
      staff_id: staffData.staff_id,
    }));
    
    const { error: shiftError } = await supabase
      .from("staff_shifts")
      .insert(shifts);

    if (shiftError) {
      logger.error(`Error adding staff shifts: ${shiftError.message}`);
      await supabase.from("staff").delete().eq("staff_id", staffData.staff_id);
      throw new Error("Error adding staff shifts");
    }

    if (files && files.length > 0) {
      const fileUploads = await uploadFilesToBucket(
        files,
        staffData.staff_id!,
        formData.get("userId") as string,
        "tenant-mis",
        "staff-profiles"
      );

      if (!fileUploads || fileUploads.length === 0) {
        logger.error("No files were uploaded successfully");
        await supabase
          .from("staff")
          .delete()
          .eq("staff_id", staffData.staff_id);
        throw new Error("No files were uploaded");
      }

      const { error: fileError } = await supabase
        .from("staff")
        .update({ picture: fileUploads[0].file_url });

      if (fileError) {
        logger.error(`Error saving file metadata: ${fileError.message}`);
        await supabase
          .from("staff")
          .delete()
          .eq("staff_id", staffData.staff_id);
        throw new Error("Error saving file metadata");
      }
    }
    logger.info("Staff added successfully");
  }

  revalidatePath("/staffmanager/security");

  return result;
}
