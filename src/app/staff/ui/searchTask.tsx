"use client";

import React from "react";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import Link from "next/link";
import { Complaint } from "@/models/complaint";

interface SearchProps {
  placeholder?: string;
}

export function Search({ placeholder = "Search..." }: SearchProps) {
  const [suggestions, setSuggestions] = React.useState<Complaint[]>([]);
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
          `/staffmanager/api/getRequests?search=${value}`,
          { cache: "no-store" }
        );
        console.log("data", data);
        const { complaints } = await data.json();

        setSuggestions(complaints || []);
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
                    key={suggestion.complaint_id}
                    href={`/staff/tasks/details/${suggestion.complaint_id}`}
                    passHref
                  >
                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      {suggestion.subject}
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
