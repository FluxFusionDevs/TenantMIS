"use client";

import { useActionState, useEffect, useState } from "react";
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
import { Loader2 } from "lucide-react";
import { Task, TaskStatus } from "@/models/task";
import { formatErrors } from "@/app/utils";
import { StaffShift, StaffWithShifts } from "@/models/staff";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/datePicker";
import { useParams, useSearchParams } from "next/navigation";
import { Priority, Status } from "@/models/complaint";
import { onAssignTask } from "@/app/staffmanager/actions/onassigntask";
import { onSubmitReport } from "../action/onsubmitreport";

type FormState = {
  success: boolean;
  messages?: string[];
};

const initialState: FormState = {
  success: true,
  messages: [],
};

export function AddProgressReport({
  task,
}: {
  task: Task;
}) {
  const [state, formAction, pending] = useActionState(submitReport, initialState);

  async function submitReport(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      formData.append("task_id", task?.task_id || "");
      const response = await onSubmitReport(formData);
      if (response.success) {
        return { success: true, messages: ["Task assigned successfully"] };
      } else {
        return { success: false, messages: formatErrors(response.error) };
      }
    } catch (error) {
      return { success: false, messages: ["An unexpected error occurred"] };
    }
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Submit a progress report</DialogTitle>
      <DialogHeader>
        <DialogDescription>
          Fill in the form below to assign a new task
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} className="space-y-6 p-6">

        {/* Priority Selection */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="priority" className="text-left text-gray-700">
            Status
          </Label>
          <div className="col-span-3">
            <Select name="status" defaultValue={task?.status}>
              <SelectTrigger className="w-full border-gray-300 rounded-lg">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="border-gray-300">
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {Object.values(Status).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>


        {/* Description */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label
            htmlFor="description"
            className="text-left text-gray-700 align-top pt-2"
          >
            Description
          </Label>
          <div className="col-span-3">
            <textarea
              id="description"
              name="description"
              placeholder="Enter task description"
              className="w-full min-h-[100px] p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
        </div>

        {state.messages && (
          <div className="p-3 rounded-lg text-sm font-medium">
            <ul className={state.success ? "text-green-600" : "text-red-600"}>
              {state.messages.map((message) => (
                <li key={message}>{message}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Button */}
        <DialogFooter>
          <Button
            type="submit"
            className="w-full rounded-lg py-2 flex items-center justify-center disabled:opacity-50"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Submit report
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
