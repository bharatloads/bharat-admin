"use client";

import { Header } from "@/components/landing/header";
import { Meteors } from "@/components/ui/meteors";
import { WordRotate } from "@/components/ui/word-rotate";
import { GlobeSection } from "@/components/sections/globe-section";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  return (
    <>
      <Header />
      <main className="relative">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Revolutionizing Logistics{" "}
              <WordRotate
                className="text-bl-green-500 inline-block"
                words={["Together", "Efficiently", "Seamlessly", "Nationwide"]}
                duration={2000}
              />
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Connecting truckers and transporters across India through a
              seamless digital platform. Post loads, find trucks, and make deals
              with ease.
            </p>
            {isAuthenticated && (
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-[#00BFA6] hover:bg-[#00BFA6]/90 text-white px-8 py-6 rounded-lg text-lg font-semibold"
              >
                Go to Dashboard
              </Button>
            )}
          </div>
          <Meteors number={30} />
        </section>

        {/* Globe Section */}
        <GlobeSection />
      </main>
    </>
  );
}
