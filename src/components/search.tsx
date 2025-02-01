"use client";

import React from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { supabase } from "@/lib/supabaseClient";
import { Complaint } from "@/models/complaint";

interface SearchProps {
  placeholder?: string;
}

export function Search({ placeholder = "Search..." }: SearchProps) {
  const [suggestions, setSuggestions] = React.useState<Complaint[]>([]);
  const [searchQuery, setSearchQuery] = React.useState<string>("");
  const userIdRef = React.useRef<string | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleSelect = (suggestion: number) => {
    console.log(suggestion);
    // onSelect?.(suggestion);
  };

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        userIdRef.current = user?.id || null;
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

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
          `/tenant/request/getRequests?tenantId=${userIdRef.current}&search=${value}`,
          { cache: "no-store" }
        );
        const { complaints } = await data.json();
        setSuggestions(complaints || []);
        console.log("Suggestions", suggestions);
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
            {suggestions.length === 0 || searchQuery === "" ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No results found.
              </p>
            ) : (
              <div className="px-1">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.complaint_id}
                    onClick={() => handleSelect(suggestion.complaint_id)}
                    className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    {suggestion.description}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CommandList>
      </Command>
    </>
  );
}
