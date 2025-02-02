'use client'

import { MultiCard } from '@/components/multi-card'
import Image from 'next/image'
import React from 'react'
import { Bell, Filter } from 'lucide-react'

// Dummy user data
const user = {
  name: "Name",
  role: "Manager",
};

const cardData = [
  {
    id: 1,
    title: 'John Smith 3-Month Lease',
    description: "ID#2190",
    content: (
      <div>
        <p>Starts:</p>
        <p>Expires:</p>
      </div>
    ),
  },
  {
    id: 2,
    title: 'Jane Madison Neo',
    description: "ID#1154",
    content: (
      <div>
        <p>Starts:</p>
        <p>Expires:</p>
      </div>
    ),
  },
  {
    id: 3,
    title: 'James Manginiban',
    description: "ID#1678",
    content: (
      <div>
        <p>Starts:</p>
        <p>Expires:</p>
      </div>
    ),
  },
];

const UserProfile = () => (
  <div className="flex items-center space-x-3">
    <Bell className="w-6 h-6 text-gray-500" />
    <div className="text-right">
      <p className="text-sm text-gray-700">
        Welcome, <span className="font-semibold">{user.name}</span>
      </p>
      <p className="text-xs text-gray-500">{user.role}</p>
    </div>
    <Image src="/path-to-user-image.jpg" alt="User Avatar" width={32} height={32} className="rounded-full" />
  </div>
);

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contract Monitoring</h1>
        <UserProfile />
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <input type="text" placeholder="Search" className="border p-2 rounded-md w-64" />
      </div>

      {/* Cards */}
      <MultiCard data={cardData} direction="column" />
    </div>
  );
}
