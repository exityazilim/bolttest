import { createApiError } from './errorHandling';

export async function handleApiResponse(response: Response): Promise<any> {
  const data = await response.json();
  
  if (!response.ok) {
    throw createApiError(response.status, data.message);
  }
  
  return data;
}