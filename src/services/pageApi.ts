import { BASE_URL } from '../config/constants';
import { getHeaders } from './api';
import { handleApiResponse } from '../utils/apiUtils';

export interface Page {
  id?: string;
  name: string;
  detail: string;
  isCache: boolean;
}

export const pageApi = {
  getAll: async (): Promise<Page[]> => {
    const response = await fetch(`${BASE_URL}Page`, {
      headers: getHeaders(),
    });
    
    return handleApiResponse(response);
  },

  create: async (page: Omit<Page, 'id'>): Promise<void> => {
    const response = await fetch(`${BASE_URL}Page`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(page),
    });
    
    await handleApiResponse(response);
  },

  update: async (page: Page): Promise<void> => {
    const response = await fetch(`${BASE_URL}Page`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        id: page.id,
        name: page.name,
        detail: page.detail,
        isCache: page.isCache,
      }),
    });
    
    await handleApiResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}Page`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    });
    
    await handleApiResponse(response);
  },
};