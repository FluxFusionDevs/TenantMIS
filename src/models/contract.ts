
export interface Contract {
    contract_id: number;
    tenant_id: number;
    contract_start: string;
    contract_end: string;
    contract_status: string;
    rent_price: number;
}


export enum ContractStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    TERMINATED = 'TERMINATED'
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
  
