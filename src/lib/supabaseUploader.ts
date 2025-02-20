import logger from "@/logger/logger";
import { createClient } from "./supabaseClient";
import { v4 as uuidv4 } from 'uuid';

export async function uploadFilesToBucket(files: File[], sourceId: string, uploaderId: string, bucketName: string, folderName: string) {
    const fileUploads = [];
  
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folderName}/${sourceId}/${uuidv4()}.${fileExt}`;
  
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type
        }
        );
  
      if (uploadError) {
        logger.error(`Error uploading file: ${uploadError.message}`);
        throw uploadError;
      }
  
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
  
      fileUploads.push({
        complaint_id: sourceId,
        file_name: file.name,
        file_type: file.type,
        file_size: file.size,
        file_url: publicUrl,
        uploaded_by: uploaderId
      });
    }
  
    return fileUploads;
  }