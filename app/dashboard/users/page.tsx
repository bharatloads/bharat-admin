"use client";

import { useEffect, useState } from "react";
import { Users, Truck, Building2 } from "lucide-react";
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

export default function UsersPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetUsersResponse | null>(null);
  const [params, setParams] = useState<GetUsersParams>({
    page: 1,
    limit: 10,
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
        console.error("Error fetching users:", error);
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
            description: "Failed to fetch users",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [params, toast]);

  return (
    <div className="space-y-6">
      {/* Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Users</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.totalUsers || 0}
                className="text-2xl font-bold"
              />
            )}
          </div>
        </div>
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
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-medium">Total Transporters</h3>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <Skeleton className="h-7 w-20" />
            ) : (
              <NumberTicker
                value={data?.stats.totalTransporters || 0}
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
              <TableHead>Company</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>BL Coins</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              // Loading state
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  {Array.from({ length: 8 }).map((_, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data?.users.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              // Data state
              data?.users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>
                    {user.companyName || (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {user.mobile.countryCode} {user.mobile.phone}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {user.userType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                        user.isVerified
                          ? "bg-green-50 text-green-700 ring-green-600/20"
                          : "bg-red-50 text-red-700 ring-red-600/20"
                      }`}
                    >
                      {user.isVerified ? "Verified" : "Unverified"}
                    </span>
                  </TableCell>
                  <TableCell>{user.BlCoins}</TableCell>
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        // Handle view user
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(params.page! - 1) * params.limit! + 1} to{" "}
            {Math.min(params.page! * params.limit!, data.pagination.total)} of{" "}
            {data.pagination.total} users
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParams((p) => ({ ...p, page: p.page! - 1 }))}
              disabled={params.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setParams((p) => ({ ...p, page: p.page! + 1 }))}
              disabled={!data.pagination.hasMore}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
