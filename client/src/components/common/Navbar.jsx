import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';
import { Car, Compass, User, LogOut, Shield, LayoutDashboard } from 'lucide-react';

export const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header
      style={{
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '4.25rem',
        }}
      >
        {/* Brand */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, var(--primary-500), #2563eb)',
              padding: '0.5rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-glow)',
            }}
          >
            <Car size={22} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 800 }}>
            Park<span style={{ color: 'var(--primary-500)' }}>Sphere</span>
          </span>
        </Link>

        {/* Center Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link
            to="/parking"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.375rem',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}
          >
            <Compass size={16} />
            Find Parking
          </Link>
          {isAuthenticated && user?.role === 'CUSTOMER' && (
            <Link
              to="/customer/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <LayoutDashboard size={16} />
              Customer Portal
            </Link>
          )}
          {isAuthenticated && user?.role === 'OPERATOR' && (
            <Link
              to="/operator/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <LayoutDashboard size={16} />
              Operator Portal
            </Link>
          )}
          {isAuthenticated && user?.role === 'ADMIN' && (
            <Link
              to="/admin/dashboard"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                color: 'var(--text-muted)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
            >
              <Shield size={16} />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--text-muted)',
                  background: 'var(--bg-surface)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {user?.name || user?.email || 'User'} ({user?.role || 'CUSTOMER'})
              </span>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
                style={{ padding: '0.5rem 0.875rem', fontSize: '0.8125rem' }}
                aria-label="Logout"
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link to="/login" className="btn btn-ghost">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
