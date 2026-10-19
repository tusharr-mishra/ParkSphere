import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const CustomerVehiclesPage = () => {
  return (
    <PageShell
      title="Registered Vehicles"
      subtitle="Manage license plates, vehicle types, and EV compatibility flags"
    >
      
      <div className="card">
        <button className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>+ Register New Vehicle</button>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No vehicles registered yet. Add a vehicle to enable 1-click slot booking.
        </p>
      </div>
    </PageShell>
  );
};
