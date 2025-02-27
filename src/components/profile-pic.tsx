"use client";

import { StaffWithShifts } from "@/models/staff";
import { Edit } from "lucide-react";
import Image from "next/image";
import imageCompression from "browser-image-compression";

interface ProfilePicProps {
  staff: StaffWithShifts;
  onUpdateImage: (formData: FormData) => Promise<void>;
}

export default function ProfilePic({ staff, onUpdateImage }: ProfilePicProps) {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      // Compression options
      const options = {
        maxSizeMB: 0.5, // Target size in MB
        maxWidthOrHeight: 800, // Resize to 800px max width/height
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(file, options);

      // Prepare FormData for upload
      const formData = new FormData();
      if (!staff.staff_id) return;
      formData.append("staffId", staff.staff_id);
      formData.append("picture", compressedFile);

      await onUpdateImage(formData);
    } catch (error) {
      console.error("Compression failed:", error);
    }
  };

  return (
    <form>
      <input type="hidden" name="staffId" value={staff.staff_id} />
      <div 
        className="w-48 h-48 rounded-full overflow-hidden relative group cursor-pointer"
        onClick={() => {
          const fileInput = document.getElementById(`file-upload-${staff.staff_id}`) as HTMLInputElement;
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
        id={`file-upload-${staff.staff_id}`}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </form>
  );
}
