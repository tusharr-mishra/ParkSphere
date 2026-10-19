import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const ResetPasswordPage = () => {
  return (
    <PageShell
      title="Set New Password"
      subtitle="Enter your OTP verification code and choose a secure password"
    >
      
      <div className="card" style={{ maxWidth: '440px', margin: '2rem auto' }}>
        <div className="form-group">
          <label className="form-label">Recovery OTP</label>
          <input type="text" className="form-input" placeholder="6-digit code" />
        </div>
        <div className="form-group">
          <label className="form-label">New Password</label>
          <input type="password" className="form-input" placeholder="••••••••" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}>Update Password</button>
      </div>
    </PageShell>
  );
};
