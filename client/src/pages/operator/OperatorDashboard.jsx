import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const OperatorDashboard = () => {
  return (
    <PageShell
      title="Operator Command Center"
      subtitle="Real-time occupancy, gate operations, and revenue metrics"
    >
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Facility Occupancy</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>74%</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Active Parked Cars</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>58</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Today's Revenue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>$1,420</div>
        </div>
      </div>
    </PageShell>
  );
};
