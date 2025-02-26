"use server";

import { createClient } from "@/lib/supabaseServer";
import { z } from "zod";
import logger from "@/logger/logger";
import { revalidatePath } from "next/cache";

type FormState = {
  [x: string]: any;
  success: boolean;
  messages?: string[];
};

const tenantUpdateSchema = z.object({
  tenant_id: z.string(),
  user_id: z.string(),
  first_name: z.string().max(50, { message: "First name is too long" }),
  last_name: z.string().max(50, { message: "Last name is too long" }),
  email: z.string().email(),
  contact_no: z
    .string()
    .regex(/^\d+$/, "Contact number must contain only digits")
    .min(10, "Contact number must be at least 10 digits")
    .max(15, "Contact number cannot exceed 15 digits"),
});

export async function onUpdateTenant(
  formData: FormData
): Promise<FormState> {
  try {
    const supabase = await createClient();

    const data = {
      tenant_id: formData.get("tenant_id") as string,
      user_id: formData.get("user_id") as string,
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      email: formData.get("email") as string,
      contact_no: formData.get("contact_no") as string,
    };

    const result = tenantUpdateSchema.safeParse(data);
    if (!result.success) {
      const formattedErrors = result.error.issues.map((err) => `• ${err.message}`);
      return { success: false, messages: formattedErrors };
    }

    const { error: updateError } = await supabase
      .from("tenants")
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        contact_no: data.contact_no,
      })
      .eq("tenant_id", data.tenant_id);

    if (updateError) {
      if (updateError.code === "23505" && updateError.message.includes("tenants_email_key")) {
        return { success: false, messages: ["Email already exists"] };
      }
      if (updateError.code === "23505" && updateError.message.includes("tenants_contact_key")) {
        return { success: false, messages: ["Contact number already exists"] };
      }
      return { success: false, messages: ["Error updating tenant"] };
    }

    revalidatePath("/tenants");
    return { success: true, messages: ["Tenant updated successfully"] };
  } catch (error) {
    logger.error(`Error updating tenant: ${error}`);
    return { success: false, messages: ["An unexpected error occurred"] };
  }
}
