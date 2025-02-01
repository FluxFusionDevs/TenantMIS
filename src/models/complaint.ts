export interface Complaint {
  complaint_id: number;
  tenant_id: string;
  subject: string;
  description: string;
  created_at: string;
  status: Status;
  priority: Priority;
  category: Category;
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