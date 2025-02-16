"use server";

import { MultiCard } from "@/components/multi-card";
import { createClient } from "@/lib/supabaseServer";
import { Staff } from "@/models/staff";
import {
  FilterIcon,
  MailIcon,
  PhoneIcon,
  Plus,
  PlusCircleIcon,
} from "lucide-react";
import Image from "next/image";
import { Search } from "./ui/search";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { StaffForm } from "./ui/addStaffForm";
import { onSelectSearchItem } from "./actions/onselectsearchitem";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/pagination";
import Link from "next/link";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const userId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const currentPage = Number(await params.page) || 1;

  const res = await fetch(
    `${baseUrl}/staffmanager/getStaffs?role=SECURITY&page=${currentPage}`
  );

  const data = await res.json();
  const staffs: Staff[] = data.staffs;

  const cardData = staffs.map((staff) => {
    return {
      id: staff.staff_id,
      title: (
        <div className="flex justify-between">
          <Link href={`/staffmanager/security/details/${staff.staff_id}`}>
          <h1 className="text-2xl font-bold underline">{staff.name}</h1>
          </Link>
          <div className="flex items-center space-x-4">
            <PhoneIcon size={40} className="cursor-pointer" />
            <MailIcon size={40} className="cursor-pointer" />
          </div>
        </div>
      ),
      description: (
        <>
          Email: {staff.email} <br />
          Phone: {staff.phone_number} <br />
          Status: {staff.status}
        </>
      ),
      content: (
        <div className="flex items-center space-x-4">
          <Image
            src={
              staff.picture ||
              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23E5E7EB'/%3E%3C/svg%3E"
            }
            alt="Staff Image"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p>UID# {staff.staff_id}</p>
          </div>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80">Security Management</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow mr-2">
          <Search
            placeholder="Search request..."
            onSelect={onSelectSearchItem}
          />
          <Button variant={"default"}>
            <FilterIcon size={20} />
          </Button>{" "}
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant={"default"}>
              <Plus size={20} />
            </Button>
          </DialogTrigger>
          <StaffForm userId={userId} />
        </Dialog>
      </div>
      <MultiCard padding="md" data={cardData} direction="row" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={data.totalPages}
        redirectPath="/staffmanager/security"
      />
    </div>
  );
}
