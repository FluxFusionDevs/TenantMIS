"use client";

import { useState, useCallback, useEffect } from "react";
import { Upload, X } from "lucide-react";


export function MultipleFileUploads({allowedTypes }: { allowedTypes: string[] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  }, []);

  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center 
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <input
          type="file"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          name="attachments"
          accept={allowedTypes.join(",")}
          onChange={(e) => {
            const selectedFiles = Array.from(e.target.files || []);
            setFiles((prev) => [...prev, ...selectedFiles]);
          }}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Drag files here or click to upload
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, PDF up to 10MB each
        </p>
      </div>

      {files.length > 0 && (
        <div className="mt-4 h-48 overflow-auto rounded-lg border border-gray-200">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 hover:bg-gray-50 border-b last:border-b-0"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="text-sm truncate">{file.name.substring(0, 15)}...</span>
                <span className="text-xs text-gray-500">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button
                onClick={() => removeFile(index)}
                className="p-1 hover:bg-gray-200 rounded-full"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
