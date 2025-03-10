"use server";

import { formatDateToNow } from "@/app/utils";
import { CardData, MultiCard } from "@/components/multi-card";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabaseServer";
import logger from "@/logger/logger";
import { CustomJwtPayload } from "@/models/jwt";
import { Status } from "@/models/purchase";
import { Staff, StaffShift, StaffWithShifts } from "@/models/staff";
import { Task } from "@/models/task";
import { jwtDecode } from "jwt-decode";
import React from "react";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  let tasks: Task[] = [];
  let staffs: Staff[] = [];
  let staff: Staff;
  let shifts: StaffShift[] = [];
  try {
    const supabase = await createClient();
    const user = (await supabase.auth.getUser()).data.user;
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) {
      throw new Error("No session found");
    }
    const token = jwtDecode(session?.access_token) as CustomJwtPayload;

    const userId = user?.id;
    const res3 = await fetch(
      `${baseUrl}/staff/api/getStaff?userId=${userId}`
    );
    const data3 = await res3.json();
    staff = data3.staff as Staff;
    const res = await fetch(
      `${baseUrl}/staffmanager/api/getTasks?staffId=${staff.staff_id}`
    );
    const res2 = await fetch(
      `${baseUrl}/staffmanager/api/getStaffs?staffId=${userId}&${token.user_role}=HOUSEKEEPING`
    );

    const res4 = await fetch(
      `${baseUrl}/staff/api/getShifts?staffId=${staff.staff_id}`
    );
    const data = await res.json();
    const data2 = await res2.json();
    const data4 = await res4.json();
    tasks = data.complaints ?? [];
    staffs = data2.staffs ?? [];
    shifts = data4.shifts ?? [];
  } catch (error) {
    logger.error("Error fetching data:", error);
  }

  const recentTaskCard = tasks.map((task) => {
    return {
      id: Number(task.task_id),
      content: (
        <div className="flex items-start justify-start">
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold">{task.complaints?.subject}</p>
            <p className="text-md text-gray-500">#ID {task.task_id}</p>
            <div>
              <StatusBadge status={task.status} />
            </div>
            <p className="text-sm text-gray-500">{task.description}</p>
            <p className="text-md text-gray-500 font-medium">
              Due {formatDateToNow(task.deadline!)}
            </p>
          </div>
        </div>
      ),
    };
  });

  const accountCardData = [
    {
      id: 1,
      title: <p className="text-2xl font-semibold">Coworkers</p>,
      description: `Total ${staffs.length}`,
    },
    {
      id: 2,
      title:  <p className="text-2xl font-semibold">Shifts</p>,
      description: "Total: " + shifts.length,
    },
    {
      id: 3,
      title: <p className="text-2xl font-semibold">Tasks</p>,
      description: `Total: ${tasks.length}`,
    },
  ];
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold opacity-80 text-customIndigoTextColor">Home</h1>
        {/* {cardTemplate(housekeepingCount, housekeepingShiftCount)} */}
      </div>

      <div className="space-y-4">
        <h1 className="text-2xl font-bold opacity-80 text-customGreenTextColor">Recent Task</h1>
        <MultiCard data={recentTaskCard} direction="row" size="md" />
      </div>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold opacity-80 text-customGreenTextColor">Dashboard</h1>
        <MultiCard data={accountCardData} direction="row" size="md" />
      </div>
    </div>
  );
}
