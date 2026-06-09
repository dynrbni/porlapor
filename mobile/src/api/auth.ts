import { api } from "./client";
import type { LoginPayload, RegisterPayload, User } from "../types";

function mapUser(user: any): User {
  return {
    id: user.id,
    name: user.name || user.nama || "",
    email: user.email,
    role: user.role,
    phone: user.phone,
    nik: user.nik,
    address: user.address,
    gender: user.gender,
    photoUrl: user.photoUrl,
    agencyId: user.agencyId,
    isActive: user.isActive ?? true,
    createdAt: user.createdAt,
  };
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post("/auth/login", payload);
  const token = data.token;
  const user = data.data?.user || data.user;
  if (!token || !user) throw new Error("Format response login tidak valid");
  return { token, data: { user: mapUser(user) } };
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post("/auth/register", payload);
  const token = data.token;
  const user = data.data?.user || data.user;
  if (!token || !user) throw new Error("Format response registrasi tidak valid");
  return { token, data: { user: mapUser(user) } };
}

export async function getMe() {
  const { data } = await api.get("/users/me");
  const user = data.data || data.user || data;
  if (!user) throw new Error("Format response profil tidak valid");
  return { data: mapUser(user) };
}
