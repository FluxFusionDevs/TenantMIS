'use server';

import React from 'react';
import { MultiCard } from '@/components/multi-card';
import { Bell } from 'lucide-react';

// Dummy user data
const user = {
  name: "Name",
  role: "Manager",
};

const recentsData = [
  {
    id: "1",
    title: 'Complaint',
    description: "Submitted by: John Smith",
    content: (
      <div className="flex items-center space-x-4">
        <p>Faucet Leakage in room 301</p>
      </div>
    ),
  },
  {
    id: "2",
    title: 'Contract',
    description: "Contract: Jane Madison Neo",
    content: (
      <div className="flex items-center space-x-4">
        <p>6 Days before expiration...</p>
      </div>
    ),
  },
  {
    id: "3",
    title: 'Payment Due',
    description: "James Manginiban",
    content: (
      <div className="flex items-center space-x-4">
        <p>Payment 6 months overdue</p>
      </div>
    ),
  },
];

const managementData = [
  { id: "1", title: 'Tenants', description: "Currently 58 Tenant/s", content: "" },
  { id: "2", title: 'Contracts', description: "3 Pending", content: "" },
  { id: "3", title: 'Complaints', description: "4 Active", content: "" },
];

const ordersData = [
  { id: "1", title: 'Purchase Orders', description: "Last Updated: 09/16/24", content: "" },
];

const UserProfile = () => {
  return (
    <div className="flex items-center justify-end space-x-3">
      <Bell className="w-6 h-6 text-gray-500" />
      <div className="text-right">
        <p className="text-sm text-gray-700">Welcome, <span className="font-semibold">{user.name}</span></p>
        <p className="text-xs text-gray-500">{user.role}</p>
      </div>
      <img 
        src="/path-to-user-image.jpg" 
        alt="User Avatar" 
        className="w-8 h-8 rounded-full" 
      />
    </div>
  );
};

export default async function ManagerDashboard() {
  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold opacity-80">Home</h1>
        <UserProfile />
      </div>

      {/* Content Sections */}
      <div className='space-y-4'>
        <h2 className="text-2xl font-bold opacity-40">Recents</h2>
        <MultiCard data={recentsData} direction="row" />
      </div>
      
      <div className='space-y-4'>
        <h2 className="text-2xl font-bold opacity-40">Management</h2>
        <MultiCard data={managementData} direction="row" />
      </div>

      <div className='space-y-4'>
        <h2 className="text-2xl font-bold opacity-40">Orders</h2>
        <MultiCard data={ordersData} direction="row" />
      </div>
    </div>
  );
}
