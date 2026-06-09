import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { login as apiLogin, register as apiRegister, getMe } from "../api/auth";
import { setToken, getToken } from "../api/client";
import type { User, LoginPayload, RegisterPayload } from "../types";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await getMe();
          setUser(res.data);
        }
      } catch {
        await setToken(null);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await apiLogin(payload);
    await setToken(res.token);
    setUser(res.data.user);
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await apiRegister(payload);
    await setToken(res.token);
    setUser(res.data.user);
  }, []);

  const logout = useCallback(async () => {
    await setToken(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const res = await getMe();
    setUser(res.data);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
