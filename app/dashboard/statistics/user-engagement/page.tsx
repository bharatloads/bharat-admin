"use client";

import { StatsCard } from "@/components/statistics/stats-card";

export default function UserEngagementPage() {
  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      <StatsCard title='User Flow & Navigation'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Most Visited Pages'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Drop-off & Cancellation Points'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Session Duration & Frequency'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='New vs Returning Users'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Click-through Rates'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='Device Analytics'>
        <div>Content coming soon</div>
      </StatsCard>

      <StatsCard title='OS Analytics'>
        <div>Content coming soon</div>
      </StatsCard>
    </div>
  );
}
