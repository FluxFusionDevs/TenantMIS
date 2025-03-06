"use server";

import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Complaint,
  getPriorityColor,
  getStatusColor,
  Priority,
  Status,
} from "@/models/complaint";
import { StaffWithTasks, StaffWithShifts } from "@/models/staff";
import { FileIcon } from "lucide-react";
import Image from "next/image";
import VacantStaffList from "../../ui/vacantstafflist";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { EditTaskForm } from "@/app/staffmanager/ui/editTaskForm";
import { Dialog } from "@/components/ui/dialog";
import { AssignedStaffList } from "../../ui/assignedstafflist";

export default async function Page({ params }: { params: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { complaintId } = await params;

  let complaint: Complaint | null = null;
  let vacantStaffs: StaffWithShifts[] = [];
  let assignedStaffs: StaffWithTasks[] | null = null;

  try {
    // Fetch complaint details
    const res = await fetch(
      `${baseUrl}/tenant/request/api/getRequest?requestId=${complaintId}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch complaint data. Status: ${res.status}`);
    }

    const data = await res.json();

    complaint = data.complaint;

    // Fetch vacant staff based on complaint category
    const res2 = await fetch(
      `${baseUrl}/staffmanager/api/getVacantStaffs?role=${
        complaint!.category
      }&complaintId=${complaintId}`,
      {
        cache: "no-store",
      }
    );

    if (!res2.ok) {
      throw new Error(`Failed to fetch vacant staff. Status: ${res2.status}`);
    }

    const data2 = await res2.json();
    vacantStaffs = data2.staffs ?? [];

    const res3 = await fetch(
      `${baseUrl}/staffmanager/api/getAssignedStaffs?complaintId=${complaintId}`,
      {
        cache: "no-store",
      }
    );

    if (!res3.ok) {
      throw new Error(`Failed to fetch assigned staff. Status: ${res3.status}`);
    }

    const data3 = await res3.json();
    assignedStaffs = data3.staffs ?? [];

  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <div className="p-4 md:p-8 w-full">
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* First column - Images */}
        <div className="flex flex-col gap-4">
          {complaint?.complaints_attachments &&
            complaint.complaints_attachments.length > 0 && (
              <div
                key={complaint.complaints_attachments[0].attachment_id}
                className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
              >
                {isImageFile(complaint.complaints_attachments[0].file_type) ? (
                  <Image
                    width={500}
                    height={500}
                    src={complaint.complaints_attachments[0].file_url}
                    alt={complaint.complaints_attachments[0].file_name}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <FileIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">
                      {complaint.complaints_attachments[0].file_name
                        .split(".")
                        .pop()
                        ?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}

          {complaint?.complaints_attachments &&
            complaint.complaints_attachments.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {complaint.complaints_attachments.slice(1).map((attachment) => (
                  <div
                    key={attachment.attachment_id}
                    className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
                  >
                    {isImageFile(attachment.file_type) ? (
                      <Image
                        width={200}
                        height={200}
                        src={attachment.file_url}
                        alt={attachment.file_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                        <FileIcon className="w-8 h-8 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-1">
                          {attachment.file_name.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Second column - Complaint details */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold break-words">
              <p>{complaint?.subject}</p>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4 md:p-6">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={"secondary"}
                className={`text-${getStatusColor(
                  complaint!.status
                )} bg-${getStatusColor(complaint!.status)}-100`}
              >
                {complaint?.status}
              </Badge>
              <Badge
                variant={"secondary"}
                className={`text-${getPriorityColor(
                  complaint!.priority
                )} bg-${getPriorityColor(complaint!.priority)}-100`}
              >
                {complaint?.priority}
              </Badge>
            </div>
            <p className="text-base md:text-lg break-words whitespace-pre-wrap">
              Description: {complaint?.description}
            </p>
            <p className="text-base md:text-lg truncate">
              Created At:{" "}
              {complaint ? formatDateTime(complaint.created_at!) : "N/A"}
            </p>
            <div>
              <p className="text-lg font-bold">Available Staff</p>
              {vacantStaffs.length === 0 && <p>No staff available</p>}
              <VacantStaffList vacantStaffs={vacantStaffs} />
            </div>
          </CardContent>
        </Card>
      </div>

      {assignedStaffs && assignedStaffs.length > 0 && (
        <AssignedStaffList assignedStaffs={assignedStaffs} />
      )}
    </div>
  );
}
