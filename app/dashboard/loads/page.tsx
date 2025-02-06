"use client";

import { useEffect, useState } from "react";
import { Package, CheckCircle } from "lucide-react";
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
import { GetLoadsParams, GetLoadsResponse, Load } from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";

export default function LoadsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetLoadsResponse | null>(null);
  const [params, setParams] = useState<GetLoadsParams>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const fetchLoads = async () => {
      try {
        setIsLoading(true);
        // Convert params to query string
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join("&");

        const data = await fetcher<GetLoadsResponse>(
          `/admin/loads${queryString ? `?${queryString}` : ""}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching loads:", error);
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
            description: "Failed to fetch loads",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoads();
  }, [params, toast]);

  const handleViewLoad = (loadId: string) => {
    router.push(`/dashboard/loads/${loadId}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Loads</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.totalLoads || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Active Loads</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.activeLoads || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
      </div>

      {/* Loads Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transporter</TableHead>
              <TableHead>Material Type</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Total Bids</TableHead>
              <TableHead>Amount</TableHead>
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
            ) : data?.loads.length ? (
              data.loads.map((load: Load) => (
                <TableRow key={load._id}>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className="cursor-help">
                          {load.transporterId.name}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {load.transporterId.mobile.countryCode}{" "}
                          {load.transporterId.mobile.phone}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{load.materialType}</TableCell>
                  <TableCell>{load.source.placeName}</TableCell>
                  <TableCell>{load.destination.placeName}</TableCell>
                  <TableCell>{load.bids.length}</TableCell>
                  <TableCell>₹{load.offeredAmount.total}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        load.isActive === true
                          ? "success"
                          : load.isActive === false
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {load.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewLoad(load._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No loads found
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
              )} of ${data.pagination.total} loads`
            : "No loads found"}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams((p: GetLoadsParams) => ({ ...p, page: p.page - 1 }))
            }
            disabled={params.page <= 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setParams((p: GetLoadsParams) => ({ ...p, page: p.page + 1 }))
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
