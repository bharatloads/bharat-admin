"use client";

import { StatsCard } from "@/components/statistics/stats-card";

export default function OperationalMetricsPage() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <StatsCard title='Customer Support Queries'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Query Resolution Time'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='App Performance'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Error Rates'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Response Times'>
        <div>Content coming soon</div>
      </StatsCard>
    </div>
  );
}
