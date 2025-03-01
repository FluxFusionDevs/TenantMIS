"use server";

import { MultiCard } from "@/components/multi-card";
import { Plus, Bell, Filter } from "lucide-react";
import Image from "next/image";
import { Purchase } from "@/models/purchase";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchPurchases(): Promise<Purchase[]> {
  try {
    const res = await fetch(`${baseUrl}/tenantmanager/api/getPurchase`, {
      next: {
        revalidate: 60,
      }
    });
    if (!res.ok) throw new Error(`Failed to fetch purchases: ${res.statusText}`);
    const data = await res.json();
    return data.purchase || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function Page() {
  const purchases = await fetchPurchases();

  const purchaseCards = purchases.map((order: Purchase) => ({
    id: `ID#${order.po_id}`,
    title: order.description,
    description: `Amount: $${order.amount}`,
    content: (
      <div className="p-4 border rounded-lg shadow-sm flex flex-col items-center text-center">
        <span
          className={`block w-fit px-3 py-1 rounded-md text-sm mb-3 ${
            order.status === "PENDING"
              ? "text-yellow-700 bg-yellow-100"
              : order.status === "APPROVED"
              ? "text-green-700 bg-green-100"
              : "text-red-700 bg-red-100"
          }`}
        >
          {order.status}
        </span>
        <Link href={`/purchases/details/${order.po_id}`}>
          <Button className="bg-[#00000080] hover:bg-[#00000095] text-white w-full" size="lg">
            View
          </Button>
        </Link>
      </div>
    ),
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
      </div>

      {/* Add Purchase Order Button */}
      <button className="w-full flex items-center justify-center bg-gray-200 text-black py-3 rounded-md font-semibold">
        <Plus className="w-5 h-5 mr-2" /> ADD NEW PURCHASE ORDER
      </button>

      {/* Search & Filter */}
      <div className="flex items-center space-x-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <input type="text" placeholder="Search" className="border p-2 rounded-md w-64" />
      </div>

      {/* Purchase Orders List using MultiCard */}
      <MultiCard data={purchaseCards} direction="row" padding="md" />
    </div>
  );
}
