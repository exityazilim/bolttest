import { ObjectApi } from './objectApi';
import { Product, CreateProduct, UpdateProduct } from '../types/product';
import { uploadApi } from './uploadApi';

const api = new ObjectApi();
const TABLE_NAME = 'Products';

export const productApi = {
  getAll: async () => {
    const response = await api.getAll<Product>(TABLE_NAME);
    return response.items;
  },

  create: async (data: CreateProduct) => {
    return await api.create<CreateProduct>(TABLE_NAME, data);
  },

  update: async (data: UpdateProduct) => {
    await api.update<UpdateProduct>(TABLE_NAME, data.id!, data);
  },

  delete: async (id: string) => {
    await api.delete(TABLE_NAME, id);
  },

  uploadImage: async (file: File): Promise<string> => {
    return await uploadApi.uploadFile(TABLE_NAME, file, true);
  },

  deleteImage: async (imageUrl: string): Promise<void> => {
    await uploadApi.deleteFile(TABLE_NAME, imageUrl);
  }
};