import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { History, Calendar, MapPin, Flag, ArrowRight, ShieldCheck } from 'lucide-react';

export default function RideHistory() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/rides/history');
        setRides(res.data || []);
      } catch (err) {
        console.error('Failed to load ride history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const totalDistance = rides.reduce((acc, r) => acc + (r.totalDistanceKm || 0), 0);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <History size={26} color="var(--accent-orange)" /> Group Ride History
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '4px' }}>
            Review past group rides, telemetry logs, and participant metrics.
          </p>
        </div>

        {/* Total Stats Pill */}
        <div className="glass-panel" style={{ padding: '0.6rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL COMPLETED RIDES</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent-orange)' }}>
              {rides.length} Rides
            </div>
          </div>
          <div style={{ width: '1px', height: '24px', background: 'var(--border-color)' }}></div>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '700' }}>TOTAL DISTANCE</div>
            <div style={{ fontFamily: 'Outfit', fontWeight: '800', fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>
              {totalDistance.toFixed(1)} km
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>Loading ride history...</div>
      ) : rides.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <ShieldCheck size={48} color="var(--text-dim)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No Rides Recorded Yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Join or host a ride session to start recording your telemetry history!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {rides.map((r) => (
            <div key={r._id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                  <h3 style={{ fontSize: '1.2rem' }}>{r.title}</h3>
                  <span className={`badge ${r.status === 'active' ? 'badge-active' : 'badge-completed'}`}>
                    {r.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <span>Code: <strong style={{ color: 'var(--accent-orange)' }}>{r.rideCode}</strong></span>
                  <span>Leader: <strong>{r.leaderName}</strong></span>
                  <span>Participants: <strong>{r.participants?.length || 1}</strong></span>
                  <span>Distance: <strong>{r.totalDistanceKm || 0} km</strong></span>
                </div>

                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={14} /> {new Date(r.createdAt || r.startTime).toLocaleString()}
                </div>
              </div>

              <div>
                <button onClick={() => navigate(`/live/${r.rideCode}`)} className="btn-secondary" style={{ padding: '0.6rem 1rem', fontSize: '0.85rem' }}>
                  View Map & Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
