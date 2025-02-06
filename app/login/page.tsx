"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

interface ApiError {
  message: string;
}

interface AdminResponse {
  message: string;
  admin?: {
    username: string;
    phone: string;
    userLevel: number;
  };
}

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      router.replace("/dashboard");
      return;
    }

    // Check if we're coming back from a failed verification
    const storedUsername = sessionStorage.getItem("adminUsername");
    if (storedUsername) {
      router.replace("/login/verify");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Starting login process for username:", formData.username);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/login`;
      console.log("Making API call to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data: AdminResponse = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.admin) {
        console.log("Login successful, storing username:", formData.username);
        // Store username in session storage for OTP verification
        sessionStorage.setItem("adminUsername", formData.username);

        toast({
          title: "Success",
          description: `OTP sent to your phone (${data.admin.phone.slice(-4)})`,
        });

        console.log("Redirecting to verify page...");
        // Add a small delay before redirecting to ensure storage is complete
        setTimeout(() => {
          router.replace("/login/verify");
        }, 100);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      const apiError = error as Error | ApiError;
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "message" in apiError
            ? apiError.message
            : "Invalid credentials. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background/95">
      {/* Animated Background */}
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.3}
        duration={1}
        repeatDelay={0.5}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[160%] skew-y-12"
      />

      {/* Card */}
      <Card className="w-full max-w-md mx-4 relative z-10 bg-background/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center">
            <Image
              src="/assets/bllogo.png"
              alt="Bharatloads Logo"
              width={100}
              height={100}
            />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter your credentials to access the admin panel
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
            <AnimatedSubscribeButton className="w-full" disabled={isLoading}>
              <span>Login</span>
              <span>Logging in...</span>
            </AnimatedSubscribeButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
