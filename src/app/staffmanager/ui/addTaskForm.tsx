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
import { onAssignTask } from "../actions/onassigntask";
import { TaskStatus } from "@/models/task";
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
import { Priority } from "@/models/complaint";

type FormState = {
  success: boolean;
  messages?: string[];
};

const initialState: FormState = {
  success: true,
  messages: [],
};

export function AddTaskForm({
  onClose,
  staff,
}: {
  staff: StaffWithShifts;
  onClose: () => void;
}) {
  const [state, formAction, pending] = useActionState(submitTask, initialState);
  const { complaintId } = useParams();

  useEffect(() => {
    if (state.success && state.messages && state.messages.length > 0) {
      onClose();
    }
  }, [state]);

  async function submitTask(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      formData.append("complaint_id", complaintId as string);
      formData.append("staff_id", staff?.staff_id || "");
      const response = await onAssignTask(formData);
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
      <DialogTitle>Assign a New Task</DialogTitle>
      <DialogHeader>
        <DialogDescription>
          Fill in the form below to assign a new task
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} className="space-y-6 p-6">
        {/* Deadline Input */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="deadline" className="text-left text-gray-700">
            Deadline
          </Label>
          <div className="col-span-3">
            <DatePicker label="Select a deadline" name="date" />
          </div>
        </div>

        {/* Priority Selection */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="priority" className="text-left text-gray-700">
            Priority
          </Label>
          <div className="col-span-3">
            <Select name="priority">
              <SelectTrigger className="w-full border-gray-300 rounded-lg">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent className="border-gray-300">
                <SelectGroup>
                  <SelectLabel>Priority</SelectLabel>
                  {Object.values(Priority).map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status Selection */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-left text-gray-700">
            Status
          </Label>
          <div className="col-span-3">
            <Select name="status">
              <SelectTrigger className="w-full border-gray-300 rounded-lg">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent className="border-gray-300">
                <SelectGroup>
                  <SelectLabel>Status</SelectLabel>
                  {Object.values(TaskStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Title */}
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-left text-gray-700">
            Title
          </Label>
          <div className="col-span-3">
            <Input
              id="title"
              name="title"
              placeholder="Enter task title"
              className="w-full border-gray-300 rounded-lg"
              required
            />
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
            Assign Task
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
