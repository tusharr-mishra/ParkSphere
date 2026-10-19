import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export const Toast = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="toast" role="alert" data-testid="toast-notification">
      <CheckCircle2 size={20} color="var(--accent-emerald)" />
      <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          aria-label="Close notification"
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.5rem' }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
