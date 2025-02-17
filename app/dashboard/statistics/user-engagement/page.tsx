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
import { Users, UserCheck, UserCog, Activity } from "lucide-react";

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

interface UserStatsResponse {
  success: boolean;
  data: {
    dailyStats: Array<{
      _id: string;
      total: number;
      truckers: number;
      transporters: number;
    }>;
    userTypes: Array<{
      _id: string;
      count: number;
      verified: number;
    }>;
    verificationStats: Array<{
      _id: boolean;
      count: number;
      truckers: number;
      transporters: number;
    }>;
    activityStats: Array<{
      _id: string;
      count: number;
      truckers: number;
      transporters: number;
    }>;
    actionStats: Array<{
      action: string;
      count: number;
      uniqueUsers: number;
    }>;
    authStats: Array<{
      _id: string;
      uniqueUsers: string[];
      totalVerifications: number;
      truckers: number;
      transporters: number;
    }>;
    searchStats: Array<{
      _id: string;
      searches: Array<{
        action: string;
        count: number;
        uniqueUsers: number;
        truckers: number;
        transporters: number;
      }>;
    }>;
  };
}

// const chartConfig = {
//   users: {
//     label: "Total Users",
//     color: "hsl(var(--chart-1))",
//   },
//   truckers: {
//     label: "Truckers",
//     color: "hsl(var(--chart-2))",
//   },
//   transporters: {
//     label: "Transporters",
//     color: "hsl(var(--chart-3))",
//   },
//   verified: {
//     label: "Verified",
//     color: "hsl(var(--chart-4))",
//   },
//   unverified: {
//     label: "Unverified",
//     color: "hsl(var(--chart-5))",
//   },
// };

export default function UserEngagementPage() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState<UserStatsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<UserStatsResponse>(
          `/admin/stats/users?timeRange=${timeRange}`
        );
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching user stats:", error);
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
            description: "Failed to fetch user statistics",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeRange, toast]);

  // Calculate total users and verified users
  const totalUsers =
    stats?.userTypes.reduce((acc, type) => acc + type.count, 0) || 0;
  const verifiedUsers =
    stats?.userTypes.reduce((acc, type) => acc + type.verified, 0) || 0;

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>User Engagement</h2>
          <p className='text-muted-foreground'>
            Analyze user behavior and interactions
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
      <div className='grid gap-6 md:grid-cols-3'>
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
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
                  Total Users
                </CardTitle>
                <Users className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  <NumberTicker value={totalUsers} direction='up' />
                </div>
                <p className='text-xs text-muted-foreground'>
                  {stats?.dailyStats[stats.dailyStats.length - 1]?.total || 0}{" "}
                  new today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Verified Users
                </CardTitle>
                <UserCheck className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  <NumberTicker value={verifiedUsers} direction='up' />
                </div>
                <p className='text-xs text-muted-foreground'>
                  {((verifiedUsers / totalUsers) * 100).toFixed(1)}% of total
                  users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Active Users
                </CardTitle>
                <UserCog className='h-4 w-4 text-muted-foreground' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  <NumberTicker
                    value={
                      stats?.activityStats.find(
                        (stat) => stat._id === "LAST_7_DAYS"
                      )?.count || 0
                    }
                    direction='up'
                  />
                </div>
                <p className='text-xs text-muted-foreground'>
                  Active in last 7 days
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
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Daily user registrations</CardDescription>
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
                        id='colorTruckers'
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
                      <linearGradient
                        id='colorTransporters'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'>
                        <stop
                          offset='5%'
                          stopColor='hsl(var(--chart-3))'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='hsl(var(--chart-3))'
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
                                    Truckers
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Transporters
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
                      dataKey='truckers'
                      stackId='1'
                      stroke='hsl(var(--chart-2))'
                      fill='url(#colorTruckers)'
                    />
                    <Area
                      type='monotone'
                      dataKey='transporters'
                      stackId='1'
                      stroke='hsl(var(--chart-3))'
                      fill='url(#colorTransporters)'
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
            <CardTitle>User Type Distribution</CardTitle>
            <CardDescription>Breakdown by user type</CardDescription>
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
                      data={stats?.userTypes.map((type) => ({
                        name: type._id,
                        value: type.count,
                        fill:
                          type._id === "TRUCKER"
                            ? "hsl(var(--chart-2))"
                            : "hsl(var(--chart-3))",
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
                                  {data.value} users
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
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>User verification breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={stats?.verificationStats.map((stat) => ({
                      name: stat._id ? "Verified" : "Unverified",
                      truckers: stat.truckers,
                      transporters: stat.transporters,
                    }))}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <p className='text-[0.70rem] uppercase text-muted-foreground'>
                                {label}
                              </p>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Truckers
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Transporters
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
                    <Bar
                      dataKey='truckers'
                      name='Truckers'
                      fill='hsl(var(--chart-2))'
                    />
                    <Bar
                      dataKey='transporters'
                      name='Transporters'
                      fill='hsl(var(--chart-3))'
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
            <CardTitle>User Activity Distribution</CardTitle>
            <CardDescription>Activity breakdown by type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={stats?.actionStats.map((stat) => ({
                      name: stat.action
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" "),
                      total: stat.count,
                      uniqueUsers: stat.uniqueUsers,
                    }))}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <p className='text-[0.70rem] uppercase text-muted-foreground'>
                                {label}
                              </p>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Total Actions
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Unique Users
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
                    <Bar
                      dataKey='total'
                      name='Total Actions'
                      fill='hsl(var(--chart-4))'
                    />
                    <Bar
                      dataKey='uniqueUsers'
                      name='Unique Users'
                      fill='hsl(var(--chart-5))'
                    />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Active Users by Type</CardTitle>
            <CardDescription>
              User type distribution in active users
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={stats?.activityStats.map((stat) => ({
                      name:
                        stat._id === "LAST_7_DAYS"
                          ? "Last 7 Days"
                          : stat._id === "LAST_30_DAYS"
                          ? "Last 30 Days"
                          : "Inactive",
                      truckers: stat.truckers,
                      transporters: stat.transporters,
                    }))}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className='rounded-lg border bg-background p-2 shadow-sm'>
                              <p className='text-[0.70rem] uppercase text-muted-foreground'>
                                {label}
                              </p>
                              <div className='grid grid-cols-2 gap-2'>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Truckers
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Transporters
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
                    <Bar
                      dataKey='truckers'
                      name='Truckers'
                      fill='hsl(var(--chart-2))'
                    />
                    <Bar
                      dataKey='transporters'
                      name='Transporters'
                      fill='hsl(var(--chart-3))'
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
            <CardTitle>User Activity</CardTitle>
            <CardDescription>Active users by time period</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={stats?.activityStats.map((stat) => ({
                      name:
                        stat._id === "LAST_7_DAYS"
                          ? "Last 7 Days"
                          : stat._id === "LAST_30_DAYS"
                          ? "Last 30 Days"
                          : "Inactive",
                      value: stat.count,
                      fill:
                        stat._id === "LAST_7_DAYS"
                          ? "hsl(var(--chart-4))"
                          : stat._id === "LAST_30_DAYS"
                          ? "hsl(var(--chart-5))"
                          : "hsl(var(--chart-6))",
                    }))}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='name' />
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
                                  {payload[0].value} users
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey='value' />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add new section for Auth Verification Stats */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>App Usage</CardTitle>
            <CardDescription>Daily app opens by user type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={stats?.authStats.map((stat) => ({
                      date: stat._id,
                      uniqueUsers: stat.uniqueUsers.length,
                      totalVerifications: stat.totalVerifications,
                      truckers: stat.truckers,
                      transporters: stat.transporters,
                    }))}>
                    <defs>
                      <linearGradient
                        id='colorAuth'
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
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
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
                                    Unique Users
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Total App Opens
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[1].value}
                                  </span>
                                </div>
                              </div>
                              <div className='mt-2 grid grid-cols-2 gap-2'>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Truckers
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[2].value}
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Transporters
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[3].value}
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
                      dataKey='uniqueUsers'
                      name='Unique Users'
                      stroke='hsl(var(--chart-1))'
                      fill='url(#colorAuth)'
                    />
                    <Area
                      type='monotone'
                      dataKey='totalVerifications'
                      name='Total App Opens'
                      stroke='hsl(var(--chart-2))'
                      fill='url(#colorAuth)'
                    />
                    <Area
                      type='monotone'
                      dataKey='truckers'
                      name='Truckers'
                      stroke='hsl(var(--chart-3))'
                      fill='url(#colorAuth)'
                    />
                    <Area
                      type='monotone'
                      dataKey='transporters'
                      name='Transporters'
                      stroke='hsl(var(--chart-4))'
                      fill='url(#colorAuth)'
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
            <CardTitle>App Usage Overview</CardTitle>
            <CardDescription>Summary of app usage metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-20 w-full' />
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Average Daily Active Users
                    </p>
                    <p className='text-2xl font-bold'>
                      {Math.round(
                        (stats?.authStats || []).reduce(
                          (acc, stat) => acc + stat.uniqueUsers.length,
                          0
                        ) / (stats?.authStats?.length || 1)
                      )}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Average App Opens per User
                    </p>
                    <p className='text-2xl font-bold'>
                      {(
                        (stats?.authStats.reduce(
                          (acc, stat) => acc + stat.totalVerifications,
                          0
                        ) || 0) /
                        (stats?.authStats.reduce(
                          (acc, stat) => acc + stat.uniqueUsers.length,
                          0
                        ) || 1)
                      ).toFixed(1)}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Most Active Day
                    </p>
                    <p className='text-2xl font-bold'>
                      {stats?.authStats?.length
                        ? new Date(
                            stats?.authStats.reduce((max, stat) =>
                              stat.totalVerifications > max.totalVerifications
                                ? stat
                                : max
                            )?._id ?? ""
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Total App Opens
                    </p>
                    <p className='text-2xl font-bold'>
                      {stats?.authStats.reduce(
                        (acc, stat) => acc + stat.totalVerifications,
                        0
                      ) || 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Search Stats Section */}
      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Search Activity</CardTitle>
            <CardDescription>Daily search patterns by type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='h-[300px]'>
                <Skeleton className='h-full w-full' />
              </div>
            ) : (
              <div className='h-[300px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart
                    data={stats?.searchStats.map((stat) => {
                      const loadSearches = stat.searches.find(
                        (s) => s.action === "LOAD_SEARCHED"
                      ) || {
                        count: 0,
                        uniqueUsers: 0,
                        truckers: 0,
                        transporters: 0,
                      };
                      const truckSearches = stat.searches.find(
                        (s) => s.action === "TRUCK_SEARCHED"
                      ) || {
                        count: 0,
                        uniqueUsers: 0,
                        truckers: 0,
                        transporters: 0,
                      };
                      return {
                        date: stat._id,
                        loadSearches: loadSearches.count,
                        loadSearchUsers: loadSearches.uniqueUsers,
                        truckSearches: truckSearches.count,
                        truckSearchUsers: truckSearches.uniqueUsers,
                      };
                    })}>
                    <defs>
                      <linearGradient
                        id='colorSearches'
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
                    </defs>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='date'
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
                                    Load Searches
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[0].value}
                                  </span>
                                  <span className='text-[0.70rem] text-muted-foreground'>
                                    ({payload[1].value} users)
                                  </span>
                                </div>
                                <div className='flex flex-col'>
                                  <span className='text-[0.70rem] uppercase text-muted-foreground'>
                                    Truck Searches
                                  </span>
                                  <span className='font-bold text-muted-foreground'>
                                    {payload[2].value}
                                  </span>
                                  <span className='text-[0.70rem] text-muted-foreground'>
                                    ({payload[3].value} users)
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
                      dataKey='loadSearches'
                      name='Load Searches'
                      stroke='hsl(var(--chart-1))'
                      fill='url(#colorSearches)'
                    />
                    <Area
                      type='monotone'
                      dataKey='loadSearchUsers'
                      name='Load Search Users'
                      stroke='hsl(var(--chart-2))'
                      fill='url(#colorSearches)'
                    />
                    <Area
                      type='monotone'
                      dataKey='truckSearches'
                      name='Truck Searches'
                      stroke='hsl(var(--chart-3))'
                      fill='url(#colorSearches)'
                    />
                    <Area
                      type='monotone'
                      dataKey='truckSearchUsers'
                      name='Truck Search Users'
                      stroke='hsl(var(--chart-4))'
                      fill='url(#colorSearches)'
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
            <CardTitle>Search Overview</CardTitle>
            <CardDescription>Summary of search activity</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className='space-y-4'>
                <Skeleton className='h-20 w-full' />
                <Skeleton className='h-20 w-full' />
              </div>
            ) : (
              <div className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Total Load Searches
                    </p>
                    <p className='text-2xl font-bold'>
                      {stats?.searchStats.reduce(
                        (acc, stat) =>
                          acc +
                          (stat.searches.find(
                            (s) => s.action === "LOAD_SEARCHED"
                          )?.count || 0),
                        0
                      )}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Total Truck Searches
                    </p>
                    <p className='text-2xl font-bold'>
                      {stats?.searchStats.reduce(
                        (acc, stat) =>
                          acc +
                          (stat.searches.find(
                            (s) => s.action === "TRUCK_SEARCHED"
                          )?.count || 0),
                        0
                      )}
                    </p>
                  </div>
                </div>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Most Active Search Day
                    </p>
                    <p className='text-2xl font-bold'>
                      {stats?.searchStats.length
                        ? new Date(
                            stats.searchStats.reduce(
                              (max, stat) => {
                                const totalSearches = stat.searches.reduce(
                                  (acc, s) => acc + s.count,
                                  0
                                );
                                return totalSearches > max.total
                                  ? { date: stat._id, total: totalSearches }
                                  : max;
                              },
                              { date: "", total: 0 }
                            ).date
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>
                  <div className='space-y-2'>
                    <p className='text-sm text-muted-foreground'>
                      Average Searches per Day
                    </p>
                    <p className='text-2xl font-bold'>
                      {stats?.searchStats.length
                        ? Math.round(
                            stats.searchStats.reduce(
                              (acc, stat) =>
                                acc +
                                stat.searches.reduce(
                                  (sum, s) => sum + s.count,
                                  0
                                ),
                              0
                            ) / stats.searchStats.length
                          )
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
