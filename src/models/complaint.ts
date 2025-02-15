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


export enum Priority {
  LOW = "LOW",
  MODERATE = "MODERATE",
  HIGH = "HIGH",
}

export enum Category {
  MAINTENANCE = "MAINTENANCE",
  HOUSEKEEPING = "HOUSEKEEPING",
  SECURITY = "SECURITY",
}

export enum Status {
  PENDING = "PENDING",
  IN_PROGRESS = "IN PROGRESS",
  COMPLETED = "COMPLETED",
}

export function validateCategory(category: string): Category {
  if (Object.values(Category).includes(category as Category)) {
    return category as Category;
  }
  throw new Error('Invalid category');
}

export function validatePriority(priority: string): Priority {
  if (Object.values(Priority).includes(priority as Priority)) {
    return priority as Priority;
  }
  throw new Error('Invalid priority');
}

export function validateStatus(status: string): Status {
  if (Object.values(Status).includes(status as Status)) {
    return status as Status;
  }
  throw new Error('Invalid status');
}