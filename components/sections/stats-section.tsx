"use client";

import { motion } from "motion/react";
import { NumberTicker } from "@/components/ui/number-ticker";

const statistics = [
  {
    value: 5435,
    label: "Registered Transporters",
    suffix: "+",
  },
  {
    value: 15456,
    label: "Trucks in Network",
    suffix: "+",
  },
  {
    value: 54540,
    label: "Loads Delivered",
    suffix: "+",
  },
  {
    value: 674,
    label: "Customer Satisfaction",
    suffix: "+ ",
  },
];

export function StatsSection() {
  return (
    <section className="py-24 bg-[#00BFA6]">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 text-white">
            Our Impact in Numbers
          </h2>
          <p className="text-xl text-white/80 max-w-3xl mx-auto">
            BharatLoads is revolutionizing logistics across India, connecting
            businesses and transporters in unprecedented ways.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statistics.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center">
                <NumberTicker
                  value={stat.value}
                  delay={0.5}
                  className="text-4xl md:text-5xl font-bold text-white"
                />
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {stat.suffix}
                </span>
              </div>
              <p className="text-lg text-white/80 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
