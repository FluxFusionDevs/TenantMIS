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
import {
  DayOfWeek,
  StaffCategory,
  StaffShift,
  StaffStatus,
  StaffWithShifts,
} from "@/models/staff";
import { TimePicker } from "@/components/timePicker";
import { onUpdateStaff } from "../actions/onupdatestaff";

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

export function EditStaffForm({ staff }: { staff: StaffWithShifts }) {
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

  useEffect(() => {
    setShifts(staff.staff_shifts);
  }, [staff]);

  // Replace the handleShiftChange function
  const handleShiftChange = (
    index: number,
    field: keyof StaffShift,
    value: string
  ) => {
    setShifts(
      shifts.map((shift, i) =>
        i === index ? { ...shift, [field]: value } : shift
      )
    );
  };

  // Update the addShift function
  const addShift = () => {
    setShifts([
      ...shifts,
      {
        shift_id: shifts.length + 1,
        staff_id: staff.staff_id!, // Use the staff_id from props
        day_of_week: "" as DayOfWeek,
        shift_start: "",
        shift_end: "",
      },
    ]);
  };

  // Update the removeShift function
  const removeShift = (index: number) => {
    if (shifts.length > 1) {
      setShifts(shifts.filter((_, i) => i !== index));
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
      formData.append("role", staff.role as StaffCategory);

      const response = await onUpdateStaff(formData);
      console.log("Response", response);
      if (response && response.success) {
        return {
          success: true,
          messages: ["Staff updated successfully"],
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
      <DialogTitle>Edit staff</DialogTitle>
      <DialogHeader>
        <DialogDescription>Edit staff</DialogDescription>
      </DialogHeader>
      <form action={formAction} className="grid gap-4 py-4">
        <input type="hidden" name="staff_id" value={staff.staff_id} />
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <div className="col-span-3">
            <Input id="name" name="name" defaultValue={staff.name} />
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
              defaultValue={staff.phone_number}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right">
            Email
          </Label>
          <div className="col-span-3">
            <Input
              id="email"
              name="email"
              className="col-span-3"
              defaultValue={staff.email}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right">
            Status
          </Label>
          <Select name="status" defaultValue={staff.status}>
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
        {/* <div className="grid grid-cols-4 items-center gap-4">
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
        </div> */}
        <div className="grid grid-cols-4 items-start gap-4">
          <Label htmlFor="shifts" className="text-right">
            Shifts
          </Label>
          <div className="col-span-4 space-y-4 h-[300px] overflow-auto">
            {shifts.map((shift, index) => (
              <div
                key={index}
                className="grid grid-cols-[2fr_2fr_2fr_auto] gap-2 items-center"
              >
                <Select
                  value={shift.day_of_week}
                  onValueChange={(value) =>
                    handleShiftChange(index, "day_of_week", value)
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
                    handleShiftChange(index, "shift_start", value)
                  }
                />
                <TimePicker
                  value={shift.shift_end}
                  onChange={(value) =>
                    handleShiftChange(index, "shift_end", value)
                  }
                />
                {shifts.length > 1 && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeShift(index)}
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
                {state.messages.map((message, index) => (
                  <li key={`error-${index}`}>{message}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Edit Staff
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
