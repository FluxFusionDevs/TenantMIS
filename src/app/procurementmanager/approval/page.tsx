"use server";

import { MultiCard } from "@/components/multi-card";
import { Plus, Bell, Filter } from "lucide-react";
import Image from "next/image";
import { Purchase } from "@/models/purchase";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function fetchPurchases(): Promise<Purchase[]> {
  try {
    const res = await fetch(`${baseUrl}/tenantmanager/api/getPurchase`, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch purchases: ${res.statusText}`);
    const data = await res.json();
    return data.purchase || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function PurchaseOrdersPage() {
  const purchases = await fetchPurchases();

  const purchaseCards = purchases.map((order: Purchase) => ({
    id: `ID#${order.po_id}`,
    title: order.description,
    description: `Amount: $${order.amount}`,
    content: (
      <span
        className={`px-3 py-1 rounded-md text-sm ${
          order.status === "PENDING"
            ? "text-yellow-700 bg-yellow-100"
            : order.status === "APPROVED"
            ? "text-green-700 bg-green-100"
            : "text-red-700 bg-red-100"
        }`}
      >
        {order.status}
      </span>
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
