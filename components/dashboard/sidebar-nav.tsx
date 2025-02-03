"use client";

import {
  Users,
  Truck,
  Building2,
  Search,
  Package,
  BarChart3,
  Coins,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border">
        <div className="flex items-center justify-between px-2">
          <Image
            src="/assets/bllogo.png"
            alt="Bharatloads Logo"
            width={40}
            height={40}
          />
          <span className="text-lg font-semibold">BharatLoads Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Users Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Users</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* All Users */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/users"}
                  tooltip="All Users"
                >
                  <Link href="/dashboard/users">
                    <Users className="h-4 w-4" />
                    <span>All Users</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Truckers */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/users/truckers"}
                  tooltip="Truckers"
                >
                  <Link href="/dashboard/users/truckers">
                    <Truck className="h-4 w-4" />
                    <span>Truckers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Transporters */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/users/transporters"}
                  tooltip="Transporters"
                >
                  <Link href="/dashboard/users/transporters">
                    <Building2 className="h-4 w-4" />
                    <span>Transporters</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Loads Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Loads</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* All Loads */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/loads"}
                  tooltip="All Loads"
                >
                  <Link href="/dashboard/loads">
                    <Package className="h-4 w-4" />
                    <span>All Loads</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Load Search */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/loads/search"}
                  tooltip="Search Loads"
                >
                  <Link href="/dashboard/loads/search">
                    <Search className="h-4 w-4" />
                    <span>Load Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Trucks Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Trucks</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* All Trucks */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/trucks"}
                  tooltip="All Trucks"
                >
                  <Link href="/dashboard/trucks">
                    <Truck className="h-4 w-4" />
                    <span>All Trucks</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Truck Search */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/trucks/search"}
                  tooltip="Search Trucks"
                >
                  <Link href="/dashboard/trucks/search">
                    <Search className="h-4 w-4" />
                    <span>Truck Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bids Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Bids</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* All Bids */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/bids"}
                  tooltip="All Bids"
                >
                  <Link href="/dashboard/bids">
                    <Coins className="h-4 w-4" />
                    <span>All Bids</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Bid Search */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/bids/search"}
                  tooltip="Search Bids"
                >
                  <Link href="/dashboard/bids/search">
                    <Search className="h-4 w-4" />
                    <span>Bid Search</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Statistics Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Statistics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Overview */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/statistics"}
                  tooltip="Statistics Overview"
                >
                  <Link href="/dashboard/statistics">
                    <BarChart3 className="h-4 w-4" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Section */}
      <SidebarFooter className="border-t border-border p-2">
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex w-full items-center gap-2 rounded-lg p-2 hover:bg-accent">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {admin?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{admin?.username}</p>
                <p className="text-xs text-muted-foreground">{admin?.phone}</p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>
                  {admin?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h3 className="font-medium">{admin?.username}</h3>
                <p className="text-sm text-muted-foreground">{admin?.phone}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    Logout
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to logout?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You will need to login again to access the admin
                      dashboard.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </DialogContent>
        </Dialog>
      </SidebarFooter>
    </Sidebar>
  );
}
