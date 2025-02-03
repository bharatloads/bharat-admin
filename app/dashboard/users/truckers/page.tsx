"use client";

import { useEffect, useState } from "react";
import { Users, Truck } from "lucide-react";
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
import { GetUsersParams, GetUsersResponse } from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";

export default function TruckersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetUsersResponse | null>(null);
  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    limit: 10,
    userType: "TRUCKER",
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Convert params to query string
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join("&");

        const data = await fetcher<GetUsersResponse>(
          `/admin/users${queryString ? `?${queryString}` : ""}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching truckers:", error);
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
            description: "Failed to fetch truckers",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [params, toast]);

  const handleViewUser = (userId: string) => {
    router.push(`/dashboard/user/${userId}`);
  };

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Truckers</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.totalTruckers || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Active Truckers</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.activeTruckers || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>BL Coins</TableHead>
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
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-[100px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : data?.users.length ? (
              data.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>
                    {user.mobile.countryCode} {user.mobile.phone}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </TableCell>
                  <TableCell>{user.BlCoins}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewUser(user._id)}
                    >
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No truckers found
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
              )} of ${data.pagination.total} truckers`
            : "No truckers found"}
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
