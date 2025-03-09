export enum Status {
  ORDER_REQUEST = "0",
  UPLOAD_PO_DOCUMENT = "1",
  APPROVAL_BUDGET = "2",
  APPROVAL_PROCUREMENT = "3",
  PURCHASED = "4",
  COMPLETED = "5",
}

export interface Purchase {
  po_id?: string; 
  description: string;
  amount: number;
  status: Status;
}
