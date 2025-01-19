import * as React from "react"

import { cn } from "@/lib/utils"

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(
  ({ className, icon, type, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && <div className="absolute right-3">{icon}</div>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }