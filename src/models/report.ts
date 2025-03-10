import { Task } from "./task";

export interface Reports {
  task_id: string;
  progress_id: string;
  description: string;
  created_at: string;
    staff_tasks: Task;
}