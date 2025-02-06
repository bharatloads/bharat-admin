import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_ROUTES, AUTH_ROUTES, isPublicRoute } from "./config/routes";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("adminToken")?.value ||
    request.headers.get("Authorization")?.split(" ")[1];
  const path = request.nextUrl.pathname;

  // Allow access to public routes
  if (isPublicRoute(path)) {
    // If user has token and tries to access login/verify, redirect to dashboard
    if (
      token &&
      (path === PUBLIC_ROUTES.LOGIN || path === PUBLIC_ROUTES.VERIFY)
    ) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.DASHBOARD, request.url));
    }
    return NextResponse.next();
  }

  // Handle verify page special case
  if (path === PUBLIC_ROUTES.VERIFY) {
    const hasStoredUsername = request.cookies.get("adminUsername");
    if (!hasStoredUsername) {
      return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url));
    }
    return NextResponse.next();
  }

  // Require authentication for all other routes
  if (!token) {
    return NextResponse.redirect(new URL(PUBLIC_ROUTES.LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|assets).*)",
  ],
};
