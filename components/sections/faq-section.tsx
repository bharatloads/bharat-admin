"use client";

import { motion } from "motion/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    question: "How does BharatLoads work?",
    answer:
      "BharatLoads connects transporters with truck owners through our digital platform. Transporters can post loads, find available trucks, and negotiate directly with owners. The platform streamlines the entire logistics process from finding the right carrier to completing the delivery.",
  },
  {
    question: "Is BharatLoads available across all of India?",
    answer:
      "Yes, BharatLoads operates nationwide across India. Our network covers major logistics hubs, industrial centers, and remote areas, providing comprehensive coverage for all your transportation needs.",
  },
  {
    question: "How do I register as a transporter or truck owner?",
    answer:
      "Registration is simple. Visit our website or download our app, click on 'Register', select your role (transporter or truck owner), and follow the step-by-step process. You'll need to provide basic details, documentation for verification, and create your profile.",
  },
  {
    question: "What types of vehicles are available on the platform?",
    answer:
      "BharatLoads supports a wide range of commercial vehicles including but not limited to mini trucks, LCVs, HCVs, trailers, tankers, container trucks, and specialized vehicles. Whatever your logistics requirements, we have the right vehicles for you.",
  },
  {
    question: "How is payment processed on BharatLoads?",
    answer:
      "BharatLoads offers secure payment options directly through the platform. Once a deal is finalized, the payment terms are documented. Transporters can make payments through our secure payment gateway, and truck owners receive their payments promptly after successful delivery.",
  },
  {
    question: "What measures does BharatLoads take for security?",
    answer:
      "We prioritize security at every level. All users undergo verification before joining the platform. Transactions are secured and encrypted. We also offer load tracking, digital documentation, and dispute resolution mechanisms to ensure a safe experience for all parties.",
  },
];

export function FaqSection() {
  return (
    <section className="py-24 bg-accent/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-5xl font-bold mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Find answers to common questions about using BharatLoads for your
            logistics needs.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
