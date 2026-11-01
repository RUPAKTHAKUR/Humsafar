import { Place } from './types';
import { haversineKm } from './places';

export type VehicleType = 'mini4' | 'suv7';

export interface VehicleConfig {
  id: VehicleType;
  label: string;
  seats: number;       // total seats
  poolSeats: number;   // poolable seats
  baseFare: number;    // ₹
  perKmRate: number;   // ₹/km per seat (in solo mode this is per whole cab)
  bookingFee: number;  // ₹ per rider
  icon: string;
}

export const VEHICLES: Record<VehicleType, VehicleConfig> = {
  mini4: {
    id: 'mini4',
    label: '4-Seater Mini',
    seats: 4,
    poolSeats: 3,
    baseFare: 30,
    perKmRate: 11,
    bookingFee: 9,
    icon: '🚕',
  },
  suv7: {
    id: 'suv7',
    label: '7-Seater SUV',
    seats: 7,
    poolSeats: 6,
    baseFare: 45,
    perKmRate: 14,
    bookingFee: 9,
    icon: '🚐',
  },
};

export interface SegmentFare {
  fromId: string;
  toId: string;
  distanceKm: number;
  riderCount: number;
  costPerRider: number;
  totalCost: number;
}

export interface FareResult {
  vehicleType: VehicleType;
  mode: 'share' | 'solo';
  distanceKm: number;
  baseFare: number;
  perKmCharge: number;
  bookingFee: number;
  detourCharge: number;
  totalFare: number;
  soloFare: number;
  savingsVsSolo: number;
  savingsPct: number;
  segments: SegmentFare[];
}

/** Calculate fare for a simple A→B ride (no pooling details) */
export function calculateSimpleFare(
  from: Place,
  to: Place,
  vehicleType: VehicleType,
  mode: 'share' | 'solo',
  riderCount = 1
): FareResult {
  const vehicle = VEHICLES[vehicleType];
  const distanceKm = Math.max(1, haversineKm(from.lat, from.lng, to.lat, to.lng) * 1.35);

  const baseFare = vehicle.baseFare;
  const perKmCharge = vehicle.perKmRate * distanceKm;
  const bookingFee = vehicle.bookingFee;

  // Solo: entire cab cost
  const soloTotal = baseFare + perKmCharge + bookingFee;

  let totalFare: number;
  let savingsVsSolo: number;

  if (mode === 'solo') {
    totalFare = soloTotal;
    savingsVsSolo = 0;
  } else {
    // Share: split proportionally
    const effectiveRiders = Math.max(1, riderCount);
    totalFare = baseFare / effectiveRiders + perKmCharge / effectiveRiders + bookingFee;
    savingsVsSolo = soloTotal - totalFare;
  }

  const savingsPct = soloTotal > 0 ? Math.round((savingsVsSolo / soloTotal) * 100) : 0;

  return {
    vehicleType,
    mode,
    distanceKm: Math.round(distanceKm * 10) / 10,
    baseFare: Math.round(baseFare),
    perKmCharge: Math.round(perKmCharge),
    bookingFee,
    detourCharge: 0,
    totalFare: Math.round(totalFare),
    soloFare: Math.round(soloTotal),
    savingsVsSolo: Math.round(savingsVsSolo),
    savingsPct,
    segments: [
      {
        fromId: from.id,
        toId: to.id,
        distanceKm: Math.round(distanceKm * 10) / 10,
        riderCount,
        costPerRider: Math.round(totalFare),
        totalCost: Math.round(totalFare * riderCount),
      },
    ],
  };
}

/** Segment-by-segment fare calculation for pooled rides */
export function calculateSegmentFares(
  stops: { place: Place; ridersBoarding: string[]; ridersAlighting: string[] }[],
  vehicleType: VehicleType
): { riderFares: Record<string, number>; segments: SegmentFare[] } {
  const vehicle = VEHICLES[vehicleType];
  const segments: SegmentFare[] = [];
  const riderFares: Record<string, number> = {};

  let activeRiders = new Set<string>();

  for (let i = 0; i < stops.length - 1; i++) {
    const curr = stops[i];
    const next = stops[i + 1];

    // Board riders at current stop
    curr.ridersBoarding.forEach(r => activeRiders.add(r));

    const distKm = Math.max(0.5, haversineKm(
      curr.place.lat, curr.place.lng,
      next.place.lat, next.place.lng
    ) * 1.35);

    const totalSegCost = vehicle.perKmRate * distKm;
    const riderCount = activeRiders.size;
    const costPerRider = riderCount > 0 ? totalSegCost / riderCount : 0;

    const segFare: SegmentFare = {
      fromId: curr.place.id,
      toId: next.place.id,
      distanceKm: Math.round(distKm * 10) / 10,
      riderCount,
      costPerRider: Math.round(costPerRider),
      totalCost: Math.round(totalSegCost),
    };
    segments.push(segFare);

    activeRiders.forEach(r => {
      riderFares[r] = (riderFares[r] ?? 0) + costPerRider;
    });

    // Alight riders after this segment
    next.ridersAlighting.forEach(r => activeRiders.delete(r));
  }

  // Add base fare + booking fee per rider
  Object.keys(riderFares).forEach(r => {
    riderFares[r] = Math.round(riderFares[r] + vehicle.baseFare / Math.max(1, Object.keys(riderFares).length) + vehicle.bookingFee);
  });

  return { riderFares, segments };
}

export function formatRupees(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function estimateArrivalTime(distanceKm: number, minutesOffset = 0): string {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesOffset + Math.round((distanceKm / 25) * 60));
  return now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
