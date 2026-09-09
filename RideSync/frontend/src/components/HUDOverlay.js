import React from 'react';
import { Gauge, Clock, Navigation, Users, Copy, Check } from 'lucide-react';

export default function HUDOverlay({ rideCode, speed = 0, distanceKm = 0, eta = 'Calculating', activeCount = 1 }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(rideCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', right: '1.25rem', zIndex: 900, pointerEvents: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      
      {/* Top Header Row: Ride Code & Active Riders */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        {/* Ride Code Box */}
        <div className="glass-panel" style={{ pointerEvents: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', uppercase: 'true', letterSpacing: '0.05em', fontWeight: '700' }}>RIDE CODE</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent-orange)', letterSpacing: '0.08em' }}>
              {rideCode}
            </div>
          </div>
          <button onClick={handleCopyCode} className="btn-secondary" style={{ padding: '0.35rem 0.5rem', borderRadius: '6px' }} title="Copy Code">
            {copied ? <Check size={16} color="var(--accent-green)" /> : <Copy size={16} />}
          </button>
        </div>

        {/* Active Riders Counter */}
        <div className="glass-panel" style={{ pointerEvents: 'auto', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Users size={18} color="var(--accent-cyan)" />
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>GROUP SIZE</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: '700', fontSize: '1rem', color: '#fff' }}>
              {activeCount} Riders
            </div>
          </div>
        </div>
      </div>

      {/* Floating Telemetry Stats Bar */}
      <div className="glass-panel" style={{ pointerEvents: 'auto', alignSelf: 'center', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '2rem', border: '1px solid rgba(255, 107, 0, 0.25)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)' }}>
        
        {/* Speed */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: 'rgba(255,107,0,0.15)', padding: '0.5rem', borderRadius: '10px' }}>
            <Gauge size={22} color="var(--accent-orange)" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>SPEED</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.3rem' }}>
              {speed} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>km/h</span>
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>

        {/* Distance Remaining */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: 'rgba(0,242,254,0.15)', padding: '0.5rem', borderRadius: '10px' }}>
            <Navigation size={22} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>DISTANCE</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.3rem' }}>
              {distanceKm} <span style={{ fontSize: '0.75rem', fontWeight: '500', color: 'var(--text-muted)' }}>km</span>
            </div>
          </div>
        </div>

        <div style={{ width: '1px', height: '30px', background: 'var(--border-color)' }}></div>

        {/* ETA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ background: 'rgba(157,78,221,0.15)', padding: '0.5rem', borderRadius: '10px' }}>
            <Clock size={22} color="var(--accent-purple)" />
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>ESTIMATED ETA</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.3rem', color: '#fff' }}>
              {eta}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
