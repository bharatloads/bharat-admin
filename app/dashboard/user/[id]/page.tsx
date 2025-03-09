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
} from "@/components/ui/dialog";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const data = await fetcher<GetUserByIdResponse>(`/admin/users/${id}`);
        setUser(data.user);
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

    if (id) {
      fetchUser();
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
    // Logic to update user details
    // After updating, refetch user details
    setIsDialogOpen(false);
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
            <Button className="bg-blue-600 text-white">Edit Details</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User Details</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={userDetails?.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="border rounded p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={userDetails?.companyName || ""}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Company Location
                </label>
                <input
                  type="text"
                  value={userDetails?.companyLocation || ""}
                  onChange={(e) =>
                    handleInputChange("companyLocation", e.target.value)
                  }
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={userDetails?.mobile?.countryCode || ""}
                    onChange={(e) =>
                      handleMobileChange("countryCode", e.target.value)
                    }
                    className="border rounded p-2 w-1/4 mr-2"
                    placeholder="Country Code"
                    required
                  />
                  <input
                    type="text"
                    value={userDetails?.mobile?.phone || ""}
                    onChange={(e) =>
                      handleMobileChange("phone", e.target.value)
                    }
                    className="border rounded p-2 w-3/4"
                    placeholder="Phone Number"
                    required
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button type="submit" className="bg-green-600 text-white">
                  Submit
                </Button>
              </div>
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
