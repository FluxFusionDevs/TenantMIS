"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerDemoProps {
  className?: string;
  label?: string;
  name: string;
  defaultValue?: Date;
}

export function DatePicker({ className, label, name, defaultValue }: DatePickerDemoProps) {
  const [date, setDate] = React.useState<Date | undefined>(
    defaultValue || (defaultValue ? new Date(defaultValue) : undefined)
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {date ? (
            format(date, "PPP")
          ) : (
            <span>{label}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
      <input type="hidden" name={name} value={date ? format(date, "yyyy-MM-dd") : ""} />
    </Popover>
  )
}