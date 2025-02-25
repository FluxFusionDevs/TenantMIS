export interface Contracts {
  contract_id?: string;
  tenant_id: string;
  contract_start: string;
  contract_ends: string;
  contract_status: Status;
  contract_price: number;
  contract_attachments?: ContractAttachment[];
}

export interface ContractAttachment {
    attachment_id?: string;
    contract_id: string;
    file_name: string;
    file_type: string;
    file_size: number;
    file_url: string;
    uploaded_at: string;
    uploaded_by: string;
  }

export enum Status {
    ACTIVE = "ACTIVE",
    EXPIRED = "EXPIRED",
    TERMINATED = "TERMINATED",
  }