"use server";

import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { validatePriority } from "@/models/complaint";
import { validateStatus } from "@/models/task";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define task schema validation
const taskSchema = z.object({
  task_id: z.string().optional(),
  deadline: z.string().refine((date) => {
    return !isNaN(Date.parse(date));
  }, { message: "Invalid date" }),
  complaint_id: z.string( { message: "Invalid complaint ID" }),
  status: z.string().refine(validateStatus, { message: "Invalid task status" }),
  priority: z.string().refine(validatePriority, { message: "Invalid task priority" }),
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(50, { message: "Title cannot exceed 100 characters" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description cannot exceed 500 characters" })
});

export async function onAssignTask(
  formData: FormData
): Promise<{ success: boolean; error?: z.ZodError | string }> {
  const supabase = await createClient();
  const data = {
    deadline: formData.get("date") as string,
    status: formData.get("status") as string,
    complaint_id: formData.get("complaint_id") as string,
    staff_id: formData.get("staff_id") as string,
    priority: formData.get("priority") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  };
  // Validate input data
  const result = taskSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  try {
    // Insert Task into "staff_tasks" Table
    const { data: taskData, error: taskError } = await supabase
      .from("staff_tasks")
      .insert({
        deadline: data.deadline,
        status: data.status,
        complaint_id: data.complaint_id,
        staff_id: data.staff_id,
        priority: data.priority,
        title: data.title,
        description: data.description,
      })
      .select("*")
      .single();

    if (taskError) {
      logger.error("Error assigning task", taskError);
      return { success: false, error: "Error assigning task" };
    }

    // Revalidate cache to reflect the new assignment
    revalidatePath(`/staffmanager/complaints/details/${data.complaint_id}`);

    logger.info("Successfully assigned task");
    return { success: true };
  } catch (error: any) {
    logger.error("Unexpected error assigning task", error);
    return { success: false, error: "An unexpected error ocssscurred" };
  }
}
