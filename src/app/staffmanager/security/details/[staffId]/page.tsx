import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabaseServer";
import { StaffWithShifts } from "@/models/staff";
import { ArrowLeft, FileIcon, ImageIcon, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: any }) {
  const client = await createClient();
  const tenantId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { staffId } = await params;
  const res = await fetch(
    `${baseUrl}/staffmanager/getStaff?staffId=${staffId}&role=SECURITY`
  );
  const data = await res.json();
  const staff: StaffWithShifts = data.staff;


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
            <div className="w-48 h-48 rounded-full overflow-hidden">
              <Image
                width={192}
                height={192}
                src={staff.picture || "/placeholder.jpg"}
                alt={`${staff.name}'s profile picture`}
                className="w-full h-full object-cover"
              />
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
            <Button variant="outline" size="lg">
              Edit
            </Button>
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
              <span className="font-medium">Status:</span>{" "}
              <span className="capitalize">{staff.status.toLowerCase()}</span>
            </p>
          </div>
        </div>
        {/* Shifts and Additional Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
          {/* Shifts Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Shifts</h2>
            <div className="grid gap-2">
              {staff.staff_shifts.map((shift) => (
                <div
                  key={shift.shift_id}
                  className="p-3 bg-gray-50 rounded-lg grid  gap-4 items-center"
                >
                  <span className="font-medium">{shift.day_of_week}</span>
                  <span className="text-gray-600">
                    {shift.shift_start} - {shift.shift_end}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Information Card */}
          <h1 className="text-2xl font-semibold">Additional Information</h1>
        </div>
      </div>
    </div>
  );
}
