import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const CustomerDashboard = () => {
  return (
    <PageShell
      title="Customer Dashboard"
      subtitle="Overview of your active parking sessions and recent bookings"
    >
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Active Sessions</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>0</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Total Completed</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>12</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Registered Vehicles</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-500)' }}>2</div>
        </div>
      </div>
    </PageShell>
  );
};
