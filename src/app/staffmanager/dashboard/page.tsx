"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {  StaffWithShifts } from "@/models/staff";
import Image from "next/image";
import React from "react";

const cardData = [
  {
    id: "1",
    title: "Card 1",
    description: "Description 1",
    content: (
      <div className="flex items-center space-x-4">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
          alt="Card 1"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p>This is card 1</p>
          <span>Status</span>
        </div>
      </div>
    ),
  },
  {
    id: "2",
    title: "Card 2",
    description: "Description 2",
    content: (
      <div className="flex items-center space-x-4">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
          alt="Card 2"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p>This is card 2</p>
          <span>Status</span>
        </div>
      </div>
    ),
  },
  {
    id: "3",
    title: "Card 3",
    description: "Description 3",
    content: (
      <div className="flex items-center space-x-4">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
          alt="Card 3"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p>This is card 3</p>
          <span>Status</span>
        </div>
      </div>
    ),
  },
];

const accountCardData = [
  {
    id: "1",
    title: "Card 1",
    description: "Description 1",
  },
  {
    id: "2",
    title: "Card 2",
    description: "Description 2",
  },
  {
    id: "3",
    title: "Card 3",
    description: "Description 3",
  },
];
export default async function Dashboard() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${baseUrl}/staffmanager/api/getStaffs?page=1`);
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
