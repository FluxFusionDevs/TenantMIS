"use server";

import { MultiCard } from "@/components/multi-card";
import { createClient } from "@/lib/supabaseServer";
import { StaffWithShifts } from "@/models/staff";
import {
  FilterIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/pagination";
import Link from "next/link";
import StaffScheduler from "@/components/sheduler";
import { jwtDecode } from "jwt-decode";
import { CustomJwtPayload } from "@/models/jwt";
// import { Search } from "../ui/searchStaffInSchedules";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  const userId = user?.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const staffName = await params.staffName;

  const res = await fetch(
    `${baseUrl}/staff/api/getStaff?userId=${userId}`
  );

  const data = await res.json();
  const staff: StaffWithShifts = data.staff;

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80">Scheduling Management</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow mr-2">
          {/* <Search
            placeholder="Search staff..."
          /> */}
          {/* <Button variant={"default"}>
            <FilterIcon size={20} />
          </Button> */}
        </div>
      </div>
      <StaffScheduler accountRole="staff" staffData={[staff]} searchQuery={staffName} />
    </div>
  );
}
