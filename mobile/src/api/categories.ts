import { api } from "./client";
import type { Category, ApiResponse } from "../types";

export async function getCategories(params?: { agencyId?: string }) {
  const { data } = await api.get<ApiResponse<Category[]>>("/categories", {
    params,
  });
  return data;
}

export async function createCategory(payload: {
  name: string;
  description?: string;
  agencyId?: string;
}) {
  const { data } = await api.post<{ category: Category }>(
    "/categories",
    payload
  );
  return data;
}

export async function updateCategory(id: string, payload: Partial<Category>) {
  const { data } = await api.put<{ category: Category }>(
    `/categories/${id}`,
    payload
  );
  return data;
}

export async function deleteCategory(id: string) {
  await api.delete(`/categories/${id}`);
}
