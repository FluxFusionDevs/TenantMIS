import { MultiCard } from "@/components/multi-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabaseClient";
import logger from "@/logger/logger";
import { Complaint } from "@/models/complaint";
import { FilterIcon, PlusCircleIcon, Search } from "lucide-react";
import Image from "next/image";

// const requestsCard = [
//   {
//     id: 1,
//     content: (
//       <div className="flex items-start justify-start">
//         <Image
//           src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
//           alt="Request Image"
//           width={180}
//           height={180}
//         />
//         <div className="mx-8">
//           <p className="font-bold text-2xl opacity-80">Request 1</p>
//           <p className="opacity-50 mb-2">Status</p>
//           <Button className="bg-[#00000080] text-white" size="lg">
//             View
//           </Button>
//         </div>
//       </div>
//     ),
//   },
//     {
//         id: 2,
//         content: (
//         <div className="flex items-start justify-start">
//             <Image
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
//             alt="Request Image"
//             width={180}
//             height={180}
//             />
//             <div className="mx-8">
//             <p className="font-bold text-2xl opacity-80">Request 2</p>
//             <p className="opacity-50 mb-2">Status</p>
//             <Button className="bg-[#00000080] text-white" size="lg">
//                 View
//             </Button>
//             </div>
//         </div>
//         ),
//     },
//     {
//         id: 3,
//         content: (
//         <div className="flex items-start justify-start">
//             <Image
//             src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
//             alt="Request Image"
//             width={180}
//             height={180}
//             />
//             <div className="mx-8">
//             <p className="font-bold text-2xl opacity-80">Request 3</p>
//             <p className="opacity-50 mb-2">Status</p>
//             <Button className="bg-[#00000080] text-white" size="lg">
//                 View
//             </Button>
//             </div>
//         </div>
//         ),
//     },
// ];




export default async function RequestPage({}) {
  const tenantId = await supabase.auth.getSession();
  if (!tenantId) {
    return null;
  }
  const res = await fetch(`http://localhost:3000/tenant/sdadsa/request/getRequests`);
  const data = await res.json();

  const complaints: Complaint[] = data.complaints;
  
  if (!Array.isArray(complaints)) {
    logger.error(`Complaints is not an array`);
    return null;
  }

  const cardData = complaints.map((complaint) => {
    return {
      id: complaint.complaint_id,
      content: (
        <div className="flex items-start justify-start">
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSwme89cM8YZvHcybGrZl_Obd9U9p5QabozJQ&s"
            alt="Request Image"
            width={180}
            height={180}
          />
          <div className="mx-8">
            <p className="font-bold text-2xl opacity-80">{complaint.description}</p>
            <p className="opacity-50 mb-2">{complaint.status}</p>
            <Button className="bg-[#00000080] text-white" size="lg">
              View
            </Button>
          </div>
        </div>
      ),
    };
  });


  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80">Request Page</h1>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-grow">
          <Input placeholder="Search" icon={<Search size={20} />} />
          <FilterIcon size={20} />
        </div>
        <PlusCircleIcon size={20} />
      </div>

      <MultiCard padding="md" data={cardData} direction="column" />
    </div>
  );
}
