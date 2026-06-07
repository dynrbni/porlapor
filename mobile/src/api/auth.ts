import { api } from "./client";
import type { LoginPayload, RegisterPayload, User } from "../types";

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  return data as { token: string; data: { user: User } };
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  return data as { token: string; data: { user: User } };
}

export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data as { data: User };
}
