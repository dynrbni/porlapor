import apiClient from './authService';

export interface Agency {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  photoUrl?: string | null;
  createdAt: string;
}

export interface CreateAgencyPayload {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
  photoSource?: 'LOCAL' | 'URL';
}

export const getAgencies = async (): Promise<Agency[]> => {
  const response = await apiClient.get('/agencies');
  return response.data.data || [];
};

export const createAgency = async (payload: CreateAgencyPayload) => {
  const response = await apiClient.post<{ message: string; data: Agency }>('/agencies', payload);
  return response.data;
};
