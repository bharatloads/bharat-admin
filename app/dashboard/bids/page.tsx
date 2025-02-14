"use client";

import { useEffect, useState } from "react";
import { Coins, Clock, CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { NumberTicker } from "@/components/ui/number-ticker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface GetBidsParams {
  page: number;
  limit: number;
  bidType?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  startDate?: string;
  endDate?: string;
}

interface Bid {
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
  loadId: {
    materialType: string;
    source: {
      placeName: string;
    };
    destination: {
      placeName: string;
    };
    offeredAmount: {
      total: number;
    };
  };
  truckId: {
    truckNumber: string;
    truckLocation: {
      placeName: string;
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

interface GetBidsResponse {
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

import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";

export default function BidsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetBidsResponse | null>(null);
  const [params, setParams] = useState<GetBidsParams>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchBids = async () => {
      try {
        setIsLoading(true);
        // Convert params to query string
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join("&");

        const data = await fetcher<GetBidsResponse>(
          `/admin/bids${queryString ? `?${queryString}` : ""}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching bids:", error);
        if (error instanceof ApiError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to fetch bids",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBids();
  }, [params, toast]);

  const handleViewBid = (bidId: string) => {
    router.push(`/dashboard/bids/${bidId}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Bids</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.totalBids || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Pending Bids</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.pendingBids || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Accepted Bids</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.acceptedBids || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Rejected Bids</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.rejectedBids || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
      </div>

      {/* Bids Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Bid By</TableHead>
              <TableHead>Offered To</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading skeleton rows
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[150px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.bids.length ? (
              data.bids.map((bid: Bid) => (
                <TableRow key={bid._id}>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-help">
                          {bid.bidBy.name}
                          {bid.bidBy.companyName && (
                            <span className="text-xs text-muted-foreground block">
                              {bid.bidBy.companyName}
                            </span>
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {bid.bidBy.mobile.countryCode}{" "}
                          {bid.bidBy.mobile.phone}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-help">
                          {bid.offeredTo.name}
                          {bid.offeredTo.companyName && (
                            <span className="text-xs text-muted-foreground block">
                              {bid.offeredTo.companyName}
                            </span>
                          )}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {bid.offeredTo.mobile.countryCode}{" "}
                          {bid.offeredTo.mobile.phone}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {bid.bidType === "LOAD_BID" ? "Load" : "Truck"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {bid.bidType === "LOAD_BID" ? (
                      <div>
                        <p className="font-medium">{bid.loadId.materialType}</p>
                        <p className="text-sm text-muted-foreground">
                          {bid.loadId.source.placeName} →{" "}
                          {bid.loadId.destination.placeName}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">{bid.truckId.truckNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {bid.truckId.truckLocation.placeName} -{" "}
                          {bid.truckId.truckType}
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{bid.biddedAmount.total}</p>
                      <p className="text-xs text-muted-foreground">
                        {bid.bidType === "LOAD_BID"
                          ? `Original: ₹${bid.loadId.offeredAmount.total}`
                          : ""}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        bid.status === "ACCEPTED"
                          ? "success"
                          : bid.status === "REJECTED"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(bid.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewBid(bid._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No bids found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {data?.pagination.total
            ? `Showing ${(params.page - 1) * params.limit + 1} to ${Math.min(
                params.page * params.limit,
                data.pagination.total
              )} of ${data.pagination.total} bids`
            : "No bids found"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
            disabled={params.page <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
            disabled={!data || !data.pagination.hasMore || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
