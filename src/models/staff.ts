import { Task } from "./task";

export enum StaffCategory {
  HOUSEKEEPING = "HOUSEKEEPING",
  MAINTENANCE = "MAINTENANCE",
  SECURITY = "SECURITY",
}

export enum DayOfWeek {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export enum StaffStatus {
  AVAILABLE = "AVAILABLE",
  UNAVAILABLE = "UNAVAILABLE",
}

export interface Staff {
  staff_id?: string;
  user_id?: string;
  name: string;
  password: string;
  role: StaffCategory;
  phone_number: string;
  email: string;
  status: StaffStatus;
  picture?: string;
}

export interface StaffShift {
  shift_id: number;
  staff_id: string;
  day_of_week: DayOfWeek;
  shift_start: string; 
  shift_end: string;
}

export interface StaffWithTasks extends Staff {
    staff_tasks?: {
      task_id: string;
      title: string;
      priority: string;
      staff_id: string;
      status: string;
      description: string;
      deadline: string;
    } | null;
  };

export interface StaffWithShifts extends Staff {
  staff_shifts: StaffShift[];
}

export const validateCategory = (category: string): StaffCategory => {
  if (!Object.values(StaffCategory).includes(category as StaffCategory)) {
    throw new Error(`Invalid category: ${category}`);
  }
  return category as StaffCategory;
};

export const validateDay = (day: string): DayOfWeek => {
  if (!Object.values(DayOfWeek).includes(day as DayOfWeek)) {
    throw new Error(`Invalid day: ${day}`);
  }
  return day as DayOfWeek;
};

export const validateStatus = (status: string): StaffStatus => {
  if (!Object.values(StaffStatus).includes(status as StaffStatus)) {
    throw new Error(`Invalid status: ${status}`);
  }
  return status as StaffStatus;
};