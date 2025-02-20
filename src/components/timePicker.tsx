"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Clock } from "lucide-react";

interface TimePickerProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleTimeChange = (type: "hour" | "minute", newValue: number) => {
    const currentTime = value ? value.split(":") : ["00", "00"];
    const newTime = [...currentTime];

    if (type === "hour") {
      newTime[0] = newValue.toString().padStart(2, "0");
    } else if (type === "minute") {
      newTime[1] = newValue.toString().padStart(2, "0");
    }

    const timeString = newTime.join(":");
    onChange?.(timeString);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value ? value : "HH:mm"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="flex h-[300px] divide-x">
          <ScrollArea className="w-auto">
            <div className="flex flex-col p-2">
              {hours.map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={
                    value?.split(":")[0] === hour.toString().padStart(2, "0")
                      ? "default"
                      : "ghost"
                  }
                  className="w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("hour", hour)}
                >
                  {hour.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
          <ScrollArea className="w-auto">
            <div className="flex flex-col p-2">
              {minutes.map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={
                    value?.split(":")[1] === minute.toString().padStart(2, "0")
                      ? "default"
                      : "ghost"
                  }
                  className="w-full shrink-0 aspect-square"
                  onClick={() => handleTimeChange("minute", minute)}
                >
                  {minute.toString().padStart(2, "0")}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="vertical" />
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
