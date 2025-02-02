"use server";

import { Complaint } from "@/models/complaint";

export async function onSelectSearchItem(suggestion: Complaint) {
  console.log(`Clicked on suggestion: ${suggestion.complaint_id}`);
}