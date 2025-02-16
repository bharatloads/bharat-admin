"use client";

import {
  Users,
  Truck,
  Building2,
  Search,
  Package,
  BarChart3,
  Coins,
  Shield,
  BarChart2,
  Activity,
  TrendingUp,
  PieChart,
  HeartPulse,
  Target,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { USER_LEVELS, USER_ROLES } from "@/config/accessPolicies";
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
import { useAccess } from "@/hooks/useAccess";

const sidebarItems = [
  {
    title: "Statistics",
    icon: BarChart2,
    items: [
      {
        title: "Overview",
        href: "/dashboard/statistics",
        icon: PieChart,
      },
      {
        title: "User Engagement",
        href: "/dashboard/statistics/user-engagement",
        icon: Activity,
      },
      {
        title: "Load Metrics",
        href: "/dashboard/statistics/load-metrics",
        icon: TrendingUp,
      },
      {
        title: "Trucker Metrics",
        href: "/dashboard/statistics/trucker-metrics",
        icon: Truck,
      },
      {
        title: "Financial Metrics",
        href: "/dashboard/statistics/financial-metrics",
        icon: Target,
      },
      {
        title: "Operational Metrics",
        href: "/dashboard/statistics/operational-metrics",
        icon: HeartPulse,
      },
      {
        title: "Marketing Metrics",
        href: "/dashboard/statistics/marketing-metrics",
        icon: Users,
      },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { admin, logout } = useAuth();
  const { checkRouteAccess } = useAccess();
  const isSuperAdmin = admin?.userLevel === USER_ROLES.SUPER_ADMIN;

  const handleLogout = () => {
    logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className='border-b border-border'>
        <div className='flex items-center justify-between px-2'>
          <Image
            src='/assets/bllogo.png'
            alt='Bharatloads Logo'
            width={40}
            height={40}
          />
          <span className='text-lg font-semibold'>BharatLoads Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Admin Users Group - Only visible to super admins */}
        {isSuperAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === "/dashboard/admin-users"}
                    tooltip='Admin Users'>
                    <Link href='/dashboard/admin-users'>
                      <Shield className='h-4 w-4' />
                      <span>Admin Users</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Users Group */}
        {checkRouteAccess("/dashboard/users") && (
          <SidebarGroup>
            <SidebarGroupLabel>Users</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {checkRouteAccess("/dashboard/users") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/users"}
                      tooltip='All Users'>
                      <Link href='/dashboard/users'>
                        <Users className='h-4 w-4' />
                        <span>All Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* Truckers */}
                {checkRouteAccess("/dashboard/users/truckers") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/users/truckers"}
                      tooltip='Truckers'>
                      <Link href='/dashboard/users/truckers'>
                        <Truck className='h-4 w-4' />
                        <span>Truckers</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* Transporters */}
                {checkRouteAccess("/dashboard/users/transporters") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/users/transporters"}
                      tooltip='Transporters'>
                      <Link href='/dashboard/users/transporters'>
                        <Building2 className='h-4 w-4' />
                        <span>Transporters</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Loads Group */}
        {checkRouteAccess("/dashboard/loads") && (
          <SidebarGroup>
            <SidebarGroupLabel>Loads</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* All Loads */}
                {checkRouteAccess("/dashboard/loads") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/loads"}
                      tooltip='All Loads'>
                      <Link href='/dashboard/loads'>
                        <Package className='h-4 w-4' />
                        <span>All Loads</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* Load Search */}
                {checkRouteAccess("/dashboard/loads/search") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/loads/search"}
                      tooltip='Search Loads'>
                      <Link href='/dashboard/loads/search'>
                        <Search className='h-4 w-4' />
                        <span>Load Search</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Trucks Group */}
        {checkRouteAccess("/dashboard/trucks") && (
          <SidebarGroup>
            <SidebarGroupLabel>Trucks</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* All Trucks */}
                {checkRouteAccess("/dashboard/trucks") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/trucks"}
                      tooltip='All Trucks'>
                      <Link href='/dashboard/trucks'>
                        <Truck className='h-4 w-4' />
                        <span>All Trucks</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* Truck Search */}
                {checkRouteAccess("/dashboard/trucks/search") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/trucks/search"}
                      tooltip='Search Trucks'>
                      <Link href='/dashboard/trucks/search'>
                        <Search className='h-4 w-4' />
                        <span>Truck Search</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Bids Group */}
        {checkRouteAccess("/dashboard/bids") && (
          <SidebarGroup>
            <SidebarGroupLabel>Bids</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {/* All Bids */}
                {checkRouteAccess("/dashboard/bids") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/bids"}
                      tooltip='All Bids'>
                      <Link href='/dashboard/bids'>
                        <Coins className='h-4 w-4' />
                        <span>All Bids</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}

                {/* Bid Search */}
                {checkRouteAccess("/dashboard/bids/search") && (
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/dashboard/bids/search"}
                      tooltip='Search Bids'>
                      <Link href='/dashboard/bids/search'>
                        <Search className='h-4 w-4' />
                        <span>Bid Search</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Statistics Group */}
        {checkRouteAccess("/dashboard/statistics") && (
          <SidebarGroup>
            <SidebarGroupLabel>Statistics</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems
                  .find((item) => item.title === "Statistics")
                  ?.items.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === item.href}
                        tooltip={item.title}>
                        <Link href={item.href}>
                          <item.icon className='h-4 w-4' />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* User Profile Section */}
      <SidebarFooter className='border-t border-border p-2'>
        <Dialog>
          <DialogTrigger asChild>
            <button className='flex w-full items-center gap-2 rounded-lg p-2 hover:bg-accent'>
              <Avatar className='h-8 w-8'>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>
                  {admin?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='flex-1 text-left'>
                <p className='text-sm font-medium'>{admin?.username}</p>
                <p className='text-xs text-muted-foreground'>
                  {admin?.userLevel && USER_LEVELS[admin.userLevel]}
                </p>
              </div>
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Profile</DialogTitle>
            </DialogHeader>
            <div className='flex flex-col items-center gap-4 py-4'>
              <Avatar className='h-20 w-20'>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>
                  {admin?.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className='text-center'>
                <h3 className='font-medium'>{admin?.username}</h3>
                <p className='text-sm text-muted-foreground'>{admin?.phone}</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant='destructive' className='w-full'>
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
