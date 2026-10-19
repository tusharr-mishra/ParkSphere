import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ShieldCheck, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '3rem 0 2rem 0',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div
                style={{
                  background: 'var(--primary-600)',
                  padding: '0.35rem',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                }}
              >
                <Car size={18} color="#fff" />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.125rem', fontWeight: 800 }}>
                Park<span style={{ color: 'var(--primary-500)' }}>Sphere</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Production-grade smart parking management and reservation platform. Concurrency-safe,
              multi-role, and real-time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Explore
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem' }}>
              <li>
                <Link to="/parking" style={{ color: 'var(--text-muted)' }}>
                  Search Facilities
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: 'var(--text-muted)' }}>
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link to="/operator/dashboard" style={{ color: 'var(--text-muted)' }}>
                  Operator Workspace
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" style={{ color: 'var(--text-muted)' }}>
                  System Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* System Guarantees */}
          <div>
            <h4 style={{ fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: '1rem' }}>
              Reliability
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-emerald)" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-emerald)" />
                <span>Authoritative Timestamp Billing</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} color="var(--accent-emerald)" />
                <span>Cryptographic Email OTP</span>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.8125rem',
            color: 'var(--text-dim)',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>&copy; 2026 ParkSphere Platform. Built for excellence.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            Engineered with <Heart size={14} color="#f43f5e" fill="#f43f5e" /> for technical interview readiness.
          </div>
        </div>
      </div>
    </footer>
  );
};
