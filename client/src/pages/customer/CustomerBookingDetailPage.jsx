import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const CustomerBookingDetailPage = () => {
  return (
    <PageShell
      title="Reservation Session"
      subtitle="Real-time booking status, digital pass, and receipt"
    >
      
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Booking Code: PS-882194</h3>
          <span className="badge badge-confirmed">Confirmed</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Check-in opens 15 minutes before scheduled start time.
        </p>
      </div>
    </PageShell>
  );
};
