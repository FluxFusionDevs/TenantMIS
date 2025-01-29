'use client'

import { MultiCard } from '@/components/multi-card'
import Image from 'next/image'
import React from 'react'
import { Bell, Filter, Plus } from 'lucide-react';

// Dummy user data
const user = {
  name: "Name",
  role: "Manager",
};

const cardData = [
    {
      id: 1,
      title: 'Card 1',
      description: "Description 1",
      content: (
        <div className="flex items-center space-x-4">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
            alt="Card 1"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p>This is card 1</p>
            <span>Status</span>
          </div>
        </div>
      ),
    },
    {
      id: 2,
      title: 'Card 2',
      description: "Description 2",
      content: (
        <div className="flex items-center space-x-4">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
            alt="Card 2"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p>This is card 2</p>
            <span>Status</span>
          </div>
        </div>
      ),
    },
    {
      id: 3,
      title: 'Card 3',
      description: "Description 3",
      content: (
        <div className="flex items-center space-x-4">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
            alt="Card 3"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p>This is card 3</p>
            <span>Status</span>
          </div>
        </div>
      ),
    },
  ];

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
    
    <MultiCard data={cardData} direction="column" />
  </div>
  )
}