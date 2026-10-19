import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ForbiddenState = ({
  title = 'Access Denied',
  message = 'You do not have permission to view or manage this resource.',
}) => {
  const navigate = useNavigate();

  return (
    <div className="state-container" style={{ borderColor: 'rgba(245, 158, 11, 0.3)' }} data-testid="forbidden-state">
      <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%' }}>
        <ShieldAlert size={40} color="#fbbf24" />
      </div>
      <div>
        <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem', color: '#fbbf24' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '400px' }}>
          {message}
        </p>
      </div>
      <button onClick={() => navigate(-1)} className="btn btn-secondary">
        <ArrowLeft size={16} />
        Go Back
      </button>
    </div>
  );
};
