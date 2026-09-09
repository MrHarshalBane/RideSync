import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { PlusCircle, MapPin, Navigation, Flag, Sparkles } from 'lucide-react';

const PRESET_ROUTES = [
  {
    id: 'route_mumbai_highway',
    name: 'Western Express Highway Sunrise Rally',
    sourceName: 'Bandra Reclamation, Mumbai',
    sourceCoords: { lat: 19.0434, lng: 72.8223 },
    destinationName: 'Gorai Beach, Borivali',
    destinationCoords: { lat: 19.2458, lng: 72.7812 },
    polyline: [
      { lat: 19.0434, lng: 72.8223 },
      { lat: 19.0968, lng: 72.8516 },
      { lat: 19.1412, lng: 72.8465 },
      { lat: 19.1985, lng: 72.8488 },
      { lat: 19.2458, lng: 72.7812 }
    ]
  },
  {
    id: 'route_marine_drive',
    name: 'South Mumbai Coastal Promenade Run',
    sourceName: 'Nariman Point, Marine Drive',
    sourceCoords: { lat: 18.926, lng: 72.8229 },
    destinationName: 'Worli Sea Face',
    destinationCoords: { lat: 19.0117, lng: 72.8149 },
    polyline: [
      { lat: 18.926, lng: 72.8229 },
      { lat: 18.9432, lng: 72.8236 },
      { lat: 18.9715, lng: 72.8099 },
      { lat: 19.0117, lng: 72.8149 }
    ]
  },
  {
    id: 'route_lonavala',
    name: 'Mumbai to Lonavala Ghat Expressway',
    sourceName: 'Vashi Bridge Toll Plaza',
    sourceCoords: { lat: 19.063, lng: 72.9969 },
    destinationName: 'Tiger Point, Lonavala',
    destinationCoords: { lat: 18.7557, lng: 73.4091 },
    polyline: [
      { lat: 19.063, lng: 72.9969 },
      { lat: 19.0211, lng: 73.0945 },
      { lat: 18.8923, lng: 73.1812 },
      { lat: 18.7557, lng: 73.4091 }
    ]
  }
];

export default function CreateRide() {
  const [title, setTitle] = useState(PRESET_ROUTES[0].name);
  const [selectedPreset, setSelectedPreset] = useState(PRESET_ROUTES[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSelectPreset = (preset) => {
    setSelectedPreset(preset);
    setTitle(preset.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const payload = {
        title,
        sourceName: selectedPreset.sourceName,
        sourceCoords: selectedPreset.sourceCoords,
        destinationName: selectedPreset.destinationName,
        destinationCoords: selectedPreset.destinationCoords,
        routePolyline: selectedPreset.polyline
      };

      const res = await api.post('/rides/create', payload);
      const rideCode = res.data.ride.rideCode;
      navigate(`/live/${rideCode}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create ride. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem 1.5rem', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '2.5rem', border: '1px solid var(--border-highlight)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ background: 'rgba(255,107,0,0.15)', padding: '0.6rem', borderRadius: '12px' }}>
            <PlusCircle size={24} color="var(--accent-orange)" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem' }}>Host a New Group Ride</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Select a route preset or customize coordinates to generate an 8-character Ride Code.
            </p>
          </div>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          
          <div className="form-group">
            <label>Ride Event Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sunday Morning Highway Rally"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* Route Preset Cards */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', uppercase: 'true', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.75rem' }}>
              <Sparkles size={16} color="var(--accent-orange)" /> Select Pre-Configured Route
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
              {PRESET_ROUTES.map((p) => {
                const isSelected = selectedPreset.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    style={{
                      background: isSelected ? 'rgba(255,107,0,0.15)' : 'rgba(255,255,255,0.03)',
                      border: isSelected ? '1px solid var(--accent-orange)' : '1px solid var(--border-color)',
                      padding: '1rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ fontWeight: '700', fontSize: '0.9rem', marginBottom: '0.4rem', color: isSelected ? 'var(--accent-orange)' : '#fff' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      📍 {p.sourceName.split(',')[0]} ➔ {p.destinationName.split(',')[0]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Route Summary Box */}
          <div style={{ background: 'rgba(10,15,26,0.8)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '700', marginBottom: '0.75rem' }}>
              <Navigation size={16} /> ROUTE CONFIGURATION DETAILS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={14} color="var(--accent-green)" /> Source Start
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '2px' }}>
                  {selectedPreset.sourceName}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Flag size={14} color="var(--accent-red)" /> Destination
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '600', marginTop: '2px' }}>
                  {selectedPreset.destinationName}
                </div>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.9rem', fontSize: '1rem' }} disabled={submitting}>
            {submitting ? 'Generating Ride Code...' : '🚀 Generate Ride Code & Launch Map'}
          </button>
        </form>

      </div>
    </div>
  );
}
