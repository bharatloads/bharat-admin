"use client";

import { StatsCard } from "@/components/statistics/stats-card";

export default function FinancialMetricsPage() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <StatsCard title='Total Revenue'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Growth Rate'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Average Revenue per User'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Payment Success Rate'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Payment Failures'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Refunds & Disputes'>
        <div>Content coming soon</div>
      </StatsCard>
    </div>
  );
}
