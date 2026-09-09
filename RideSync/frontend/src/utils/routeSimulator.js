/**
 * Route GPS Motion Simulator
 * Interpolates movement along route polyline for live browser demonstration
 */

export class RouteSimulator {
  constructor(routePolyline, onLocationUpdate) {
    this.route = routePolyline || [];
    this.onUpdate = onLocationUpdate;
    this.currentIndex = 0;
    this.timer = null;
    this.isDeviated = false;
    this.speed = 48; // km/h
  }

  start(intervalMs = 1500) {
    if (!this.route || this.route.length === 0) return;
    this.stop();

    this.timer = setInterval(() => {
      if (this.isDeviated) {
        // Simulate straying 150 meters away from current polyline vertex
        const base = this.route[this.currentIndex] || this.route[0];
        const strayLocation = {
          lat: base.lat + 0.002, // ~220 meters off-route
          lng: base.lng + 0.002,
          speed: this.speed + Math.floor(Math.random() * 8 - 4),
          heading: 90
        };
        this.onUpdate(strayLocation);
      } else {
        const currentLoc = this.route[this.currentIndex];
        const nextLoc = this.route[(this.currentIndex + 1) % this.route.length];
        
        let heading = 0;
        if (nextLoc) {
          const dy = nextLoc.lat - currentLoc.lat;
          const dx = nextLoc.lng - currentLoc.lng;
          heading = Math.round((Math.atan2(dx, dy) * 180) / Math.PI);
        }

        const simulatedData = {
          lat: currentLoc.lat,
          lng: currentLoc.lng,
          speed: this.speed + Math.floor(Math.random() * 6 - 3),
          heading: (heading + 360) % 360
        };

        this.onUpdate(simulatedData);

        this.currentIndex = (this.currentIndex + 1) % this.route.length;
      }
    }, intervalMs);
  }

  toggleDeviation() {
    this.isDeviated = !this.isDeviated;
    return this.isDeviated;
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
