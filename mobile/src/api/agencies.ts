import { api } from "./client";
import type { Agency, ApiResponse } from "../types";

export async function getAgencies() {
  const { data } = await api.get<ApiResponse<Agency[]>>("/agencies");
  return data;
}

export async function getAgencyById(id: string) {
  const { data } = await api.get<ApiResponse<Agency>>(`/agencies/${id}`);
  return data;
}

export async function createAgency(payload: { name: string; description?: string }) {
  const { data } = await api.post<{ agency: Agency }>("/agencies", payload);
  return data;
}

export async function updateAgency(id: string, formData: FormData) {
  const { data } = await api.put<{ agency: Agency }>(`/agencies/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteAgency(id: string) {
  await api.delete(`/agencies/${id}`);
}

export async function toggleAgencyActive(id: string) {
  const { data } = await api.patch<{ agency: Agency }>(`/agencies/${id}/toggle`);
  return data;
}
