import axios from "axios";
import { setToken as _setToken, getToken as _getToken } from "./storage";

const TOKEN_KEY = "auth_token";
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

export const api = axios.create({ baseURL: API_URL });
export const publicApi = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await _getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response?.status === 401) _setToken(null);
    return Promise.reject(e);
  }
);

publicApi.interceptors.request.use(async (config) => {
  const token = await _getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const setToken = _setToken;
export const getToken = _getToken;

export function getPhotoUrl(photoUrl?: string | null) {
  if (!photoUrl) return null;
  if (photoUrl.startsWith("http")) return photoUrl;
  const base = API_URL.replace(/\/api\/?$/, "");
  return `${base}${photoUrl}`;
}
