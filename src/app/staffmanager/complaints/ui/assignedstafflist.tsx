"use client";

import { useActionState, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { EditTaskForm } from "@/app/staffmanager/ui/editTaskForm";
import { PencilIcon, Trash2Icon } from "lucide-react";
import { StaffWithTasks } from "@/models/staff";
import Image from "next/image";
import { format, parseISO } from "date-fns";
import { getPriorityColor, Priority, Status } from "@/models/complaint";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { onDeleteTask } from "../../actions/ondeletetask";
import { ConfirmDialog } from "@/components/confirm-dialog";
import Link from "next/link";
import clsx from "clsx";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";

type FormState = {
  success: boolean;
  messages?: string[];
};

const initialState: FormState = {
  success: true,
  messages: [],
};

export function AssignedStaffList({
  assignedStaffs,
}: {
  assignedStaffs: StaffWithTasks[];
}) {
  console.log(assignedStaffs);
  const [selectedStaff, setSelectedStaff] = useState<StaffWithTasks | null>(
    null
  );
  const [state, formAction, pending] = useActionState(
    handleDeleteStaff,
    initialState
  );

  const [isPending, startTransition] = useTransition();

  const handleEditStaff = (staff: StaffWithTasks) => {
    setSelectedStaff(staff);
  };

  const handleCloseDialog = () => {
    setSelectedStaff(null);
  };

  const handleDeleteStaffClick = (taskId: string | undefined) => {
    if (!taskId) {
      return;
    }

    startTransition(() => {
      formAction(taskId);
    });
  };

  async function handleDeleteStaff(
    state: FormState,
    staffId: string
  ): Promise<FormState> {
    try {
      if (!staffId) {
        return {
          success: false,
          messages: ["Task ID not found"],
        };
      }

      const result = await onDeleteTask(staffId);

      if (result.success) {
        return {
          success: true,
          messages: ["Staff assignment removed successfully"],
        };
      } else {
        return {
          success: false,
          messages: [result.message],
        };
      }
    } catch (error: any) {
      const errorMessage =
        error.message || "An error occurred while removing staff assignment";
      return {
        success: false,
        messages: [errorMessage],
      };
    }
  }

  return (
    <>
      <div className="space-y-4">
        {assignedStaffs.map((staff) => (
          <div key={staff.staff_id} className="border rounded-lg p-4 relative">
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant={"default"}
                title="Edit staff assignment"
                onClick={() => handleEditStaff(staff)}
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
          
              <ConfirmDialog
                title="Remove staff from assignment"
                description="Are you sure you want to remove this staff from the assignment?"
                actionButtons={[
                  {
                    label: "Remove",
                    variant: "destructive",
                    onClick: () =>
                      handleDeleteStaffClick(staff.staff_tasks?.task_id),
                    isLoading: pending,
                    showLoaderOnLoading: true,
                  },
                ]}
              >
                <Button
                  variant={"destructive"}
                  title="Remove staff from assignment"
                >
                  <Trash2Icon className="w-4 h-4" />
                </Button>
              </ConfirmDialog>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src={staff.picture || "/profile_placeholder.png"}
                  alt={staff.name}
                />
                <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <Link
                  href={`/staffmanager/${staff.role.toLocaleLowerCase()}/details/${
                    staff.staff_id
                  }`}
                  passHref
                >
                  <h3 className="font-semibold text-lg">{staff.name}</h3>
                </Link>
                <div className="flex space-x-2 mb-2">
                  <p className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                    #{staff.staff_id}
                  </p>
                  <p className="text-xs bg-gray-100 px-2 py-1 rounded-md">
                    {staff.role}
                  </p>
                </div>

                {staff.staff_tasks && (
                  <div className="mt-2 border-t pt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Task
                        </p>
                        <p className="text-sm font-medium">
                          {staff.staff_tasks.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Deadline
                        </p>
                        <p className="text-sm">
                          {staff.staff_tasks.deadline
                            ? format(
                                parseISO(staff.staff_tasks.deadline),
                                "MMM d, yyyy"
                              )
                            : "No deadline set"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Status
                        </p>
                        <StatusBadge status={staff.staff_tasks.status} />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">
                          Priority
                        </p>
                        <PriorityBadge priority={staff.staff_tasks.priority} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={!!selectedStaff}
        onOpenChange={(open) => !open && setSelectedStaff(null)}
      >
        {selectedStaff && (
          <EditTaskForm staff={selectedStaff} onClose={handleCloseDialog} />
        )}
      </Dialog>
    </>
  );
}
