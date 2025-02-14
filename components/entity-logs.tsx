"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Activity } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";

interface EntityLog {
  _id: string;
  event: string;
  description: string;
  performedBy: {
    _id: string;
    name: string;
    userType: string;
  };
  changes: Record<string, unknown> | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

interface EntityLogsResponse {
  logs: EntityLog[];
  total: number;
  pages: number;
  currentPage: number;
}

interface EntityLogsProps {
  entityType: "USER" | "TRUCK" | "LOAD_POST" | "BID";
  entityId: string;
}

export function EntityLogs({ entityType, entityId }: EntityLogsProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<EntityLogsResponse | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<EntityLogsResponse>(
          `/admin/entity-logs/${entityType}/${entityId}?page=${page}&limit=10`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
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
            description: "Failed to fetch activity logs",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, [entityType, entityId, page, toast]);

  const getEventBadgeVariant = (event: string) => {
    if (event.includes("CREATED")) return "default";
    if (event.includes("UPDATED")) return "secondary";
    if (event.includes("DELETED")) return "destructive";
    if (event.includes("VERIFIED")) return "success";
    if (event.includes("ACCEPTED")) return "success";
    if (event.includes("REJECTED")) return "destructive";
    return "secondary";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activity Logs
            </CardTitle>
            <CardDescription>Recent activity and changes</CardDescription>
          </div>
          {data && (
            <div className="text-sm text-muted-foreground">
              Showing {data.logs.length} of {data.total} logs
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4">
                <Skeleton className="h-6 w-24" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : data?.logs.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No activity logs found
          </div>
        ) : (
          <div className="space-y-6">
            {data?.logs.map((log) => (
              <div key={log._id} className="flex items-start gap-4">
                <Badge variant={getEventBadgeVariant(log.event)}>
                  {log.event.split("_").join(" ")}
                </Badge>
                <div className="flex-1">
                  <p>{log.description}</p>
                  <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>by {log.performedBy.name}</span>
                    <span>•</span>
                    <span>{format(new Date(log.createdAt), "PPp")}</span>
                  </div>
                  {log.changes && (
                    <pre className="mt-2 rounded-lg bg-muted p-2 text-xs">
                      {JSON.stringify(log.changes, null, 2)}
                    </pre>
                  )}
                </div>
              </div>
            ))}

            {/* Pagination */}
            {data && data.pages > 1 && (
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page === data.pages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
