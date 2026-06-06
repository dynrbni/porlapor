import apiClient, { publicApiClient } from './authService';

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const categoryService = {
  getAll: async () => {
    const response = await publicApiClient.get('/categories');
    return response.data.data || [];
  }
  ,
  create: async (payload: { name: string; description?: string }) => {
    const response = await apiClient.post<{ message: string; data: Category }>('/categories', payload);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete<{ message: string }>(`/categories/${id}`);
    return response.data;
  }
};
