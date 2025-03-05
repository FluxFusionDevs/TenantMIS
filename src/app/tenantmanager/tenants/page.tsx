"use server";

import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Tenant } from "@/models/tenant";
import { CreateTenantForm } from "../ui/addTenantForm";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchTenants(): Promise<Tenant[]> {
  try {
    const res = await fetch(`${baseUrl}/tenantmanager/api/getTenant`, {
      next: {
        revalidate: 60, // Revalidates every 60 seconds
      },
    });
    if (!res.ok) throw new Error(`Failed to fetch tenants: ${res.statusText}`);

    const data = await res.json();
    return data.tenant || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function TenantManagement() {
  const tenants = await fetchTenants();

  const tenantCards = tenants.map((tenant) => ({
    id: tenant.tenant_id,
    content: (
      <div className="flex items-start justify-between p-4 border rounded-lg shadow-sm">
        <div>
          <p className="font-bold text-xl opacity-80">
            {tenant.first_name} {tenant.last_name}
          </p>
          <p className="opacity-50 mb-2">UID#{tenant.tenant_id}</p>
          <Link href={`/tenantmanager/tenants/details/${tenant.tenant_id}`}>
            <Button className="bg-[#00000080] hover:bg-[#00000095] text-white" size="lg">
              View
            </Button>
          </Link>
        </div>
      </div>
    ),
  }));

  // "Add Tenant" Card with a Dialog Trigger
  const addTenantCard = {
    id: "add",
    content: (
      <Dialog>
        <DialogTrigger asChild>
          <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded-lg cursor-pointer">
            <Plus className="w-8 h-8 text-gray-500" />
          </div>
        </DialogTrigger>
        <CreateTenantForm />
      </Dialog>
    ),
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-3">
        <input type="text" placeholder="Search" className="border p-2 rounded-md w-64" />
      </div>

      {/* Tenant Cards */}
      <MultiCard data={[...tenantCards, addTenantCard]} direction="column" />
    </div>
  );
}
