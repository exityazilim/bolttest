import { ObjectApi } from './objectApi';
import { DocumentType, CreateDocumentType, UpdateDocumentType } from '../types/documentType';

const api = new ObjectApi();
const TABLE_NAME = 'DocumentTypes';

export const documentTypeApi = {
  getAll: async () => {
    const response = await api.getAll<DocumentType>(TABLE_NAME, {
      sort: { order: 1 }
    });
    return response.items;
  },

  create: async (data: CreateDocumentType) => {
    return await api.create<CreateDocumentType>(TABLE_NAME, data);
  },

  update: async (data: UpdateDocumentType) => {
    await api.update<UpdateDocumentType>(TABLE_NAME, data.id!, data);
  },

  delete: async (id: string) => {
    await api.delete(TABLE_NAME, id);
  },
};