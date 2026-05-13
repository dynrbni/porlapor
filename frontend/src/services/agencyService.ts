import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface Agency {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
}

export const getAgencies = async (): Promise<Agency[]> => {
  const response = await apiClient.get('/agencies');
  return response.data.data || [];
};
