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
  Truck,
  XCircle,
  MessageSquare,
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
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
interface GetBidByIdResponse {
  success: boolean;
  bid: {
    _id: string;
    bidType: "LOAD_BID" | "TRUCK_REQUEST";
    bidBy: {
      _id: string;
      name: string;
      mobile: {
        countryCode: string;
        phone: string;
      };
      companyName?: string;
    };
    rejectionReason?: string;
    rejectionNote?: string;
    offeredTo: {
      _id: string;
      name: string;
      mobile: {
        countryCode: string;
        phone: string;
      };
      companyName?: string;
    };
    loadId: {
      materialType: string;
      source: {
        placeName: string;
        coordinates: [number, number];
      };
      destination: {
        placeName: string;
        coordinates: [number, number];
      };
      offeredAmount: {
        total: number;
        advanceAmount: number;
        dieselAmount: number;
      };
      weight: number;
      vehicleBodyType: string;
      vehicleType: string;
      numberOfWheels: number;
      whenNeeded: "IMMEDIATE" | "SCHEDULED";
      scheduleDate?: string;
    };
    truckId: {
      truckNumber: string;
      truckLocation: {
        placeName: string;
        coordinates: [number, number];
      };
      truckType: string;
      truckCapacity: number;
      vehicleBodyType: string;
      truckBodyType: string;
      truckTyre: number;
    };
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    biddedAmount: {
      total: number;
      advanceAmount: number;
      dieselAmount: number;
    };
    createdAt: string;
  };
}

export default function BidDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<GetBidByIdResponse | null>(null);

  useEffect(() => {
    const fetchBid = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<GetBidByIdResponse>(
          `/admin/bids/${params.id}`
        );
        setData(data);
      } catch (error) {
        console.error("Error fetching bid:", error);
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
            description: "Failed to fetch bid details",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchBid();
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

  if (!data?.bid) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl font-bold">Bid not found</h1>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  const { bid } = data;

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
          <h1 className="text-2xl font-bold">Bid Details</h1>
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
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Bid Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bid Information</CardTitle>
            <CardDescription>Basic details about the bid</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Bid Type:</span>
              {bid.bidType === "LOAD_BID" ? "Load Bid" : "Truck Request"}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Total Amount:</span>
                <p>₹{bid.biddedAmount.total}</p>
              </div>
              <div>
                <span className="font-medium">Advance Amount:</span>
                <p>₹{bid.biddedAmount.advanceAmount}</p>
              </div>
              <div>
                <span className="font-medium">Diesel Amount:</span>
                <p>₹{bid.biddedAmount.dieselAmount}</p>
              </div>
            </div>
            {bid.status === "REJECTED" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Rejection Reason:</span>
                  <p>
                    {bid.rejectionReason
                      ?.replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </p>
                </div>
                {bid.rejectionNote && (
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Rejection Note:</span>
                    <p>{bid.rejectionNote}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              {format(new Date(bid.createdAt), "PPP")}
            </div>
          </CardContent>
        </Card>

        {/* Bidder Information */}
        <Card>
          <CardHeader>
            <CardTitle>Bidder Information</CardTitle>
            <CardDescription>Details about who placed the bid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Name:</span>
              {bid.bidBy.name}
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Phone:</span>
              {bid.bidBy.mobile.countryCode} {bid.bidBy.mobile.phone}
            </div>
            {bid.bidBy.companyName && (
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Company:</span>
                {bid.bidBy.companyName}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Load Information */}
        <Card>
          <CardHeader>
            <CardTitle>Load Information</CardTitle>
            <CardDescription>Details about the load</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Material Type:</span>
              {bid.loadId.materialType}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Source:</span>
              {bid.loadId.source.placeName}
              <Link
                href={`https://maps.google.com/?q=${bid.loadId.source.coordinates[0]},${bid.loadId.source.coordinates[1]}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Destination:</span>
              {bid.loadId.destination.placeName}
              <Link
                href={`https://maps.google.com/?q=${bid.loadId.destination.coordinates[0]},${bid.loadId.destination.coordinates[1]}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Weight:</span>
                <p>{bid.loadId.weight} tons</p>
              </div>
              <div>
                <span className="font-medium">Vehicle Type:</span>
                <p>{bid.loadId.vehicleType}</p>
              </div>
              <div>
                <span className="font-medium">Body Type:</span>
                <p>{bid.loadId.vehicleBodyType}</p>
              </div>
              <div>
                <span className="font-medium">Wheels:</span>
                <p>{bid.loadId.numberOfWheels}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">When Needed:</span>
                <p>{bid.loadId.whenNeeded}</p>
              </div>
              {bid.loadId.scheduleDate && (
                <div>
                  <span className="font-medium">Schedule Date:</span>
                  <p>{format(new Date(bid.loadId.scheduleDate), "PPP")}</p>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Original Amount:</span>
                <p>₹{bid.loadId.offeredAmount.total}</p>
              </div>
              <div>
                <span className="font-medium">Advance:</span>
                <p>₹{bid.loadId.offeredAmount.advanceAmount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Truck Information */}
        <Card>
          <CardHeader>
            <CardTitle>Truck Information</CardTitle>
            <CardDescription>Details about the truck</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Number:</span>
              {bid.truckId.truckNumber}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Location:</span>
              {bid.truckId.truckLocation.placeName}
              <Link
                href={`https://maps.google.com/?q=${bid.truckId.truckLocation.coordinates[1]},${bid.truckId.truckLocation.coordinates[0]}`}
                target="_blank"
              >
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Capacity:</span>
                <p>{bid.truckId.truckCapacity} tons</p>
              </div>
              <div>
                <span className="font-medium">Type:</span>
                <p>{bid.truckId.truckType}</p>
              </div>
              <div>
                <span className="font-medium">Body Type:</span>
                <p>{bid.truckId.truckBodyType}</p>
              </div>
              <div>
                <span className="font-medium">Tyres:</span>
                <p>{bid.truckId.truckTyre}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
