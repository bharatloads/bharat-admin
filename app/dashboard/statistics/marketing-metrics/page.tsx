"use client";

import { StatsCard } from "@/components/statistics/stats-card";

export default function MarketingMetricsPage() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <StatsCard title='User Acquisition Sources'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Conversion Rates'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Churn Rate'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Campaign Performance'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Referral Analytics'>
        <div>Content coming soon</div>
      </StatsCard>
    </div>
  );
}
