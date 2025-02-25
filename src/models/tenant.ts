export interface Tenant {
    user_id?: number;
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


