import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const AdminDashboard = () => {
  return (
    <PageShell
      title="System Administrator Governance"
      subtitle="Platform-wide telemetry, user growth, and audit log monitoring"
    >
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Total Users</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>1,280</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Approved Facilities</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-500)' }}>18</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Platform Gross (MTD)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>$48,920</div>
        </div>
      </div>
    </PageShell>
  );
};
