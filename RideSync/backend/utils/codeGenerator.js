/**
 * Generates a unique 8-character Ride Code for RideSync sessions
 * Example format: RS-8A9X2 or RIDE-9X4A
 */
function generateRideCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 5; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `RS-${randomPart}`;
}

module.exports = { generateRideCode };
