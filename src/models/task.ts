import { Complaint, Status } from "./complaint";

export interface Task {
    task_id: string;
    staff_id: string;
    status: Status;
    complaints?: Complaint;  
}