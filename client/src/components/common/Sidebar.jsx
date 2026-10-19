import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Car,
  CreditCard,
  Bell,
  User,
  Building2,
  Grid3X3,
  BarChart3,
  Users,
  Shield,
  FileText,
  Settings,
} from 'lucide-react';

export const Sidebar = ({ role }) => {
  const customerLinks = [
    { to: '/customer/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/customer/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/customer/vehicles', label: 'Vehicles', icon: Car },
    { to: '/customer/payments', label: 'Payments', icon: CreditCard },
    { to: '/customer/notifications', label: 'Notifications', icon: Bell },
    { to: '/customer/profile', label: 'Account Profile', icon: User },
  ];

  const operatorLinks = [
    { to: '/operator/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/operator/facilities', label: 'My Facilities', icon: Building2 },
    { to: '/operator/slots', label: 'Slot Control', icon: Grid3X3 },
    { to: '/operator/reservations', label: 'Live Operations', icon: CalendarCheck },
    { to: '/operator/analytics', label: 'Facility Analytics', icon: BarChart3 },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/operators', label: 'Operator Approvals', icon: Shield },
    { to: '/admin/facilities', label: 'Facility Oversight', icon: Building2 },
    { to: '/admin/reservations', label: 'All Reservations', icon: CalendarCheck },
    { to: '/admin/payments', label: 'Financial Audit', icon: CreditCard },
    { to: '/admin/audit-logs', label: 'Audit Trail', icon: FileText },
    { to: '/admin/settings', label: 'Global Settings', icon: Settings },
  ];

  const links =
    role === 'ADMIN' ? adminLinks : role === 'OPERATOR' ? operatorLinks : customerLinks;

  return (
    <aside
      style={{
        width: '260px',
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border-subtle)',
        minHeight: 'calc(100vh - 4.25rem)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <div
        style={{
          padding: '0.5rem 0.75rem',
          fontSize: '0.75rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-dim)',
          marginBottom: '0.25rem',
        }}
      >
        {role} Workspace
      </div>
      {links.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.endsWith('dashboard')}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.625rem 0.875rem',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: isActive ? '#fff' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-600)' : 'transparent',
              transition: 'all var(--transition-fast)',
            })}
          >
            <Icon size={18} />
            {item.label}
          </NavLink>
        );
      })}
    </aside>
  );
};
