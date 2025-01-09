import { ApiError } from '../types/api';

export const HTTP_STATUS = {
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  DEFAULT: 'An error occurred',
} as const;

let logoutHandler: (() => void) | null = null;

export function setLogoutHandler(handler: () => void) {
  logoutHandler = handler;
}

export function handleSessionExpiration() {
  logoutHandler?.();
}

export function createApiError(status: number, message?: string): ApiError {
  if (status === HTTP_STATUS.FORBIDDEN) {
    handleSessionExpiration();
    return new ApiError(message || 'Access forbidden', status);
  }
  
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    return new ApiError(message || ERROR_MESSAGES.UNAUTHORIZED, status);
  }
  
  return new ApiError(message || ERROR_MESSAGES.DEFAULT, status);
}