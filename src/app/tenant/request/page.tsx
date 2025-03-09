"use server";

import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import {
  Complaint,
  getPriorityColor,
  getStatusColor,
} from "@/models/complaint";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { FileIcon, FilterIcon, Plus, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { Search } from "@/app/tenant/request/ui/search";
import { onSelectSearchItem } from "./actions/onselectsearchitem";
import { RequestForm } from "./ui/addRequestForm";
import { PaginationControls } from "@/components/pagination";
import { formatDateTime, isImageFile } from "@/app/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/status-badge";
import { PriorityBadge } from "@/components/priority-badge";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const tenantId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const currentPage = Number(await params.page) || 1;

  const res = await fetch(
    `${baseUrl}/tenant/request/api/getRequests?tenantId=${tenantId}&page=${currentPage}`
  );

  const data = await res.json();
  const complaints: Complaint[] = data.complaints;

  if (!Array.isArray(complaints)) {
    logger.error(`Complaints is not an array`);
    return null;
  }
  const cardData = complaints.map((complaint) => {
    const renderAttachment = () => {
      // Early return if attachments is undefined
      if (!complaint.complaints_attachments) {
        return (
          <div className="w-[180px] h-[180px] bg-gray-100 flex items-center justify-center aspect-square">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        );
      }

      const hasAttachments = complaint.complaints_attachments.length > 0;

      // Check for attachments and valid image file
      if (
        !hasAttachments ||
        !isImageFile(complaint.complaints_attachments[0]?.file_type)
      ) {
        return (
          <div className="w-[180px] h-[180px] bg-gray-100 flex items-center justify-center aspect-square">
            <FileIcon className="w-16 h-16 text-gray-400" />
          </div>
        );
      }

      return (
        <Image
          src={complaint.complaints_attachments[0].file_url}
          alt="Request Image"
          width={180}
          height={180}
          className="aspect-square object-cover"
          loading="lazy"
        />
      );
    };

    return {
      id: Number(complaint.complaint_id),
      content: (
        <div className="flex items-start justify-start">
          {renderAttachment()}
          <div className="mx-8">
            <p className="font-bold text-2xl opacity-80 text-customGreenTextColor">{complaint.subject}</p>
            <p className="text-sm opacity-75">
             #ID {complaint.complaint_id}
            </p>
            <p className="text-md opacity-75 mb-2">{complaint.description}</p>
            <p className="text-sm opacity-75 mb-2">
              {formatDateTime(complaint.created_at!)}
            </p>
            <Link href={`/tenant/request/details/${complaint.complaint_id}`}>
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
      <h1 className="text-3xl font-bold opacity-80 text-customIndigoTextColor">Request Page</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow mr-2">
          <Search
            placeholder="Search request..."
            onSelect={onSelectSearchItem}
          />
          <Button>
            <FilterIcon size={20} />
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus size={20} />
            </Button>
          </DialogTrigger>
          <RequestForm tenantId={tenantId} />
        </Dialog>
      </div>

      <MultiCard padding="md" data={cardData} direction="column" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={data.totalPages}
        redirectPath="/tenant/request"
      />
    </div>
  );
}
