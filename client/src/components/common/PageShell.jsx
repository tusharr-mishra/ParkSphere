import React from 'react';
import { LoadingSkeleton } from './LoadingSkeleton.jsx';
import { EmptyState } from './EmptyState.jsx';
import { ErrorState } from './ErrorState.jsx';

export const PageShell = ({
  title,
  subtitle,
  action,
  loading = false,
  error = null,
  isEmpty = false,
  emptyProps = {},
  onRetry,
  children,
}) => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>{title}</h1>
          {subtitle && <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      {/* 5 UI States handling */}
      {loading ? (
        <LoadingSkeleton count={4} height="80px" />
      ) : error ? (
        <ErrorState message={error} onRetry={onRetry} />
      ) : isEmpty ? (
        <EmptyState {...emptyProps} />
      ) : (
        children
      )}
    </div>
  );
};
