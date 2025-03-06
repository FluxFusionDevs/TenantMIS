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

const days = Object.values(DayOfWeek);

// Group shifts by day
const getShiftsByDay = (staffData: StaffWithShifts[], searchQuery: string) => {
  const shiftsByDay: Record<string, { staff: StaffWithShifts; shift: StaffShift }[]> = {};
  const normalizedSearchQuery = searchQuery.toLowerCase().trim();
  
  days.forEach(day => {
    shiftsByDay[day] = [];
    
    staffData.forEach(staff => {
      // Filter by staff name if search query exists
      if (normalizedSearchQuery && !staff.name.toLowerCase().includes(normalizedSearchQuery)) {
        return;
      }
      
      staff.staff_shifts.forEach(shift => {
        if (shift.day_of_week === day) {
          shiftsByDay[day].push({ staff, shift });
        }
      });
    });
    
    // Sort shifts by start time
    shiftsByDay[day].sort((a, b) => {
      return a.shift.shift_start.localeCompare(b.shift.shift_start);
    });
  });
  
  return shiftsByDay;
};

export default function Scheduler({ staffData, searchQuery= "" }: { staffData: StaffWithShifts[]; searchQuery: string }) {
  const shiftsByDay = getShiftsByDay(staffData, searchQuery);
  const hasVisibleShifts = Object.values(shiftsByDay).some(shifts => shifts.length > 0);

  return (
    <div className="border rounded-lg">
         {!hasVisibleShifts && searchQuery && (
        <div className="p-4 text-center text-muted-foreground">
          No staff matching "{searchQuery}" found in the schedule
        </div>
      )}
      
      <Table>
        <TableHeader>
          <TableRow>
            {days.map((day) => (
              <TableHead key={day} className="text-center">
                {day.charAt(0) + day.slice(1).toLowerCase()}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            {days.map((day) => (
              <TableCell key={day} className="align-top p-2">
                <div className="flex flex-col space-y-2">
                  {shiftsByDay[day].length > 0 ? (
                    shiftsByDay[day].map(({ staff, shift }) => (
                      <Link 
                        key={`${day}-${staff.staff_id}-${shift.shift_id}`} 
                        href={`/staffmanager/${(staff.role).toLocaleLowerCase()}/details/${staff.staff_id}`}
                      >
                        <div className="p-2 bg-slate-100 rounded border border-slate-200 hover:bg-slate-200 transition-colors">
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={staff.picture || ""} alt={staff.name} />
                              <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-medium truncate">{staff.name}</span>
                              <span className="text-xs text-muted-foreground">{staff.role}</span>
                              <span className="text-xs text-muted-foreground">
                                {shift.shift_start.slice(0, 5)} - {shift.shift_end.slice(0, 5)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-4 text-sm text-muted-foreground">No shifts</div>
                  )}
                </div>
              </TableCell>
            ))}
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}