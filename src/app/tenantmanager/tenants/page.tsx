'use server'

import { Bell, Filter, Plus } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { MultiCard } from '@/components/multi-card';

// Dummy user data
const user = {
  name: "Name",
  role: "Manager",
};

const tenants = [
  {
    id: "1",
    title: 'John Smith',
    description: 'UID#2190',
    content: (
      <div className="flex items-center space-x-3">
        <Image src="/path-to-user-image.jpg" alt="Reviewer" width={30} height={30} className="rounded-full" />
        <div>
          <p className="text-sm">Description</p>
          <p className="text-xs text-gray-400">Status</p>
        </div>
      </div>
    ),
  },
  {
    id: "2",
    title: 'Jane Madison Neo',
    description: 'UID#1154',
    content: (
      <div className="flex items-center space-x-3">
        <Image src="/path-to-user-image.jpg" alt="Reviewer" width={30} height={30} className="rounded-full" />
        <div>
          <p className="text-sm">Reviewer name</p>
          <p className="text-xs text-gray-400">Date</p>
        </div>
      </div>
    ),
  },
  {
    id: "3",
    title: 'James Manginiban',
    description: 'UID#1678',
    content: (
      <div className="flex items-center space-x-3">
        <Image src="/path-to-user-image.jpg" alt="Reviewer" width={30} height={30} className="rounded-full" />
        <div>
          <p className="text-sm">Reviewer name</p>
          <p className="text-xs text-gray-400">Date</p>
        </div>
      </div>
    ),
  },
];

// Add Tenant Card
const addTenantCard = {
  id: "4",
  title: '',
  description: '',
  content: (
    <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded-lg cursor-pointer">
      <Plus className="w-8 h-8 text-gray-500" />
    </div>
  ),
};

const UserProfile = () => (
  <div className="flex items-center space-x-3">
    <Bell className="w-6 h-6 text-gray-500" />
    <div className="text-right">
      <p className="text-sm text-gray-700">Welcome, <span className="font-semibold">{user.name}</span></p>
      <p className="text-xs text-gray-500">{user.role}</p>
    </div>
    <img src="/path-to-user-image.jpg" alt="User Avatar" className="w-8 h-8 rounded-full" />
  </div>
);

export default function TenantManagement() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenant Management</h1>
        <UserProfile />
      </div>

      {/* Search & Filter */}
      <div className="flex items-center space-x-3">
        <Filter className="w-5 h-5 text-gray-600" />
        <input type="text" placeholder="Search" className="border p-2 rounded-md w-64" />
      </div>

      {/* Tenant Cards using MultiCard */}
      <MultiCard data={[...tenants, addTenantCard]} direction="row" />
    </div>
  );
}
