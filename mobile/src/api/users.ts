import { api } from "./client";

export async function updateProfile(data: Record<string, any> | FormData) {
  const response = await api.put("/users/me", data);
  return response.data;
}
