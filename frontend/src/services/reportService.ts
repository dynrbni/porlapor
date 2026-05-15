import apiClient from './authService';

export interface Author {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
}

export interface OfficialNote {
  id: string;
  reportId: string;
  content: string;
  createdAt: string;
  author: Author;
}

export interface Category {
  id: string;
  name: string;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  category: Category;
  officialNotes: OfficialNote[];
}

export const reportService = {
  
  createReport: async (payload: { title: string; description: string; latitude: number; longitude: number; address: string; categoryId: string; agencyId?: string; imageUrl?: string }) => {
    const response = await apiClient.post('/reports', payload);
    return response.data;
  },

  getUserReports: async (userId: string) => {
    const response = await apiClient.get<{ message: string; data: Report[] }>(`/reports?userId=${userId}`);
    return response.data;
  },
};
