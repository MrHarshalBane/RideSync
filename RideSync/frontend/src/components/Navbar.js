import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import { Navigation, Shield, LogOut, PlusCircle, LogIn, UserPlus, History, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { isConnected } = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 'none', borderLeft: 'none', borderRight: 'none', zIndex: 1000, position: 'sticky', top: 0 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, #ff6b00, #ff8800)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(255,107,0,0.4)' }}>
            <Navigation size={22} color="#fff" style={{ transform: 'rotate(45deg)' }} />
          </div>
          <div>
            <span style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.4rem', background: 'linear-gradient(135deg, #ffffff 30%, #ff8800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              RideSync
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: '600', textTransform: 'uppercase' }}>
              Real-Time Tracking
            </span>
          </div>
        </Link>

        {/* Live Socket Status Dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.35rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isConnected ? '#10b981' : '#ef4444', boxShadow: isConnected ? '0 0 8px #10b981' : '0 0 8px #ef4444' }}></span>
          <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>{isConnected ? 'Socket Online' : 'Connecting...'}</span>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ color: isActive('/dashboard') ? 'var(--accent-orange)' : 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Activity size={16} /> Dashboard
              </Link>
              <Link to="/create-ride" style={{ color: isActive('/create-ride') ? 'var(--accent-orange)' : 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <PlusCircle size={16} /> Host Ride
              </Link>
              <Link to="/history" style={{ color: isActive('/history') ? 'var(--accent-orange)' : 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <History size={16} /> History
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" style={{ color: isActive('/admin') ? 'var(--accent-cyan)' : 'var(--text-main)', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Shield size={16} color="var(--accent-cyan)" /> Admin Panel
                </Link>
              )}

              {/* User Profile Badge & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700' }}>{user.name}</div>
                  <span className={`badge ${user.role === 'admin' ? 'badge-follower' : 'badge-leader'}`}>
                    {user.role}
                  </span>
                </div>
                <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem' }} title="Logout">
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <LogIn size={16} /> Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                <UserPlus size={16} /> Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
