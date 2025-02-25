"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import { Button } from "@/components/ui/button";
import { File } from "lucide-react";
import { Contract, ContractAttachment } from "@/models/contract";


pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


export default function ContractsPage() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pdfFiles, setPdfFiles] = useState<ContractAttachment[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const [containerSize, setContainerSize] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  useEffect(() => {
    if (!containerRef) return;
    if (containerRef.current) {
      setContainerSize(containerRef.current.offsetWidth);
    }
    fetchContracts();
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }


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
    setPageNumber(1);
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold opacity-80">My Contracts</h1>
      
      <div className="flex flex-col gap-4">
      <div className="flex flex-row overflow-x-auto gap-4">
          {pdfFiles.map((file) => (
            <Button key={file.attachment_id} variant={"outline"} onClick={() => handlePdfClick(file.file_url)}>
              <File className="w-6 h-6 mr-2" />
              {file.file_name}
            </Button>
          ))}
        </div> 
        <div className="flex justify-between items-center mt-4">
            <button
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <p>
              Page {pageNumber} of {numPages}
            </p>
            <button
              disabled={pageNumber >= (numPages || 0)}
              onClick={() => setPageNumber(pageNumber + 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        <div className="bg-white rounded-lg shadow-lg" ref={containerRef}>
          <Document
            file={selectedPdf}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<div>Loading PDF...</div>}
          >
            <Page 
              pageNumber={pageNumber} 
              width={containerSize - containerSize * 0.03}
              renderTextLayer={false}
            />
          </Document>

        </div>

      </div>

    </div>
  );
}