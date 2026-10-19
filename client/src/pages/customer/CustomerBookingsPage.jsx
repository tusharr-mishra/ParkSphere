import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const CustomerBookingsPage = () => {
  return (
    <PageShell
      title="My Reservations"
      subtitle="Historical and active booking sessions"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Your verified bookings will appear here. Full booking lifecycle supported.
        </p>
      </div>
    </PageShell>
  );
};
