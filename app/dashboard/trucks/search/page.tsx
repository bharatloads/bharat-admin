"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
import debounce from "lodash/debounce";

export default function TruckSearchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetTrucksResponse | null>(null);
  const [searchParams, setSearchParams] = useState<GetTrucksParams>({
    page: 1,
    limit: 10,
  });
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [truckNumberSearch, setTruckNumberSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (params: GetTrucksParams) => {
      try {
        setIsLoading(true);
        // Convert params to query string
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== undefined)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join("&");

        const data = await fetcher<GetTrucksResponse>(
          `/admin/search/trucks${queryString ? `?${queryString}` : ""}`
        );
        setData(data);
      } catch (error) {
        console.error("Error searching trucks:", error);
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
            description: "Failed to search trucks",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }, 300),
    [toast]
  );
  useEffect(() => {
    setVerificationStatus(verificationStatus === " " ? "" : verificationStatus);
  }, [verificationStatus]);

  // Add this check for active filters
  const hasActiveFilters = Boolean(
    nameSearch || phoneSearch || truckNumberSearch || verificationStatus
  );

  // Modify the useEffect for search
  useEffect(() => {
    if (!hasActiveFilters) {
      setData(null);
      return;
    }

    const params: GetTrucksParams = {
      page: 1,
      limit: 10,
    };

    if (nameSearch) params.search = nameSearch;
    if (phoneSearch) params.phone = phoneSearch;
    if (truckNumberSearch) params.truckNumber = truckNumberSearch;
    if (verificationStatus) params.isRCVerified = verificationStatus;

    setSearchParams(params);
    debouncedSearch(params);
  }, [
    nameSearch,
    phoneSearch,
    truckNumberSearch,
    verificationStatus,
    debouncedSearch,
    hasActiveFilters,
  ]);

  const handleViewTruck = (truckId: string) => {
    router.push(`/dashboard/trucks/${truckId}`);
  };

  const handleClearFilters = () => {
    setNameSearch("");
    setPhoneSearch("");
    setTruckNumberSearch("");
    setVerificationStatus("");
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Search Trucks</h2>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Owner Name</label>
            <Input
              placeholder="Search by owner name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              placeholder="Search by phone..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Truck Number</label>
            <Input
              placeholder="Search by truck number..."
              value={truckNumberSearch}
              onChange={(e) => setTruckNumberSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Verification Status</label>
            <Select
              value={verificationStatus}
              onValueChange={setVerificationStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All</SelectItem>
                <SelectItem value="true">Verified</SelectItem>
                <SelectItem value="false">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Results Table */}
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
            {isLoading && hasActiveFilters ? (
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
            ) : !hasActiveFilters ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Enter search criteria to find trucks
                </TableCell>
              </TableRow>
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
      {hasActiveFilters && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data?.pagination.total
              ? `Showing ${
                  (searchParams.page - 1) * searchParams.limit + 1
                } to ${Math.min(
                  searchParams.page * searchParams.limit,
                  data.pagination.total
                )} of ${data.pagination.total} trucks`
              : "No trucks found"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSearchParams((p) => ({ ...p, page: p.page - 1 }))
              }
              disabled={searchParams.page <= 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSearchParams((p) => ({ ...p, page: p.page + 1 }))
              }
              disabled={!data || !data.pagination.hasMore || isLoading}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
