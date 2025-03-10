import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { StaffWithShifts } from "@/models/staff";
import { Task } from "@/models/task";
import { FileIcon, Mail, Phone, Trash2Icon } from "lucide-react";
import Image from "next/image";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Page({ params }: { params: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { staffId } = await params;
  const res = await fetch(
    `${baseUrl}/staffmanager/api/getStaff?staffId=${staffId}&role=HOUSEKEEPING`
  );
  const data = await res.json();
  const staff: StaffWithShifts = data.staff;

  const res2 = await fetch(
    `${baseUrl}/staffmanager/api/getTasks?role=HOUSEKEEPING&staffId=${staffId}`
  );

  const data2 = await res2.json();
  const requests: Task[] = data2.complaints ?? [];
  const cardData = requests.map((request) => {
    return {
      id: request.task_id,
      content: (
        <div className="flex items-start justify-start">
          {request.complaints?.complaints_attachments &&
          request.complaints.complaints_attachments.length > 0 ? (
            <Image
              src={request.complaints.complaints_attachments[0].file_url}
              alt="Request Image"
              width={180}
              height={180}
              className="aspect-square object-cover"
            />
          ) : (
            <div className="w-[180px] h-[180px] bg-gray-100 flex items-center justify-center aspect-square">
              <FileIcon className="w-16 h-16 text-gray-400" />
            </div>
          )}
          <div className="mx-8">
            <p className="font-bold text-2xl opacity-80">
              {request.complaints?.subject}
            </p>
            <p className="text-sm opacity-75">
              UID# {request.complaints?.complaint_id}
            </p>
            <span className="text-sm opacity-75">
              {formatDateTime(request.complaints?.created_at!)}
            </span>
            <p className="opacity-50 mb-2">{request.status}</p>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <BackButton />

      {/* Main content grid */}
      <div className="grid gap-8">
        {/* Top section with image and name */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-8 items-start">
          {/* Left section - Profile Image and Info */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            {/* Profile Image */}
            <div className="w-48 h-48 rounded-full">
              <Avatar className="w-full h-full">
                <AvatarImage
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-50 rounded-full"
                  src={staff.picture || "/profile_placeholder.png"}
                  alt={`${staff.name}'s profile picture`}
                />
                <AvatarFallback>
                  <Image
                    src="/profile_placeholder.png"
                    width={192}
                    height={192}
                    alt="Profile Picture"
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-50 rounded-full"
                  />
                </AvatarFallback>
              </Avatar>
            </div>
            {/* Staff Info */}
            <div className="space-y-2 text-center md:text-left">
              <h1 className="text-3xl font-bold">{staff.name}</h1>
              <p className="text-xl text-gray-600">UID# {staff.staff_id}</p>
              <p className="text-xl text-gray-600">{staff.role}</p>
            </div>
          </div>

          {/* Right section - Contact Icons and Edit Button */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="flex justify-center gap-4">
              <a
                href={`tel:${staff.phone_number}`}
                className="hover:opacity-80"
              >
                <Phone className="w-8 h-8" />
              </a>
              <a href={`mailto:${staff.email}`} className="hover:opacity-80">
                <Mail className="w-8 h-8" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact Details Card */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>
          <div className="grid gap-3">
            <p className="text-lg">
              <span className="font-medium">Email:</span> {staff.email}
            </p>
            <p className="text-lg">
              <span className="font-medium">Phone:</span> {staff.phone_number}
            </p>
            <p className="text-lg">
              <span className="font-medium">Status:</span>
              <span className="capitalize">{staff.status.toLowerCase()}</span>
            </p>
          </div>
        </div>
        {/* Shifts and Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
          {/* Shifts Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shifts</h2>
            <div className="grid gap-2">
              {staff.staff_shifts.map((shift) => (
                <div
                  key={shift.shift_id}
                  className="p-3 bg-gray-50 rounded-lg grid gap-4 items-center"
                >
                  <span className="font-medium">{shift.day_of_week}</span>
                  <span className="text-gray-600">
                    {shift.shift_start} - {shift.shift_end}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
