"use server";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { revalidatePath } from "next/cache";

export async function onDeleteStaff(
  staffId: string
): Promise<{ success: boolean; message: string }> {
  console.log(staffId);
  try {
    const supabase = await createClient();
    if (!staffId) {
      throw new Error("Staff ID is required");
    }

    // Get the staff details first for logging and getting user_id
    const { data: staff, error: fetchError } = await supabase
      .from("staff")
      .select("name, role, email, user_id")
      .eq("staff_id", staffId)
      .single();

    if (fetchError) {
      throw new Error(`Error fetching staff details: ${fetchError.message}`);
    }

    if (!staff) {
      throw new Error("Staff not found");
    }

    // Check for active tasks assigned to this staff
    const { data: activeTasks, error: tasksError } = await supabase
      .from("staff_tasks")
      .select("task_id")
      .eq("staff_id", staffId);

    if (tasksError) {
      throw new Error(`Error checking staff tasks: ${tasksError.message}`);
    }

    // If staff has active tasks, prevent deletion
    if (activeTasks && activeTasks.length > 0) {
      logger.error(
        `Cannot delete staff with ${activeTasks.length} active assignments. Please reassign or complete these tasks first.`
      );
      return {
        success: false,
        message: `Cannot delete staff with ${activeTasks.length} active assignments. Please reassign or complete these tasks first.`,
      };
    }

    // Delete staff shifts first (foreign key constraint)
    const { error: shiftsError } = await supabase
      .from("staff_shifts")
      .delete()
      .eq("staff_id", staffId);

    if (shiftsError) {
      throw new Error(`Error deleting staff shifts: ${shiftsError.message}`);
    }

    // Delete staff record
    const { error: deleteError } = await supabase
      .from("staff")
      .delete()
      .eq("staff_id", staffId);

    if (deleteError) {
      throw new Error(`Error deleting staff: ${deleteError.message}`);
    }

    // Delete user from authentication (auth.users)
    if (staff.user_id) {
    
      const { error: authDeleteError } = await supabase.auth.admin.deleteUser(staff.user_id);

      if (authDeleteError) {
        throw new Error(`Error deleting auth user: ${authDeleteError.message}`);
      }
    }

    // Log the successful deletion
    logger.info(
      `Staff ${staffId} (${staff.name}, ${staff.role}) and auth user deleted successfully`
    );

    revalidatePath(`/staffmanager/${staff.role}/${staffId}`);

    return {
      success: true,
      message: "Staff and associated auth user deleted successfully",
    };
  } catch (error: any) {
    logger.error(`Error in onDeleteStaff: ${error.message}`);

    return {
      success: false,
      message: error.message || "Failed to delete staff",
    };
  }
}
