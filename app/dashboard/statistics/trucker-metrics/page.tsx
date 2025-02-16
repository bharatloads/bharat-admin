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
import { Truck, CheckCircle, AlertCircle } from "lucide-react";

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

interface TruckStatsResponse {
  success: boolean;
  data: {
    dailyStats: Array<{
      _id: string;
      count: number;
      verified: number;
    }>;
    truckTypeStats: Array<{
      _id: string;
      count: number;
      verified: number;
    }>;
    verificationStats: Array<{
      _id: string;
      count: number;
    }>;
    capacityStats: Array<{
      _id: string;
      count: number;
    }>;
  };
}

// const chartConfig = {
//   trucks: {
//     label: "Total Trucks",
//     color: "hsl(var(--chart-1))",
//   },
//   verified: {
//     label: "Verified",
//     color: "hsl(var(--chart-2))",
//   },
//   pending: {
//     label: "Pending",
//     color: "hsl(var(--chart-3))",
//   },
//   rejected: {
//     label: "Rejected",
//     color: "hsl(var(--chart-4))",
//   },
// };

export default function TruckerMetricsPage() {
  const { toast } = useToast();
  const [timeRange, setTimeRange] = useState("30d");
  const [stats, setStats] = useState<TruckStatsResponse["data"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<TruckStatsResponse>(
          `/admin/stats/trucks?timeRange=${timeRange}`
        );
        setStats(data.data);
      } catch (error) {
        console.error("Error fetching truck stats:", error);
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
            description: "Failed to fetch truck statistics",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [timeRange, toast]);

  // Calculate totals
  const totalTrucks =
    stats?.dailyStats.reduce((acc, day) => acc + day.count, 0) || 0;
  const totalVerified =
    stats?.dailyStats.reduce((acc, day) => acc + day.verified, 0) || 0;
  const verificationRate = ((totalVerified / totalTrucks) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Truck Metrics</h2>
          <p className="text-muted-foreground">
            Monitor transport partner performance
          </p>
        </div>
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
      <div className="grid gap-6 md:grid-cols-3">
        {isLoading ? (
          <>
            {[1, 2, 3].map((i) => (
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
                  Total Trucks
                </CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker value={totalTrucks} direction="up" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.dailyStats[stats.dailyStats.length - 1]?.count || 0}{" "}
                  new today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Verified Trucks
                </CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker value={totalVerified} direction="up" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {verificationRate}% verification rate
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Verification
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <NumberTicker
                    value={
                      stats?.verificationStats.find(
                        (stat) => stat._id === "PENDING"
                      )?.count || 0
                    }
                    direction="up"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting verification
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Truck Registration Trends</CardTitle>
            <CardDescription>Daily truck registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={stats?.dailyStats}>
                    <defs>
                      <linearGradient
                        id="colorTrucks"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--chart-1))"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorVerified"
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
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="_id"
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
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <p className="text-[0.70rem] uppercase text-muted-foreground">
                                {date.toLocaleDateString("en-US", {
                                  month: "long",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Total
                                  </span>
                                  <span className="font-bold text-muted-foreground">
                                    {payload[0].value}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[0.70rem] uppercase text-muted-foreground">
                                    Verified
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
                      dataKey="count"
                      name="Total Trucks"
                      stroke="hsl(var(--chart-1))"
                      fill="url(#colorTrucks)"
                    />
                    <Area
                      type="monotone"
                      dataKey="verified"
                      name="Verified Trucks"
                      stroke="hsl(var(--chart-2))"
                      fill="url(#colorVerified)"
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
            <CardTitle>Truck Type Distribution</CardTitle>
            <CardDescription>Breakdown by truck type</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats?.truckTypeStats.map((type, index) => ({
                        name: type._id,
                        value: type.count,
                        fill: `hsl(${
                          (index * 360) / stats.truckTypeStats.length
                        } 70% 50%)`,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name} (${entry.value})`}
                    />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {data.name}
                                </span>
                                <span className="font-bold text-muted-foreground">
                                  {data.value} trucks
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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Current verification status</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats?.verificationStats}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {label}
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
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-3))"
                      name="Number of Trucks"
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
            <CardTitle>Capacity Distribution</CardTitle>
            <CardDescription>Trucks by capacity range</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px]">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={stats?.capacityStats}
                    layout="vertical"
                    margin={{ left: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="_id" type="category" />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {label}
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
                    <Bar
                      dataKey="count"
                      fill="hsl(var(--chart-4))"
                      name="Number of Trucks"
                    />
                    <Legend />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
