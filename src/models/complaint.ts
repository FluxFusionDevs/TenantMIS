import { Staff } from "./staff";

export interface Complaint {
  complaint_id?: string;
  tenant_id: string;
  subject: string;
  description: string;
  created_at?: string;
  status: Status;
  priority: Priority;
  category: Category;
  files?: string[] | File[];
  complaints_attachments?: ComplaintAttachment[];
}

export interface ComplaintAttachment {
  attachment_id?: string;
  complaint_id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_url: string;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ComplaintWithStaffAssigned extends Complaint {
  staff_assigned: Staff[]
}

export enum Priority {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}


export enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN PROGRESS",
  COMPLETED = "COMPLETED",
}

export enum Category {
  MAINTENANCE = "MAINTENANCE",
  HOUSEKEEPING = "HOUSEKEEPING",
  SECURITY = "SECURITY",
}


export function validateCategory(category: string): boolean {
  return Object.values(Category).includes(category as Category);
}

export function validatePriority(priority: string): Priority | boolean {
  return Object.values(Priority).includes(priority as Priority);
}

export function validateStatus(status: string): boolean {
  return Object.values(Status).includes(status as Status);
}

export function getValidCategory(category: string): Category {
  if (!validateCategory(category)) {
    throw new Error(`Invalid category: ${category}`);
  }
  return category as Category;
}

export function getValidPriority(priority: string): Priority {
  if (!validatePriority(priority)) {
    throw new Error(`Invalid priority: ${priority}`);
  }
  return priority as Priority;
}

export function getValidStatus(status: string): Status {
  if (!validateStatus(status)) {
    throw new Error(`Invalid status: ${status}`);
  }
  return status as Status;
}

export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case Priority.LOW:
      return "green";
    case Priority.MODERATE:
      return "orange";
    case Priority.HIGH:
      return "red";
    case Priority.CRITICAL:
      return "purple";
    default:
      return "gray";
  }
}

export function getStatusColor(status: Status): string {
  switch (status) {
    case Status.PENDING:
      return "yellow";
    case Status.IN_PROGRESS:
      return "blue";
    case Status.COMPLETED:
      return "green";
    default:
      return "gray";
  }
}