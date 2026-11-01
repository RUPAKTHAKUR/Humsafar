// Shared TypeScript interfaces for Humsafar

export type VehicleType = 'mini4' | 'suv7';
export type RideMode = 'share' | 'solo';
export type GenderFilter = 'any' | 'women';
export type RideStatus = 'searching' | 'matched' | 'pickup' | 'onride' | 'done' | 'cancelled';
export type DriverStatus = 'online' | 'offline' | 'onride';

export interface Place {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  type: 'airport' | 'metro' | 'hub' | 'area' | 'station';
}

export interface Route {
  from: Place;
  to: Place;
  distanceKm: number;
  durationMin: number;
  corridor?: string;
}

export interface FareBreakdown {
  baseFare: number;
  perKmCharge: number;
  bookingFee: number;
  detourCharge: number;
  totalFare: number;
  savingsVsSolo: number;
  distanceKm: number;
}

export interface Rider {
  id: string;
  name: string;
  gender: 'male' | 'female';
  pickup: Place;
  drop: Place;
  fare: FareBreakdown;
  status: RideStatus;
  rating: number;
  profilePic?: string;
}

export interface PooledRide {
  id: string;
  riders: Rider[];
  vehicle: VehicleType;
  driver: Driver;
  segments: Segment[];
  startTime: Date;
  estimatedEndTime: Date;
  status: 'waiting' | 'active' | 'completed';
}

export interface Segment {
  from: Place;
  to: Place;
  distanceKm: number;
  riders: string[]; // rider ids in this segment
  costPerRider: number;
}

export interface Driver {
  id: string;
  name: string;
  rating: number;
  totalRides: number;
  vehicle: {
    type: VehicleType;
    model: string;
    number: string;
    color: string;
  };
  status: DriverStatus;
  currentLocation?: { lat: number; lng: number };
  earnings: {
    today: number;
    week: number;
    month: number;
  };
  otp?: string;
}

export interface BookingRequest {
  pickupPlace: Place;
  dropPlace: Place;
  vehicleType: VehicleType;
  mode: RideMode;
  genderFilter: GenderFilter;
  userId: string;
  requestedAt: Date;
}

export interface Notification {
  id: string;
  type: 'ride_matched' | 'pickup_near' | 'ride_complete' | 'promo' | 'safety' | 'payment';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface TripHistory {
  id: string;
  from: Place;
  to: Place;
  date: Date;
  fare: number;
  savings: number;
  rating?: number;
  mode: RideMode;
  status: 'completed' | 'cancelled';
  driver?: Driver;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female' | 'other';
  rating: number;
  totalRides: number;
  savedLocations: Place[];
  preferredMode: RideMode;
  preferredGender: GenderFilter;
  notifications: Notification[];
  tripHistory: TripHistory[];
}

export interface OwnerMetrics {
  totalBookings: number;
  totalRevenue: number;
  activeDrivers: number;
  avgPoolSavings: number;
  completionRate: number;
  womenOnlyRides: number;
  cityBreakdown: Record<string, number>;
  revenueByDay: { date: string; revenue: number; rides: number }[];
}
