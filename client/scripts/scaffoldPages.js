import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pages = [
  // Public
  {
    path: 'public/LoginPage.jsx',
    title: 'Sign In to ParkSphere',
    subtitle: 'Access your customer, operator, or admin workspace',
    content: `
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
      </div>`,
  },
  {
    path: 'public/RegisterPage.jsx',
    title: 'Create Your Account',
    subtitle: 'Join ParkSphere for fast, verified parking access',
    content: `
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
      </div>`,
  },
  {
    path: 'public/VerifyEmailPage.jsx',
    title: 'Verify Your Email',
    subtitle: 'Enter the 6-digit cryptographic verification code sent to your email',
    content: `
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
      </div>`,
  },
  {
    path: 'public/ForgotPasswordPage.jsx',
    title: 'Reset Password',
    subtitle: 'Provide your account email to receive a recovery code',
    content: `
      <div className="card" style={{ maxWidth: '440px', margin: '2rem auto' }}>
        <div className="form-group">
          <label className="form-label">Registered Email</label>
          <input type="email" className="form-input" placeholder="you@example.com" />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }}>Send Reset OTP</button>
      </div>`,
  },
  {
    path: 'public/ResetPasswordPage.jsx',
    title: 'Set New Password',
    subtitle: 'Enter your OTP verification code and choose a secure password',
    content: `
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
      </div>`,
  },
  {
    path: 'public/ParkingSearchPage.jsx',
    title: 'Find Parking Facilities',
    subtitle: 'Browse real-time parking spaces with verified pricing and availability',
    content: `
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem' }}>Downtown Plaza Garage</h3>
            <span className="badge badge-active">Available</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
            100 Financial Way, San Francisco, CA
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>$12.50</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}> / hr</span>
            </div>
            <a href="/parking/facility-1" className="btn btn-secondary" style={{ fontSize: '0.8125rem' }}>
              View Facility
            </a>
          </div>
        </div>
      </div>`,
  },
  {
    path: 'public/FacilityDetailPage.jsx',
    title: 'Facility Details & Slot Booking',
    subtitle: 'Inspect slots, amenities, operating hours, and reserve your bay',
    content: `
      <div className="card">
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Downtown Plaza Garage</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          Open 24/7 • EV Charging Stations • Covered Security Surveillance
        </p>
        <div style={{ padding: '1.5rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Interactive Slot Map</h4>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-dim)' }}>
            Select an available bay to begin conflict-free reservation.
          </p>
        </div>
        <button className="btn btn-primary">Book Selected Slot</button>
      </div>`,
  },
  {
    path: 'public/NotFoundPage.jsx',
    title: '404 - Page Not Found',
    subtitle: 'The requested route does not exist or has been relocated.',
    content: `
      <div style={{ textAlign: 'center', padding: '3rem 0' }}>
        <a href="/" className="btn btn-primary">Return to Home</a>
      </div>`,
  },

  // Customer
  {
    path: 'customer/CustomerDashboard.jsx',
    title: 'Customer Dashboard',
    subtitle: 'Overview of your active parking sessions and recent bookings',
    content: `
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Active Sessions</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>0</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Total Completed</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>12</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>Registered Vehicles</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-500)' }}>2</div>
        </div>
      </div>`,
  },
  {
    path: 'customer/CustomerBookingsPage.jsx',
    title: 'My Reservations',
    subtitle: 'Historical and active booking sessions',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Your verified bookings will appear here. Full booking lifecycle supported.
        </p>
      </div>`,
  },
  {
    path: 'customer/CustomerBookingDetailPage.jsx',
    title: 'Reservation Session',
    subtitle: 'Real-time booking status, digital pass, and receipt',
    content: `
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3>Booking Code: PS-882194</h3>
          <span className="badge badge-confirmed">Confirmed</span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Check-in opens 15 minutes before scheduled start time.
        </p>
      </div>`,
  },
  {
    path: 'customer/CustomerVehiclesPage.jsx',
    title: 'Registered Vehicles',
    subtitle: 'Manage license plates, vehicle types, and EV compatibility flags',
    content: `
      <div className="card">
        <button className="btn btn-primary" style={{ marginBottom: '1.5rem' }}>+ Register New Vehicle</button>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          No vehicles registered yet. Add a vehicle to enable 1-click slot booking.
        </p>
      </div>`,
  },
  {
    path: 'customer/CustomerPaymentsPage.jsx',
    title: 'Payment History',
    subtitle: 'Authoritative transaction ledger and receipts',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          All authoritative charges and digital receipts are recorded here.
        </p>
      </div>`,
  },
  {
    path: 'customer/CustomerNotificationsPage.jsx',
    title: 'Notification Center',
    subtitle: 'In-app alerts for confirmations, reminders, and receipts',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          You're all caught up! No unread notifications.
        </p>
      </div>`,
  },
  {
    path: 'customer/CustomerProfilePage.jsx',
    title: 'Account Settings',
    subtitle: 'Profile details, email verification status, and password updates',
    content: `
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
      </div>`,
  },

  // Operator
  {
    path: 'operator/OperatorDashboard.jsx',
    title: 'Operator Command Center',
    subtitle: 'Real-time occupancy, gate operations, and revenue metrics',
    content: `
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Facility Occupancy</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>74%</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Active Parked Cars</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>58</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Today's Revenue</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>$1,420</div>
        </div>
      </div>`,
  },
  {
    path: 'operator/OperatorFacilitiesPage.jsx',
    title: 'Assigned Parking Facilities',
    subtitle: 'Manage lots, operating hours, and rate tiers',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Assigned facilities list with configuration actions.</p>
      </div>`,
  },
  {
    path: 'operator/OperatorFacilityDetailPage.jsx',
    title: 'Facility Configuration',
    subtitle: 'Operating schedule, capacity rules, and pricing structure',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Facility settings and slot allocation.</p>
      </div>`,
  },
  {
    path: 'operator/OperatorSlotsPage.jsx',
    title: 'Slot State & Inventory Management',
    subtitle: 'Live slot grid with maintenance state toggles',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Interactive slot bay manager.</p>
      </div>`,
  },
  {
    path: 'operator/OperatorReservationsPage.jsx',
    title: 'Live Gate Operations',
    subtitle: 'Manual check-in, check-out, and active vehicle tracking',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Check-in / check-out gate console.</p>
      </div>`,
  },
  {
    path: 'operator/OperatorAnalyticsPage.jsx',
    title: 'Facility Analytics & Utilization',
    subtitle: 'Hourly occupancy curves, peak windows, and revenue breakdown',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Occupancy and revenue aggregations.</p>
      </div>`,
  },

  // Admin
  {
    path: 'admin/AdminDashboard.jsx',
    title: 'System Administrator Governance',
    subtitle: 'Platform-wide telemetry, user growth, and audit log monitoring',
    content: `
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Total Users</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>1,280</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Approved Facilities</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-500)' }}>18</div>
        </div>
        <div className="card">
          <div style={{ color: 'var(--text-dim)', fontSize: '0.8125rem' }}>Platform Gross (MTD)</div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>$48,920</div>
        </div>
      </div>`,
  },
  {
    path: 'admin/AdminUsersPage.jsx',
    title: 'User Management',
    subtitle: 'Directory of registered customers, operators, and administrators',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Platform user accounts and state management.</p>
      </div>`,
  },
  {
    path: 'admin/AdminOperatorsPage.jsx',
    title: 'Operator Approvals & Oversight',
    subtitle: 'Review pending operator applications and facility permissions',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Operator approval queue.</p>
      </div>`,
  },
  {
    path: 'admin/AdminFacilitiesPage.jsx',
    title: 'Platform Facilities',
    subtitle: 'Global oversight across all geographic parking locations',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>All facility listings and statuses.</p>
      </div>`,
  },
  {
    path: 'admin/AdminReservationsPage.jsx',
    title: 'Reservation Monitor',
    subtitle: 'Cross-facility real-time booking stream and lifecycle audits',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Platform-wide reservation stream.</p>
      </div>`,
  },
  {
    path: 'admin/AdminPaymentsPage.jsx',
    title: 'Financial Ledger & Reconciliation',
    subtitle: 'Platform transaction records, refunds, and payment statuses',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Financial audit table.</p>
      </div>`,
  },
  {
    path: 'admin/AdminAuditLogsPage.jsx',
    title: 'Security & Action Audit Logs',
    subtitle: 'Immutable record of privileged operations and state modifications',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>Audit log explorer with filterable actors and actions.</p>
      </div>`,
  },
  {
    path: 'admin/AdminSettingsPage.jsx',
    title: 'Platform Configuration',
    subtitle: 'Global platform parameters, OTP expiry windows, and policies',
    content: `
      <div className="card">
        <p style={{ color: 'var(--text-muted)' }}>System configuration settings.</p>
      </div>`,
  },
];

const pagesDir = path.resolve(__dirname, '../src/pages');

for (const p of pages) {
  const filePath = path.join(pagesDir, p.path);
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const componentName = path.basename(p.path, '.jsx');
  const code = `import React from 'react';
import { PageShell } from '../../components/common/PageShell.jsx';

export const ${componentName} = () => {
  return (
    <PageShell
      title="${p.title}"
      subtitle="${p.subtitle}"
    >
      ${p.content}
    </PageShell>
  );
};
`;

  fs.writeFileSync(filePath, code);
}

console.log('Successfully scaffolded all route pages with PageShell!');
