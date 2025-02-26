import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import { FileIcon, Mail, Phone } from "lucide-react";
import Image from "next/image";
import { EditTenantForm } from "@/app/tenantmanager/ui/editTenantForm";

export default async function Page({ params }: { params: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { tenantId } = params;

  const res = await fetch(`${baseUrl}/tenantmanager/request/api/getTenantRequest?tenantId=${tenantId}`);
  const data = await res.json();
  const { tenant, contract, complaints } = data;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <BackButton />

      {/* Tenant Profile Section */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-6 items-start">
        {/* Profile Image */}
        <div className="flex flex-col items-left gap-4">
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
          <p className="text-sm text-gray-500">Email: {tenant.email || "N/A"}</p>
          <p className="text-sm text-gray-500">Contact No: {tenant.contact_no || "N/A"}</p>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex justify-center gap-4">
            <a href={`tel:${tenant.contact_no}`} className="hover:opacity-80">
              <Phone className="w-8 h-8" />
            </a>
            <a href={`mailto:${tenant.email}`} className="hover:opacity-80">
              <Mail className="w-8 h-8" />
            </a>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg">Edit</Button>
            </DialogTrigger>
            <EditTenantForm tenant={tenant} />
          </Dialog>
        </div>
      </div>

      {/* Contract Section */}
      <Card>
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
      <Card>
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
