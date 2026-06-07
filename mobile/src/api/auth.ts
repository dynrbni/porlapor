import { api } from "./client";
import type {
  LoginPayload,
  RegisterPayload,
  User,
  ApiResponse,
} from "../types";

export async function login(payload: LoginPayload) {
  const { data } = await api.post<{ token: string; user: User }>(
    "/auth/login",
    payload
  );
  return data;
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<{ token: string; user: User }>(
    "/auth/register",
    payload
  );
  return data;
}

export async function getMe() {
  const { data } = await api.get<ApiResponse<User>>("/auth/me");
  return data;
}

export async function updateProfile(formData: FormData) {
  const { data } = await api.put<{ user: User }>("/auth/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
