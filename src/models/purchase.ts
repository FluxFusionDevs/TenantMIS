export interface Purchase {
  po_id?: string;
  description: string;
  amount: number;
  status: Status;
}

export enum Status {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
  }