"use server";

import { createClient } from "@/lib/supabaseServer";
import { uploadFilesToBucket } from "@/lib/supabaseUploader";
import logger from "@/logger/logger";
import {
  StaffShift,
  StaffWithShifts,
  validateCategory,
  validateStatus,
} from "@/models/staff";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const staffUpdateSchema = z.object({
  staff_id: z.string(),
  name: z.string().max(50, { message: "Name is too long" }),
  role: z.string().refine(validateCategory, { message: "Invalid role" }),
  phone_number: z
    .string()
    .regex(/^\d+$/, "Phone number must contain only digits")
    .min(11, "Phone number must be at least 11 digits")
    .max(11, "Phone number cannot exceed 11 digits"),
  email: z.string().email(),
  status: z.string().refine(validateStatus, { message: "Invalid status" }),
  staff_shifts: z
    .array(
      z.object({
        shift_id: z.number().optional(),
        staff_id: z.number().min(1, "Staff ID is required"),
        day_of_week: z.string().min(1, "Day of week is required"),
        shift_start: z.string().min(1, "Shift start time is required"),
        shift_end: z.string().min(1, "Shift end time is required"),
      })
    )
    .min(1, "At least one shift is required"),
});

export async function onUpdateStaff(
  formData: FormData
): Promise<
  z.SafeParseReturnType<
    (typeof staffUpdateSchema)["_input"],
    (typeof staffUpdateSchema)["_output"]
  >
> {
  console.log("Trying to update staff");
  const supabase = await createClient();
  const data: StaffWithShifts = {
    staff_id: formData.get("staff_id") as string,
    name: formData.get("name") as string,
    role: validateCategory(formData.get("role") as string),
    phone_number: formData.get("phone_number") as string,
    email: formData.get("email") as string,
    status: validateStatus(formData.get("status") as string),
    staff_shifts: JSON.parse(
      formData.get("staff_shifts") as string
    ) as StaffShift[],
  };

  const result = staffUpdateSchema.safeParse(data);
  if (result.success) {
    const { staff_shifts, ...staffWithoutShifts } = data;

    // Update staff data
    const { error: updateError } = await supabase
      .from("staff")
      .update(staffWithoutShifts)
      .eq("staff_id", data.staff_id);

    if (updateError) {
      if (
        updateError.code === "23505" &&
        updateError.message.includes("staff_email_key")
      ) {
        throw new Error("Email already exists");
      }
      if (
        updateError.code === "23505" &&
        updateError.message.includes("staff_phone_key")
      ) {
        throw new Error("Phone number already exists");
      }
      throw new Error("Error updating staff");
    }

    // Delete existing shifts
    await supabase.from("staff_shifts").delete().eq("staff_id", data.staff_id);

    // Insert new shifts
    const shifts = staff_shifts.map(({ shift_id, ...shiftData }) => ({
      ...shiftData,
      staff_id: data.staff_id,
    }));

    const { error: shiftError } = await supabase
      .from("staff_shifts")
      .insert(shifts);

    if (shiftError) {
      logger.error(`Error updating staff shifts: ${shiftError.message}`);
      throw new Error("Error updating staff shifts");
    }

    logger.info(`Staff ${data.staff_id} updated successfully`);
  }

  revalidatePath("/staffmanager/security");
  return result;
}

export async function updateProfileImage(formData: FormData) {
  try {
    const supabase = await createClient();

    const staffId = formData.get("staffId") as string;
    const picture = formData.get("picture") as File;

    if (!picture || picture.size === 0) {
      throw new Error("No image selected");
    }

    const fileUploads = await uploadFilesToBucket(
      [picture],
      staffId,
      staffId,
      "tenant-mis",
      "staff-profiles"
    );

    if (!fileUploads || fileUploads.length === 0) {
      throw new Error("Failed to upload image");
    }

    const { error } = await supabase
      .from("staff")
      .update({ picture: fileUploads[0].file_url })
      .eq("staff_id", staffId);

    if (error) {
      throw error;
    }

    revalidatePath("/staffmanager/security/details/[staffId]");
  } catch (error) {
    logger.error(`Error updating profile image: ${error}`);
  }
}
