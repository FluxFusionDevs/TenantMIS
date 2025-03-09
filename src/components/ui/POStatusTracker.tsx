import React from "react";
import { cn } from "@/lib/utils";

const statusSteps = [
  "Order Request",
  "Tenant Manager Upload of Purchase Order Document",
  "For Approval of Budget of Finance Department",
  "For Approval of Procurement Department",
  "Order is being purchased",
  "Completed",
];

type POStatusTrackerProps = {
  poStatus: number; // Enum from 0 to 5
};

const POStatusTracker: React.FC<POStatusTrackerProps> = ({ poStatus }) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      {statusSteps.map((label, index) => (
        <div key={index} className="flex flex-col items-center">
          {/* Step Indicator */}
          <div
            className={cn(
              "h-4 w-4 rounded-full transition-all",
              index <= poStatus ? "bg-green-500" : "bg-gray-300"
            )}
          />
          {/* Status Label */}
          <span
            className={cn(
              "mt-2 text-sm",
              index <= poStatus ? "text-green-500 font-medium" : "text-gray-400"
            )}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  );
};

export { POStatusTracker };
