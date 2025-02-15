"use client";

import { ChevronLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";

export function BackButton() {
    const router = useRouter();
  return (
    <Button variant="outline" size="icon" onClick={() => router.back()}>
      <ChevronLeft />
    </Button>
  )
}
