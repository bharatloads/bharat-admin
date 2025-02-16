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
  Line,
  LineChart,
} from "recharts";
import { IndianRupee, TrendingUp, ArrowUpDown, Percent } from "lucide-react";

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

interface FinancialStatsResponse {
  success: boolean;
  data: {
    dailyStats: Array<{
      _id: string;
      totalAmount: number;
      avgAmount: number;
      transactionCount: number;
    }>;
    paymentStats: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
    revenueStats: {
      currentPeriod: number;
      previousPeriod: number;
      growthRate: number;
    };
    transactionStats: Array<{
      _id: string;
      count: number;
      totalAmount: number;
    }>;
  };
}

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  transactions: {
    label: "Transactions",
    color: "hsl(var(--chart-2))",
  },
  average: {
    label: "Average",
    color: "hsl(var(--chart-3))",
  },
};

export default function FinancialMetricsPage() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState<FinancialStatsResponse["data"] | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<FinancialStatsResponse>(
          `/admin/stats/financial?timeRange=${timeRange}`
        );
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching financial stats:", error);
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
            description: "Failed to fetch financial statistics",
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
  const totalRevenue =
    stats?.dailyStats.reduce((acc, day) => acc + day.totalAmount, 0) || 0;
  const totalTransactions =
    stats?.dailyStats.reduce((acc, day) => acc + day.transactionCount, 0) || 0;
  const avgTransactionValue = totalRevenue / totalTransactions || 0;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>
            Financial Metrics
          </h2>
          <p className='text-muted-foreground'>
            Track revenue and financial health
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
                  Total Revenue
                </CardTitle>
                <IndianRupee className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatCurrency(totalRevenue)}
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
                  Growth Rate
                </CardTitle>
                <TrendingUp className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {stats?.revenueStats.growthRate.toFixed(1)}%
                </div>
                <p className='text-xs text-muted-foreground'>
                  Compared to previous period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Total Transactions
                </CardTitle>
                <ArrowUpDown className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  <NumberTicker value={totalTransactions} direction='up' />
                </div>
                <p className='text-xs text-muted-foreground'>
                  {stats?.dailyStats[stats.dailyStats.length - 1]
                    ?.transactionCount || 0}{" "}
                  today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Avg. Transaction
                </CardTitle>
                <Percent className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {formatCurrency(avgTransactionValue)}
                </div>
                <p className='text-xs text-muted-foreground'>Per transaction</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>Daily revenue and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={stats?.dailyStats}>
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
                    <YAxis yAxisId='left' />
                    <YAxis yAxisId='right' orientation='right' />
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
                                    Revenue
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {formatCurrency(payload[0].value)}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Transactions
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
                    <Line
                      type='monotone'
                      dataKey='totalAmount'
                      name='Revenue'
                      stroke='hsl(var(--chart-1))'
                      yAxisId='left'
                    />
                    <Line
                      type='monotone'
                      dataKey='transactionCount'
                      name='Transactions'
                      stroke='hsl(var(--chart-2))'
                      yAxisId='right'
                    />
                    <Legend />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution by payment type</CardDescription>
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
                      data={stats?.paymentStats.map((type, index) => ({
                        name: type._id,
                        value: type.totalAmount,
                        fill: `hsl(${
                          (index * 360) / stats.paymentStats.length
                        } 70% 50%)`,
                      }))}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      label={(entry) => `${entry.name}`}
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
                                  {formatCurrency(data.value)}
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
            <CardTitle>Transaction Size Distribution</CardTitle>
            <CardDescription>Breakdown by transaction amount</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart data={stats?.transactionStats}>
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
                                  {payload[0].value} transactions
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
                      name='Number of Transactions'
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
            <CardTitle>Revenue Growth</CardTitle>
            <CardDescription>Period over period comparison</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-4 w-[200px]' />
                <Skeleton className='h-8 w-[300px]' />
                <Skeleton className='h-4 w-[150px]' />
                <Skeleton className='h-8 w-[250px]' />
              </div>
            ) : (
              <div className='space-y-8'>
                <div>
                  <p className='text-sm font-medium'>Current Period</p>
                  <p className='text-2xl font-bold'>
                    {formatCurrency(stats?.revenueStats.currentPeriod || 0)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium'>Previous Period</p>
                  <p className='text-2xl font-bold'>
                    {formatCurrency(stats?.revenueStats.previousPeriod || 0)}
                  </p>
                </div>
                <div>
                  <p className='text-sm font-medium'>Growth Rate</p>
                  <p className='text-2xl font-bold'>
                    {stats?.revenueStats.growthRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
