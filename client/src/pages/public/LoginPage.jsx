import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const LoginPage = () => {
  return (
    <PageShell
      title="Sign In to ParkSphere"
      subtitle="Access your customer, operator, or admin workspace"
    >
      
      <div className="card" style={{ maxWidth: '440px', margin: '2rem auto' }}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" placeholder="name@example.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" placeholder="••••••••" required />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginBottom: '1rem' }}>
            Sign In
          </button>
          <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            Don't have an account? <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </PageShell>
  );
};
