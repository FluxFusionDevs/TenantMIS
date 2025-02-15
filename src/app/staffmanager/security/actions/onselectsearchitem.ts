"use server";

import { Complaint } from "@/models/complaint";
import { Staff } from "@/models/staff";

export async function onSelectSearchItem(suggestion: Staff) {
  console.log(`Clicked on suggestion: ${suggestion.staff_id}`);
}