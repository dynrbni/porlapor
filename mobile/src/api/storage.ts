import { Platform } from "react-native";

const TOKEN_KEY = "auth_token";

function getSecureStore(): typeof import("expo-secure-store") | null {
  try {
    return require("expo-secure-store");
  } catch {
    return null;
  }
}

const store = getSecureStore();
const isNative = Platform.OS !== "web" && store !== null;

export async function setToken(token: string | null) {
  if (isNative && store) {
    if (token) await store.setItemAsync(TOKEN_KEY, token);
    else await store.deleteItemAsync(TOKEN_KEY);
  } else {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }
}

export async function getToken(): Promise<string | null> {
  if (isNative && store) return store.getItemAsync(TOKEN_KEY);
  return localStorage.getItem(TOKEN_KEY);
}
