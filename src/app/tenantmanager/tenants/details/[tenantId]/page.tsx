import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabaseServer";
import { FileIcon } from "lucide-react";
import Image from "next/image";

export default async function Page({ params }: { params: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { tenantId } = params;

  const res = await fetch(`${baseUrl}/tenantmanager/request/api/getTenantRequest?tenantId=${tenantId}`);
  const data = await res.json();
  const { tenant, contract, complaints } = data;
  return (
    <div className="flex flex-col items-start p-4 md:p-8 gap-4 w-full">
      <BackButton />
  
      {/* Tenant Profile Section */}
      <div className="flex flex-col gap-4 items-center w-full">
        {tenant.profile_picture ? (
          <Image
            width={120}
            height={120}
            src={tenant.profile_picture}
            alt={`${tenant.first_name} ${tenant.last_name}`}
            className="rounded-full w-32 h-32 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center">
            <FileIcon className="w-12 h-12 text-gray-500" />
          </div>
        )}
  
        <h2 className="text-xl font-bold">{tenant.first_name} {tenant.last_name}</h2>
        <p className="text-sm text-gray-500">Contact No: {tenant.contact_number || "N/A"}</p>
      </div>
  
      {/* Contract Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          {contract ? (
            <div className="p-4 border rounded-lg shadow-sm">
              <p className="text-md font-semibold">{contract.contract_type} Lease</p>
              <p className="text-sm text-gray-500">Start: {formatDateTime(contract.contract_start)}</p>
              <p className="text-sm text-gray-500">Expires: {formatDateTime(contract.contract_end)}</p>
              <p className="text-sm font-medium">Status: {contract.contract_status}</p>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No active contracts found.</p>
          )}
        </CardContent>
      </Card>
  
      {/* Complaints Section */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-lg font-bold">Complaints</CardTitle>
        </CardHeader>
        <CardContent>
          {complaints.length > 0 ? (
            complaints.map((complaint: any) => (
              <div key={complaint.complaint_id} className="p-4 border rounded-lg shadow-sm mb-2">
                <p className="text-md font-semibold">{complaint.subject}</p>
                <p className="text-sm text-gray-500">{complaint.description}</p>
                <p className="text-xs text-gray-400">Submitted: {formatDateTime(complaint.created_at)}</p>
                <p className={`text-xs font-medium ${complaint.status === "COMPLETED" ? "text-green-500" : "text-red-500"}`}>
                  Status: {complaint.status}
                </p>
  
                {/* Complaint Image Preview */}
                {complaint.files && complaint.files.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {complaint.files.map((file: string, index: number) => (
                      isImageFile(file) ? (
                        <Image key={index} width={60} height={60} src={file} alt="Complaint Attachment" className="rounded-lg" />
                      ) : (
                        <FileIcon key={index} className="w-6 h-6 text-gray-500" />
                      )
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No complaints found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
  
}
