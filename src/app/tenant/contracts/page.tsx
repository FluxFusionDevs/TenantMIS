import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterIcon, PlusCircleIcon, Search } from "lucide-react";
import Image from "next/image";

const ContractCards = [
  {
    id: 1,
    content: (
      <div className="flex items-start justify-start">
        <Image
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
          alt="Contract Image"
          width={180}
          height={180}
        />
        <div className="mx-8">
          <p className="font-bold text-2xl opacity-80">Contract 1</p>
          <p className="opacity-50 mb-2">Status</p>
          <Button className="bg-[#00000080] text-white" size="lg">
            View
          </Button>
        </div>
      </div>
    ),
  },
    {
        id: 2,
        content: (
        <div className="flex items-start justify-start">
            <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
            alt="Contract Image"
            width={180}
            height={180}
            />
            <div className="mx-8">
            <p className="font-bold text-2xl opacity-80">Contract 2</p>
            <p className="opacity-50 mb-2">Status</p>
            <Button className="bg-[#00000080] text-white" size="lg">
                View
            </Button>
            </div>
        </div>
        ),
    },
    {
        id: 3,
        content: (
        <div className="flex items-start justify-start">
            <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
            alt="Contract Image"
            width={180}
            height={180}
            />
            <div className="mx-8">
            <p className="font-bold text-2xl opacity-80">Contract 3</p>
            <p className="opacity-50 mb-2">Status</p>
            <Button className="bg-[#00000080] text-white" size="lg">
                View
            </Button>
            </div>
        </div>
        ),
    },
];

export default function ContractPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80">My Contracts</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow">
          <Input placeholder="Search" icon={<Search size={20} />} />
          <FilterIcon size={20} />
        </div>
      </div>

      <MultiCard padding="md" data={ContractCards} direction="column" />
    </div>
  );
}
