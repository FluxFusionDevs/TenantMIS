'use server'

import { formatDateToNow } from '@/app/utils';
import { MultiCard } from '@/components/multi-card'
import { Complaint } from '@/models/complaint';
import { Contract } from '@/models/contract';
import { headers } from 'next/headers';
import Image from 'next/image'
import React from 'react'

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


  export default async function Dashboard() {
    let complaints: Complaint[] = [];
    let contract = {} as Contract;
  
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const res = await fetch(`${baseUrl}/staffmanager/api/getRequests?page=1`);

      const res2 = await fetch(`${baseUrl}/tenant/contracts/api/getContracts`, {
        method: "GET",
        headers: await headers()
      })

      if (!res.ok) {
        console.error("Failed to fetch data. Status:", res.status);
      }

      if (!res2.ok) {
        console.error("Failed to fetch data. Status:", res2.status);
      }


      const data = await res.json();
      const data2 = await res2.json();
      complaints = data.complaints;
      contract = data2.contracts;
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  
    const accountCardData = [
      {
        id: 1,
        title: 'My Contract',
        description: `End Date: ${contract.contract_end}`,
     
      },
      {
        id: 2,
        title: 'Billing Statements',
        description: "Description 2",
     
      },
      {
        id: 3,
        title: 'Requests',
        description: `Total: ${complaints.length}`,
      },
    ];
    const complaintsCard = complaints.map((complaint) => {
      return {
        id: Number(complaint.complaint_id),
        content: (
          <div className="flex items-start justify-start">
            <div className="flex flex-col gap-2">
              <p className="text-lg font-semibold">{complaint.subject}</p>
              <p className="text-md text-gray-500">#ID {complaint.complaint_id}</p>
              <p className="text-sm text-gray-500">{complaint.description}</p>
              <p className="text-md text-gray-500 font-medium">{formatDateToNow(complaint.created_at!)}</p>
              </div>
          </div>
        ),
      };
    });
  
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold opacity-80 text-customIndigoTextColor">Recent Request</h1>
        <MultiCard size='md' data={complaintsCard} direction="row" />
        <h1 className="text-3xl font-bold opacity-80 text-customGreenTextColor">Account Management</h1>
        <MultiCard data={accountCardData} size='sm' direction="row" />
      </div>
    );
  }