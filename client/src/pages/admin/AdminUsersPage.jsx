import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const AdminUsersPage = () => {
  return (
    <PageShell
      title="User Management"
      subtitle="Directory of registered customers, operators, and administrators"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Platform user accounts and state management.</p>
      </div>
    </PageShell>
  );
};
