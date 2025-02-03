"use client";

import { DashboardSidebar } from "@/components/dashboard/sidebar-nav";
import { BreadcrumbNav } from "@/components/dashboard/breadcrumb-nav";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Don't render anything while checking authentication
  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <DashboardSidebar />
      <SidebarInset>
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between gap-4 px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="h-8 w-8" />
                <BreadcrumbNav />
              </div>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1">
            <div className="container px-6 py-6">{children}</div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
