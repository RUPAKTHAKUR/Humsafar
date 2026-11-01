import { Place } from './types';
import { haversineKm } from './places';

export interface Corridor {
  id: string;
  name: string;
  waypoints: Place[];
  totalKm: number;
}

/** Build a corridor from an ordered array of places */
export function buildCorridor(id: string, name: string, waypoints: Place[]): Corridor {
  let totalKm = 0;
  for (let i = 0; i < waypoints.length - 1; i++) {
    totalKm += haversineKm(
      waypoints[i].lat, waypoints[i].lng,
      waypoints[i + 1].lat, waypoints[i + 1].lng
    ) * 1.35;
  }
  return { id, name, waypoints, totalKm: Math.round(totalKm * 10) / 10 };
}

/** Check if a place is within `radiusKm` of any waypoint in corridor */
export function isNearCorridor(place: Place, corridor: Corridor, radiusKm = 3): boolean {
  return corridor.waypoints.some(
    wp => haversineKm(place.lat, place.lng, wp.lat, wp.lng) <= radiusKm
  );
}

/** Snap a place to the nearest waypoint on a corridor */
export function snapToCorridor(place: Place, corridor: Corridor): Place {
  let best = corridor.waypoints[0];
  let bestDist = Infinity;
  for (const wp of corridor.waypoints) {
    const d = haversineKm(place.lat, place.lng, wp.lat, wp.lng);
    if (d < bestDist) {
      bestDist = d;
      best = wp;
    }
  }
  return best;
}

/** Simple bounding-box check to see if two rides share a corridor */
export function sharesCorridor(
  pickup1: Place,
  drop1: Place,
  pickup2: Place,
  drop2: Place,
  thresholdKm = 5
): boolean {
  // Check if the two routes have overlapping midpoints within threshold
  const mid1Lat = (pickup1.lat + drop1.lat) / 2;
  const mid1Lng = (pickup1.lng + drop1.lng) / 2;
  const mid2Lat = (pickup2.lat + drop2.lat) / 2;
  const mid2Lng = (pickup2.lng + drop2.lng) / 2;
  const dist = haversineKm(mid1Lat, mid1Lng, mid2Lat, mid2Lng);
  return dist <= thresholdKm;
}

export function distanceBetween(a: Place, b: Place): number {
  return Math.round(haversineKm(a.lat, a.lng, b.lat, b.lng) * 1.35 * 10) / 10;
}

/** Interpolate a point along a straight route (0=start, 1=end) */
export function interpolateRoute(from: Place, to: Place, fraction: number): { lat: number; lng: number } {
  const f = Math.max(0, Math.min(1, fraction));
  return {
    lat: from.lat + (to.lat - from.lat) * f,
    lng: from.lng + (to.lng - from.lng) * f,
  };
}
