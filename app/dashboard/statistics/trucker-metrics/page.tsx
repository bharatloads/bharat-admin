"use client";

import { StatsCard } from "@/components/statistics/stats-card";

export default function TruckerMetricsPage() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <StatsCard title='Total Truckers Registered'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Total Transporters Registered'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Total Trucks Listed'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Active vs Inactive Transporters'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Response Time Analytics'>
        <div>Content coming soon</div>
      </StatsCard>
    </div>
  );
}
