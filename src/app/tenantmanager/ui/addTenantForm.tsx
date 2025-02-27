"use client";

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
import { useActionState, useEffect, useState } from "react";
import { Loader2, Minus } from "lucide-react";
import { onSubmitStaff } from "../actions/onsubmittenant";
import {
  DayOfWeek,
  StaffCategory,
  StaffShift,
  StaffStatus,
} from "@/models/staff";
import { TimePicker } from "@/components/timePicker";
import { useSession } from "@/app/context/SupabaseSessionContext";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/models/jwt";
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
    // If single error
    const singleError =
      typeof parsedErrors === "string" ? parsedErrors : parsedErrors.message;
    return [`${singleError}`];
  } catch (e) {
    // If parsing fails, return original string with bullet
    return [`${errors}`];
  }
}

export function StaffForm({ userId, role  }: { userId: string, role: StaffCategory }) {
  const [state, formAction, pending] = useActionState(
    submitStaff,
    initialState
  );

  const [shifts, setShifts] = useState<StaffShift[]>([
    {
      shift_id: 1,
      staff_id: "",
      day_of_week: "" as DayOfWeek,
      shift_start: "",
      shift_end: "",
    },
  ]);

  const handleShiftChange = (
    id: number,
    field: keyof StaffShift,
    value: string
  ) => {
    setShifts(
      shifts.map((shift) =>
        shift.shift_id === id ? { ...shift, [field]: value } : shift
      )
    );
  };

  const addShift = () => {
    const newId = Math.max(...shifts.map((s) => s.shift_id)) + 1;
    setShifts([
      ...shifts,
      {
        shift_id: newId,
        staff_id: "",
        day_of_week: "" as DayOfWeek,
        shift_start: "",
        shift_end: "",
      },
    ]);
  };

  const removeShift = (id: number) => {
    if (shifts.length > 1) {
      setShifts(shifts.filter((shift) => shift.shift_id !== id));
    } else {
      console.log("Cannot remove last shift");
    }
  };

  async function submitStaff(
    prevState: FormState,
    formData: FormData
  ): Promise<FormState> {
    try {
      const files = formData.getAll("files");
      files.forEach((file) => {
        if (file instanceof Blob) {
          formData.append("files", file);
        }
      });

      formData.append("staff_shifts", JSON.stringify(shifts));
      formData.append("role", role);

      const response = await onSubmitStaff(formData);
      if (response.success) {
        return {
          success: true,
          messages: ["Staff added successfully"],
        };
      } else {
        const formattedErrors = formatValidationErrors(response.error.message);
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
    <DialogContent className="sm:max-w-[600px]">
      <DialogTitle>Add a new staff</DialogTitle>
      <DialogHeader>
        <DialogDescription>
          Fill in the form below to add a new staff
        </DialogDescription>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 py-4">
        <input type="hidden" name="userId" value={userId} />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <div className="col-span-3">
            <Input id="name" name="name" />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="phone_number" className="text-right">
            Phone Number
          </Label>
          <div className="col-span-3">
            <Input
              id="phone_number"
              name="phone_number"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <div className="col-span-3">
            <Input id="email" name="email" className="col-span-3" />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select name="status">
            <SelectTrigger className="col-span-3">
              <SelectValue placeholder="Select a status" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Status</SelectLabel>
                {Object.values(StaffStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="picture" className="text-right">
            Picture
          </Label>
          <div className="col-span-3">
            <Input
              id="picture"
              name="picture"
              type="file"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="shifts" className="text-right">
            Shifts
          </Label>
          <div className="col-span-4 space-y-4 h-[300px] overflow-auto">
            {shifts.map((shift) => (
              <div
                key={shift.shift_id}
                className="grid grid-cols-[2fr_2fr_2fr_auto] gap-2 items-center"
              >
                {" "}
                <Select
                  value={shift.day_of_week}
                  onValueChange={(value: string) =>
                    handleShiftChange(shift.shift_id, "day_of_week", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Day</SelectLabel>
                      {Object.values(DayOfWeek).map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <TimePicker
                  value={shift.shift_start}
                  onChange={(value) =>
                    handleShiftChange(shift.shift_id, "shift_start", value)
                  }
                />
                <TimePicker
                  value={shift.shift_end}
                  onChange={(value) =>
                    handleShiftChange(shift.shift_id, "shift_end", value)
                  }
                />
                {shifts.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeShift(shift.shift_id)}
                    className="h-10 w-10"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={addShift}
        >
          + Add Another Shift
        </Button>
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
            Add Staff
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
