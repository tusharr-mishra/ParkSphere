import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Calendar,
  Zap,
  ShieldCheck,
  Clock,
  ArrowRight,
  CheckCircle,
  Building,
} from 'lucide-react';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/parking${city ? `?city=${encodeURIComponent(city)}` : ''}`);
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          padding: '6rem 0 5rem 0',
          background: 'radial-gradient(ellipse at top, #1e293b 0%, #0a0f1d 70%)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              color: 'var(--primary-500)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '1.5rem',
            }}
          >
            <Zap size={14} />
            <span>Real-Time Smart Parking Platform</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              letterSpacing: '-0.02em',
            }}
          >
            Reserve Your Parking Spot in{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #60a5fa, #38bdf8)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Seconds
            </span>
          </h1>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: 'clamp(1rem, 2vw, 1.25rem)',
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
            }}
          >
            Frictionless parking discovery, guaranteed reservation slots, and authoritative digital
            check-in/check-out across prime metro facilities.
          </p>

          {/* Search Card */}
          <form
            onSubmit={handleSearch}
            className="card-glass"
            style={{
              maxWidth: '720px',
              margin: '0 auto',
              padding: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              flexWrap: 'wrap',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flex: 1,
                minWidth: '220px',
                background: 'var(--bg-surface)',
                padding: '0.625rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <MapPin size={18} color="var(--primary-500)" />
              <input
                type="text"
                placeholder="Enter city (e.g. San Francisco, New York)..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  width: '100%',
                  outline: 'none',
                  fontSize: '0.875rem',
                }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
              <Search size={16} />
              Find Parking
            </button>
          </form>

          {/* Quick Metrics */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              marginTop: '4rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff' }}>99.9%</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>Conflict-Free Uptime</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                100%
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>Zero Double-Booking</div>
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-500)' }}>
                &lt; 5s
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-dim)' }}>Booking Confirmation</div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-primary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>How ParkSphere Works</h2>
            <p style={{ color: 'var(--text-muted)' }}>
              A frictionless four-step journey designed for drivers and parking operators.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="card">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-500)',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                1
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Locate & Filter</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Search facilities by city, vehicle type, and EV charging compatibility with live
                rates.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                2
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Select & Reserve</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Choose an available slot with concurrency-safe locking and receive an instant booking
                code.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-amber)',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                3
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Check In & Park</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Seamlessly verify your booking upon facility arrival with authoritative entry
                timestamping.
              </p>
            </div>

            <div className="card">
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#c084fc',
                  fontWeight: 800,
                  marginBottom: '1rem',
                }}
              >
                4
              </div>
              <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Checkout & Receipt</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                Check out with transparent server-computed billing, automated receipts, and rating
                reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: '4rem 0',
          background: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '640px' }}>
          <h2 style={{ fontSize: '1.875rem', marginBottom: '1rem' }}>Ready to Experience Smart Parking?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            Create an account or start searching for open parking bays near your destination today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }}>
              Create Free Account
            </Link>
            <Link to="/parking" className="btn btn-secondary" style={{ padding: '0.75rem 2rem' }}>
              Browse Facilities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
