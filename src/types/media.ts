export interface MediaItem {
  id: string;
  _id: string; // API identifier
  fileName: string;
  originalUrl: string;
  thumbnailUrl?: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  description?: string;
}

export interface CreateMediaItem {
  fileName: string;
  originalUrl: string;
  thumbnailUrl?: string;
  fileType: string;
  fileSize: number;
  description?: string;
}