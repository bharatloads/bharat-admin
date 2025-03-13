"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Package,
  User,
  MapPin,
  Building,
  Phone,
  Calendar,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Bid, GetLoadByIdResponse } from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { convertToTitleCase } from "@/lib/utils";
import { EntityLogs } from "@/components/entity-logs";
export default function LoadDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetLoadByIdResponse | null>(null);

  useEffect(() => {
    const fetchLoad = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<GetLoadByIdResponse>(
          `/admin/loads/${params.id}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching load:", error);
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
            description: "Failed to fetch load details",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchLoad();
    }
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[200px]" />
          <Skeleton className="h-[200px]" />
        </div>
      </div>
    );
  }

  if (!data?.load) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Load not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const { load } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Load Details</h1>
          <Badge
            variant={
              new Date(load.expiresAt) < new Date() ? "destructive" : "success"
            }
          >
            {new Date(load.expiresAt) < new Date() ? "Expired" : "Active"}
          </Badge>
        </div>
        {/* add edit button here that redirects to /dashboard/loads/[id]/edit */}
        <Button variant="ghost" className="border border-gray-300 text-primary">
          <Link href={`/dashboard/loads/${load._id}/edit`}>Edit</Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Load Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Load Information{" "}
              <Button variant="ghost" size="icon">
                <Link href={`/dashboard/loads/${load._id}/edit`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>Basic details about the load</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Material Type:</span>
              {load.materialType}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Source:</span>
              {load.source.placeName}
              <Button variant="ghost" size="icon">
                <Link
                  href={`https://maps.google.com/?q=${load.source.coordinates[0]},${load.source.coordinates[1]}`}
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Destination:</span>
              {load.destination.placeName}
              <Button variant="ghost" size="icon">
                <Link
                  href={`https://maps.google.com/?q=${load.destination.coordinates[0]},${load.destination.coordinates[1]}`}
                  target="_blank"
                >
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Total Amount:</span>
                <p>₹{load.offeredAmount.total}</p>
              </div>
              <div>
                <span className="font-medium">Advance Amount:</span>
                <p>₹{load.offeredAmount.advanceAmount}</p>
              </div>
              <div>
                <span className="font-medium">Diesel Amount:</span>
                <p>₹{load.offeredAmount.dieselAmount}</p>
              </div>
              <div>
                <span className="font-medium">Total Bids:</span>
                <p>{load.bids.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Posted:</span>
              {load.createdAt ? format(new Date(load.createdAt), "PPP") : "N/A"}
            </div>
          </CardContent>
        </Card>

        {/* Transporter Information */}
        <Card>
          <CardHeader>
            <CardTitle>Transporter Information</CardTitle>
            <CardDescription>Details about the transporter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              {load.transporterId.name}
              <Button variant="ghost" size="icon">
                <Link href={`/dashboard/user/${load.transporterId._id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              {load.transporterId.mobile.countryCode}{" "}
              {load.transporterId.mobile.phone}
            </div>
            {load.transporterId.companyName && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Company:</span>
                {load.transporterId.companyName}
              </div>
            )}
            {load.transporterId.companyLocation && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Company Location:</span>
                {load.transporterId.companyLocation}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bid History */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Bid History</CardTitle>
            <CardDescription>
              Recent bids placed on this load ({load.bids.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Bidder</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {load.bids.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No bids placed yet
                    </TableCell>
                  </TableRow>
                ) : (
                  load.bids.map((bid: Bid) => (
                    <TableRow key={bid._id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{bid.bidBy.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {bid.bidBy.companyName}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>₹{bid.biddedAmount.total}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            bid.status === "ACCEPTED"
                              ? "success"
                              : bid.status === "REJECTED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {bid.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(bid.createdAt), "PP")}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="">
                              {bid.rejectionReason
                                ? convertToTitleCase(bid.rejectionReason)
                                : "N/A"}
                            </span>
                          </TooltipTrigger>
                          {bid.rejectionNote && (
                            <TooltipContent>
                              {convertToTitleCase(bid.rejectionNote)}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon">
                          <Link href={`/dashboard/bids/${bid._id}`}>
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        {/* Activity Logs */}
        <Card className="md:col-span-2">
          <EntityLogs entityType="LOAD_POST" entityId={load._id} />
        </Card>
      </div>
    </div>
  );
}
