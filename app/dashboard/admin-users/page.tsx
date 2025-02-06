"use client";

import { useEffect, useState } from "react";
import { Users, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { USER_ROLES, USER_LEVELS } from "@/config/accessPolicies";
import { fetcher } from "@/lib/fetcher";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminUser {
  _id: string;
  username: string;
  phone: string;
  userLevel: number;
  isVerified: boolean;
  createdAt: string;
}

interface AdminResponse {
  admins: AdminUser[];
  total: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { admin, token } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AdminResponse | null>(null);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    password: "",
    userLevel: "1",
  });

  // Check if current user is super admin
  const isSuperAdmin = admin?.userLevel === USER_ROLES.SUPER_ADMIN;

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push("/dashboard");
      return;
    }

    const fetchAdmins = async () => {
      try {
        setIsLoading(true);

        const response = await fetcher<AdminResponse>(`/admins`, {
          method: "GET",
        });
        setData(response);
      } catch (error) {
        console.error("Error fetching admins:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch admin users",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdmins();
  }, [isSuperAdmin, router, toast, token]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetcher("/admin/create", {
        method: "POST",
        body: formData,
      });
      toast({
        title: "Success",
        description: "Admin user created successfully",
      });
      setIsCreateDialogOpen(false);
      // Refresh the data
      const data = await fetcher<AdminResponse>("/admins", {
        requireAuth: true,
      });
      setData(data);
    } catch (error) {
      console.error("Error creating admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create admin user",
      });
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAdmin) return;

    try {
      await fetcher(`/admin/update/${selectedAdmin._id}`, {
        method: "PUT",
        body: formData,
        requireAuth: true,
      });
      toast({
        title: "Success",
        description: "Admin user updated successfully",
      });
      setIsEditDialogOpen(false);
      // Refresh the data
      const data = await fetcher<AdminResponse>("/admins", {
        requireAuth: true,
      });
      setData(data);
    } catch (error) {
      console.error("Error updating admin:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update admin user",
      });
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      phone: admin.phone,
      password: "", // Don't set password for edit
      userLevel: admin.userLevel.toString(),
    });
    setIsEditDialogOpen(true);
  };

  if (!isSuperAdmin) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Users</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleCreateSubmit}>
              <DialogHeader>
                <DialogTitle>Create Admin User</DialogTitle>
                <DialogDescription>
                  Create a new admin user with specific permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="userLevel">User Level</Label>
                  <Select
                    value={formData.userLevel}
                    onValueChange={(value) =>
                      setFormData({ ...formData, userLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(USER_LEVELS).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create Admin</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-2xl font-bold">{data?.total || 0}</span>
            <span className="text-muted-foreground">Total Admin Users</span>
          </div>
        </CardContent>
      </Card>

      {/* Admin Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Admin Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Loading state
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 6 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : data?.admins.length === 0 ? (
                // Empty state
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                // Data state
                data?.admins.map((admin) => (
                  <TableRow key={admin._id}>
                    <TableCell className="font-medium">
                      {admin.username}
                    </TableCell>
                    <TableCell>{admin.phone}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                          admin.userLevel === USER_ROLES.SUPER_ADMIN
                            ? "bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10"
                            : "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10"
                        }`}
                      >
                        {admin.userLevel === USER_ROLES.SUPER_ADMIN
                          ? "Super Admin"
                          : "Entry Level"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          admin.isVerified
                            ? "bg-green-50 text-green-700 ring-green-600/20"
                            : "bg-red-50 text-red-700 ring-red-600/20"
                        }`}
                      >
                        {admin.isVerified ? "Verified" : "Unverified"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(admin.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(admin)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Admin User</DialogTitle>
              <DialogDescription>
                Modify the admin user&apos;s details.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-username">Username</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">
                  Password (leave empty to keep unchanged)
                </Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-userLevel">User Level</Label>
                <Select
                  value={formData.userLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, userLevel: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select user level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Entry Level</SelectItem>
                    <SelectItem value="10">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
