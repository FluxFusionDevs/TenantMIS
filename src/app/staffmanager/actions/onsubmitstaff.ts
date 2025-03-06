"use server";

import { createClient } from "@/lib/supabaseServer";
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
      staff_id: z.string(),
      day_of_week: z.string(),
      shift_start: z.string(),
      shift_end: z.string(),
    })
  ),
});
export async function onSubmitStaff(
  formData: FormData
): Promise<{ success: boolean; error?: z.ZodError | string }> {
  const supabase = await createClient();
  const picture = formData.get("picture") as File;

  const data: StaffWithShifts = {
    name: formData.get("name") as string,
    password: formData.get("password") as string,
    role: validateCategory(formData.get("role") as string),
    phone_number: formData.get("phone_number") as string,
    email: formData.get("email") as string,
    status: validateStatus(formData.get("status") as string),
    picture: "",
    staff_shifts: JSON.parse(formData.get("staff_shifts") as string) as StaffShift[],
  };

  // Validate input data
  const result = staffSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  try {
    // Step 1: Create User Account in Supabase Auth
    const { data: accountData, error: accountError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
    });

    if (accountError) {
      logger.error("Error creating staff account");
      return { success: false, error: "Error creating staff account" };
    }

    const userId = accountData?.user.id;
    if (!userId) {
      logger.error("Error user id not generated");
      return { success: false, error: "User ID not generated" };
    }

    const { password, staff_shifts, ...cleanedStaff } = data; // Exclude password
    // Step 2: Insert Staff into "staff" Table
    const { data: staffData, error: staffError } = await supabase
      .from("staff")
      .insert({ ...cleanedStaff, user_id: userId })
      .select("*")
      .single();

    if (staffError) {
      // **Rollback: Delete created user from Supabase Auth**
      await supabase.auth.admin.deleteUser(userId);
      logger.error("Error adding staff into staff table ", staffError);
      return { success: false, error: "Error adding staff" };
    }

    const staffId = staffData.staff_id;

    // Step 3: Insert Shifts into "staff_shifts" Table
    const shifts = data.staff_shifts.map(({ shift_id, ...shiftData }) => ({
      ...shiftData,
      staff_id: staffId,
    }));

    const { error: shiftError } = await supabase.from("staff_shifts").insert(shifts);

    if (shiftError) {
      // **Rollback: Delete staff & user account**
      await supabase.from("staff").delete().eq("staff_id", staffId);
      await supabase.auth.admin.deleteUser(userId);
      logger.error("Error adding staff shifts");
      return { success: false, error: "Error adding staff shifts" };
    }

    // Step 4: Handle File Upload
    if (picture) {
      const fileUploads = await uploadFilesToBucket(
        [picture],
        staffId,
        formData.get("userId") as string,
        "tenant-mis",
        "staff-profiles"
      );

      if (!fileUploads || fileUploads.length === 0) {
        // **Rollback: Delete staff, user, and shifts**
        await supabase.from("staff_shifts").delete().eq("staff_id", staffId);
        await supabase.from("staff").delete().eq("staff_id", staffId);
        await supabase.auth.admin.deleteUser(userId);
        logger.error("Error uploading profile picture");
        return { success: false, error: "Error uploading profile picture" };
      }

      // Update staff record with profile picture URL
      const { error: fileError } = await supabase
        .from("staff")
        .update({ picture: fileUploads[0].file_url })
        .eq("staff_id", staffId);

      if (fileError) {
        // **Rollback: Delete everything if image update fails**
        await supabase.from("staff_shifts").delete().eq("staff_id", staffId);
        await supabase.from("staff").delete().eq("staff_id", staffId);
        await supabase.auth.admin.deleteUser(userId);
        return { success: false, error: "Error saving file metadata" };
      }
    }

    // Success: Everything inserted correctly
    revalidatePath(`/staffmanager/${data.role.toLowerCase()}`);
    logger.info("Successfully added staff");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "An unexpected error occurred" };
  }
}
