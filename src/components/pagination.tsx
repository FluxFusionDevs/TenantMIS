"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  redirectPath: string;
}

export function PaginationControls({ 
  currentPage, 
  totalPages,
  redirectPath 
}: PaginationProps) {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    router.push(`${redirectPath}?page=${page}`);
  };


  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
          className="cursor-pointer"
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>
        
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i + 1}>
            <PaginationLink
            className="cursor-pointer"
              isActive={currentPage === i + 1}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext
            className="cursor-pointer"
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}