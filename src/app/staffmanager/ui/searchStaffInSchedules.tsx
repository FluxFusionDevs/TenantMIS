"use client";

import React from "react";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import { Staff, StaffCategory } from "@/models/staff";
import Link from "next/link";

interface SearchProps {
  placeholder?: string;
}

export function Search({ placeholder = "Search..." }: SearchProps) {
  const [suggestions, setSuggestions] = React.useState<Staff[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSearch = async (value: string) => {
    setSearchQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for debouncing
    timeoutRef.current = setTimeout(async () => {
      try {
        const data = await fetch(
          `/staffmanager/api/getStaffs?search=${value}`,
          { cache: "no-store" }
        );
        const { staffs } = await data.json();
        setSuggestions(staffs || []);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
      }
    }, 300);
  };

  return (
    <>
      <Command className="rounded-lg border shadow-md md:min-w-[450px]">
        <CommandInput
          placeholder={placeholder}
          value={searchQuery}
          onValueChange={handleSearch}
        />
        <CommandList>
          <div className="max-h-[300px] overflow-y-auto">
            {searchQuery === "" ? null : suggestions.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </p>
            ) : (
              <div className="px-1">
                {suggestions.map((suggestion) => (
                  <Link
                    key={suggestion.staff_id}
                    href={`/staffmanager/schedules?staffName=${suggestion.name}`}
                    passHref
                  >
                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      {suggestion.name}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CommandList>
      </Command>
    </>
  );
}
