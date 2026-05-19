import { create } from "zustand";
import api, { setAccessToken } from "@/lib/axios";

type User = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isHydrated: boolean;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isHydrated: false,

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setAccessToken(data.accessToken);
      set({ user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (name, email, password) => {
    set({ isLoading: true });
    try {
      const { data } = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      setAccessToken(data.accessToken);
      set({ user: data.user, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await api.post("/api/auth/logout");
    setAccessToken(null);
    set({ user: null, isAuthenticated: false });
  },

  refresh: async () => {
    try {
      const { data } = await api.post("/api/auth/refresh");
      setAccessToken(data.accessToken);
      set({ user: data.user, isAuthenticated: true });
    } catch {
      setAccessToken(null);
      set({ user: null, isAuthenticated: false });
    }
  },

  hydrate: async () => {
    try {
      // First get a fresh access token via the httpOnly cookie
      const { data: refreshData } = await api.post("/api/auth/refresh");
      setAccessToken(refreshData.accessToken);
      // Then fetch the full user
      const { data } = await api.get("/api/auth/me");
      set({ user: data.user, isAuthenticated: true });
    } catch {
      setAccessToken(null);
      set({ user: null, isAuthenticated: false });
    } finally {
      set({ isHydrated: true });
    }
  },
}));
