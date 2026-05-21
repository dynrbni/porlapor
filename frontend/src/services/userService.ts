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

export const userService = {
  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get('/users');
    return response.data.data || [];
  },
  deleteUser: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return response.data;
  },
  promote: async (id: string, role: string) => {
    // backend currently may not accept role via update; attempt PUT anyway
    const response = await apiClient.put<{ message: string; data?: any }>(`/users/${id}`, { role });
    return response.data;
  }
};
