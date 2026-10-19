import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const OperatorReservationsPage = () => {
  return (
    <PageShell
      title="Live Gate Operations"
      subtitle="Manual check-in, check-out, and active vehicle tracking"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Check-in / check-out gate console.</p>
      </div>
    </PageShell>
  );
};
