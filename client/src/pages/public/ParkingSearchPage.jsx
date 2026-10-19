import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const ParkingSearchPage = () => {
  return (
    <PageShell
      title="Find Parking Facilities"
      subtitle="Browse real-time parking spaces with verified pricing and availability"
    >
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Downtown Plaza Garage</h3>
            <span className="badge badge-active">Available</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            100 Financial Way, San Francisco, CA
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>$12.50</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}> / hr</span>
            </div>
            <a href="/parking/facility-1" className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
              View Facility
            </a>
          </div>
        </div>
      </div>
    </PageShell>
  );
};
