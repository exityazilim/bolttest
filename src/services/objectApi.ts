import { getHeaders } from './api';
import { BASE_URL } from '../config/constants';
import { handleApiResponse } from '../utils/apiUtils';

interface ApiResponse<T> {
  result: T;
  message?: string;
  totalCount?: number;
  totalPage?: number;
}

interface QueryOptions {
  query?: Record<string, any>;
  sort?: Record<string, any>;
  pageIndex?: number;
  pageSize?: number;
}

export class ObjectApi {
  private buildQueryString = (options?: QueryOptions): string => {
    const params = new URLSearchParams();
    
    if (options?.query) {
      params.append('query', JSON.stringify(options.query));
    }
    
    if (options?.sort) {
      params.append('sort', JSON.stringify(options.sort));
    }
    
    if (typeof options?.pageIndex === 'number' && typeof options?.pageSize === 'number') {
      params.append('pageIndex', options.pageIndex.toString());
      params.append('pageSize', options.pageSize.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
  };

  private extractId(item: any): string {
    // Handle MongoDB-style ObjectId
    if (item._id && typeof item._id === 'object' && '$oid' in item._id) {
      return item._id.$oid;
    }
    // Fallback to regular id or _id
    return item.id || item._id || '';
  }

  private processItem<T>(item: T): T {
    if (typeof item !== 'object' || !item) return item;
    
    const processed = { ...item } as any;
    if (processed._id && typeof processed._id === 'object' && '$oid' in processed._id) {
      processed.id = processed._id.$oid;
    }
    return processed;
  }

  private processItems<T>(items: T[]): T[] {
    return items.map(item => this.processItem(item));
  }

  private safeJsonParse<T>(str: string): T {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.error('JSON Parse Error:', error);
      throw new Error('Failed to parse server response');
    }
  }

  private preserveNewlines<T>(data: T): string {
    return JSON.stringify({
      Detail: JSON.stringify(data)
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
    });
  }

  create = async <T>(tableName: string, data: T): Promise<string> => {
    const response = await fetch(`${BASE_URL}Obj/${tableName}`, {
      method: 'POST',
      headers: getHeaders(),
      body: this.preserveNewlines(data),
    });
    
    const result = await handleApiResponse(response);
    return result.result;
  };

  update = async <T>(tableName: string, id: string, data: T): Promise<void> => {
    const response = await fetch(`${BASE_URL}Obj/${tableName}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: this.preserveNewlines(data),
    });
    
    await handleApiResponse(response);
  };

  delete = async (tableName: string, id: string): Promise<void> => {
    const response = await fetch(`${BASE_URL}Obj/${tableName}/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    
    await handleApiResponse(response);
  };

  getAll = async <T>(tableName: string, options?: QueryOptions): Promise<{
    items: T[];
    totalCount?: number;
    totalPage?: number;
  }> => {
    const queryString = this.buildQueryString(options);
    const response = await fetch(`${BASE_URL}Obj/${tableName}${queryString}`, {
      headers: getHeaders(),
    });
    
    const data = await handleApiResponse(response);
    const items = this.safeJsonParse<T[]>(data.result);
    
    return {
      items: this.processItems(items),
      totalCount: data.totalCount,
      totalPage: data.totalPage,
    };
  };

  getById = async <T>(tableName: string, id: string): Promise<T> => {
    const response = await fetch(`${BASE_URL}Obj/${tableName}/${id}`, {
      headers: getHeaders(),
    });
    
    const data = await handleApiResponse(response);
    const item = this.safeJsonParse<T>(data.result);
    return this.processItem(item);
  };
}