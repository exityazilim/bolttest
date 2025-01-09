import { useState, useCallback } from 'react';
import { ObjectApi } from '../services/objectApi';
import { useNavigate } from 'react-router-dom';

const api = new ObjectApi();

export function useObjectApi<T>(tableName: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleError = useCallback((error: Error) => {
    setError(error.message);
    if (error.message.includes('Please login again')) {
      navigate('/login');
    }
  }, [navigate]);

  const create = useCallback(async (data: T) => {
    setIsLoading(true);
    setError(null);
    try {
      const id = await api.create<T>(tableName, data);
      return id;
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to create'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [tableName, handleError]);

  const update = useCallback(async (id: string, data: T) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.update<T>(tableName, id, data);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to update'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [tableName, handleError]);

  const remove = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await api.delete(tableName, id);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to delete'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [tableName, handleError]);

  const getAll = useCallback(async (options?: {
    query?: Record<string, any>;
    sort?: Record<string, any>;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    setIsLoading(true);
    setError(null);
    try {
      return await api.getAll<T>(tableName, options);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to fetch list'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [tableName, handleError]);

  const getById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      return await api.getById<T>(tableName, id);
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Failed to fetch item'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [tableName, handleError]);

  return {
    isLoading,
    error,
    create,
    update,
    remove,
    getAll,
    getById,
  };
}