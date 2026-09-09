import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom SVG markers
const createCustomIcon = (color, label, isLeader = false) => {
  const svgHtml = `
    <div style="
      background: ${color};
      width: ${isLeader ? '38px' : '30px'};
      height: ${isLeader ? '38px' : '30px'};
      border-radius: 50%;
      border: 3px solid #ffffff;
      box-shadow: 0 0 15px ${color};
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: bold;
      font-size: ${isLeader ? '14px' : '11px'};
    ">
      ${isLeader ? '👑' : '🏍️'}
    </div>
  `;
  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

function AutoCenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.panTo([center.lat, center.lng]);
    }
  }, [center, map]);
  return null;
}

export default function MapView({ routePolyline = [], participants = [], currentLoc, sourceCoords, destinationCoords }) {
  const defaultCenter = sourceCoords || (routePolyline[0] ? [routePolyline[0].lat, routePolyline[0].lng] : [19.0434, 72.8223]);

  // Transform route polyline array into Leaflet LatLng tuples
  const polylinePositions = routePolyline.map((pt) => [pt.lat, pt.lng]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {currentLoc && <AutoCenter center={currentLoc} />}

        {/* Planned Route Polyline */}
        {polylinePositions.length > 1 && (
          <Polyline
            positions={polylinePositions}
            pathOptions={{
              color: '#ff6b00',
              weight: 5,
              opacity: 0.85,
              lineCap: 'round'
            }}
          />
        )}

        {/* Source Marker */}
        {sourceCoords && (
          <Marker position={[sourceCoords.lat, sourceCoords.lng]}>
            <Popup>
              <strong>🚀 Start Point</strong>
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationCoords && (
          <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
            <Popup>
              <strong>🏁 Destination</strong>
            </Popup>
          </Marker>
        )}

        {/* Active Participant Markers */}
        {participants.map((p) => {
          if (!p.lat || !p.lng) return null;
          const isLeader = p.role === 'leader';
          const iconColor = isLeader ? '#ff6b00' : p.isOffRoute ? '#ef4444' : '#00f2fe';
          const icon = createCustomIcon(iconColor, p.userName, isLeader);

          return (
            <Marker key={p.userId} position={[p.lat, p.lng]} icon={icon}>
              <Popup>
                <div style={{ color: '#090d16', fontFamily: 'Inter' }}>
                  <strong style={{ fontSize: '0.95rem' }}>{p.userName}</strong>
                  <div style={{ fontSize: '0.8rem', margin: '4px 0' }}>
                    Role: <span style={{ textTransform: 'capitalize', fontWeight: 'bold' }}>{p.role}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem' }}>
                    Speed: <strong>{p.speed || 0} km/h</strong>
                  </div>
                  {p.isOffRoute && (
                    <div style={{ color: '#dc2626', fontWeight: 'bold', fontSize: '0.8rem', marginTop: '4px' }}>
                      ⚠️ OFF-ROUTE ({p.offRouteDistance}m strayed)
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
