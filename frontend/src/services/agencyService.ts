import apiClient, { publicApiClient } from './authService';

export interface Agency {
  id: string;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  description?: string | null;
  isActive?: boolean;
  photoUrl?: string | null;
  createdAt: string;
}

export interface CreateAgencyPayload {
  name: string;
  description?: string;
  email?: string;
  password?: string;
  phone?: string;
  address?: string;
  photoUrl?: string;
  photoSource?: 'LOCAL' | 'URL';
}

export const getAgencies = async (): Promise<Agency[]> => {
  const response = await publicApiClient.get('/agencies');
  return response.data.data || [];
};

export const createAgency = async (payload: CreateAgencyPayload) => {
  const response = await apiClient.post<{ message: string; data: Agency }>('/agencies', payload);
  return response.data;
};

export const updateAgency = async (id: string, payload: Partial<CreateAgencyPayload>) => {
  const response = await apiClient.put<{ message: string; data: Agency }>(`/agencies/${id}`, payload);
  return response.data;
};

export const deleteAgency = async (id: string) => {
  const response = await apiClient.delete<{ message: string }>(`/agencies/${id}`);
  return response.data;
};
