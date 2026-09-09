import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export default function OffRouteAlertModal({ alertData, onClose }) {
  if (!alertData) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem' }}>
      <div className="glass-panel alert-pulse" style={{ maxWidth: '440px', width: '100%', padding: '2rem', textAlign: 'center', border: '2px solid #ef4444', borderRadius: '18px', background: 'rgba(26, 12, 14, 0.95)' }}>
        
        <div style={{ background: 'rgba(239,68,68,0.2)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem', border: '1px solid #ef4444' }}>
          <AlertTriangle size={36} color="#ef4444" />
        </div>

        <h3 style={{ fontFamily: 'Outfit', fontSize: '1.6rem', color: '#ef4444', marginBottom: '0.5rem' }}>
          OFF-ROUTE WARNING!
        </h3>

        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '1.25rem' }}>
          Rider <strong>{alertData.userName}</strong> has strayed <strong>{alertData.offRouteDistance || 120} meters</strong> away from the planned group route!
        </p>

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
          📍 Location: {alertData.lat?.toFixed(4)}, {alertData.lng?.toFixed(4)}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={onClose} className="btn-danger" style={{ flex: 1, justifyContent: 'center' }}>
            <ShieldAlert size={18} /> Acknowledge Alert
          </button>
        </div>
      </div>
    </div>
  );
}
