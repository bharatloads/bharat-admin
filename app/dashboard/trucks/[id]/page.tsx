"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Truck,
  User,
  MapPin,
  Package,
  Calendar,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Phone,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bid, GetTruckByIdResponse } from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { EntityLogs } from "@/components/entity-logs";

export default function TruckDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetTruckByIdResponse | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<GetTruckByIdResponse>(
          `/admin/trucks/${params.id}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching truck:", error);
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
            description: "Failed to fetch truck details",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchTruck();
    }
  }, [params.id, toast]);

  const handleVerify = async (status: "APPROVED" | "REJECTED") => {
    try {
      setIsVerifying(true);
      await fetcher(`/admin/trucks/${params.id}/verify`, {
        method: "PUT",
        body: { status },
      });

      // Refresh data
      const data = await fetcher<GetTruckByIdResponse>(
        `/admin/trucks/${params.id}`
      );
      setData(data);

      toast({
        title: "Success",
        description: `Truck ${status.toLowerCase()} successfully`,
      });
    } catch (error) {
      console.error("Error verifying truck:", error);
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
          description: "Failed to verify truck",
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

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

  if (!data?.truck) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Truck not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const { truck } = data;

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
          <h1 className="text-2xl font-bold">Truck Details</h1>
          <Badge
            variant={truck.isRCVerified ? "success" : "destructive"}
            className="ml-2"
          >
            {truck.isRCVerified ? "Verified" : "Unverified"}
          </Badge>
          <Badge
            variant={
              new Date(truck.expiresAt) < new Date() ? "destructive" : "success"
            }
          >
            {new Date(truck.expiresAt) < new Date() ? "Expired" : "Active"}
          </Badge>
        </div>
        {truck.RCVerificationStatus === "PENDING" && (
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => handleVerify("REJECTED")}
              disabled={isVerifying}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              variant="default"
              onClick={() => handleVerify("APPROVED")}
              disabled={isVerifying}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Truck Information */}
        <Card>
          <CardHeader>
            <CardTitle>
              Truck Information{" "}
              <Button variant="ghost" size="icon">
                <Link href={`/dashboard/trucks/${truck._id}/edit`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>Basic details about the truck</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Number:</span>
              {truck.truckNumber}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              {truck.truckLocation.placeName}
              <Link
                href={`https://maps.google.com/?q=${truck.truckLocation.coordinates[0]},${truck.truckLocation.coordinates[1]}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Capacity:</span>
              {truck.truckCapacity} tons
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Vehicle Type:</span>
                <p>{truck.vehicleBodyType}</p>
              </div>
              <div>
                <span className="font-medium">Body Type:</span>
                <p>{truck.truckBodyType}</p>
              </div>
              <div>
                <span className="font-medium">Truck Type:</span>
                <p>{truck.truckType}</p>
              </div>
              <div>
                <span className="font-medium">Tyres:</span>
                <p>{truck.truckTyre}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Registered:</span>
              {format(new Date(truck.createdAt), "PPP")}
            </div>
          </CardContent>
        </Card>

        {/* Owner Information */}
        <Card>
          <CardHeader>
            <CardTitle>Owner Information</CardTitle>
            <CardDescription>Details about the truck owner</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              {truck.truckOwner?.name || "N/A"}
              <Button variant="ghost" size="icon">
                <Link href={`/dashboard/user/${truck.truckOwner?._id}`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            {truck.truckOwner?.mobile && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                {truck.truckOwner.mobile.countryCode}{" "}
                {truck.truckOwner.mobile.phone}
              </div>
            )}
          </CardContent>
        </Card>

        {/* RC Image */}
        <Card>
          <CardHeader>
            <CardTitle>RC Document</CardTitle>
            <CardDescription>Registration certificate image</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative aspect-video w-full cursor-pointer overflow-hidden rounded-lg border">
                  <Image
                    src={truck.RCImage}
                    alt="RC Document"
                    fill
                    className="object-cover"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>RC Document</DialogTitle>
                  <DialogDescription>
                    Registration certificate for {truck.truckNumber}
                  </DialogDescription>
                </DialogHeader>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={truck.RCImage}
                    alt="RC Document"
                    fill
                    className="object-contain"
                  />
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Bid History */}
        <Card>
          <CardHeader>
            <CardTitle>
              Bid History{" "}
              <Button variant="ghost" size="icon">
                <Link href={`/dashboard/trucks/${truck._id}/bids`}>
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </Button>
            </CardTitle>
            <CardDescription>
              Recent bids placed on this truck ({truck.bids.length} total)
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {truck.bids.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No bids placed yet
                    </TableCell>
                  </TableRow>
                ) : (
                  truck.bids.map((bid: Bid) => (
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
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Activity Logs */}
        <Card className="md:col-span-2">
          <EntityLogs entityType="TRUCK" entityId={truck._id} />
        </Card>
      </div>
    </div>
  );
}
