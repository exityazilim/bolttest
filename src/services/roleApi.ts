import { BASE_URL } from '../config/constants';
import { getHeaders } from './api';
import { handleApiResponse } from '../utils/apiUtils';
import { Role } from '../types/role';

export const roleApi = {
  getAll: async (): Promise<Role[]> => {
    const response = await fetch(`${BASE_URL}Role`, {
      headers: getHeaders(),
    });
    
    return handleApiResponse(response);
  },

  create: async (role: Omit<Role, 'id'>): Promise<void> => {
    const response = await fetch(`${BASE_URL}Role`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(role),
    });
    
    await handleApiResponse(response);
  },

  update: async (role: Role): Promise<void> => {
    const response = await fetch(`${BASE_URL}Role`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(role),
    });
    
    await handleApiResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}Role`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    });
    
    await handleApiResponse(response);
  },
};