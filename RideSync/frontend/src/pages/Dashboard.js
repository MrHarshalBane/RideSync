import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, LogIn, Navigation, History, Shield, ArrowRight, Radio } from 'lucide-react';

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [recentRides, setRecentRides] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/rides/history');
        setRecentRides(res.data || []);
      } catch (err) {
        console.error('Failed to load ride history', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleJoinRide = async (e) => {
    e.preventDefault();
    setJoinError('');

    if (!joinCode.trim()) {
      setJoinError('Please enter an 8-character Ride Code');
      return;
    }

    try {
      const codeClean = joinCode.trim().toUpperCase();
      const res = await api.post('/rides/join', { rideCode: codeClean });
      navigate(`/live/${codeClean}`);
    } catch (err) {
      setJoinError(err.response?.data?.message || 'Invalid Ride Code. Check and try again.');
    }
  };

  const activeRide = recentRides.find((r) => r.status === 'active');

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%' }}>
      
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(22,30,46,0.9), rgba(255,107,0,0.1))', border: '1px solid var(--border-highlight)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>
            Welcome back, {user?.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Host a new group ride session or enter an 8-character Ride Code to join your squad on the map.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/create-ride" className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <PlusCircle size={18} /> Host New Ride
          </Link>
        </div>
      </div>

      {/* Active Ongoing Ride Alert Banner */}
      {activeRide && (
        <div className="glass-panel alert-pulse" style={{ padding: '1.25rem 1.5rem', marginBottom: '2rem', border: '1px solid var(--accent-orange)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,107,0,0.2)', padding: '0.6rem', borderRadius: '10px' }}>
              <Radio size={24} color="var(--accent-orange)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-orange)', fontWeight: '700', textTransform: 'uppercase' }}>ONGOING ACTIVE RIDE</div>
              <h3 style={{ fontSize: '1.1rem' }}>{activeRide.title}</h3>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Code: <strong style={{ color: '#fff' }}>{activeRide.rideCode}</strong> | Leader: {activeRide.leaderName}</div>
            </div>
          </div>

          <button onClick={() => navigate(`/live/${activeRide.rideCode}`)} className="btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
            Re-enter Live Map <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* Main Grid: Join Code Form & Recent Rides */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Join Ride Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
            <LogIn size={22} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '1.3rem' }}>Join Active Group Ride</h2>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem', lineHeight: '1.5' }}>
            Enter the unique 8-character Ride Code provided by your ride leader to sync telemetry.
          </p>

          {joinError && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.6rem', borderRadius: '6px', fontSize: '0.8rem', marginBottom: '1rem' }}>
              {joinError}
            </div>
          )}

          <form onSubmit={handleJoinRide}>
            <div className="form-group">
              <label>Ride Code (e.g. RS-DEMO1)</label>
              <input
                type="text"
                className="form-control"
                placeholder="RS-XXXXX"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                style={{ fontFamily: 'Outfit', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase', fontSize: '1.1rem' }}
                maxLength={10}
              />
            </div>

            <button type="submit" className="btn-secondary" style={{ width: '100%', justifyContent: 'center', borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)' }}>
              Join Live Map Tracking
            </button>
          </form>
        </div>

        {/* Recent Rides Summary Card */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <History size={22} color="var(--accent-orange)" />
              <h2 style={{ fontSize: '1.3rem' }}>Recent Rides</h2>
            </div>
            <Link to="/history" style={{ fontSize: '0.8rem', color: 'var(--accent-orange)', fontWeight: '600' }}>View All</Link>
          </div>

          {loading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>Loading rides...</div>
          ) : recentRides.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>
              No past rides found. Host or join a ride to begin!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recentRides.slice(0, 3).map((r) => (
                <div key={r._id} style={{ background: 'rgba(255,255,255,0.03)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{r.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Code: <strong style={{ color: 'var(--accent-orange)' }}>{r.rideCode}</strong> | {r.totalDistanceKm || 0} km
                    </div>
                  </div>
                  <span className={`badge ${r.status === 'active' ? 'badge-active' : 'badge-completed'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
