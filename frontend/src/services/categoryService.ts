import apiClient from './authService';

export interface Category {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export const categoryService = {
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data.data as Category[];
  }
};
