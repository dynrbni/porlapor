import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
// Public API client without 401 redirect (for public pages)
export const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const decodeJwtPayload = (token: string): Record<string, unknown> | null => {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = atob(padded);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
};

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
  publicApiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  nik: string;
  address: string;
  birthDate: string;
  gender: 'LAKI_LAKI' | 'PEREMPUAN';
}

export interface AuthUser {
  id: string;
  name?: string;
  nama?: string;
  email?: string;
  role?: string;
  agencyId?: string;
  photoUrl?: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  data?: {
    user: AuthUser;
  };
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', payload);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data?.user));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Gagal terhubung ke server.' };
    }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      const cleanPayload = Object.fromEntries(
        Object.entries(payload).filter(([, v]) => v !== undefined && v !== '')
      );
      const response = await apiClient.post<AuthResponse>('/auth/register', cleanPayload);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data?.user));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || { message: 'Gagal terhubung ke server.' };
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  getUser: (): AuthUser | null => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    const parsed = JSON.parse(user) as AuthUser;
    if (!parsed.role) {
      const token = localStorage.getItem('auth_token');
      const payload = token ? decodeJwtPayload(token) : null;
      const role = payload?.role;
      if (typeof role === 'string' && role.length > 0) {
        const updatedUser = { ...parsed, role };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
    }
    return parsed;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};

export default apiClient;
