

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