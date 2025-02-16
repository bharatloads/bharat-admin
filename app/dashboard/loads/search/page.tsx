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
import { GetLoadsParams, GetLoadsResponse, Load } from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import debounce from "lodash/debounce";

export default function LoadSearchPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<GetLoadsResponse | null>(null);
  const [searchParams, setSearchParams] = useState<GetLoadsParams>({
    page: 1,
    limit: 10,
  });
  const [nameSearch, setNameSearch] = useState("");
  const [phoneSearch, setPhoneSearch] = useState("");
  const [sourceSearch, setSourceSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [date, setDate] = useState<DateRange | undefined>();

  // Check if any search filters are applied
  const hasActiveFilters = Boolean(
    nameSearch ||
      phoneSearch ||
      sourceSearch ||
      destinationSearch ||
      date?.from ||
      date?.to
  );

  // Debounced search function
  const debouncedSearch = useCallback(
    (params: GetLoadsParams) => {
      const search = debounce(async (searchParams: GetLoadsParams) => {
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

          const data = await fetcher<GetLoadsResponse>(
            `/admin/loads?${queryString}`
          );
          setData(data);
        } catch (error) {
          console.error("Error searching loads:", error);
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
              description: "Failed to search loads",
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

    const params: GetLoadsParams = {
      page: 1,
      limit: 10,
    };

    if (nameSearch) params.search = nameSearch;
    if (phoneSearch) params.phone = phoneSearch;
    if (sourceSearch) params.source = sourceSearch;
    if (destinationSearch) params.destination = destinationSearch;
    if (date?.from) params.startDate = format(date.from, "yyyy-MM-dd");
    if (date?.to) params.endDate = format(date.to, "yyyy-MM-dd");

    setSearchParams(params);
    debouncedSearch(params);
  }, [
    nameSearch,
    phoneSearch,
    sourceSearch,
    destinationSearch,
    date,
    debouncedSearch,
    hasActiveFilters,
  ]);

  const handleViewLoad = (loadId: string) => {
    router.push(`/dashboard/loads/${loadId}`);
  };

  const handleClearFilters = () => {
    setNameSearch("");
    setPhoneSearch("");
    setSourceSearch("");
    setDestinationSearch("");
    setDate(undefined);
  };

  return (
    <div className='space-y-6'>
      {/* Search Controls */}
      <div className='rounded-lg border bg-card p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h2 className='text-lg font-semibold'>Search Loads</h2>
          <Button variant='outline' onClick={handleClearFilters}>
            Clear Filters
          </Button>
        </div>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <div className='flex flex-col space-y-2'>
            <label className='text-sm font-medium'>Transporter Name</label>
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
            <label className='text-sm font-medium'>Source Location</label>
            <Input
              placeholder='Search by source...'
              value={sourceSearch}
              onChange={(e) => setSourceSearch(e.target.value)}
              className='w-full'
            />
          </div>
          <div className='flex flex-col space-y-2'>
            <label className='text-sm font-medium'>Destination Location</label>
            <Input
              placeholder='Search by destination...'
              value={destinationSearch}
              onChange={(e) => setDestinationSearch(e.target.value)}
              className='w-full'
            />
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
              Array.from({ length: 5 }, (_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className='h-4 w-[150px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[100px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[120px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[120px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[60px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[80px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-[80px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-[100px]' />
                  </TableCell>
                </TableRow>
              ))
            ) : !hasActiveFilters ? (
              <TableRow>
                <TableCell colSpan={8} className='text-center py-8'>
                  Enter search criteria to find loads
                </TableCell>
              </TableRow>
            ) : data?.loads.length ? (
              data.loads.map((load: Load) => (
                <TableRow key={load._id}>
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className='cursor-help'>
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
                      }>
                      {load.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handleViewLoad(load._id)}>
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className='text-center'>
                  No loads found
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
                )} of ${data.pagination.total} loads`
              : "No loads found"}
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
