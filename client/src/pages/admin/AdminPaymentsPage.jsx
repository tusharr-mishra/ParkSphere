import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const AdminPaymentsPage = () => {
  return (
    <PageShell
      title="Financial Ledger & Reconciliation"
      subtitle="Platform transaction records, refunds, and payment statuses"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Financial audit table.</p>
      </div>
    </PageShell>
  );
};
