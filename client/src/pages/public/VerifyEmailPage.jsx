import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const VerifyEmailPage = () => {
  return (
    <PageShell
      title="Verify Your Email"
      subtitle="Enter the 6-digit cryptographic verification code sent to your email"
    >
      
      <div className="card" style={{ maxWidth: '420px', margin: '2rem auto', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          We sent a code to your registered email address. This code expires in 10 minutes.
        </p>
        <div className="form-group">
          <input
            type="text"
            className="form-input"
            maxLength={6}
            placeholder="000000"
            style={{ fontSize: '1.5rem', textAlign: 'center', letterSpacing: '0.3em' }}
          />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
          Verify Account
        </button>
        <button className="btn btn-ghost" style={{ fontSize: '0.8125rem' }}>
          Resend Code (Cooldown: 60s)
        </button>
      </div>
    </PageShell>
  );
};
