"use client";

import PDFViewer from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { ContractAttachment } from "@/models/contract";
import { File } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContractsPage() {
  const [pdfFiles, setPdfFiles] = useState<ContractAttachment[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchContracts();
  }, []);

  async function fetchContracts() {
    try {
      const response = await fetch(`${baseUrl}/tenant/contracts/api/getContracts`);
      const data = await response.json();
      const contractAttachment: ContractAttachment[] = data.contracts.contracts_attachments;
      setPdfFiles(contractAttachment);
      setSelectedPdf(contractAttachment[0]?.file_url || "");
    } catch (error) {
      console.error("Error fetching contracts:", error);
    }
  }

  const handlePdfClick = (fileUrl: string) => {
    setSelectedPdf(fileUrl);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80">My Contracts</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row overflow-x-auto gap-4">
          {pdfFiles.map((file) => (
            <Button key={file.attachment_id} variant="outline" onClick={() => handlePdfClick(file.file_url)}>
              <File className="w-6 h-6 mr-2" />
              {file.file_name}
            </Button>
          ))}
        </div>
        {selectedPdf && <PDFViewer fileUrl={selectedPdf} />}
      </div>
    </div>
  );
}
