"use server";

import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Complaint } from "@/models/complaint";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { FileIcon, FilterIcon, Plus, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { PaginationControls } from "@/components/pagination";
import { formatDateTime, isImageFile } from "@/app/utils";
import Link from "next/link";
import { Search } from "../ui/searchComplaint";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const tenantId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const currentPage = Number(await params.page) || 1;

  const res = await fetch(
    `${baseUrl}/tenantmanager/api/getComplaint`,{
      next: {
        revalidate: 20,
      }
    });
  
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
        if (!hasAttachments || !isImageFile(complaint.complaints_attachments[0]?.file_type)) {
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
        id: complaint.complaint_id,
        content: (
          <div className="flex items-start justify-start">
            {renderAttachment()}
            <div className="mx-8">
              <p className="font-bold text-2xl opacity-80">{complaint.subject}</p>
              {/* <span className="text-sm opacity-75">
                {formatDateTime(complaint.created_at!)}
              </span> */}
              <p className="opacity-50 mb-2">{complaint.status}</p>
              <Link href={`/tenantmanager/complaints/details/${complaint.complaint_id}`}>
                <Button className="bg-[#00000080] hover:bg-[#00000095] text-white" size="lg">
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
        <div className="flex items-center space-x-4 flex-grow mr-2">
          <Search
            placeholder="Search request..."
          />
          <Button>
            <FilterIcon size={20} />
            </Button>
        </div>
       
      </div>

      <MultiCard padding="md" data={cardData} direction="column" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={data.totalPages}
        redirectPath="/tenantmanager/complaints"
      />
    </div>
  );
}
