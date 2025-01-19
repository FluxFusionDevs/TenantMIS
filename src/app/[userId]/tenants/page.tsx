import { MultiCard } from "@/components/multi-card";
import { Input } from "@/components/ui/input";
import { FilterIcon, PlusCircle, PlusCircleIcon, Search } from "lucide-react";
import Image from "next/image";
import React from "react";
const cardData = [
  {
    id: 1,
    title: "Card 1",
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
    title: "Card 2",
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
    title: "Card 3",
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
  {
    id: 4,
    title: "Card 4",
    description: "Description 4",
    content: (
      <div className="flex items-center space-x-4">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
          alt="Card 4"
          width={50}
          height={50}
          className="rounded-full"
        />
        <div>
          <p>This is card 4</p>
          <span>Status</span>
        </div>
      </div>
    ),
  }
];

export default function Tenants() {
  return (
    <div className="space-y-4">

      <h1 className="text-3xl font-bold opacity-80">Tenant Management</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow">
          <Input placeholder="Search" icon={<Search size={20} />} />
          <FilterIcon size={20} />
        </div>
        <PlusCircleIcon size={20} />
      </div>
      <MultiCard data={cardData} direction="row" />

    </div>
  );
}
