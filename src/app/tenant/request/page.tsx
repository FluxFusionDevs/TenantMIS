"use server";

import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Complaint } from "@/models/complaint";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { FilterIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { Search } from "@/components/search";
import { onSelectSearchItem } from "./actions/onselectsearchitem";
import { RequestForm } from "./addRequestForm";

export default async function RequestPage({ params }: { params: any }) {
  const client = await createClient();
  const tenantId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(
    `${baseUrl}/tenant/request/getRequests?tenantId=${tenantId}`
  );
  const data = await res.json();

  const complaints: Complaint[] = data.complaints;

  if (!Array.isArray(complaints)) {
    logger.error(`Complaints is not an array`);
    return null;
  }

  const cardData = complaints.map((complaint) => {
    return {
      id: complaint.complaint_id,
      content: (
        <div className="flex items-start justify-start">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
            alt="Request Image"
            width={180}
            height={180}
          />
          <div className="mx-8">
            <p className="font-bold text-2xl opacity-80">{complaint.subject}</p>
            <p className="opacity-50 mb-2">{complaint.status}</p>
            <Button className="bg-[#00000080] text-white" size="lg">
              View
            </Button>
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
    </div>
  );
}
