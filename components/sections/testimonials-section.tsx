"use client";

import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteIcon } from "@radix-ui/react-icons";

const testimonials = [
  {
    name: "Rajesh Kumar",
    role: "Fleet Owner, Delhi",
    content:
      "BharatLoads has completely transformed how I manage my fleet. Finding consistent loads has never been easier, and my trucks are rarely idle now. The platform's transparency and ease of use are outstanding.",
    avatar: "/assets/avatars/user1.png",
  },
  {
    name: "Priya Sharma",
    role: "Logistics Manager, Tata Industries",
    content:
      "As a large manufacturer, finding reliable transportation is critical. BharatLoads has given us access to a vast network of verified carriers, reducing our logistics costs by 15% while improving delivery times.",
    avatar: "/assets/avatars/user2.png",
  },
  {
    name: "Mohammed Irfan",
    role: "Independent Truck Owner, Mumbai",
    content:
      "Before BharatLoads, I struggled to find regular loads for my two trucks. Now I can select from multiple options every day and negotiate fair rates directly. My income has increased significantly.",
    avatar: "/assets/avatars/user3.png",
  },
  {
    name: "Ananya Patel",
    role: "Supply Chain Director, Pharma Co.",
    content:
      "BharatLoads has streamlined our distribution network across India. The analytics and tracking features provide unprecedented visibility into our shipments, and the quality of service has been exceptional.",
    avatar: "/assets/avatars/user4.png",
  },
];

export function TestimonialsSection() {
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
            What Our Users Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join thousands of satisfied transporters and truck owners who have
            transformed their businesses with BharatLoads.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03 }}
              className="h-full"
            >
              <Card className="h-full border border-border">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-6">
                    <QuoteIcon className="h-8 w-8 text-[#00BFA6]" />
                  </div>
                  <p className="text-muted-foreground mb-6 flex-grow">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center mt-auto">
                    <Avatar className="h-12 w-12 mr-4">
                      <AvatarImage
                        src={testimonial.avatar}
                        alt={testimonial.name}
                      />
                      <AvatarFallback className="bg-[#00BFA6] text-white">
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
