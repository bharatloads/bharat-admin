"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { GetBidsParams, GetBidsResponse, Bid } from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

export default function BidSearchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<GetBidsResponse | null>(null);
  const [searchParams, setSearchParams] = useState<GetBidsParams>({
    page: 1,
    limit: 10,
  });
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [bidType, setBidType] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [date, setDate] = useState<DateRange | undefined>();

  // Check if any search filters are applied
  const hasActiveFilters = Boolean(
    nameSearch || phoneSearch || bidType || status || date?.from || date?.to
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (params: GetBidsParams) => {
      const search = debounce(async (searchParams: GetBidsParams) => {
        try {
          setIsLoading(true);
          // Convert params to query string
          const queryString = Object.entries(searchParams)
            .filter(([_, value]) => value !== undefined && value !== "")
            .map(([key, value]) => {
              if (value instanceof Date) {
                return `${key}=${value.toISOString()}`;
              }
              return `${key}=${value}`;
            })
            .join("&");

          const data = await fetcher<GetBidsResponse>(
            `/admin/bids?${queryString}`
          );
          setData(data);
        } catch (error) {
          console.error("Error searching bids:", error);
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
              description: "Failed to search bids",
            });
          }
        } finally {
          setIsLoading(false);
        }
      }, 500);

      search(params);
    },
    [toast]
  );

  // Update search when filters change
  useEffect(() => {
    if (!hasActiveFilters) {
      setData(null);
      return;
    }

    const params: GetBidsParams = {
      page: 1,
      limit: 10,
    };

    if (nameSearch) params.search = nameSearch;
    if (phoneSearch) params.phone = phoneSearch;
    if (bidType) params.bidType = bidType;
    if (status) params.status = status;
    if (date?.from) params.startDate = format(date.from, "yyyy-MM-dd");
    if (date?.to) params.endDate = format(date.to, "yyyy-MM-dd");

    setSearchParams(params);
    debouncedSearch(params);
  }, [
    nameSearch,
    phoneSearch,
    bidType,
    status,
    date,
    debouncedSearch,
    hasActiveFilters,
  ]);

  const handleViewBid = (bidId: string) => {
    router.push(`/dashboard/bids/${bidId}`);
  };

  const handleClearFilters = () => {
    setNameSearch("");
    setPhoneSearch("");
    setBidType("");
    setStatus("");
    setDate(undefined);
  };

  return (
    <div className='space-y-6'>
      {/* Search Controls */}
      <div className='rounded-lg border bg-card p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Search Bids</h2>
          <Button variant='outline' onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col space-y-2'>
            <label className='text-sm font-medium'>Bidder Name</label>
            <Input
              placeholder='Search by name...'
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <label className='text-sm font-medium'>Phone Number</label>
            <Input
              placeholder='Search by phone...'
              value={phoneSearch}
              onChange={(e) => setPhoneSearch(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <label className='text-sm font-medium'>Bid Type</label>
            <Select value={bidType} onValueChange={setBidType}>
              <SelectTrigger>
                <SelectValue placeholder='Select type' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=' '>All</SelectItem>
                <SelectItem value='LOAD_BID'>Load Bid</SelectItem>
                <SelectItem value='TRUCK_REQUEST'>Truck Request</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col space-y-2'>
            <label className='text-sm font-medium'>Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder='Select status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=' '>All</SelectItem>
                <SelectItem value='PENDING'>Pending</SelectItem>
                <SelectItem value='ACCEPTED'>Accepted</SelectItem>
                <SelectItem value='REJECTED'>Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex flex-col space-y-2 lg:col-span-2'>
            <label className='text-sm font-medium'>Date Range</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant='outline'
                  className={cn(
                    "justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}>
                  <Calendar className='mr-2 h-4 w-4' />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <CalendarComponent
                  initialFocus
                  mode='range'
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className='rounded-lg border'>
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
              Array.from({ length: 5 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className='h-4 w-[150px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[150px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[100px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[200px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[80px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[80px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[100px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-[100px]' />
                  </TableCell>
                </TableRow>
              ))
            ) : !hasActiveFilters ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center py-8'>
                  Enter search criteria to find bids
                </TableCell>
              </TableRow>
            ) : data?.bids.length ? (
              data.bids.map((bid: Bid) => (
                <TableRow key={bid._id}>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className='cursor-help'>
                          {bid.bidBy.name}
                          {bid.bidBy.companyName && (
                            <span className='text-xs text-muted-foreground block'>
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
                        <span className='cursor-help'>
                          {bid.offeredTo.name}
                          {bid.offeredTo.companyName && (
                            <span className='text-xs text-muted-foreground block'>
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
                    <Badge variant='secondary'>
                      {bid.bidType === "LOAD_BID" ? "Load" : "Truck"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {bid.bidType === "LOAD_BID" ? (
                      <div>
                        <p className='font-medium'>
                          {bid.loadId?.materialType}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {bid.loadId?.source.placeName} →{" "}
                          {bid.loadId?.destination.placeName}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className='font-medium'>
                          {bid.truckId?.truckNumber}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {bid.truckId?.truckLocation.placeName} -{" "}
                          {bid.truckId?.truckType}
                        </p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className='font-medium'>₹{bid.biddedAmount.total}</p>
                      <p className='text-xs text-muted-foreground'>
                        {bid.bidType === "LOAD_BID" && bid.loadId
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
                      }>
                      {bid.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(bid.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleViewBid(bid._id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className='text-center'>
                  No bids found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {hasActiveFilters && (
        <div className='flex items-center justify-between'>
          <p className='text-sm text-muted-foreground'>
            {data?.pagination.total
              ? `Showing ${
                  (searchParams.page - 1) * searchParams.limit + 1
                } to ${Math.min(
                  searchParams.page * searchParams.limit,
                  data.pagination.total
                )} of ${data.pagination.total} bids`
              : "No bids found"}
          </p>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setSearchParams((p) => ({ ...p, page: p.page - 1 }))
              }
              disabled={searchParams.page <= 1 || isLoading}>
              Previous
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() =>
                setSearchParams((p) => ({ ...p, page: p.page + 1 }))
              }
              disabled={!data || !data.pagination.hasMore || isLoading}>
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
