import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { SocketContext } from '../context/SocketContext';
import api from '../services/api';
import MapView from '../components/MapView';
import HUDOverlay from '../components/HUDOverlay';
import OffRouteAlertModal from '../components/OffRouteAlertModal';
import ChatDrawer from '../components/ChatDrawer';
import { RouteSimulator } from '../utils/routeSimulator';
import { calculateDistanceKm, calculateETA } from '../utils/haversine';
import { Play, Square, AlertTriangle, MessageSquare, Users, Power, Radio } from 'lucide-react';

export default function LiveRide() {
  const { code } = useParams();
  const rideCode = (code || '').toUpperCase();

  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const [rideData, setRideData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [currentLoc, setCurrentLoc] = useState(null);
  const [speed, setSpeed] = useState(0);
  const [distanceKm, setDistanceKm] = useState(0);
  const [eta, setEta] = useState('Calculating');
  
  // Simulator State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isDeviated, setIsDeviated] = useState(false);
  const simulatorRef = useRef(null);

  // Modals & Drawers
  const [alertData, setAlertData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isParticipantsOpen, setIsParticipantsOpen] = useState(false);

  // Fetch ride details
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await api.get(`/rides/code/${rideCode}`);
        setRideData(res.data);
        if (res.data.sourceCoords) {
          setCurrentLoc(res.data.sourceCoords);
        }
      } catch (err) {
        console.error('Ride not found', err);
      }
    };

    fetchRide();
  }, [rideCode]);

  // Socket setup & real-time events
  useEffect(() => {
    if (!socket || !user || !rideData) return;

    const userRole = rideData.leader === user.id || rideData.leader._id === user.id ? 'leader' : 'follower';

    socket.emit('join_ride_room', {
      rideCode,
      userId: user.id || user._id,
      userName: user.name,
      role: userRole
    });

    // Active participants snapshot listener
    socket.on('active_participants_snapshot', (snapshot) => {
      const activeList = Object.values(snapshot);
      setParticipants(activeList);
    });

    // Location updated listener
    socket.on('location_updated', (loc) => {
      setParticipants((prev) => {
        const map = new Map(prev.map((p) => [p.userId, p]));
        map.set(loc.userId, loc);
        return Array.from(map.values());
      });
    });

    // Off-route alert listener
    socket.on('off_route_alert', (alert) => {
      setAlertData(alert);
    });

    // SOS alert listener
    socket.on('sos_emergency_alert', (sos) => {
      alert(`🚨 EMERGENCY SOS FROM ${sos.userName.toUpperCase()}! Coordinates: ${sos.lat}, ${sos.lng}`);
    });

    return () => {
      socket.emit('leave_ride_room', {
        rideCode,
        userId: user.id || user._id
      });
      socket.off('active_participants_snapshot');
      socket.off('location_updated');
      socket.off('off_route_alert');
      socket.off('sos_emergency_alert');
    };
  }, [socket, user, rideData, rideCode]);

  // GPS Simulator Helper
  const handleToggleSimulator = () => {
    if (!rideData || !rideData.routePolyline) return;

    if (isSimulating) {
      simulatorRef.current?.stop();
      setIsSimulating(false);
      setIsDeviated(false);
    } else {
      const userRole = rideData.leader === user.id || rideData.leader._id === user.id ? 'leader' : 'follower';
      
      const sim = new RouteSimulator(rideData.routePolyline, (simLoc) => {
        setCurrentLoc(simLoc);
        setSpeed(simLoc.speed);

        // Update telemetry calculations
        if (rideData.destinationCoords) {
          const remDist = calculateDistanceKm(simLoc.lat, simLoc.lng, rideData.destinationCoords.lat, rideData.destinationCoords.lng);
          setDistanceKm(+remDist.toFixed(1));
          setEta(calculateETA(remDist, simLoc.speed));
        }

        // Emit over socket
        if (socket) {
          socket.emit('update_location', {
            rideCode,
            userId: user.id || user._id,
            userName: user.name,
            role: userRole,
            lat: simLoc.lat,
            lng: simLoc.lng,
            speed: simLoc.speed,
            heading: simLoc.heading,
            routePolyline: rideData.routePolyline
          });
        }
      });

      simulatorRef.current = sim;
      sim.start(1500);
      setIsSimulating(true);
    }
  };

  const handleToggleDeviation = () => {
    if (simulatorRef.current) {
      const state = simulatorRef.current.toggleDeviation();
      setIsDeviated(state);
    }
  };

  const handleTriggerSOS = () => {
    if (!socket || !currentLoc) return;
    socket.emit('trigger_sos', {
      rideCode,
      lat: currentLoc.lat,
      lng: currentLoc.lng
    });
    alert('🚨 Emergency SOS alert broadcast to all riders!');
  };

  const handleEndRide = async () => {
    if (!window.confirm('Are you sure you want to end this ride session for all riders?')) return;
    try {
      await api.post(`/rides/end/${rideData._id}`);
      navigate('/history');
    } catch (err) {
      alert('Error ending ride.');
    }
  };

  const isLeader = rideData && (rideData.leader === user?.id || rideData.leader?._id === user?.id);

  return (
    <div style={{ position: 'relative', width: '100vw', height: 'calc(100vh - 65px)', overflow: 'hidden', background: '#090d16' }}>
      
      {/* HUD Floating Telemetry Bar */}
      <HUDOverlay
        rideCode={rideCode}
        speed={speed}
        distanceKm={distanceKm}
        eta={eta}
        activeCount={participants.length || 1}
      />

      {/* Main Map Component */}
      <MapView
        routePolyline={rideData?.routePolyline || []}
        participants={participants}
        currentLoc={currentLoc}
        sourceCoords={rideData?.sourceCoords}
        destinationCoords={rideData?.destinationCoords}
      />

      {/* Floating Control Toolbar (Bottom Center) */}
      <div style={{ position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 950, display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        
        {/* GPS Simulator Toggle */}
        <button onClick={handleToggleSimulator} className={isSimulating ? 'btn-danger' : 'btn-primary'} style={{ padding: '0.65rem 1.25rem', fontSize: '0.85rem' }}>
          {isSimulating ? <Square size={16} /> : <Play size={16} />}
          {isSimulating ? 'Stop Simulator' : 'Start GPS Motion'}
        </button>

        {/* Simulate Off-Route Straying */}
        {isSimulating && (
          <button onClick={handleToggleDeviation} className="btn-secondary" style={{ borderColor: isDeviated ? '#ef4444' : 'var(--border-color)', color: isDeviated ? '#ef4444' : '#fff', padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
            <AlertTriangle size={16} color={isDeviated ? '#ef4444' : 'var(--accent-orange)'} />
            {isDeviated ? 'Off-Route Sim Active' : 'Simulate Off-Route'}
          </button>
        )}

        {/* Chat Drawer Button */}
        <button onClick={() => setIsChatOpen(!isChatOpen)} className="btn-secondary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
          <MessageSquare size={16} color="var(--accent-cyan)" /> Chat
        </button>

        {/* Participants Sidebar Toggle */}
        <button onClick={() => setIsParticipantsOpen(!isParticipantsOpen)} className="btn-secondary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
          <Users size={16} color="var(--accent-purple)" /> Squad ({participants.length})
        </button>

        {/* End Ride Button (Leader Only) */}
        {isLeader && (
          <button onClick={handleEndRide} className="btn-danger" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
            <Power size={16} /> End Ride
          </button>
        )}
      </div>

      {/* Participants Drawer (Right Panel) */}
      {isParticipantsOpen && (
        <div className="glass-panel" style={{ position: 'absolute', top: '5.5rem', right: '1.25rem', width: '280px', maxHeight: '400px', zIndex: 1000, padding: '1rem', overflowY: 'auto' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--accent-orange)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Radio size={16} /> ACTIVE RIDERS IN SQUAD
          </div>
          {participants.map((p) => (
            <div key={p.userId} style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', marginBottom: '0.5rem', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: '600' }}>{p.userName}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{p.speed || 0} km/h</div>
              </div>
              <span className={`badge ${p.role === 'leader' ? 'badge-leader' : 'badge-follower'}`}>
                {p.role}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Off Route Warning Modal */}
      <OffRouteAlertModal
        alertData={alertData}
        onClose={() => setAlertData(null)}
      />

      {/* Live In-Ride Chat Drawer */}
      <ChatDrawer
        rideCode={rideCode}
        socket={socket}
        user={user}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onTriggerSOS={handleTriggerSOS}
      />

    </div>
  );
}
