import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const AdminReservationsPage = () => {
  return (
    <PageShell
      title="Reservation Monitor"
      subtitle="Cross-facility real-time booking stream and lifecycle audits"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Platform-wide reservation stream.</p>
      </div>
    </PageShell>
  );
};
