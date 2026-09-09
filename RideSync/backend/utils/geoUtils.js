/**
 * Geometric & Spatial Math Utilities for RideSync
 * Calculates Haversine distance and off-route polyline deviation
 */

// Convert degrees to radians
function toRad(value) {
  return (value * Math.PI) / 180;
}

/**
 * Calculates straight-line distance in meters between two lat/lng points using Haversine formula
 */
function calculateDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in meters
}

/**
 * Calculates minimum distance from point P to line segment AB (in meters)
 */
function distanceToSegmentMeters(plat, plng, alat, alng, blat, blng) {
  // Approximate Cartesian projection locally around point A
  const cosLat = Math.cos(toRad(plat));
  const px = plng * cosLat;
  const py = plat;
  const ax = alng * cosLat;
  const ay = alat;
  const bx = blng * cosLat;
  const by = blat;

  const dx = bx - ax;
  const dy = by - ay;

  if (dx === 0 && dy === 0) {
    return calculateDistanceMeters(plat, plng, alat, alng);
  }

  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)));
  const projLat = ay + t * dy;
  const projLng = (ax + t * dx) / cosLat;

  return calculateDistanceMeters(plat, plng, projLat, projLng);
}

/**
 * Determines if a current location (lat, lng) is off-route from polyline array of coordinates
 * Threshold default: 100 meters
 */
function isOffRoute(currentLoc, routePolyline, thresholdMeters = 100) {
  if (!routePolyline || routePolyline.length === 0) {
    return { isOffRoute: false, minDistance: 0 };
  }

  if (routePolyline.length === 1) {
    const dist = calculateDistanceMeters(
      currentLoc.lat,
      currentLoc.lng,
      routePolyline[0].lat,
      routePolyline[0].lng
    );
    return { isOffRoute: dist > thresholdMeters, minDistance: Math.round(dist) };
  }

  let minDistance = Infinity;

  for (let i = 0; i < routePolyline.length - 1; i++) {
    const pA = routePolyline[i];
    const pB = routePolyline[i + 1];
    const dist = distanceToSegmentMeters(
      currentLoc.lat,
      currentLoc.lng,
      pA.lat,
      pA.lng,
      pB.lat,
      pB.lng
    );
    if (dist < minDistance) {
      minDistance = dist;
    }
  }

  return {
    isOffRoute: minDistance > thresholdMeters,
    minDistance: Math.round(minDistance),
  };
}

module.exports = {
  calculateDistanceMeters,
  distanceToSegmentMeters,
  isOffRoute,
};
