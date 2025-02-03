"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function Header() {
  const { isAuthenticated, admin, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-bold text-2xl">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/bllogo.png"
                alt="Bharatloads Logo"
                width={40}
                height={40}
              />
              BharatLoads
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt={admin?.username}
                    />
                    <AvatarFallback className="bg-[#00BFA6] text-white">
                      {admin?.username?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                className="bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
