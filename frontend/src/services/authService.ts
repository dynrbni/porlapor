import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Interceptor: inject token ke setiap request ──────────────────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Types ────────────────────────────────────────────────────────────────────

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
  nama: string;
  email: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  data?: {
    user: AuthUser;
  };
}

// ─── Auth Service ─────────────────────────────────────────────────────────────

export const authService = {

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post<AuthResponse>('/auth/login', payload);
      // Cek berdasarkan ada/tidaknya token di response.data
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
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};

export default apiClient;