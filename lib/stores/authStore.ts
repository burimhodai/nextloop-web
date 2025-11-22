// stores/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  LoginRequest,
  SignupRequest,
  AuthResponse,
} from "@/lib/types/user.types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setToken: (token) => set({ token }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch(`${API_URL}/user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          });

          const data: AuthResponse = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.message || "Login failed");
          }

          if (data.data) {
            set({
              user: data.data.user,
              token: data.data.token,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Login failed";
          set({
            error: message,
            isLoading: false,
            user: null,
            token: null,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      signup: async (data) => {
        set({ isLoading: true, error: null });
        try {
          console.log("Sending signup request with data:", data);

          // Generate username from email if not provided
          const username = data.email
            .split("@")[0]
            .toLowerCase()
            .replace(/[^a-z0-9_]/g, "_");

          const payload = {
            ...data,
            username, // Auto-generate username from email
            preferredLanguage: "en", // Default language
          };

          console.log("Payload being sent:", payload);

          const response = await fetch(`${API_URL}/user/create`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          console.log("Response status:", response.status);
          const result = await response.json();
          console.log("Response data:", result);

          if (!response.ok) {
            throw new Error(result.message || "Signup failed");
          }

          // After successful signup, show success message
          // User needs to verify email before they can login
          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          console.error("Signup error:", error);
          const message =
            error instanceof Error ? error.message : "Signup failed";
          set({
            error: message,
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
