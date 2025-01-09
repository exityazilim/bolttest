export interface DocumentType {
  id?: string;
  name: string;
  detail: string;
  isActive: boolean;
  order: number; // Added for sorting
}

export interface DocumentUpload {
  userId: string;
  documentTypeId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  actualUploadDate: string;
}

export interface CreateDocumentType extends Omit<DocumentType, 'id'> {}
export interface UpdateDocumentType extends DocumentType {}