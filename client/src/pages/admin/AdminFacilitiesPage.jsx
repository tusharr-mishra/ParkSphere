import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const AdminFacilitiesPage = () => {
  return (
    <PageShell
      title="Platform Facilities"
      subtitle="Global oversight across all geographic parking locations"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>All facility listings and statuses.</p>
      </div>
    </PageShell>
  );
};
