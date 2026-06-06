import apiClient from './authService';

export interface User {
  id: string;
  name?: string;
  nama?: string;
  email?: string;
  role?: string;
  phone?: string;
  nik?: string;
  address?: string;
  photoUrl?: string;
  createdAt?: string;
}

export interface ProfileData {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  nik?: string;
  address?: string;
  birthDate?: string;
  gender?: string;
  role?: string;
  photoUrl?: string;
  photoSource?: string;
  createdAt?: string;
  lastLoginAt?: string;
}

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data.data || [];
  },
  createUser: async (payload: { name: string; email: string; password: string; role?: string }) => {
    const response = await apiClient.post<{ message: string; data: User }>('/users', payload);
    return response.data;
  },
  deleteUser: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
  promote: async (id: string, role: string) => {
    const response = await apiClient.put<{ message: string; data?: any }>(`/users/${id}`, { role });
    return response.data;
  },
  getProfile: async (): Promise<{ message: string; data: ProfileData }> => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },
  updateProfile: async (payload: FormData) => {
    const response = await apiClient.put('/users/me', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
