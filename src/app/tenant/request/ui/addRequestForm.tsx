"use client";

import { onSubmitRequest } from "../actions/onsubmitrequest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Status, Priority, Category } from "@/models/complaint";
import { useActionState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { MultipleFileUploads } from "@/components/multi-fileuploads";
import { Loader2 } from "lucide-react";
import { formatErrors } from "@/app/utils";

type FormState = {
  success: boolean;
  messages?: string[];
};

const initialState: FormState = {
  success: true,
  messages: [],
};


export function RequestForm({ tenantId }: { tenantId: string }) {
  const [state, formAction, pending] = useActionState(
    submitRequest,
    initialState
  );

  async function submitRequest(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {

      const response = await onSubmitRequest(formData);

      if (response.success) {
        return {
          success: true,
          messages: ["Request added successfully"],
        };
      } else {
        const formattedErrors = formatErrors(response.error);
        return {
          success: false,
          messages: formattedErrors,
        };
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";

      return {
        success: false,
        messages: [errorMessage],
      };
    } finally {
      console.log("Request submitted");
    }
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogTitle>Add a new request</DialogTitle>

      <DialogHeader>
        <DialogDescription>
          Fill in the form below to add a new request
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 py-4">
        <input type="hidden" name="tenant_id" value={tenantId} />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subject" className="text-right">
            Subject
          </Label>
          <div className="col-span-3">
            <Input id="subject" name="subject" />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Textarea
            id="description"
            name="description"
            className="col-span-3"
          />
        </div>
      
        <MultipleFileUploads allowedTypes={["image/jpeg", "image/png", "application/pdf"]} />
        <div className="grid grid-cols-4 items-center gap-4">
          {state.messages && (
            <div className="col-span-4">
              <ul
                className={`${
                  state.success ? "text-green-500" : "text-red-500"
                }`}
              >
                {state.messages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Add Request
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
