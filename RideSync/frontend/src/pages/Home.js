import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navigation, ShieldAlert, Radio, Users, Cpu, ChevronRight, Zap } from 'lucide-react';

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'radial-gradient(circle at 50% 20%, rgba(255, 107, 0, 0.12) 0%, transparent 60%)' }}>
      
      {/* Hero Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 3rem', textAlign: 'center' }}>
        
        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 107, 0, 0.1)', border: '1px solid rgba(255, 107, 0, 0.3)', padding: '0.4rem 1rem', borderRadius: '30px', color: 'var(--accent-orange)', fontSize: '0.85rem', fontWeight: '700', marginBottom: '1.5rem' }}>
          <Zap size={16} /> NEXT-GEN MERN + SOCKET.IO TELEMETRY
        </div>

        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.2rem)', fontWeight: '800', lineHeight: '1.1', marginBottom: '1.5rem', background: 'linear-gradient(135deg, #ffffff 40%, #ff8800 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Real-Time Group Ride Tracking <br />
          Built for Motorcycle Squads
        </h1>

        <p style={{ maxWidth: '720px', margin: '0 auto 2.5rem', color: 'var(--text-muted)', fontSize: '1.15rem', lineHeight: '1.6' }}>
          Never lose a rider again. Broadcast sub-second GPS telemetry, join instantly with unique 8-character Ride Codes, and stay safe with automated Off-Route deviation alerts.
        </p>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {user ? (
            <Link to="/dashboard" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.1rem' }}>
              Launch Dashboard <ChevronRight size={20} />
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1.1rem' }}>
                Get Started Free <ChevronRight size={20} />
              </Link>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1.1rem' }}>
                Demo Login
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Grid */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem 6rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%' }}>
        
        {/* Card 1 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ background: 'rgba(255,107,0,0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Radio size={24} color="var(--accent-orange)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>8-Character Ride Codes</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Leaders spawn rides instant-sharable via 8-character codes (`e.g. RS-98X2B`). Followers join in one click.
          </p>
        </div>

        {/* Card 2 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ background: 'rgba(0,242,254,0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Navigation size={24} color="var(--accent-cyan)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Sub-Second Telemetry</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Live location streaming over WebSockets with custom dark-themed Leaflet maps and distinct vehicle badges.
          </p>
        </div>

        {/* Card 3 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ background: 'rgba(239,68,68,0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <ShieldAlert size={24} color="#ef4444" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>Off-Route Detection</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Spatial Haversine calculation automatically alerts followers and leaders if a rider strays &gt;100 meters.
          </p>
        </div>

        {/* Card 4 */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ background: 'rgba(157,78,221,0.15)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Cpu size={24} color="var(--accent-purple)" />
          </div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.6rem' }}>GPS Route Simulator</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Test live ride motion directly inside your desktop browser without needing to physically ride out!
          </p>
        </div>

      </section>

      {/* Footer */}
      <footer style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <p>RideSync &copy; 2026 - Designed & Built by <strong>Harshal Sane</strong> | TCET Mumbai</p>
      </footer>
    </div>
  );
}
