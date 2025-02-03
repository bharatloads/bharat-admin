import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token =
    request.cookies.get("adminToken")?.value ||
    request.headers.get("Authorization")?.split(" ")[1];
  const path = request.nextUrl.pathname;

  // Be more specific about which pages are which
  const isLoginPage = path === "/login";
  const isVerifyPage = path === "/login/verify";
  const isRootPage = path === "/";
  const isDashboardPage = path.startsWith("/dashboard");

  // If user is on main login page and has token, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If user is trying to access dashboard without token, redirect to login
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Allow access to public pages
  if (isRootPage || isVerifyPage || isLoginPage) {
    return NextResponse.next();
  }

  // For all other routes, require authentication
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
