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
import { onAddTenant } from "../actions/onAddTenant";

type FormState = {
  success: boolean;
  messages?: string[];
};

const initialState: FormState = {
  success: true,
  messages: [],
};

export function CreateTenantForm() {
  const [state, formAction, pending] = useActionState(submitTenant, initialState);

  async function submitTenant(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      const response = await onAddTenant(formData);
      return {
        success: response?.success ?? false,
        messages: response?.messages ?? ["An error occurred"],
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
      <DialogTitle>Create Tenant</DialogTitle>
      <DialogHeader>
        <DialogDescription>Enter tenant details</DialogDescription>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" name="first_name" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" name="last_name" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="contact_no">Contact Number</Label>
          <Input id="contact_no" name="contact_no" required />
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
            {pending && <Loader2 className="h-4 w-4 animate-spin mr-2" />} Create Tenant
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
