"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, GetUserByIdResponse } from "@/types/api";
import { fetcher, ApiError } from "@/lib/fetcher";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  CalendarDays,
  Coins,
  MapPin,
  Phone,
  User as UserIcon,
} from "lucide-react";
import { EntityLogs } from "@/components/entity-logs";

export default function UserDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<GetUserByIdResponse>(`/admin/users/${id}`);
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
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
            description: "Failed to fetch user details",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchUser();
    }
  }, [id, toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <p className="text-lg text-muted-foreground">User not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">User Details</CardTitle>
            <Badge
              variant={user.isVerified ? "default" : "destructive"}
              className="px-4 py-1"
            >
              {user.isVerified ? "Verified" : "Unverified"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <UserIcon className="h-4 w-4" />
              <span>Basic Information</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground">Name</div>
                <div className="font-medium">{user.name}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">User Type</div>
                <div className="font-medium">{user.userType}</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <span>Contact Information</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground">Phone</div>
                <div className="font-medium">
                  {user.mobile.countryCode} {user.mobile.phone}
                </div>
              </div>
              {user.companyName && (
                <div>
                  <div className="text-sm text-muted-foreground">Company</div>
                  <div className="font-medium">{user.companyName}</div>
                </div>
              )}
            </div>
          </div>

          {/* Location Info */}
          {user.companyLocation && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Location</span>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Company Location
                </div>
                <div className="font-medium">{user.companyLocation}</div>
              </div>
            </div>
          )}

          {/* Account Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Account Information</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm text-muted-foreground">
                  Member Since
                </div>
                <div className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">BL Coins</div>
                  <Coins className="h-4 w-4 text-yellow-500" />
                </div>
                <div className="font-medium">{user.BlCoins}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs */}
      <EntityLogs entityType="USER" entityId={user._id} />
    </div>
  );
}
