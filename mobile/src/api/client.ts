import axios from "axios";
import { setToken as _setToken, getToken as _getToken } from "./storage";
import { Platform, NativeModules } from "react-native";

function detectHostIp(): string | null {
  try {
    if (Platform.OS === "web") {
      const hostname = window.location.hostname;
      if (hostname && hostname !== "localhost" && hostname !== "127.0.0.1" && hostname !== "0.0.0.0") {
        return hostname;
      }
      return null;
    }

    // On native iOS/Android — extract IP from the Metro bundler URL
    const scriptURL = NativeModules.SourceCode?.scriptURL;
    if (scriptURL) {
      const ip = scriptURL.split("://")[1]?.split(":")[0];
      if (ip && ip !== "localhost" && ip !== "127.0.0.1") return ip;
    }

    // Try expo-constants as fallback
    try {
      const Constants = require("expo-constants");
      const hostUri = Constants.default?.expoConfig?.hostUri;
      if (hostUri) {
        const ip = hostUri.split(":")[0];
        if (ip && ip !== "localhost" && ip !== "127.0.0.1") return ip;
      }
    } catch {}

    return null;
  } catch {
    return null;
  }
}

function getBaseUrl(): string {
  // Auto-detect IP on native devices (for physical iOS/Android)
  const hostIp = detectHostIp();
  if (hostIp) return `http://${hostIp}:8080/api`;

  // Fallback: env var (localhost) — works on simulator & web
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080/api";
}

let API_URL = getBaseUrl();

export const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});
export const publicApi = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

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
