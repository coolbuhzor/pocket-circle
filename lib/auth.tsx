"use client";

import { type ReactNode } from "react";
import {
  useLogin,
  useLogout,
  useMe,
  useSignup,
  useUpdateMe,
} from "@/hooks/use-auth";
import type { User } from "@/lib/api/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    bankName: string;
    accountNumber: string;
  }) => Promise<{ error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ error?: string }>;
}

/**
 * Thin compatibility layer over React Query auth hooks.
 * Session identity lives in an httpOnly cookie — never in localStorage/React state as a token.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useAuth(): AuthContextValue {
  const { data: user = null, isLoading, refetch } = useMe();
  const loginMutation = useLogin();
  const signupMutation = useSignup();
  const logoutMutation = useLogout();
  const updateMutation = useUpdateMe();

  return {
    user,
    loading: isLoading,
    login: async (email, password) => {
      try {
        await loginMutation.mutateAsync({ email, password });
        return {};
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? err.message
              : "Email or password is incorrect. Try again.",
        };
      }
    },
    signup: async (data) => {
      try {
        await signupMutation.mutateAsync(data);
        return {};
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? err.message
              : "Could not create your account. Try again.",
        };
      }
    },
    logout: () => {
      logoutMutation.mutate();
    },
    refreshUser: async () => {
      await refetch();
    },
    updateProfile: async (data) => {
      try {
        await updateMutation.mutateAsync(data);
        return {};
      } catch (err) {
        return {
          error:
            err instanceof Error
              ? err.message
              : "Could not save your changes. Try again.",
        };
      }
    },
  };
}
