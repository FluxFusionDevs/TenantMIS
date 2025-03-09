import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

export type StatusType = "PENDING" | "IN PROGRESS" | "COMPLETED" | string;

interface StatusBadgeProps {
  status: StatusType | { status: StatusType } | any;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Handle different input types
  const statusValue = typeof status === 'object' && status !== null 
    ? (status.status || 'UNKNOWN')
    : status;
  
  const isKnownStatus = ["PENDING", "IN PROGRESS", "COMPLETED"].includes(statusValue);
  
  return (
    <Badge
      variant="outline"
      className={clsx(
        "px-2 py-0.5 text-xs font-normal",
        {
          "bg-yellow-100 text-yellow-700 border-yellow-200": statusValue === "PENDING",
          "bg-blue-100 text-blue-700 border-blue-200": statusValue === "IN PROGRESS",
          "bg-green-100 text-green-700 border-green-200": statusValue === "COMPLETED",
          "bg-gray-100 text-gray-700 border-gray-200": !isKnownStatus,
        },
        className
      )}
    >
      {statusValue}
    </Badge>
  );
}