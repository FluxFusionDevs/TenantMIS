
"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  StaffWithShifts } from "@/models/staff";
import React from "react";

export default async function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/staffmanager/api/getStaffs?page=1`, {
    cache: "no-store",
    next: {
      revalidate: 0,
    }
  });
  const data = await res.json();
  const staffs: StaffWithShifts[] = data.staffs;
  const housekeepingCount = staffs.filter(
    (staff) => staff.role === "HOUSEKEEPING"
  ).length;
  const securityCount = staffs.filter(
    (staff) => staff.role === "SECURITY"
  ).length;
  const technicianCount = staffs.filter(
    (staff) => staff.role === "MAINTENANCE"
  ).length;

  const housekeepingShiftCount = staffs.reduce((acc, staff) => {
    return (
      acc +
      staff.staff_shifts.filter(() => staff.role === "HOUSEKEEPING").length
    );
  }, 0);
  const securityShiftCount = staffs.reduce((acc, staff) => {
    return (
      acc + staff.staff_shifts.filter(() => staff.role === "SECURITY").length
    );
  }, 0);
  const technicianShiftCount = staffs.reduce((acc, staff) => {
    return (
      acc + staff.staff_shifts.filter(() => staff.role === "MAINTENANCE").length
    );
  }, 0);

  const cardTemplate = (staffCount: number, shiftCount: number) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Staff Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-2">
              <p className="text-sm text-muted-foreground">Total Staff</p>
              <p className="text-2xl font-bold">{staffCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shift Overview</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div
              className={`flex flex-col space-y-2 ${
                shiftCount < 5
                  ? "text-red-600"
                  : shiftCount < 10
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              <p className="text-sm">Current Shifts</p>
              <p className="text-2xl font-bold">{shiftCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };
  // Replace the return statement with this:
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold opacity-80">
          Housekeeping Management
        </h1>
        {cardTemplate(housekeepingCount, housekeepingShiftCount)}
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold opacity-80">Security Management</h1>
        {cardTemplate(securityCount, securityShiftCount)}
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold opacity-80">Technician Management</h1>
        {cardTemplate(technicianCount, technicianShiftCount)}
      </div>
    </div>
  );
}
