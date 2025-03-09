"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Search } from "lucide-react";
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

export default function TruckSearchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<GetTrucksResponse | null>(null);
  const [searchParams, setSearchParams] = useState<GetTrucksParams>({
    page: 1,
    limit: 10,
  });
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [truckNumberSearch, setTruckNumberSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [verificationStatus, setVerificationStatus] = useState<string>("");

  const performSearch = async (params: GetTrucksParams) => {
    try {
      setIsLoading(true);
      const queryString = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== "")
        .map(([key, value]) => {
          if (value instanceof Date) {
            return `${key}=${value.toISOString()}`;
          }
          return `${key}=${encodeURIComponent(String(value))}`;
        })
        .join("&");

      const data = await fetcher<GetTrucksResponse>(
        `/admin/search/trucks?${queryString}`
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
  };

  useEffect(() => {
    setVerificationStatus(verificationStatus === " " ? "" : verificationStatus);
  }, [verificationStatus]);

  const hasActiveFilters = Boolean(
    nameSearch ||
      phoneSearch ||
      truckNumberSearch ||
      locationSearch ||
      verificationStatus
  );

  const handleSearch = () => {
    if (!hasActiveFilters) {
      setData(null);
      return;
    }

    const params: GetTrucksParams = {
      page: 1,
      limit: 10,
    };

    if (nameSearch) params.ownerName = nameSearch;
    if (phoneSearch) params.phone = phoneSearch;
    if (truckNumberSearch) params.truckNumber = truckNumberSearch;
    if (locationSearch) params.location = locationSearch;
    if (verificationStatus) params.isRCVerified = verificationStatus;

    setSearchParams(params);
    performSearch(params);
  };

  const handlePageChange = (newPage: number) => {
    const updatedParams = { ...searchParams, page: newPage };
    setSearchParams(updatedParams);
    performSearch(updatedParams);
  };

  const handleViewTruck = (truckId: string) => {
    router.push(`/dashboard/trucks/${truckId}`);
  };

  const handleClearFilters = () => {
    setNameSearch("");
    setPhoneSearch("");
    setTruckNumberSearch("");
    setLocationSearch("");
    setVerificationStatus("");
    setData(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Search Trucks</h2>
          <Button variant="outline" onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Owner Name</label>
            <Input
              placeholder="Search by owner name..."
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Phone Number</label>
            <Input
              placeholder="Search by phone..."
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Truck Number</label>
            <Input
              placeholder="Search by truck number..."
              value={truckNumberSearch}
              onChange={(e) => setTruckNumberSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              placeholder="Search by location..."
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              onKeyDown={handleKeyDown}
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
          <div className="flex items-end">
            <Button
              onClick={handleSearch}
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

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
              Array.from({ length: 5 }, (_, index) => (
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

      {data && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {data.pagination.total
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
              onClick={() => handlePageChange(searchParams.page - 1)}
              disabled={searchParams.page <= 1 || isLoading}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(searchParams.page + 1)}
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
