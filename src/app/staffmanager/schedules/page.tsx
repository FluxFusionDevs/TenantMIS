"use server";

import { MultiCard } from "@/components/multi-card";
import { createClient } from "@/lib/supabaseServer";
import { Staff, StaffCategory, StaffWithShifts } from "@/models/staff";
import {
  FilterIcon,
  MailIcon,
  PhoneIcon,
  Plus,
} from "lucide-react";
import Image from "next/image";
import { Search } from "../ui/searchStaff";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { StaffForm } from "../ui/addStaffForm";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/pagination";
import Link from "next/link";
import StaffScheduler from "@/components/sheduler";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const userId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const currentPage = Number(await params.page) || 1;

  const res = await fetch(
    `${baseUrl}/staffmanager/api/getStaffs?role=HOUSEKEEPING&page=${currentPage}`
  );

  const data = await res.json();
  const staffs: StaffWithShifts[] = data.staffs;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80">Scheduling Management</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow mr-2">
          <Search
            placeholder="Search request..."
            role={StaffCategory.HOUSEKEEPING}
          />
          <Button variant={"default"}>
            <FilterIcon size={20} />
          </Button>
        </div>
      </div>
      <StaffScheduler staffData={staffs} />

    </div>
  );
}
