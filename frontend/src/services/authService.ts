import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nama: string;
  email: string;
  password: string;
  passwordConfirm: string;
}

export interface AuthResponse {
  status: string;
  data?: {
    user: {
      id: string;
      nama: string;
      email: string;
    };
    token?: string;
  };
  message?: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    try {
      const response = await apiClient.post('/auth/login', payload);
      if (response.data.status === 'success' && response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    try {
      // Send as 'name' to backend, but accept 'nama' from frontend
      const registerPayload = {
        name: payload.nama,
        email: payload.email,
        password: payload.password,
        passwordConfirm: payload.passwordConfirm,
      };
      const response = await apiClient.post('/auth/register', registerPayload);
      if (response.data.status === 'success' && response.data.data?.token) {
        localStorage.setItem('auth_token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  getToken: () => localStorage.getItem('auth_token'),

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },
};

export default apiClient;
