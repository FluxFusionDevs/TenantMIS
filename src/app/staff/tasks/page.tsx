"use server";

import { MultiCard } from "@/components/multi-card";
import { createClient } from "@/lib/supabaseServer";
import { FileIcon, FilterIcon, MailIcon, PhoneIcon, Plus } from "lucide-react";
import { Search } from "@/app/staff/ui/searchTask";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Task } from "@/models/task";
import { Staff } from "@/models/staff";
import { formatDateTime, formatDateToNow, isImageFile } from "@/app/utils";
import { StatusBadge } from "@/components/status-badge";
import { Priority } from "@/models/tenant";
import { PriorityBadge } from "@/components/priority-badge";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const {
    data: { user },
  } = await client.auth.getUser();
  const userId = user?.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/staff/api/getStaff?userId=${userId}`);
  const data = await res.json();
  const staff: Staff = data.staff;
  const res2 = await fetch(
    `${baseUrl}/staffmanager/api/getTasks?staffId=${staff.staff_id}`
  );

  const data2 = await res2.json();
  const tasks: Task[] = data2.complaints ?? [];

  
  const cardData = tasks.map((complaint) => {
    const renderAttachment = () => {
      // Early return if attachments is undefined
      if (!complaint.complaints?.complaints_attachments) {
        return (
          <div className="w-[180px] h-[180px] bg-gray-100 flex items-center justify-center aspect-square">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        );
      }

      const hasAttachments = complaint.complaints.complaints_attachments.length > 0;

      // Check for attachments and valid image file
      if (
        !hasAttachments ||
        !isImageFile(complaint.complaints.complaints_attachments[0]?.file_type)
      ) {
        return (
          <div className="w-[180px] h-[180px] bg-gray-100 flex items-center justify-center aspect-square">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        );
      }

      return (
        <Image
          src={complaint.complaints.complaints_attachments[0].file_url}
          alt="Request Image"
          width={180}
          height={180}
          className="aspect-square object-cover"
          loading="lazy"
        />
      );
    };

    return {
      id: complaint.task_id,
      content: (
        <div className="flex items-start justify-start">
          {renderAttachment()}
          <div className="mx-8">
            <p className="font-bold text-2xl opacity-80 mb-3">
              {complaint.complaints?.subject}
            </p>
            <p className="text-sm opacity-80 mb-3">
              {complaint.complaints?.description}
            </p>
            <div className="flex items-center gap-2 mb-2">
                <StatusBadge status={complaint.status} />
                <PriorityBadge  priority={complaint.priority} />
            </div>
            <p className="text-sm opacity-75 mb-2">
              Due {formatDateToNow(complaint.deadline)}
            </p>
            <Link
              href={`/staff/tasks/details/${complaint.task_id}`}
            >
              <Button
                className="bg-[#00000080] hover:bg-[#00000095] text-white"
                size="lg"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80 text-customIndigoTextColor">
        My Tasks
      </h1>
      <div className="flex items-center justify-between">
        {/* <div className="flex items-center space-x-4 flex-grow mr-2">
          <Search
            placeholder="Search request..."
          />
          <Button variant={"default"}>
            <FilterIcon size={20} />
          </Button>
        </div> */}
      </div>

      <MultiCard padding="md" data={cardData} direction="column" />
      {/* <PaginationControls
        currentPage={currentPage}
        totalPages={data.totalPages}
        redirectPath="/taskmanager/housekeeping"
      /> */}
    </div>
  );
}
