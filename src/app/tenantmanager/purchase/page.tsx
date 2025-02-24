'use server'

import React from 'react'
import { Bell, Filter, Plus } from 'lucide-react'
import { MultiCard } from '@/components/multi-card'
import Image from 'next/image'

const user = {
  name: 'Name',
  role: 'Manager',
}

// Dummy purchase orders data
const purchaseOrders = [
  {
    id: 'ID#0001',
    title: 'New Faucet and Pipes',
    description:
      'Tenant has complained that their bathroom from room 251 has a leaky faucet. Has not been resolved in a week.',
    content: <span className="text-yellow-700 bg-yellow-100 px-3 py-1 rounded-md text-sm">Pending</span>,
  },
  {
    id: 'ID#0029',
    title: 'Sockets and Wires',
    description:
      'The socket used by the projector in room 201 is malfunctioning and not providing power.',
    content: <span className="text-green-700 bg-green-100 px-3 py-1 rounded-md text-sm">Approved</span>,
  },
  {
    id: 'ID#0067',
    title: 'Entire Elevator',
    description: 'Elevator 2 is stuck on the 6th floor.',
    content: <span className="text-red-700 bg-red-100 px-3 py-1 rounded-md text-sm">Denied</span>,
  },
]

const UserProfile = () => (
  <div className="flex items-center space-x-3">
    <Bell className="w-6 h-6 text-gray-500" />
    <div className="text-right">
      <p className="text-sm text-gray-700">
        Welcome, <span className="font-semibold italic">{user.name}</span>
      </p>
      <p className="text-xs text-gray-500">{user.role}</p>
    </div>
    <Image
      src="/path-to-user-image.jpg"
      alt="User Avatar"
      width={32}
      height={32}
      className="rounded-full"
    />
  </div>
)

export default async function PurchaseOrdersPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Purchase Orders</h1>
        <UserProfile />
      </div>

      {/* Add Purchase Order Button */}
      <button className="w-full flex items-center justify-center bg-gray-200 text-black py-3 rounded-md font-semibold">
        <Plus className="w-5 h-5 mr-2" /> ADD NEW PURCHASE ORDER
      </button>

      {/* Search & Filter */}
      <div className="flex items-center space-x-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded-md w-64"
        />
      </div>

      {/* Purchase Orders List using MultiCard */}
      <MultiCard data={purchaseOrders} direction="row" padding="md" />
    </div>
  )
}
