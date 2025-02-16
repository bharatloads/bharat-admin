"use client";

import { StatsCard } from "@/components/statistics/stats-card";

export default function LoadMetricsPage() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <StatsCard title='Total Loads'>
        {/* Add visualization components here */}
      </StatsCard>

      <StatsCard title='Load Cancellation Rate'>
        {/* Add visualization components here */}
      </StatsCard>

      <StatsCard title='Load Fulfillment Time'>
        {/* Add visualization components here */}
      </StatsCard>

      <StatsCard title='Top Searched Routes'>
        {/* Add visualization components here */}
      </StatsCard>

      <StatsCard title='Route Recommendations'>
        {/* Add visualization components here */}
      </StatsCard>

      <StatsCard title='Pricing Trends'>
        {/* Add visualization components here */}
      </StatsCard>

      <StatsCard title='Bid Statistics'>
        {/* Add visualization components here */}
      </StatsCard>

      <StatsCard title='Success Rate'>
        {/* Add visualization components here */}
      </StatsCard>
    </div>
  );
}
