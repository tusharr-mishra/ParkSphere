import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const OperatorAnalyticsPage = () => {
  return (
    <PageShell
      title="Facility Analytics & Utilization"
      subtitle="Hourly occupancy curves, peak windows, and revenue breakdown"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Occupancy and revenue aggregations.</p>
      </div>
    </PageShell>
  );
};
