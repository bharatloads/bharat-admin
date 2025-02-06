export const PUBLIC_ROUTES = {
  LOGIN: "/login",
  VERIFY: "/login/verify",
  NOT_FOUND: "/not-found",
} as const;

export const AUTH_ROUTES = {
  DASHBOARD: "/dashboard",
  UNAUTHORIZED: "/unauthorized",
} as const;

export const isPublicRoute = (path: string): boolean => {
  const publicPaths = [...Object.values(PUBLIC_ROUTES), "/"];
  return publicPaths.includes(path);
};
