"use client";

import { useEffect, useState } from "react";
import { Truck, CheckCircle, XCircle } from "lucide-react";
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
import {
  GetTrucksParams,
  GetTrucksResponse,
  Truck as TruckType,
} from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";

export default function TrucksPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetTrucksResponse | null>(null);
  const [params, setParams] = useState<GetTrucksParams>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        setIsLoading(true);
        // Convert params to query string
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join("&");

        const data = await fetcher<GetTrucksResponse>(
          `/admin/trucks${queryString ? `?${queryString}` : ""}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching trucks:", error);
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
            description: "Failed to fetch trucks",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrucks();
  }, [params, toast]);

  const handleViewTruck = (truckId: string) => {
    router.push(`/dashboard/trucks/${truckId}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Trucks</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.totalTrucks || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Verified Trucks</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.verifiedTrucks || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Pending Verification</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.pendingVerification || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
      </div>

      {/* Trucks Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>Truck Number</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Total Bids</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
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
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.trucks.length ? (
              data.trucks.map((truck: TruckType) => (
                <TableRow key={truck._id}>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-help">
                          {truck.truckOwner?.name || "N/A"}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {truck.truckOwner?.mobile?.countryCode || "+91"}{" "}
                          {truck.truckOwner?.mobile?.phone || "N/A"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{truck.truckNumber}</TableCell>
                  <TableCell>{truck.truckLocation.placeName}</TableCell>
                  <TableCell>{truck.bids.length}</TableCell>
                  <TableCell>{truck.truckType}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        truck.isRCVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {truck.isRCVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-700" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-700" />
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTruck(truck._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No trucks found
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
              )} of ${data.pagination.total} trucks`
            : "No trucks found"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams((p: GetTrucksParams) => ({ ...p, page: p.page - 1 }))
            }
            disabled={params.page <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams((p: GetTrucksParams) => ({ ...p, page: p.page + 1 }))
            }
            disabled={!data || !data.pagination.hasMore || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
