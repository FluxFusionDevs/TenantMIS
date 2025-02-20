"use client";

import { StaffWithShifts } from "@/models/staff";
import { Edit } from "lucide-react";
import Image from "next/image";

interface ProfilePicProps {
  staff: StaffWithShifts;
  onUpdateImage: (formData: FormData) => Promise<void>;
}

export default function ProfilePic({ staff, onUpdateImage }: ProfilePicProps) {
  return (
    <form action={onUpdateImage}>
      <input type="hidden" name="staffId" value={staff.staff_id} />
      <div 
        className="w-48 h-48 rounded-full overflow-hidden relative group cursor-pointer"
        onClick={() => {
          const fileInput = document.querySelector(`input[name="picture"`) as HTMLInputElement;
          fileInput?.click();
        }}
      >
        <Image
          width={192}
          height={192}
          src={staff.picture || "/placeholder.jpg"}
          alt={`${staff.name}'s profile picture`}
          className="w-full h-full object-cover transition-opacity group-hover:opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
          <Edit className="w-8 h-8 text-white" />
        </div>
      </div>
      <input
        type="file"
        name={`picture`}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            e.target.form?.requestSubmit();
          }
        }}
      />
    </form>
  );
}