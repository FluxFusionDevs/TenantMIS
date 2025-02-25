"use client";

import React from "react";
import { Command, CommandInput, CommandList } from "@/components/ui/command";
import Link from "next/link";
import { Contract } from "@/models/contract"; // Ensure this import points to your Contract interface

interface SearchProps {
  placeholder?: string;
}

export function Search({ placeholder = "Search contracts..." }: SearchProps) {
  const [suggestions, setSuggestions] = React.useState<Contract[]>([]);
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
          `/tenantmanager/api/getContracts?search=${value}`,
          { cache: "no-store" }
        );
        const { contracts } = await data.json(); // Assuming the API returns { contracts: Contract[] }

        setSuggestions(contracts || []);
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
                No contracts found.
              </p>
            ) : (
              <div className="px-1">
                {suggestions.map((contract) => (
                  <Link
                    key={contract.contract_id}
                    href={`/tenantmanager/contracts/details/${contract.contract_id}`}
                    passHref
                  >
                    <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      <div>
                        <p className="font-medium">{contract.contract_id}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {contract.contract_status}
                        </p>
                      </div>
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