"use client";

import { Globe } from "@/components/ui/globe";

export function GlobeSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background to-background/50 flex flex-col items-center justify-center  overflow-hidden">
      {/* Center Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4 mb-32">
        <h2 className="text-3xl sm:text-5xl font-bold mb-6">
          Pan-India Network
        </h2>
        <p className="text-xl text-muted-foreground mb-12">
          Our extensive network covers major logistics hubs across India,
          facilitating seamless connections between transporters and truckers.
        </p>
      </div>

      {/* Half Globe Background */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-full max-w-[800px] aspect-square">
        <Globe
          config={{
            width: 1000,
            height: 1000,
            devicePixelRatio: 2,
            phi: 0,
            theta: 0.2, // Slightly adjusted to focus on India
            dark: 1,
            diffuse: 3,
            mapSamples: 16000,
            mapBrightness: 1.2,
            baseColor: [0.08, 0.72, 0.65], // Our brand color
            markerColor: [1, 1, 1], // White markers
            glowColor: [0.08, 0.72, 0.65], // Matching glow
            markers: [
              // Major Indian cities
              { location: [19.076, 72.8777], size: 0.1 }, // Mumbai
              { location: [28.7041, 77.1025], size: 0.1 }, // Delhi
              { location: [13.0827, 80.2707], size: 0.1 }, // Chennai
              { location: [22.5726, 88.3639], size: 0.1 }, // Kolkata
            ],
            onRender: () => {},
          }}
        />
      </div>
    </section>
  );
}
