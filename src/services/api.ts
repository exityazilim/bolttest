import { BASE_URL, PROJECT_ID } from '../config/constants';
import { handleApiResponse } from '../utils/apiUtils';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-ProjectId': PROJECT_ID,
};

export const getHeaders = () => {
  const sessionKey = localStorage.getItem('sessionKey');
  return {
    ...defaultHeaders,
    ...(sessionKey ? { 'x-SessionKey': sessionKey } : {}),
  };
};

export const api = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${BASE_URL}Login`, {
      method: 'POST',
      headers: defaultHeaders,
      body: JSON.stringify({ name: username, password }),
    });
    
    const data = await handleApiResponse(response);
    return data.result;
  },

  getMe: async () => {
    const response = await fetch(`${BASE_URL}Me`, {
      headers: getHeaders(),
    });
    
    return handleApiResponse(response);
  },

  getRoles: async () => {
    const response = await fetch(`${BASE_URL}Me/Role`, {
      headers: getHeaders(),
    });
    
    return handleApiResponse(response);
  },
};