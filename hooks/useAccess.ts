import { useAuth } from "@/context/AuthContext";
import {
  ROUTE_POLICIES,
  FEATURE_POLICIES,
  USER_ROLES,
  UserRole,
  FeaturePolicy,
} from "@/config/accessPolicies";

export function useAccess() {
  const { admin } = useAuth();
  const userLevel = (admin?.userLevel || USER_ROLES.ENTRY_LEVEL) as UserRole;
  console.log(userLevel);

  const checkRouteAccess = (route: string): boolean => {
    const policy = ROUTE_POLICIES[route];
    if (!policy) return true; // If no policy exists, allow access
    return policy.allowedRoles.includes(userLevel);
  };

  const checkFeatureAccess = (feature: FeaturePolicy): boolean => {
    const policy = FEATURE_POLICIES[feature];
    if (!policy) return false; // If no policy exists, deny access
    return policy.allowedRoles.includes(userLevel);
  };

  return {
    checkRouteAccess,
    checkFeatureAccess,
    userLevel,
  };
}
