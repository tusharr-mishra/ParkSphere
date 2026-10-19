import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const ForgotPasswordPage = () => {
  return (
    <PageShell
      title="Reset Password"
      subtitle="Provide your account email to receive a recovery code"
    >
      
      <div className="card" style={{ maxWidth: '440px', margin: '2rem auto' }}>
        <div className="form-group">
          <label className="form-label">Registered Email</label>
          <input type="email" className="form-input" placeholder="you@example.com" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}>Send Reset OTP</button>
      </div>
    </PageShell>
  );
};
