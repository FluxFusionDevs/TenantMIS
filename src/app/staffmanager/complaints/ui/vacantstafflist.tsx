"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StaffWithShifts } from "@/models/staff";
import { AddTaskForm } from "../../ui/addTaskForm";
import { useRouter } from "next/navigation";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function VacantStaffList({
  vacantStaffs,
}: {
  vacantStaffs: StaffWithShifts[];
}) {
  const [selectedStaff, setSelectedStaff] = useState<StaffWithShifts | null>(null);

  return (
    <div>
      <ul className="flex flex-wrap gap-2">
        {vacantStaffs.map((staff) => (
          <li
            key={staff.staff_id}
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setSelectedStaff(staff)}
          >
            <Avatar>
              <AvatarImage 
              src={staff.picture || "/profile_placeholder.png"}
              alt={staff.name}
              width={32}
              height={32}
              />
            </Avatar>
            <div>
              <p className="text-sm">{staff.name}</p>
              <p className="text-xs text-gray-500">{staff.role}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Centralized Dialog outside of .map() */}
      <Dialog open={!!selectedStaff} onOpenChange={(open) => !open && setSelectedStaff(null)}>
          {selectedStaff && (
            <AddTaskForm
              onClose={() => setSelectedStaff(null)}
              staff={selectedStaff}
            />
          )}
      </Dialog>
    </div>
  );
}