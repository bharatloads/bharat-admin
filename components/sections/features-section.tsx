"use client";

import { motion } from "motion/react";
import { Truck, Package, BarChart, Users, Shield, Clock } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Extensive Truck Network",
    description:
      "Access thousands of trucks across India through our robust platform, ensuring you always find the right vehicle for your logistics needs.",
  },
  {
    icon: Package,
    title: "Simplified Load Management",
    description:
      "Post, track, and manage loads with ease. Our intuitive interface streamlines the entire process from posting to delivery.",
  },
  {
    icon: BarChart,
    title: "Advanced Analytics",
    description:
      "Gain valuable insights into your logistics operations with our comprehensive data analytics and reporting tools.",
  },
  {
    icon: Users,
    title: "Verified Partners",
    description:
      "Connect with pre-verified transporters and truck owners, ensuring reliability and trust in every transaction.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description:
      "Our platform ensures end-to-end security for all your business dealings, with transparent pricing and documentation.",
  },
  {
    icon: Clock,
    title: "Real-time Updates",
    description:
      "Stay informed with real-time tracking and status updates for all your shipments, from pickup to delivery.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Powerful Features for Every Logistics Need
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform offers everything you need to streamline
            your logistics operations and grow your business.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-[#00BFA6]/10 p-3 rounded-lg">
                  <feature.icon className="h-6 w-6 text-[#00BFA6]" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
