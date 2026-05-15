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


export interface Comment {
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
  comments: Comment[];
  latitude: number;
  longitude: number;
  address: string;
}

export const reportService = {
  
  getReportById: async (id: string) => {
    const response = await apiClient.get<{ message: string; data: Report }>(`/reports/${id}`);
    return response.data;
  },
  addComment: async (reportId: string, content: string) => {
    const response = await apiClient.post<{ message: string; data: Comment }>(`/reports/${reportId}/comments`, { content });
    return response.data;
  },
  createReport: async (payload: { title: string; description: string; latitude: number; longitude: number; address: string; categoryId: string; agencyId?: string; imageUrl?: string }) => {
    const response = await apiClient.post('/reports', payload);
    return response.data;
  },

  getUserReports: async (userId: string) => {
    const response = await apiClient.get<{ message: string; data: Report[] }>(`/reports?userId=${userId}`);
    return response.data;
  },
};
