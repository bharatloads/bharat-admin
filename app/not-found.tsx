"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

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
          <CardTitle className="text-2xl font-bold">Page Not Found</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Button
              onClick={() => router.back()}
              className="mr-2"
              variant="outline"
            >
              Go Back
            </Button>
            <Button onClick={() => router.push("/dashboard")}>
              Go to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
