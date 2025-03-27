"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { AnimatedGridPattern } from "@/components/ui/animated-grid-pattern";
import { AnimatedSubscribeButton } from "@/components/ui/animated-subscribe-button";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export function CtaSection() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <AnimatedGridPattern
          duration={1}
          repeatDelay={0.5}
          className="opacity-10"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Ready to Revolutionize Your Logistics?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join thousands of transporters and truck owners across India who are
            already benefiting from BharatLoads&apos; innovative platform.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleGetStarted}
              className="bg-[#00BFA6] text-white px-8 py-6 rounded-md text-base"
            >
              Get Started Now
            </Button>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="#features" className="text-primary ">
                Learn More
              </Link>
            </motion.div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="mt-10 text-muted-foreground"
          >
            No credit card required. Start connecting with transporters and
            truckers today.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
