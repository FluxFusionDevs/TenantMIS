export interface Tenant {
    user_id?: string;
    tenant_id: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_no: string;
    picture?: string;
}

export interface Contract {
    contract_id?: string;
    tenant_id: number;
    contract_start: string;
    contract_end: string;
    contract_status: string;
    rent_price: number;
}

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