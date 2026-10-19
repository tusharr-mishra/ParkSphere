import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const CustomerNotificationsPage = () => {
  return (
    <PageShell
      title="Notification Center"
      subtitle="In-app alerts for confirmations, reminders, and receipts"
    >
      
      <div className="card">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          You're all caught up! No unread notifications.
        </p>
      </div>
    </PageShell>
  );
};
