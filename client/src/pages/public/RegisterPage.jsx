import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const RegisterPage = () => {
  return (
    <PageShell
      title="Create Your Account"
      subtitle="Join ParkSphere for fast, verified parking access"
    >
      
      <div className="card" style={{ maxWidth: '480px', margin: '2rem auto' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" className="form-input" placeholder="Alex Morgan" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="alex@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="Minimum 8 characters" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            Register & Send OTP
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Already registered? <a href="/login">Sign In</a>
          </div>
        </form>
      </div>
    </PageShell>
  );
};
