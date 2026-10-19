import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There is currently no data to display.',
  actionLabel,
  onAction,
}) => {
  return (
    <div className="state-container" data-testid="empty-state">
      <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '50%' }}>
        <Icon size={40} color="#94a3b8" />
      </div>
      <div>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px' }}>
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};
