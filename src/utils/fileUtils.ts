export function truncateFilename(filename: string, maxLength: number = 20): string {
  if (filename.length <= maxLength) return filename;
  
  const extension = filename.split('.').pop() || '';
  const nameWithoutExt = filename.slice(0, filename.length - extension.length - 1);
  
  if (nameWithoutExt.length <= maxLength - 3) return filename;
  
  const truncated = nameWithoutExt.slice(0, maxLength - 3) + '...';
  return extension ? `${truncated}.${extension}` : truncated;
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}