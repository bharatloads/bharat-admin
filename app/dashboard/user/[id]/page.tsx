"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User, GetUserByIdResponse, Truck, Load } from "@/types/api";
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
  CheckCircle,
  XCircle,
  Truck as TruckIcon,
  Package,
} from "lucide-react";
import { EntityLogs } from "@/components/entity-logs";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function UserDetailsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [loads, setLoads] = useState<Load[]>([]);
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const data = await fetcher<GetUserByIdResponse>(`/admin/users/${id}`);
      setUser(data.user);
      setUserDetails(data.user);
      if (data.user) {
        if (data.user.userType === "TRUCKER") {
          const truckData = (await fetcher(`/admin/trucks/user/${id}`)) as {
            trucks: Truck[];
          };
          setTrucks(truckData.trucks);
        } else if (data.user.userType === "TRANSPORTER") {
          const loadData = (await fetcher(`/admin/loads/user/${id}`)) as {
            loads: Load[];
          };
          setLoads(loadData.loads);
        }
      }
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

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id, toast]);

  const handleInputChange = (field: string, value: string) => {
    if (userDetails) {
      setUserDetails({
        ...userDetails,
        [field]: value,
      });
    }
  };

  const handleMobileChange = (field: string, value: string) => {
    if (userDetails) {
      setUserDetails({
        ...userDetails,
        mobile: {
          ...userDetails.mobile,
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userDetails) return;

    try {
      setIsSubmitting(true);

      // Ensure we're sending the correct data structure
      const updateData = {
        name: userDetails.name,
        companyName: userDetails.companyName || "",
        companyLocation: userDetails.companyLocation || "",
        mobile: {
          countryCode: userDetails.mobile?.countryCode || "",
          phone: userDetails.mobile?.phone || "",
        },
      };

      const response = await fetcher(`/admin/users/${id}`, {
        method: "PUT",
        body: updateData,
      });

      toast({
        title: "Success",
        description: "User details updated successfully",
      });

      // Refetch user data to update the UI
      await fetchUserData();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error updating user:", error);
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
          description: "Failed to update user details",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="border border-gray-300 text-primary">
              Edit Details
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={userDetails?.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyName" className="text-right">
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    value={userDetails?.companyName || ""}
                    onChange={(e) =>
                      handleInputChange("companyName", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyLocation" className="text-right">
                    Company Location
                  </Label>
                  <Input
                    id="companyLocation"
                    value={userDetails?.companyLocation || ""}
                    onChange={(e) =>
                      handleInputChange("companyLocation", e.target.value)
                    }
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="countryCode" className="text-right">
                    Country Code
                  </Label>
                  <Input
                    id="countryCode"
                    value={userDetails?.mobile?.countryCode || ""}
                    onChange={(e) =>
                      handleMobileChange("countryCode", e.target.value)
                    }
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    value={userDetails?.mobile?.phone || ""}
                    onChange={(e) =>
                      handleMobileChange("phone", e.target.value)
                    }
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

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

      {user.userType === "TRUCKER" && trucks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              User&apos;s Trucks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Truck Number</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>RC Status</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trucks.map((truck) => (
                  <TableRow key={truck._id}>
                    <TableCell>{truck.truckNumber}</TableCell>
                    <TableCell>{truck.truckCapacity}</TableCell>
                    <TableCell>{truck.truckType}</TableCell>
                    <TableCell>
                      {truck.isRCVerified ? (
                        <CheckCircle className="text-green-500" />
                      ) : (
                        <XCircle className="text-red-500" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/trucks/${truck._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      {user.userType === "TRANSPORTER" && loads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              User&apos;s Loads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Material Type</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Offered Amount</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loads.map((load) => (
                  <TableRow key={load._id}>
                    <TableCell>{load.materialType}</TableCell>
                    <TableCell>{load.source.placeName}</TableCell>
                    <TableCell>{load.destination.placeName}</TableCell>
                    <TableCell>{load.offeredAmount.total}</TableCell>
                    <TableCell>
                      <Link
                        href={`/dashboard/loads/${load._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
