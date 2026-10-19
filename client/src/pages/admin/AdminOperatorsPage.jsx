import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const AdminOperatorsPage = () => {
  return (
    <PageShell
      title="Operator Approvals & Oversight"
      subtitle="Review pending operator applications and facility permissions"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Operator approval queue.</p>
      </div>
    </PageShell>
  );
};
