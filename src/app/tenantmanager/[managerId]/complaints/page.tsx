'use client'

import { MultiCard } from '@/components/multi-card'
import Image from 'next/image'
import React from 'react'
import { Bell, Filter, Plus } from 'lucide-react'

// Dummy user data
const user = {
  name: "Name",
  role: "Manager",
}

const cardData = [
  {
    id: 1,
    title: 'Leaky Faucet',
    description: 'ID#0001',
    content: (
      <div>
        <p>Tenant has complained that their bathroom from room 251 has a leaky faucet. Has not been resolved in a week.</p>
        <div className="flex space-x-2 mt-2">
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Housekeeping</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Low</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">In Progress</span>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Malfunctioning Socket',
    description: 'ID#0029',
    content: (
      <div>
        <p>The socket used by the projector in room 201 is malfunctioning and not providing power.</p>
        <div className="flex space-x-2 mt-2">
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Maintenance</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Medium</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Complete</span>
        </div>
      </div>
    ),
  },
  {
    id: 3,
    title: 'Stuck Elevator',
    description: 'ID#0067',
    content: (
      <div>
        <p>Elevator 2 is stuck on the 6th floor.</p>
        <div className="flex space-x-2 mt-2">
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Maintenance</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Urgent</span>
          <span className="px-2 py-1 text-xs bg-gray-200 rounded">Incomplete</span>
        </div>
      </div>
    ),
  },
]

const UserProfile = () => (
  <div className="flex items-center space-x-3">
    <Bell className="w-6 h-6 text-gray-500" />
    <div className="text-right">
      <p className="text-sm text-gray-700">
        Welcome, <span className="font-semibold">{user.name}</span>
      </p>
      <p className="text-xs text-gray-500">{user.role}</p>
    </div>
    <Image src="" alt="User Avatar" width={32} height={32} className="rounded-full" />
  </div>
)

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Complaint Management</h1>
        <UserProfile />
      </div>

      {/* Search & Filter */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3">
          <Filter className="w-5 h-5 text-gray-600" />
          <input type="text" placeholder="Search" className="border p-2 rounded-md w-64" />
        </div>
        <Plus className="w-5 h-5 text-gray-600 cursor-pointer" />
      </div>

      {/* Complaints List */}
      <MultiCard data={cardData} direction="column" />
    </div>
  )
}
