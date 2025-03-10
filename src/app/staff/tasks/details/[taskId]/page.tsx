"use server";

import { AddProgressReport } from "@/app/staff/ui/addProgressReport";
import { formatDateTime, isImageFile } from "@/app/utils";
import { BackButton } from "@/components/back-button";
import { CardData, MultiCard } from "@/components/multi-card";
import { PriorityBadge } from "@/components/priority-badge";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Reports } from "@/models/report";
import { Task } from "@/models/task";
import { format } from "date-fns";
import { FileIcon } from "lucide-react";
import Image from "next/image";

export default async function Page({ params }: { params: any }) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { taskId } = await params;

  let task: Task = null as any;
  let reports: Reports[] = [];

  try {
    // Fetch task details
    const res = await fetch(`${baseUrl}/staff/api/getTask?taskId=${taskId}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch task data. Status: ${res.status}`);
    }

    const data = await res.json();

    task = data.task;

    if (!task) {
      throw new Error("Task not found");
    }

    const res2 = await fetch(
      `${baseUrl}/staff/api/getProgressReport?taskId=${taskId}`
    );

    const data2 = await res2.json();
    reports = data2.reports;
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const progressReportCard: CardData[] = reports.map((report) => {
    return {
      id: report.progress_id,
      content: (
        <>
          <p className="text-base md:text-lg font-bold mb-2">
            {format(new Date(report.created_at), "MMMM dd, yyyy")}
          </p>
          <StatusBadge status={report.staff_tasks.status} />
          <p className="text-base md:text-lg break-words whitespace-pre-wrap">
            {report.description}
          </p>
        </>
      ),
    };
  });

  return (
    <div className="p-4 md:p-8 w-full">
      <BackButton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* First column - Images */}
        <div className="flex flex-col gap-4">
          {task?.complaints?.complaints_attachments &&
            task?.complaints?.complaints_attachments.length > 0 && (
              <div
                key={task?.complaints?.complaints_attachments[0].attachment_id}
                className="rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
              >
                {isImageFile(
                  task?.complaints?.complaints_attachments[0].file_type
                ) ? (
                  <Image
                    width={500}
                    height={500}
                    src={task?.complaints?.complaints_attachments[0].file_url}
                    alt={task?.complaints?.complaints_attachments[0].file_name}
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <FileIcon className="w-8 h-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">
                      {task?.complaints?.complaints_attachments[0].file_name
                        .split(".")
                        .pop()
                        ?.toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
            )}

          {task?.complaints?.complaints_attachments &&
            task?.complaints?.complaints_attachments.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {task?.complaints?.complaints_attachments
                  .slice(1)
                  .map((attachment) => (
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
                            {attachment.file_name
                              .split(".")
                              .pop()
                              ?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
        </div>

        {/* Second column - Task details */}
        <Card className="w-full h-fit">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold break-words">
              <p className="text-customIndigoTextColor">{task?.title}</p>
              <div className="flex gap-2 mt-2">
                <StatusBadge status={task?.status} />
                <PriorityBadge priority={task?.priority} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-4 md:p-6">
            <p className="text-base md:text-lg break-words whitespace-pre-wrap">
              Description: {task?.description}
            </p>

            <p className="text-base md:text-lg truncate">
              Deadline: {task?.deadline}
            </p>
            <div></div>
          </CardContent>
        </Card>

        <div className="col-span-2 flex flex-col gap-4">
        <div className="flex flex-row justify-between">
        <p className="text-2xl opacity-80 font-bold text-customGreenTextColor">
          Recent Progress Reports
        </p>
        <Dialog>
          <DialogTrigger>
          <Button className="ml-auto">Add Progress Report</Button>
          </DialogTrigger>
          <AddProgressReport task={task} />
        </Dialog>
        </div>
        <MultiCard data={progressReportCard} direction="column" />
      </div>
      </div>
    </div>
  );
}
