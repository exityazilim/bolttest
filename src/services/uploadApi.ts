import { BASE_URL } from '../config/constants';
import { getHeaders } from './api';
import { handleApiResponse } from '../utils/apiUtils';

export const uploadApi = {
  uploadFile: async (pageName: string, file: File, isResize: boolean = false): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    
    if (isResize) {
      formData.append('isResize', 'true');
    }

    const headers = getHeaders();
    delete headers['Content-Type']; // Let browser set content type for FormData

    const response = await fetch(`${BASE_URL}Obj/Upload/${pageName}`, {
      method: 'POST',
      headers: headers,
      body: formData,
    });

    const data = await handleApiResponse(response);
    return data.result;
  },

  deleteFile: async (pageName: string, fileUrl: string): Promise<boolean> => {
    const response = await fetch(`${BASE_URL}Obj/Upload/${pageName}`, {
      method: 'DELETE',
      headers: getHeaders(),
      body: JSON.stringify({ fileName: fileUrl }),
    });

    const data = await handleApiResponse(response);
    return data.result === true;
  }
};