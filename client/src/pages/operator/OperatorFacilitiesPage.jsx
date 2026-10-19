import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const OperatorFacilitiesPage = () => {
  return (
    <PageShell
      title="Assigned Parking Facilities"
      subtitle="Manage lots, operating hours, and rate tiers"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Assigned facilities list with configuration actions.</p>
      </div>
    </PageShell>
  );
};
