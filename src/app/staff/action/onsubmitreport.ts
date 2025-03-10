"use server";

import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { validateStatus } from "@/models/task";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Define report schema validation
const reportSchema = z.object({
  task_id: z.string({ message: "Task ID is required" }),
  status: z.string().refine(validateStatus, { message: "Invalid task status" }),
  description: z.string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(500, { message: "Description cannot exceed 500 characters" }),
});

export async function onSubmitReport(
  formData: FormData
): Promise<{ success: boolean; error?: z.ZodError | string }> {
  const supabase = await createClient();

  const data = {
    task_id: formData.get("task_id") as string,
    status: formData.get("status") as string,
    description: formData.get("description") as string,
  };

  console.log(data);
  // Validate input data
  const result = reportSchema.safeParse(data);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const client = supabase;

  try {
    // Begin transaction
    await client.rpc('begin');

    // Insert Report into "progress_report" Table
    const { data: reportData, error: reportError } = await client
      .from("progress_report")
      .insert({
        task_id: data.task_id,
        description: data.description,
      })
      .select("*")
      .single();

    if (reportError) {
      await client.rpc('rollback');
      throw reportError;
    }

    // Update task status in "staff_tasks" Table
    const { error: updateError } = await client
      .from("staff_tasks")
      .update({ status: data.status })
      .eq("task_id", data.task_id);

    if (updateError) {
      await client.rpc('rollback');
      throw updateError;
    }

    // Commit transaction
    await client.rpc('commit');

    // Revalidate cache to reflect the new report
    revalidatePath(`/staff/tasks/details/${data.task_id}`);

    logger.info("Successfully submitted report and updated task status");
    return { success: true };
  } catch (error: any) {
    logger.error("Unexpected error submitting report", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}