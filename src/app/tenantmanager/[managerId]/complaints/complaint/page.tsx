"use client";

import ComplaintForm from "@/components/complaint-form";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeftIcon } from "lucide-react";

export default function CompaintForm() {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-4">
        <ArrowLeftIcon className="cursor-pointer" />
        <h1 className="text-2xl font-bold opacity-80">File a Complaint</h1>
      </div>
      <Card>
        <CardContent className="p-6">
          <ComplaintForm />
        </CardContent>
      </Card>
    </div>
  );
}
