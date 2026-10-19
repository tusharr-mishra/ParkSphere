import React from 'react';

export const LoadingSkeleton = ({ count = 3, height = '48px', className = '' }) => {
  return (
    <div className={`space-y-3 ${className}`} data-testid="loading-skeleton">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="skeleton"
          style={{ height, width: '100%', marginBottom: '0.75rem' }}
        />
      ))}
    </div>
  );
};
