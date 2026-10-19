import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const AdminSettingsPage = () => {
  return (
    <PageShell
      title="Platform Configuration"
      subtitle="Global platform parameters, OTP expiry windows, and policies"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>System configuration settings.</p>
      </div>
    </PageShell>
  );
};
