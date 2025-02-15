export const USER_ROLES = {
  ENTRY_LEVEL: 1,
  TECH_ADMIN: 2,
  SUPPORT_ADMIN: 3,
  FINANCE_ADMIN: 4,
  OPERATIONS_ADMIN: 5,
  MARKETING_ADMIN: 6,
  SUPER_ADMIN: 10,
} as const;
export const USER_LEVELS = {
  1: "Entry Level",
  2: "Tech Admin",
  3: "Support Admin",
  4: "Finance Admin",
  5: "Operations Admin",
  6: "Marketing Admin",
  10: "Super Admin",
} as const;

// Define the type for user roles using the values
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export interface AccessPolicy {
  allowedRoles: UserRole[];
  description: string;
}

// Create a type for the feature policy keys
export type FeaturePolicy = keyof typeof FEATURE_POLICIES;

export const ROUTE_POLICIES: Record<string, AccessPolicy> = {
  // Dashboard
  "/dashboard": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.FINANCE_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View Dashboard",
  },
  // Admin Users
  "/dashboard/admin-users": {
    allowedRoles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "Manage Admin Users",
  },

  // Users
  "/dashboard/users": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.FINANCE_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View All Users",
  },
  "/dashboard/users/truckers": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.FINANCE_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View Truckers",
  },
  "/dashboard/users/transporters": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.FINANCE_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View Transporters",
  },

  // Loads
  "/dashboard/loads": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View All Loads",
  },
  "/dashboard/loads/search": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "Search Loads",
  },

  // Trucks
  "/dashboard/trucks": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View All Trucks",
  },
  "/dashboard/trucks/search": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "Search Trucks",
  },

  // Bids
  "/dashboard/bids": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View All Bids",
  },
  "/dashboard/bids/search": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "Search Bids",
  },

  // Statistics
  "/dashboard/statistics": {
    allowedRoles: [
      USER_ROLES.ENTRY_LEVEL,
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.TECH_ADMIN,
      USER_ROLES.SUPPORT_ADMIN,
      USER_ROLES.FINANCE_ADMIN,
      USER_ROLES.OPERATIONS_ADMIN,
      USER_ROLES.MARKETING_ADMIN,
    ],
    description: "View Statistics",
  },
};

export const FEATURE_POLICIES: Record<string, AccessPolicy> = {
  CREATE_USER: {
    allowedRoles: [USER_ROLES.SUPER_ADMIN],
    description: "Create new users",
  },
  DELETE_USER: {
    allowedRoles: [USER_ROLES.ENTRY_LEVEL, USER_ROLES.SUPER_ADMIN],
    description: "Delete users",
  },
  MODIFY_USER: {
    allowedRoles: [USER_ROLES.ENTRY_LEVEL, USER_ROLES.SUPER_ADMIN],
    description: "Modify user details",
  },
  APPROVE_BIDS: {
    allowedRoles: [USER_ROLES.ENTRY_LEVEL, USER_ROLES.SUPER_ADMIN],
    description: "Approve bids",
  },
  VIEW_ANALYTICS: {
    allowedRoles: [USER_ROLES.ENTRY_LEVEL, USER_ROLES.SUPER_ADMIN],
    description: "View analytics",
  },
  MANAGE_ADMINS: {
    allowedRoles: [USER_ROLES.ENTRY_LEVEL, USER_ROLES.SUPER_ADMIN],
    description: "Manage admin users",
  },
};
