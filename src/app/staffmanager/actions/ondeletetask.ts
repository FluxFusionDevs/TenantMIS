"use server";

import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { revalidatePath } from "next/cache";

/**
 * Deletes a staff task assignment
 * @param taskId - The ID of the task to delete
 * @returns Object with success status and message
 */
export async function onDeleteTask(taskId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const supabase = await createClient();

    if (!taskId) {
      throw new Error("Task ID is required");
    }

    // Get the task first to get data for logging
    const { data: task, error: fetchError } = await supabase
      .from("staff_tasks")
      .select("*, complaint_id, staff_id")
      .eq("task_id", taskId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching task details: ${fetchError.message}`);
    }

    if (!task) {
      throw new Error("Task not found");
    }

    // Delete the task
    const { error: deleteError } = await supabase
      .from("staff_tasks")
      .delete()
      .eq("task_id", taskId);

    if (deleteError) {
      throw new Error(`Error deleting task: ${deleteError.message}`);
    }

    // Log the successful deletion
    logger.info(
      `Task ${taskId} deleted successfully for staff ${task.staff_id} on complaint ${task.complaint_id}`
    );

    revalidatePath(`/staffmanager/complaints/details/${task.complaint_id}`);
    
    return {
      success: true,
      message: "Task deleted successfully",
    };
  } catch (error: any) {
    logger.error(`Error in onDeleteTask: ${error.message}`);
    
    return {
      success: false,
      message: error.message || "Failed to delete task",
    };
  }
}