"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface ApiError {
  message: string;
}

export default function VerifyPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    console.log("VerifyPage mounted, checking auth state:", {
      isAuthenticated,
    });

    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting to dashboard");
      router.replace("/dashboard");
      return;
    }

    // Get username from session storage
    const storedUsername = sessionStorage.getItem("adminUsername");
    console.log("Stored username from session:", storedUsername);

    if (!storedUsername) {
      console.log("No username found, redirecting to login");
      router.replace("/login");
      return;
    }
    setUsername(storedUsername);
  }, [router, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      console.log("No username available, cannot submit");
      return;
    }

    setIsLoading(true);
    console.log("Submitting OTP verification for username:", username);

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/admin/verify-otp`;
      console.log("Making verification API call to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          otp,
        }),
      });

      const data = await response.json();
      console.log("Verification API Response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      // Use auth context to store token and admin data
      console.log("Verification successful, storing auth data");
      login(data.token, data.admin);

      // Clear username from session storage
      console.log("Clearing session storage");
      sessionStorage.removeItem("adminUsername");

      toast({
        title: "Success",
        description: "OTP verified successfully! Redirecting...",
      });

      console.log("Redirecting to dashboard");
      router.replace("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      const apiError = error as Error | ApiError;
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "message" in apiError
            ? apiError.message
            : "Invalid OTP. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!username) {
    console.log("No username set, rendering nothing");
    return null;
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background/95">
      {/* Animated Background */}
      <AnimatedGridPattern
        numSquares={50}
        maxOpacity={0.3}
        duration={4}
        repeatDelay={0.5}
        className="[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[160%] skew-y-12"
      />
      <AnimatedGridPattern
        numSquares={30}
        maxOpacity={0.2}
        duration={3}
        repeatDelay={1}
        width={30}
        height={30}
        className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[180%] -skew-y-12"
      />

      {/* Card */}
      <Card className="w-full max-w-md mx-4 relative z-10 bg-background/95 backdrop-blur-sm shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Verify OTP</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Enter the 5-digit code sent to your phone
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center">
              <InputOTP
                maxLength={5}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <AnimatedSubscribeButton
              className="w-full"
              disabled={isLoading || otp.length !== 5}
            >
              <span>Verify OTP</span>
              <span>Verifying...</span>
            </AnimatedSubscribeButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
