import axios from "axios";
import { setToken as _setToken, getToken as _getToken } from "./storage";

import { NativeModules } from "react-native";

const TOKEN_KEY = "auth_token";
let API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";

// Auto-detect IP during development
if (__DEV__) {
  const scriptURL = NativeModules.SourceCode?.scriptURL;
  if (scriptURL) {
    // scriptURL is typically "http://192.168.1.143:8081/index.bundle?..."
    const ip = scriptURL.split("://")[1].split(":")[0];
    API_URL = `http://${ip}:8080/api`;
  }
}

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
