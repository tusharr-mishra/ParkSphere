import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const OperatorFacilityDetailPage = () => {
  return (
    <PageShell
      title="Facility Configuration"
      subtitle="Operating schedule, capacity rules, and pricing structure"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Facility settings and slot allocation.</p>
      </div>
    </PageShell>
  );
};
