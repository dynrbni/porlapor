import apiClient, { publicApiClient } from './authService';

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

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await publicApiClient.get('/users');
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
  }
};
