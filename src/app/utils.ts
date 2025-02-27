import imageCompression from 'browser-image-compression';

// Usage example:
// formatDateTime('2025-01-23T02:32:29.521369') => "01/23/2025 02:32"
export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${month}/${day}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}


export const isImageFile = (fileType: string) => {
  return ['image/jpeg', 'image/png', 'image/webp'].includes(fileType);
};


/**
 * Compresses an image file
 * @param imageFile The image file to compress
 * @param options Custom compression options (optional)
 * @returns Promise<File> The compressed image file
 */
export async function compressImage(
  imageFile: File,
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
    useWebWorker?: boolean;
  }
): Promise<File> {
  if (!isImageFile(imageFile.type)) {
    console.warn('Not an image file, skipping compression');
    return imageFile;
  }

  try {
    const compressionOptions = {
      maxSizeMB: options?.maxSizeMB || 1, // Default 1MB max size
      maxWidthOrHeight: options?.maxWidthOrHeight || 1200, // Default 1200px max width/height
      useWebWorker: options?.useWebWorker !== false, // Default true
      quality: options?.quality || 0.8, // Default 80% quality
      fileType: imageFile.type
    };

    const compressedFile = await imageCompression(imageFile, compressionOptions);
    
    console.log(
      `Image compressed: ${imageFile.name}
       - Original size: ${(imageFile.size / 1024 / 1024).toFixed(2)}MB
       - Compressed size: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB
       - Compression ratio: ${(compressedFile.size / imageFile.size * 100).toFixed(2)}%`
    );
    
    return compressedFile;
  } catch (error) {
    console.error('Image compression failed:', error);
    // Return original file if compression fails
    return imageFile;
  }
}

/**
 * Batch compress multiple image files
 * @param files Array of files to compress (only images will be compressed)
 * @param options Custom compression options (optional)
 * @returns Promise<File[]> Array of compressed files
 */
export async function compressBatchImages(
  files: File[],
  options?: {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    quality?: number;
  }
): Promise<File[]> {
  const processedFiles = await Promise.all(
    files.map(async (file) => {
      if (isImageFile(file.type)) {
        return await compressImage(file, options);
      }
      return file; // Return non-image files as-is
    })
  );
  
  return processedFiles;
}