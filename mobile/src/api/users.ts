import { api } from "./client";
import type { User, StatsResponse, ApiResponse } from "../types";

export async function getUsers(params?: { role?: string; page?: number }) {
  const { data } = await api.get<ApiResponse<User[]>>("/users", { params });
  return data;
}

export async function toggleUserActive(id: string) {
  const { data } = await api.patch<{ user: User }>(`/users/${id}/toggle`);
  return data;
}

export async function deleteUser(id: string) {
  await api.delete(`/users/${id}`);
}

export async function getStats() {
  const { data } = await api.get<StatsResponse>("/admin/stats");
  return data;
}
