import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabaseServer";
import { Contracts, ContractAttachment, Status } from "@/models/contracts";
import { FileIcon } from "lucide-react";
import Image from "next/image";

export default async function Page({ params }: { params: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const contractId = params?.contractId; // Ensure params is accessed properly

  if (!contractId) {
    return <div>Error: Invalid contract ID</div>;
  }

  try {
    const res = await fetch(
      `${baseUrl}/tenant/request/api/getRequest?requestId=${contractId}`
    );

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }

    const data = await res.json();
    const contracts: Contracts | undefined = data.contracts;

    if (!contracts) {
      return <div>Error: Contract data not found</div>;
    }

    return (
      <div className="flex flex-col md:flex-row items-start p-4 md:p-8 gap-4 md:gap-8 w-full">
        <BackButton />

        <div className="flex flex-col gap-4">
          {contracts.contract_attachments?.length > 0 && (
            <div
              key={contracts.contract_attachments[0].attachment_id}
              className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
            >
              {isImageFile(contracts.contract_attachments[0].file_type) ? (
                <Image
                  width={500}
                  height={500}
                  src={contracts.contract_attachments[0].file_url}
                  alt={contracts.contract_attachments[0].file_name}
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <FileIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1">
                    {contracts.contract_attachments[0].file_name
                      .split(".")
                      .pop()
                      ?.toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          )}

          {contracts.contract_attachments?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {contracts.contract_attachments.slice(1).map((attachment) => (
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
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold break-words">
              {contracts.tenant_id}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4 md:p-6">
            <p className="text-lg md:text-xl font-semibold truncate">
              Status: {contracts.contract_status}
            </p>
            <p className="text-base md:text-lg break-words whitespace-pre-wrap">
              Price: ${contracts.contract_price?.toFixed(2)}
            </p>
            <p className="text-base md:text-lg truncate">
              Start Date: {contracts.contract_start ? formatDateTime(contracts.contract_start) : "N/A"}
            </p>
            <p className="text-base md:text-lg truncate">
              End Date: {contracts.contract_ends ? formatDateTime(contracts.contract_ends) : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  } catch (error) {
    console.error("Error fetching contract:", error);
    return <div>Error loading contract details.</div>;
  }
}
