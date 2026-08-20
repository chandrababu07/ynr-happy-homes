/// <reference types="vite/client" />

// Centralized Frontend API Client for YNR Happy Homes REST API
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: any;
}

export class ApiClientError extends Error {
  public statusCode?: number;
  public details?: any;

  constructor(message: string, statusCode?: number, details?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Automatically attach JWT authorization token if present in localStorage
  const token = localStorage.getItem('ynr_auth_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const json: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: `API request failed with status ${response.status}`,
    }));

    if (!response.ok || !json.success) {
      // Automatic session cleanup on 401 Unauthorized
      if (response.status === 401 && endpoint !== '/auth/login') {
        localStorage.removeItem('ynr_auth_token');
        localStorage.removeItem('ynr_current_user');
      }
      const errorMessage = json.message || `API request failed with status ${response.status}`;
      throw new ApiClientError(errorMessage, response.status, json.error);
    }

    return json.data as T;
  } catch (error: any) {
    if (error instanceof ApiClientError) {
      throw error;
    }
    throw new ApiClientError(error.message || 'Failed to connect to backend server');
  }
}

async function uploadRequest<T>(endpoint: string, formData: FormData): Promise<T> {
  const url = `${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = localStorage.getItem('ynr_auth_token');

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    const json: ApiResponse<T> = await response.json().catch(() => ({
      success: false,
      message: `File upload failed with status ${response.status}`,
    }));

    if (!response.ok || !json.success) {
      throw new ApiClientError(json.message || `Upload failed (${response.status})`, response.status, json.error);
    }

    return json.data as T;
  } catch (error: any) {
    if (error instanceof ApiClientError) throw error;
    throw new ApiClientError(error.message || 'File upload failed');
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { method: 'GET', ...options }),
  post: <T>(endpoint: string, data: any, options?: RequestInit) =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(data), ...options }),
  put: <T>(endpoint: string, data: any, options?: RequestInit) =>
    request<T>(endpoint, { method: 'PUT', body: JSON.stringify(data), ...options }),
  delete: <T>(endpoint: string, options?: RequestInit) => request<T>(endpoint, { method: 'DELETE', ...options }),
  upload: <T>(endpoint: string, formData: FormData) => uploadRequest<T>(endpoint, formData),
  baseUrl: BASE_URL,
};
