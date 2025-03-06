"use server";

import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { validatePriority } from "@/models/complaint";
import { validateStatus } from "@/models/task";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define task update schema validation
const updateTaskSchema = z.object({
  task_id: z.string({ message: "Task ID is required" }),
  deadline: z.string().refine((date) => {
    return !isNaN(Date.parse(date));
  }, { message: "Invalid date" }),
  status: z.string().refine(validateStatus, { message: "Invalid task status" }),
  priority: z.string().refine(validatePriority, { message: "Invalid task priority" }),
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(50, { message: "Title cannot exceed 50 characters" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
});

export async function onUpdateTask(
  formData: FormData
): Promise<{ success: boolean; error?: z.ZodError | string }> {
  const supabase = await createClient();
  const data = {
    task_id: formData.get("task_id") as string,
    deadline: formData.get("date") as string,
    status: formData.get("status") as string,
    priority: formData.get("priority") as string,
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  };

  // Validate input data
  const result = updateTaskSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  try {
    // First, get the existing task to get the complaint_id
    const { data: existingTask, error: fetchError } = await supabase
      .from("staff_tasks")
      .select("complaint_id")
      .eq("task_id", data.task_id)
      .single();

    if (fetchError || !existingTask) {
      logger.error("Error fetching existing task", fetchError);
      return { success: false, error: "Task not found" };
    }

    // Update Task in "staff_tasks" Table
    const { data: taskData, error: taskError } = await supabase
      .from("staff_tasks")
      .update({
        deadline: data.deadline,
        status: data.status,
        priority: data.priority,
        title: data.title,
        description: data.description,
      })
      .eq("task_id", data.task_id)
      .select("*")
      .single();

    if (taskError) {
      logger.error("Error updating task", taskError);
      return { success: false, error: "Error updating task" };
    }

    // Revalidate cache to reflect the changes
    revalidatePath(`/staffmanager/complaints/details/${existingTask.complaint_id}`);

    logger.info("Successfully updated task", { task_id: data.task_id });
    return { success: true };
  } catch (error: any) {
    logger.error("Unexpected error updating task", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}