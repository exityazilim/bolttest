import { BASE_URL } from '../config/constants';
import { getHeaders } from './api';
import { handleApiResponse } from '../utils/apiUtils';
import { User, CreateUser, UpdateUser } from '../types/user';

export const userApi = {
  getAll: async (): Promise<User[]> => {
    const response = await fetch(`${BASE_URL}User`, {
      headers: getHeaders(),
    });
    
    return handleApiResponse(response);
  },

  create: async (user: CreateUser): Promise<void> => {
    const response = await fetch(`${BASE_URL}User`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    
    await handleApiResponse(response);
  },

  update: async (user: UpdateUser): Promise<void> => {
    const response = await fetch(`${BASE_URL}User`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    
    await handleApiResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}User`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ id }),
    });
    
    await handleApiResponse(response);
  },
};