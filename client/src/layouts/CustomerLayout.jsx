import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar.jsx';
import { Sidebar } from '../components/common/Sidebar.jsx';

export const CustomerLayout = () => {
  return (
    <div className="app-container">
      <Navbar />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar role="CUSTOMER" />
        <main style={{ flex: 1, padding: '2rem', background: 'var(--bg-primary)', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
