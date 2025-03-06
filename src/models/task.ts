import { Complaint } from "./complaint";

export interface Task {
    task_id: string;
    status: TaskStatus;
    complaints?: Complaint;  
    deadline: string;
    title: string;
    description: string;
    priority: string;
}

export enum TaskStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN PROGRESS",
    COMPLETED = "COMPLETED",
}

export function validateStatus(status: string): boolean {
    return Object.values(TaskStatus).includes(status as TaskStatus);
}