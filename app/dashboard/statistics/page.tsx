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
import { Users, Truck, Package, IndianRupee } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
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

interface StatsResponse {
  success: boolean;
  data: {
    dailyStats: {
      users: Array<{
        _id: string;
        count: number;
        truckers: number;
        transporters: number;
        verified: number;
      }>;
      trucks: Array<{
        _id: string;
        count: number;
        verified: number;
        pending: number;
      }>;
      loads: Array<{
        _id: string;
        count: number;
        active: number;
        totalAmount: number;
        avgAmount: number;
      }>;
      bids: Array<{
        _id: string;
        count: number;
        accepted: number;
        rejected: number;
        totalAmount: number;
        avgAmount: number;
      }>;
    };
    overallStats: {
      users: {
        total: number;
        truckers: number;
        transporters: number;
        verified: number;
      };
      trucks: {
        total: number;
        verified: number;
        pending: number;
      };
      loads: {
        total: number;
        active: number;
        totalAmount: number;
        avgAmount: number;
      };
      bids: {
        total: number;
        accepted: number;
        rejected: number;
        totalAmount: number;
        avgAmount: number;
      };
    };
    distributions: {
      materialTypes: Array<{
        _id: string;
        count: number;
        totalAmount: number;
      }>;
      truckTypes: Array<{
        _id: string;
        count: number;
        verified: number;
      }>;
      popularRoutes: Array<{
        _id: {
          source: string;
          destination: string;
        };
        count: number;
        avgAmount: number;
      }>;
    };
  };
}

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
  truckers: {
    label: "Truckers",
    color: "hsl(var(--chart-2))",
  },
  transporters: {
    label: "Transporters",
    color: "hsl(var(--chart-3))",
  },
  trucks: {
    label: "Trucks",
    color: "hsl(var(--chart-4))",
  },
  loads: {
    label: "Loads",
    color: "hsl(var(--chart-5))",
  },
  bids: {
    label: "Bids",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

export default function StatsPage() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState<StatsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<StatsResponse>(
          `/admin/stats?timeRange=${timeRange}`
        );
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
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
            description: "Failed to fetch statistics",
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

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Statistics & Analytics</h1>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-[120px]" />
                  <Skeleton className="mt-2 h-4 w-[80px]" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker
                    value={stats?.overallStats.users.total || 0}
                    direction="up"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.overallStats.users.verified || 0} verified users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Trucks
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker
                    value={stats?.overallStats.trucks.total || 0}
                    direction="up"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.overallStats.trucks.verified || 0} verified trucks
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Loads
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker
                    value={stats?.overallStats.loads.total || 0}
                    direction="up"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.overallStats.loads.active || 0} active loads
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(stats?.overallStats.loads.totalAmount || 0)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg.{" "}
                  {formatCurrency(stats?.overallStats.loads.avgAmount || 0)} per
                  load
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Growth Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users registered over time</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={stats?.dailyStats.users.map((day) => ({
                      date: day._id,
                      truckers: day.truckers,
                      transporters: day.transporters,
                    }))}
                  >
                    <defs>
                      <linearGradient
                        id="colorTruckers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-2))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTransporters"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-3))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-3))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
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
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Truckers
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Transporters
                                  </span>
                                  <span className="font-bold text-muted-foreground">
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
                      type="monotone"
                      dataKey="truckers"
                      stackId="1"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#colorTruckers)"
                    />
                    <Area
                      type="monotone"
                      dataKey="transporters"
                      stackId="1"
                      stroke="hsl(var(--chart-3))"
                      fill="url(#colorTransporters)"
                    />
                    <Legend />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Load Distribution</CardTitle>
            <CardDescription>Distribution by material type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.distributions.materialTypes.map((type) => ({
                        name: type._id,
                        value: type.count,
                        fill: `hsl(${Math.random() * 360} 70% 50%)`,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => entry.name}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {payload[0].name}
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value} loads
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
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Truck Verification Status</CardTitle>
            <CardDescription>
              Distribution of verified vs pending trucks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      {
                        name: "Verified",
                        value: stats?.overallStats.trucks.verified || 0,
                        fill: "hsl(var(--chart-4))",
                      },
                      {
                        name: "Pending",
                        value: stats?.overallStats.trucks.pending || 0,
                        fill: "hsl(var(--chart-5))",
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {payload[0].name}
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {payload[0].value} trucks
                                </span>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Popular Routes</CardTitle>
            <CardDescription>Most frequently used routes</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="mt-2 h-8 w-[180px]" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {stats?.distributions.popularRoutes
                  .slice(0, 5)
                  .map((route, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {route._id.source} → {route._id.destination}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {route.count} loads
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(route.avgAmount)}
                        </p>
                        <p className="text-sm text-muted-foreground">
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
