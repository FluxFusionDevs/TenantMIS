"use server";

import { MultiCard } from "@/components/multi-card";
import { createClient } from "@/lib/supabaseServer";
import { Staff, StaffCategory, StaffWithShifts } from "@/models/staff";
import { FilterIcon, MailIcon, PhoneIcon, Plus } from "lucide-react";
import { Search } from "@/app/staff/ui/searchStaff";
import { Button } from "@/components/ui/button";
import { PaginationControls } from "@/components/pagination";
import Link from "next/link";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import Image from "next/image";

export default async function Page({ searchParams }: { searchParams: any }) {
  const client = await createClient();
  const userId = (await client.auth.getUser()).data.user?.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const params = await searchParams;
  const currentPage = Number(await params.page) || 1;

  const res = await fetch(`${baseUrl}/staff/api/getStaff?userId=${userId}`);

  const data = await res.json();
  const staff: Staff = data.staff;

  const res2 = await fetch(
    `${baseUrl}/staffmanager/api/getStaffs?role=${staff.role}&page=${currentPage}`
  );

  const data2 = await res2.json();
  const staffs: StaffWithShifts[] = data2.staffs;

  const cardData = staffs.map((staff) => {
    return {
      id: staff.staff_id,
      title: (
        <div className="flex justify-between">
          <Link href={`/staff/details/${staff.staff_id}`}>
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
          <Avatar>
            <AvatarImage
              className="w-10 h-10 object-cover"
              src={staff.picture || "/profile_placeholder.png"}
            />
            <AvatarFallback>
              <Image
                src="/profile_placeholder.png"
                width={40}
                height={40}
                alt="Profile Picture"
              />
            </AvatarFallback>
          </Avatar>
          <p>UID# {staff.staff_id}</p>
        </div>
      ),
    };
  });

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80 text-customIndigoTextColor">{staff.role}</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow mr-2">
          <Search
            placeholder="Search request..."
            role={staff.role}
          />
          <Button variant={"default"}>
            <FilterIcon size={20} />
          </Button>
        </div>
      </div>

      <MultiCard padding="md" data={cardData} direction="row" />
      <PaginationControls
        currentPage={currentPage}
        totalPages={data.totalPages}
        redirectPath="/staffmanager/housekeeping"
      />
    </div>
  );
}
