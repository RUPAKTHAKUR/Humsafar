import { Place } from './types';
import { VehicleType, VEHICLES, calculateSegmentFares } from './pricing';
import { haversineKm } from './places';

export interface PoolRider {
  id: string;
  name: string;
  gender: 'male' | 'female';
  pickup: Place;
  drop: Place;
  womenOnly: boolean;
}

export interface PoolMatch {
  riders: PoolRider[];
  vehicleType: VehicleType;
  orderedStops: Place[];
  riderFares: Record<string, number>; // riderId → fare in ₹
  totalKm: number;
  estimatedDurationMin: number;
  poolSavings: number; // total savings vs all solo
}

/** Generate simulated pool riders for demo */
export function generatePoolRiders(
  userPickup: Place,
  userDrop: Place,
  vehicleType: VehicleType,
  genderFilter: 'any' | 'women'
): PoolRider[] {
  const vehicle = VEHICLES[vehicleType];
  const maxExtra = vehicle.poolSeats - 1; // slots besides the user

  const fakeNames = [
    ['Priya Sharma', 'female'],
    ['Rahul Verma', 'male'],
    ['Ananya Singh', 'female'],
    ['Karan Mehta', 'male'],
    ['Divya Nair', 'female'],
    ['Aditya Kumar', 'male'],
    ['Sneha Patel', 'female'],
    ['Rohan Gupta', 'male'],
  ] as [string, 'male' | 'female'][];

  // Filter by gender
  const eligible = genderFilter === 'women'
    ? fakeNames.filter(([, g]) => g === 'female')
    : fakeNames;

  // Simulate 1-2 nearby riders who share a similar route
  const count = Math.min(maxExtra, Math.floor(Math.random() * 2) + 1);
  const riders: PoolRider[] = [];

  for (let i = 0; i < count; i++) {
    const [name, gender] = eligible[i % eligible.length];
    // Slight offset for pickup/drop (within 2 km)
    const offsetLat = (Math.random() - 0.5) * 0.018;
    const offsetLng = (Math.random() - 0.5) * 0.018;

    // Create nearby pickup/drop as pseudo-places
    const nearPickup: Place = {
      ...userPickup,
      id: `pool_${i}_pickup`,
      name: `Near ${userPickup.name}`,
      lat: userPickup.lat + offsetLat,
      lng: userPickup.lng + offsetLng,
    };
    const nearDrop: Place = {
      ...userDrop,
      id: `pool_${i}_drop`,
      name: `Near ${userDrop.name}`,
      lat: userDrop.lat + offsetLat * 0.5,
      lng: userDrop.lng + offsetLng * 0.5,
    };

    riders.push({
      id: `rider_${i}_${Date.now()}`,
      name,
      gender,
      pickup: nearPickup,
      drop: nearDrop,
      womenOnly: gender === 'female' && Math.random() > 0.5,
    });
  }

  return riders;
}

/** Order stops optimally (greedy nearest neighbour) */
export function orderStops(
  userPickup: Place,
  allRiders: PoolRider[],
  userDrop: Place
): Place[] {
  // Collect all unique pickup/drop points
  const pickups = allRiders.map(r => r.pickup);
  const drops = allRiders.map(r => r.drop);

  // Simple order: all pickups first (ordered by proximity), then drops
  // Start from userPickup
  const unvisited = [...pickups];
  const ordered: Place[] = [userPickup];

  let current = userPickup;
  while (unvisited.length > 0) {
    let nearest = unvisited[0];
    let nearestDist = haversineKm(current.lat, current.lng, nearest.lat, nearest.lng);
    for (const p of unvisited.slice(1)) {
      const d = haversineKm(current.lat, current.lng, p.lat, p.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = p;
      }
    }
    ordered.push(nearest);
    current = nearest;
    unvisited.splice(unvisited.indexOf(nearest), 1);
  }

  // Then drops
  const unvisitedDrops = [...drops, userDrop];
  while (unvisitedDrops.length > 0) {
    let nearest = unvisitedDrops[0];
    let nearestDist = haversineKm(current.lat, current.lng, nearest.lat, nearest.lng);
    for (const p of unvisitedDrops.slice(1)) {
      const d = haversineKm(current.lat, current.lng, p.lat, p.lng);
      if (d < nearestDist) {
        nearestDist = d;
        nearest = p;
      }
    }
    ordered.push(nearest);
    current = nearest;
    unvisitedDrops.splice(unvisitedDrops.indexOf(nearest), 1);
  }

  return ordered;
}

/** Create a full pool match with fare calculation */
export function createPoolMatch(
  user: PoolRider,
  poolRiders: PoolRider[],
  vehicleType: VehicleType
): PoolMatch {
  const allRiders = [user, ...poolRiders];
  const orderedStops = orderStops(user.pickup, poolRiders, user.drop);

  // Build stops with boarding/alighting info
  const stops = orderedStops.map(place => {
    const ridersBoarding = allRiders
      .filter(r => r.pickup.id === place.id || (r.pickup.lat === place.lat && r.pickup.lng === place.lng))
      .map(r => r.id);
    const ridersAlighting = allRiders
      .filter(r => r.drop.id === place.id || (r.drop.lat === place.lat && r.drop.lng === place.lng))
      .map(r => r.id);
    return { place, ridersBoarding, ridersAlighting };
  });

  const { riderFares, segments } = calculateSegmentFares(stops, vehicleType);

  // Calculate total km
  let totalKm = 0;
  for (let i = 0; i < orderedStops.length - 1; i++) {
    totalKm += haversineKm(
      orderedStops[i].lat, orderedStops[i].lng,
      orderedStops[i + 1].lat, orderedStops[i + 1].lng
    ) * 1.35;
  }

  // Solo fare for comparison
  const vehicle = VEHICLES[vehicleType];
  const userDistKm = haversineKm(user.pickup.lat, user.pickup.lng, user.drop.lat, user.drop.lng) * 1.35;
  const soloFare = vehicle.baseFare + vehicle.perKmRate * userDistKm + vehicle.bookingFee;
  const userPoolFare = riderFares[user.id] ?? Math.round(soloFare / allRiders.length);
  const poolSavings = Math.round(soloFare - userPoolFare);

  return {
    riders: allRiders,
    vehicleType,
    orderedStops,
    riderFares,
    totalKm: Math.round(totalKm * 10) / 10,
    estimatedDurationMin: Math.round((totalKm / 25) * 60),
    poolSavings: Math.max(0, poolSavings),
  };
}
