"use client";

import { usePathname } from "next/navigation";

export default function StatisticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const getPageTitle = () => {
    switch (pathname) {
      case "/dashboard/statistics":
        return {
          title: "Statistics Overview",
          description: "Key metrics and performance indicators",
        };
      case "/dashboard/statistics/user-engagement":
        return {
          title: "User Engagement & Activity",
          description: "Analyze user behavior and interactions",
        };
      case "/dashboard/statistics/load-metrics":
        return {
          title: "Load & Transaction Metrics",
          description: "Track load performance and transactions",
        };
      case "/dashboard/statistics/trucker-metrics":
        return {
          title: "Trucker & Transporter Metrics",
          description: "Monitor transport partner performance",
        };
      case "/dashboard/statistics/financial-metrics":
        return {
          title: "Financial & Revenue Metrics",
          description: "Track revenue and financial health",
        };
      case "/dashboard/statistics/operational-metrics":
        return {
          title: "Operational & Support Metrics",
          description: "Monitor system and support performance",
        };
      case "/dashboard/statistics/marketing-metrics":
        return {
          title: "Marketing & Acquisition Metrics",
          description: "Analyze growth and user acquisition",
        };
      default:
        return {
          title: "Statistics",
          description: "Analytics and Metrics",
        };
    }
  };

  const { title, description } = getPageTitle();

  return (
    <div className='space-y-6'>
      <div className='border-b pb-4'>
        <h1 className='text-3xl font-bold tracking-tight'>{title}</h1>
        <p className='text-muted-foreground'>{description}</p>
      </div>
      {children}
    </div>
  );
}
