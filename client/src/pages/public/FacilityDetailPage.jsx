import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const FacilityDetailPage = () => {
  return (
    <PageShell
      title="Facility Details & Slot Booking"
      subtitle="Inspect slots, amenities, operating hours, and reserve your bay"
    >
      
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Downtown Plaza Garage</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Open 24/7 • EV Charging Stations • Covered Security Surveillance
        </p>
        <div style={{ padding: '1.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Interactive Slot Map</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
            Select an available bay to begin conflict-free reservation.
          </p>
        </div>
        <button className="btn btn-primary">Book Selected Slot</button>
      </div>
    </PageShell>
  );
};
