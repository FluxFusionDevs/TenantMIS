import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabaseServer";
import {
  Complaint,
  getPriorityColor,
  getStatusColor,
  Priority,
} from "@/models/complaint";
import { ArrowLeft, FileIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default async function Page({ params }: { params: any }) {
  const client = await createClient();
  const tenantId = (await client.auth.getUser()).data.user!.id;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { requestId } = await params;
  const res = await fetch(
    `${baseUrl}/tenant/request/api/getRequest?tenantId=${tenantId}&requestId=${requestId}`
  );
  const data = await res.json();
  const complaint: Complaint = data.complaint;

  return (
    <div className="flex flex-col md:flex-row items-start p-4 md:p-8 gap-4 md:gap-8 w-full">
      <BackButton />

      <div className="flex flex-col gap-4">
        {complaint.complaints_attachments &&
          complaint.complaints_attachments.length > 0 && (
            <div
              key={complaint.complaints_attachments[0].attachment_id}
              className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
            >
              {isImageFile(complaint.complaints_attachments[0].file_type) ? (
                <Image
                  width={500}
                  height={500}
                  src={complaint.complaints_attachments[0].file_url}
                  alt={complaint.complaints_attachments[0].file_name}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <FileIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">
                    {complaint.complaints_attachments[0].file_name
                      .split(".")
                      .pop()
                      ?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}

        {complaint.complaints_attachments &&
          complaint.complaints_attachments.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {complaint.complaints_attachments.slice(1).map((attachment) => (
                <div
                  key={attachment.attachment_id}
                  className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
                >
                  {isImageFile(attachment.file_type) ? (
                    <Image
                      width={200}
                      height={200}
                      src={attachment.file_url}
                      alt={attachment.file_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex flex-col items-center justify-center">
                      <FileIcon className="w-8 h-8 text-gray-400" />
                      <span className="text-xs text-gray-500 mt-1">
                        {attachment.file_name.split(".").pop()?.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
      </div>
      <Card className="w-full md:w-1/2">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold break-words text-customIndigoTextColor">
            {complaint.subject}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-4 md:p-6">
          <p className="text-base md:text-lg break-words whitespace-pre-wrap">
            Description: {complaint.description}
          </p>
          <p className="text-base md:text-lg truncate">
            Created At: {formatDateTime(complaint.created_at!)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
