"use client";

import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Pie,
  PieChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Package, IndianRupee, Route, Truck } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NumberTicker } from "@/components/ui/number-ticker";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface LoadStatsResponse {
  success: boolean;
  data: {
    dailyStats: Array<{
      _id: string;
      count: number;
      active: number;
      totalAmount: number;
    }>;
    materialStats: Array<{
      _id: string;
      count: number;
      avgAmount: number;
      totalAmount: number;
    }>;
    routeStats: Array<{
      _id: {
        source: string;
        destination: string;
      };
      count: number;
      avgAmount: number;
    }>;
    priceStats: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
  };
}

const chartConfig = {
  loads: {
    label: "Total Loads",
    color: "hsl(var(--chart-1))",
  },
  active: {
    label: "Active Loads",
    color: "hsl(var(--chart-2))",
  },
  amount: {
    label: "Amount",
    color: "hsl(var(--chart-3))",
  },
};

export default function LoadMetricsPage() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState<LoadStatsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<LoadStatsResponse>(
          `/admin/stats/loads?timeRange=${timeRange}`
        );
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching load stats:", error);
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
            description: "Failed to fetch load statistics",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeRange, toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate totals
  const totalLoads =
    stats?.dailyStats.reduce((acc, day) => acc + day.count, 0) || 0;
  const totalAmount =
    stats?.dailyStats.reduce((acc, day) => acc + day.totalAmount, 0) || 0;
  const avgAmount = totalAmount / totalLoads || 0;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Load Metrics</h2>
          <p className='text-muted-foreground'>
            Track load performance and transactions
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className='w-[160px]'>
            <SelectValue placeholder='Select time range' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='7d'>Last 7 days</SelectItem>
            <SelectItem value='30d'>Last 30 days</SelectItem>
            <SelectItem value='90d'>Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className='grid gap-6 md:grid-cols-4'>
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className='flex flex-row items-center justify-between pb-2'>
                  <Skeleton className='h-4 w-[100px]' />
                  <Skeleton className='h-4 w-4' />
                </CardHeader>
                <CardContent>
                  <Skeleton className='h-8 w-[120px]' />
                  <Skeleton className='mt-2 h-4 w-[80px]' />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Loads
                </CardTitle>
                <Package className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  <NumberTicker value={totalLoads} direction='up' />
                </div>
                <p className='text-xs text-muted-foreground'>
                  {stats?.dailyStats[stats.dailyStats.length - 1]?.count || 0}{" "}
                  new today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Active Loads
                </CardTitle>
                <Truck className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  <NumberTicker
                    value={
                      stats?.dailyStats[stats.dailyStats.length - 1]?.active ||
                      0
                    }
                    direction='up'
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Currently active loads
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Revenue
                </CardTitle>
                <IndianRupee className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatCurrency(totalAmount)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  In the last{" "}
                  {timeRange === "7d" ? "7" : timeRange === "30d" ? "30" : "90"}{" "}
                  days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Average Load Value
                </CardTitle>
                <Route className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatCurrency(avgAmount)}
                </div>
                <p className='text-xs text-muted-foreground'>
                  Per load average
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Load Trends</CardTitle>
            <CardDescription>Daily load postings and activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={stats?.dailyStats}>
                    <defs>
                      <linearGradient
                        id='colorLoads'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'>
                        <stop
                          offset='5%'
                          stopColor='hsl(var(--chart-1))'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='hsl(var(--chart-1))'
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id='colorActive'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'>
                        <stop
                          offset='5%'
                          stopColor='hsl(var(--chart-2))'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='hsl(var(--chart-2))'
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='_id'
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                    />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const date = new Date(label);
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <p className='text-[0.70rem] uppercase text-muted-foreground'>
                                {date.toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Total Loads
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Active Loads
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[1].value}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Area
                      type='monotone'
                      dataKey='count'
                      name='Total Loads'
                      stroke='hsl(var(--chart-1))'
                      fill='url(#colorLoads)'
                    />
                    <Area
                      type='monotone'
                      dataKey='active'
                      name='Active Loads'
                      stroke='hsl(var(--chart-2))'
                      fill='url(#colorActive)'
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Material Type Distribution</CardTitle>
            <CardDescription>Loads by material type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={stats?.materialStats.map((type, index) => ({
                        name: type._id,
                        value: type.count,
                        fill: `hsl(${
                          (index * 360) / stats.materialStats.length
                        } 70% 50%)`,
                      }))}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      label={(entry) => `${entry.name} (${entry.value})`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <div className='flex flex-col'>
                                <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                  {data.name}
                                </span>
                                <span className='font-bold text-muted-foreground'>
                                  {data.value} loads
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
            <CardDescription>Load value ranges</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={stats?.priceStats}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='_id' />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <div className='flex flex-col'>
                                <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                  {label}
                                </span>
                                <span className='font-bold text-muted-foreground'>
                                  {payload[0].value} loads
                                </span>
                                <span className='text-[0.70rem] text-muted-foreground'>
                                  Total:{" "}
                                  {formatCurrency(
                                    payload[0].payload.totalAmount
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey='count'
                      fill='hsl(var(--chart-3))'
                      name='Number of Loads'
                    />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Routes</CardTitle>
            <CardDescription>
              Most frequent source-destination pairs
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-4'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className='flex justify-between'>
                    <Skeleton className='h-4 w-[200px]' />
                    <Skeleton className='h-4 w-[100px]' />
                  </div>
                ))}
              </div>
            ) : (
              <div className='space-y-4'>
                {stats?.routeStats.slice(0, 5).map((route, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between'>
                    <div>
                      <p className='text-sm font-medium'>
                        {route._id.source} → {route._id.destination}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {route.count} loads
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-medium'>
                        {formatCurrency(route.avgAmount)}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        Avg. amount
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
