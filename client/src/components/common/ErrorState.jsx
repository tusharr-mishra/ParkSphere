import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We encountered an unexpected error while loading this content.',
  onRetry,
}) => {
  return (
    <div className="state-container" style={{ borderColor: 'rgba(244, 63, 94, 0.3)' }} data-testid="error-state">
      <div style={{ padding: '1rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '50%' }}>
        <AlertTriangle size={40} color="#fb7185" />
      </div>
      <div>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: '#fb7185' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px' }}>
          {message}
        </p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary">
          <RefreshCw size={16} />
          Retry
        </button>
      )}
    </div>
  );
};
