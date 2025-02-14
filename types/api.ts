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

export interface GetTrucksParams {
  page: number;
  limit: number;
  search?: string;
  phone?: string;
  truckNumber?: string;
  truckType?: string;
  isRCVerified?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export interface TruckOwner {
  _id: string;
  name: string;
  mobile: {
    countryCode: string;
    phone: string;
  };
  companyName?: string;
  companyLocation?: string;
}

export interface Truck {
  _id: string;
  truckOwner: TruckOwner;
  truckNumber: string;
  truckLocation: {
    placeName: string;
    coordinates: [number, number];
  };
  truckType: string;
  isRCVerified: boolean;
  bids: string[];
  createdAt: string;
  updatedAt: string;
}

export interface GetTrucksResponse {
  trucks: Truck[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  stats: {
    totalTrucks: number;
    verifiedTrucks: number;
    pendingVerification: number;
  };
}

export interface Bid {
  _id: string;
  bidType: "LOAD_BID" | "TRUCK_REQUEST";
  bidBy: {
    _id: string;
    name: string;
    mobile: {
      countryCode: string;
      phone: string;
    };
    companyName?: string;
  };
  offeredTo: {
    _id: string;
    name: string;
    mobile: {
      countryCode: string;
      phone: string;
    };
    companyName?: string;
  };
  loadId?: {
    materialType: string;
    source: {
      placeName: string;
      coordinates: [number, number];
    };
    destination: {
      placeName: string;
      coordinates: [number, number];
    };
    offeredAmount: {
      total: number;
      advanceAmount: number;
      dieselAmount: number;
    };
  };
  truckId?: {
    truckNumber: string;
    truckLocation: {
      placeName: string;
      coordinates: [number, number];
    };
    truckType: string;
  };
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  biddedAmount: {
    total: number;
    advanceAmount: number;
    dieselAmount: number;
  };
  createdAt: string;
}

export interface GetTruckByIdResponse {
  success: boolean;
  truck: Truck & {
    RCImage: string;
    RCVerificationStatus: "PENDING" | "APPROVED" | "REJECTED";
    truckCapacity: number;
    vehicleBodyType: string;
    truckBodyType: string;
    truckTyre: number;
    bids: Bid[];
  };
}

export interface LoadTransporter {
  _id: string;
  name: string;
  mobile: {
    countryCode: string;
    phone: string;
  };
  companyName?: string;
  companyLocation?: string;
}

export interface Load {
  _id: string;
  transporterId: LoadTransporter;
  materialType: string;
  source: {
    placeName: string;
    coordinates: [number, number];
  };
  destination: {
    placeName: string;
    coordinates: [number, number];
  };
  offeredAmount: {
    total: number;
    advanceAmount: number;
    dieselAmount: number;
  };
  bids: string[];
  isActive: boolean | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetLoadsParams {
  page: number;
  limit: number;
  search?: string;
  phone?: string;
  source?: string;
  destination?: string;
  materialType?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export interface GetLoadsResponse {
  loads: Load[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  stats: {
    totalLoads: number;
    activeLoads: number;
    completedLoads: number;
  };
}

export interface GetLoadByIdResponse {
  success: boolean;
  load: Load & {
    bids: Bid[];
  };
}

export interface GetBidsParams {
  page: number;
  limit: number;
  search?: string;
  phone?: string;
  bidType?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

export interface GetBidsResponse {
  bids: Bid[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
  stats: {
    totalBids: number;
    pendingBids: number;
    acceptedBids: number;
    rejectedBids: number;
  };
}
