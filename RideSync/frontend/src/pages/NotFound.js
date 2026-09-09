import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '3rem 1.5rem' }}>
      <div className="glass-panel" style={{ maxWidth: '440px', width: '100%', padding: '3rem 2rem' }}>
        <AlertCircle size={56} color="var(--accent-orange)" style={{ marginBottom: '1rem' }} />
        <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>404</h1>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          The ride route or page you are looking for does not exist or has moved.
        </p>
        <Link to="/" className="btn-primary">
          <Home size={18} /> Return to Home
        </Link>
      </div>
    </div>
  );
}
