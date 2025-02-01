"use server";

import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { Category, Complaint, Priority, Status } from "@/models/complaint";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterIcon, PlusCircleIcon } from "lucide-react";
import Image from "next/image";
import { Search } from "@/components/search";

export default async function RequestPage({ params }: { params: any }) {
  const client = await createClient();
  const tenantId = (await client.auth.getUser()).data.user?.id;
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
          <Search placeholder="Search request..."/>
          <FilterIcon size={20} />
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <PlusCircleIcon className="cursor-pointer" size={20} />
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add a new request</DialogTitle>
              <DialogDescription>
                Fill in the form below to add a new request
              </DialogDescription>
            </DialogHeader>
            <form
              action="/api/addComplaint"
              method="POST"
              className="grid gap-4 py-4"
            >
              <input type="hidden" name="tenant_id" value={tenantId} />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      {Object.values(Status).map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="priority" className="text-right">
                  Priority
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      {Object.values(Priority).map((priority) => (
                        <SelectItem key={priority} value={priority}>
                          {priority}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Category</SelectLabel>
                      {Object.values(Category).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Add Request</Button>
              </DialogFooter>
            </form>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <MultiCard padding="md" data={cardData} direction="column" />
    </div>
  );
}
