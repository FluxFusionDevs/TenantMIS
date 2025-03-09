import { Badge } from "@/components/ui/badge";
import clsx from "clsx";

export type PriorityType = "URGENT" | "HIGH" | "MODERATE" | "LOW" | "CRITICAL" | string;

interface PriorityBadgeProps {
  priority: PriorityType | { priority: PriorityType } | any;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  // Handle different input types
  const priorityValue = typeof priority === 'object' && priority !== null
    ? (priority.priority || 'UNKNOWN')
    : priority;
  
  const isKnownPriority = ["LOW", "MODERATE", "HIGH", "CRITICAL"].includes(priorityValue);
  
  return (
    <Badge
      variant="outline"
      className={clsx(
        "px-2 py-0.5 text-xs font-normal",
        {
          "bg-blue-100 text-blue-700 border-blue-200": priorityValue === "LOW",
          "bg-yellow-100 text-yellow-700 border-yellow-200": priorityValue === "MODERATE",
          "bg-orange-100 text-orange-700 border-orange-200": priorityValue === "HIGH",
          "bg-red-100 text-red-700 border-red-200": priorityValue === "CRITICAL",
          "bg-gray-100 text-gray-700 border-gray-200": !isKnownPriority,
        },
        className
      )}
    >
      {priorityValue}
    </Badge>
  );
}