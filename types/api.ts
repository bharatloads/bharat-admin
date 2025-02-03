export interface User {
  _id: string;
  name: string;
  companyName?: string;
  companyLocation?: string;
  mobile: {
    countryCode: string;
    phone: string;
  };
  userType: "ADMIN" | "TRANSPORTER" | "TRUCKER";
  isVerified: boolean;
  createdAt: string;
  BlCoins: number;
}

export interface GetUsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  stats: {
    totalUsers: number;
    totalTruckers: number;
    totalTransporters: number;
    activeTruckers: number;
    activeTransporters: number;
  };
}

export interface GetUserByIdResponse {
  user: User;
}

export interface GetUsersParams {
  page: number;
  limit: number;
  userType?: "ADMIN" | "TRANSPORTER" | "TRUCKER";
  search?: string;
  isVerified?: boolean;
  sortBy?: "name" | "createdAt" | "BlCoins";
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export interface ApiErrorResponse {
  message: string;
  status: number;
  data?: Record<string, unknown>;
}
