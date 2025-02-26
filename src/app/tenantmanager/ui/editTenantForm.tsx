"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { Tenant } from "@/models/tenant";
import { onUpdateTenant } from "../actions/onupdatetenant";

type FormState = {
  success: boolean;
  messages?: string[];
};

const initialState: FormState = {
  success: true,
  messages: [],
};

function formatValidationErrors(errors: string): string[] {
  try {
    const parsedErrors = JSON.parse(errors);
    if (Array.isArray(parsedErrors)) {
      return parsedErrors.map((error: any) => `• ${error.message}`);
    }
    return [typeof parsedErrors === "string" ? parsedErrors : parsedErrors.message];
  } catch {
    return [errors];
  }
}

export function EditTenantForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, pending] = useActionState(submitTenant, initialState);

  async function submitTenant(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      const response = await onUpdateTenant(formData);
      if (response?.success) {
        return { success: true, messages: ["Tenant updated successfully"] };
      }
      return {
        success: false,
        messages: formatValidationErrors(response?.error?.message || "An error occurred"),
      };
    } catch (error: unknown) {
      return {
        success: false,
        messages: [error instanceof Error ? error.message : "An unexpected error occurred"],
      };
    }
  }

  return (
    <DialogContent className="sm:max-w-[400px]">
      <DialogTitle>Edit Tenant</DialogTitle>
      <DialogHeader>
        <DialogDescription>Edit tenant details</DialogDescription>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 py-4">
        <input type="hidden" name="tenant_id" value={tenant.tenant_id} />
        <input type="hidden" name="user_id" value={tenant.user_id} />

        <div className="grid gap-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" name="first_name" defaultValue={tenant.first_name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" name="last_name" defaultValue={tenant.last_name} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" defaultValue={tenant.email} />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact_no">Contact Number</Label>
          <Input id="contact_no" name="contact_no" defaultValue={tenant.contact_no} />
        </div>

        {state.messages && (
          <ul className={`${state.success ? "text-green-500" : "text-red-500"} text-sm`}>
            {state.messages.map((message, index) => (
              <li key={`error-${index}`}>{message}</li>
            ))}
          </ul>
        )}

        <DialogFooter>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Edit Tenant
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
