"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Staff, StaffShift, StaffWithShifts, DayOfWeek } from "@/models/staff";
import Link from "next/link";

const timeSlots = Array.from({ length: 24 }, (_, i) => 
  `${i.toString().padStart(2, '0')}:00`
)

const days = Object.values(DayOfWeek);

const isTimeInShift = (time: string, shift: StaffShift) => {
  const timeHour = parseInt(time.split(':')[0]);
  const startHour = parseInt(shift.shift_start.split(':')[0]);
  const endHour = parseInt(shift.shift_end.split(':')[0]);
  return timeHour >= startHour && timeHour < endHour;
}

const getConsecutiveShifts = (staffData: StaffWithShifts[], day: string, time: string) => {
    const shifts: { staff: StaffWithShifts; shift: StaffShift; consecutive: number }[] = [];
    
    staffData.forEach((staff) => {
      const shift = staff.staff_shifts.find(
        (s) => s.day_of_week === day && isTimeInShift(time, s)
      );
      
      if (shift) {
        const startHour = parseInt(shift.shift_start.split(':')[0]);
        const endHour = parseInt(shift.shift_end.split(':')[0]);
        const currentHour = parseInt(time.split(':')[0]);
        const consecutive = endHour - currentHour;
        
        shifts.push({ staff, shift, consecutive });
      }
    });
    
    return shifts;
  };

export default function Scheduler({ staffData }: { staffData: StaffWithShifts[] }) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Time</TableHead>
            {days.map((day) => (
              <TableHead key={day}>{day.charAt(0) + day.slice(1).toLowerCase()}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
  {timeSlots.map((time) => (
    <TableRow key={time}>
      <TableCell className="font-medium">{time}</TableCell>
      {days.map((day) => {
        const shifts = getConsecutiveShifts(staffData, day, time);
        
        return (
          <TableCell 
            key={`${day}-${time}`} 
            className="h-[60px] min-w-32 relative p-0"
          >
            {shifts.map(({ staff, shift, consecutive }) => (
              <Link key={staff.staff_id} href={`/staffmanager/${(staff.role).toLocaleLowerCase()}/details/${staff.staff_id}`}>
              <div
                className="absolute cursor-pointer inset-0 m-1 flex items-center gap-2 p-1 bg-slate-100 rounded justify-center border border-slate-200"
                style={{
                  height: `${consecutive * 60}px`,
                  zIndex: consecutive > 1 ? 10 : 'auto'
                }}
              >
        
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-medium truncate">{staff.name}</span>
                  <span className="text-xs text-muted-foreground">{staff.role}</span>
                  <span className="text-xs text-muted-foreground">
                    {shift.shift_start.slice(0, 5)} - {shift.shift_end.slice(0, 5)}
                  </span>
                </div>
              </div>
              </Link>
            ))}
          </TableCell>
        );
      })}
    </TableRow>
  ))}
</TableBody>
      </Table>
    </div>
  )
}