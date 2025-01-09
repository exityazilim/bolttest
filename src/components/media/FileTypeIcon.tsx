import React from 'react';
import { 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileCode, 
  File
} from 'lucide-react';

interface FileTypeIconProps {
  fileType?: string;
  className?: string;
}

export function FileTypeIcon({ fileType = '', className = "w-8 h-8 text-gray-400" }: FileTypeIconProps) {
  // Helper function to check MIME type
  const isType = (type: string) => {
    if (!fileType) return false;
    return fileType.startsWith(type);
  };

  if (isType('image/')) return <FileImage className={className} />;
  if (isType('video/')) return <FileVideo className={className} />;
  if (isType('audio/')) return <FileAudio className={className} />;
  if (isType('text/')) return <FileText className={className} />;
  if (isType('application/pdf')) return <FileText className={className} />;
  if (isType('application/json') || fileType?.includes('javascript') || fileType?.includes('typescript')) {
    return <FileCode className={className} />;
  }
  if (fileType?.includes('compressed') || fileType?.includes('zip') || fileType?.includes('tar')) {
    return <FileText className={className} />;
  }

  return <File className={className} />;
}