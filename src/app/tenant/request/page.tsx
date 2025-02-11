"use server";

import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Complaint } from "@/models/complaint";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { FileIcon, FilterIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { Search } from "@/components/search";
import { onSelectSearchItem } from "./actions/onselectsearchitem";
import { RequestForm } from "./addRequestForm";
import { PaginationControls } from "@/components/pagination";
import { formatDateTime } from "@/app/utils";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const tenantId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const currentPage = Number(await params.page) || 1;

  const res = await fetch(
    `${baseUrl}/tenant/request/getRequests?tenantId=${tenantId}&page=${currentPage}`
  );
  const data = await res.json();

  const complaints: Complaint[] = data.complaints;

  if (!Array.isArray(complaints)) {
    logger.error(`Complaints is not an array`);
    return null;
  }
  console.log(complaints);
  const cardData = complaints.map((complaint) => {
    return {
      id: complaint.complaint_id,
      content: (
        <div className="flex items-start justify-start">
          {complaint.complaints_attachments &&
          complaint.complaints_attachments.length > 0 ? (
            <Image
              src={complaint.complaints_attachments[0].file_url}
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
            <p className="font-bold text-2xl opacity-80">{complaint.subject}</p>{" "}
            <span className="text-sm opacity-75">
              {formatDateTime(complaint.created_at!)}
            </span>
            <p className="opacity-50 mb-2">{complaint.status}</p>
            <Link href={`/tenant/request/details/${complaint.complaint_id}`}>
              <Button className="bg-[#00000080] text-white" size="lg">
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
      <h1 className="text-3xl font-bold opacity-80">Request Page</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow">
          <Search
            placeholder="Search request..."
            onSelect={onSelectSearchItem}
          />
          <FilterIcon size={20} />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <PlusCircleIcon className="cursor-pointer" size={20} />
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
