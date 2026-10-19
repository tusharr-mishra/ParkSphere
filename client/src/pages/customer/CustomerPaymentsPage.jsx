import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const CustomerPaymentsPage = () => {
  return (
    <PageShell
      title="Payment History"
      subtitle="Authoritative transaction ledger and receipts"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          All authoritative charges and digital receipts are recorded here.
        </p>
      </div>
    </PageShell>
  );
};
