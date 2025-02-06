"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccess } from "@/hooks/useAccess";
import { useAuth } from "@/context/AuthContext";
import { isPublicRoute, PUBLIC_ROUTES, AUTH_ROUTES } from "@/config/routes";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { checkRouteAccess } = useAccess();

  useEffect(() => {
    if (isLoading) return;

    const handleRouting = async () => {
      // Handle public routes and not-found
      if (isPublicRoute(pathname) || pathname === PUBLIC_ROUTES.NOT_FOUND) {
        // If authenticated user tries to access login/verify, redirect to dashboard
        if (
          isAuthenticated &&
          (pathname === PUBLIC_ROUTES.LOGIN ||
            pathname === PUBLIC_ROUTES.VERIFY)
        ) {
          router.replace(AUTH_ROUTES.DASHBOARD);
        }
        return;
      }

      // Handle protected routes
      if (!isAuthenticated) {
        router.replace(PUBLIC_ROUTES.LOGIN);
        return;
      }

      // Check route access for authenticated users
      if (pathname.startsWith("/dashboard") && !checkRouteAccess(pathname)) {
        router.replace(AUTH_ROUTES.UNAUTHORIZED);
      }
    };

    handleRouting();
  }, [isAuthenticated, isLoading, pathname, router, checkRouteAccess]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
