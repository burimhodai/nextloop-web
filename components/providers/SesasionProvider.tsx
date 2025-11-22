// components/providers/SessionProvider.tsx
"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { usePathname, useRouter } from "next/navigation";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user, token } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // List of public routes that don't require authentication
    const publicRoutes = [
      "/auth/login",
      "/auth/signup",
      "/auth/verify",
      "/auth/forgot-password",
      "/",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If user is not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      console.log("Not authenticated, redirecting to login");
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }

    // If user is authenticated but user data is missing, something went wrong
    if (isAuthenticated && !user) {
      console.log("Authentication inconsistent, logging out");
      useAuthStore.getState().logout();
      router.push("/auth/login");
    }

    // Log session state for debugging
    console.log("Session check:", {
      isAuthenticated,
      hasUser: !!user,
      hasToken: !!token,
      pathname,
    });
  }, [isAuthenticated, user, token, pathname, router]);

  return <>{children}</>;
}
