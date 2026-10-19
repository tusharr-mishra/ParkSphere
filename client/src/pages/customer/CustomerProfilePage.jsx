import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const CustomerProfilePage = () => {
  return (
    <PageShell
      title="Account Settings"
      subtitle="Profile details, email verification status, and password updates"
    >
      
      <div className="card" style={{ maxWidth: '540px' }}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input type="text" className="form-input" defaultValue="Customer User" />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input type="email" className="form-input" defaultValue="customer@parksphere.com" disabled />
        </div>
        <button className="btn btn-primary">Save Changes</button>
      </div>
    </PageShell>
  );
};
