import { Place } from './types';

// India-wide locations: 12 cities, 70+ places
export const PLACES: Place[] = [
  // ─── Delhi NCR ───────────────────────────────────────────────
  { id: 'del_igi', name: 'Indira Gandhi International Airport', city: 'Delhi NCR', lat: 28.5562, lng: 77.1000, type: 'airport' },
  { id: 'del_cp', name: 'Connaught Place', city: 'Delhi NCR', lat: 28.6315, lng: 77.2167, type: 'hub' },
  { id: 'del_cyber', name: 'Cyber Hub (Gurugram)', city: 'Delhi NCR', lat: 28.4944, lng: 77.0890, type: 'hub' },
  { id: 'del_huda', name: 'Huda City Centre', city: 'Delhi NCR', lat: 28.4595, lng: 77.0266, type: 'metro' },
  { id: 'del_noida', name: 'Noida Sector 62', city: 'Delhi NCR', lat: 28.6267, lng: 77.3660, type: 'hub' },
  { id: 'del_dwarka', name: 'Dwarka Sector 21', city: 'Delhi NCR', lat: 28.5523, lng: 77.0560, type: 'metro' },
  { id: 'del_rohini', name: 'Rohini West', city: 'Delhi NCR', lat: 28.7197, lng: 77.0786, type: 'area' },
  { id: 'del_lajpat', name: 'Lajpat Nagar', city: 'Delhi NCR', lat: 28.5702, lng: 77.2436, type: 'area' },
  { id: 'del_saket', name: 'Saket', city: 'Delhi NCR', lat: 28.5247, lng: 77.2131, type: 'area' },
  { id: 'del_gurgaon', name: 'DLF Phase 1 Gurgaon', city: 'Delhi NCR', lat: 28.4769, lng: 77.0927, type: 'hub' },

  // ─── Mumbai ──────────────────────────────────────────────────
  { id: 'mum_csia', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', lat: 19.0896, lng: 72.8656, type: 'airport' },
  { id: 'mum_bkc', name: 'Bandra Kurla Complex (BKC)', city: 'Mumbai', lat: 19.0641, lng: 72.8653, type: 'hub' },
  { id: 'mum_andheri', name: 'Andheri West', city: 'Mumbai', lat: 19.1197, lng: 72.8464, type: 'area' },
  { id: 'mum_bandra', name: 'Bandra West', city: 'Mumbai', lat: 19.0544, lng: 72.8322, type: 'area' },
  { id: 'mum_churchgate', name: 'Churchgate', city: 'Mumbai', lat: 18.9354, lng: 72.8280, type: 'station' },
  { id: 'mum_powai', name: 'Powai', city: 'Mumbai', lat: 19.1176, lng: 72.9060, type: 'hub' },
  { id: 'mum_thane', name: 'Thane Station', city: 'Mumbai', lat: 19.1863, lng: 72.9637, type: 'station' },
  { id: 'mum_dadar', name: 'Dadar', city: 'Mumbai', lat: 19.0186, lng: 72.8435, type: 'station' },
  { id: 'mum_worli', name: 'Worli', city: 'Mumbai', lat: 19.0128, lng: 72.8167, type: 'hub' },
  { id: 'mum_malad', name: 'Malad West', city: 'Mumbai', lat: 19.1871, lng: 72.8478, type: 'area' },

  // ─── Bangalore ───────────────────────────────────────────────
  { id: 'blr_bia', name: 'Kempegowda International Airport (BLR)', city: 'Bangalore', lat: 13.1986, lng: 77.7066, type: 'airport' },
  { id: 'blr_mg', name: 'MG Road', city: 'Bangalore', lat: 12.9757, lng: 77.6095, type: 'hub' },
  { id: 'blr_whitefield', name: 'Whitefield', city: 'Bangalore', lat: 12.9698, lng: 77.7500, type: 'hub' },
  { id: 'blr_electronic', name: 'Electronic City', city: 'Bangalore', lat: 12.8399, lng: 77.6770, type: 'hub' },
  { id: 'blr_koramangala', name: 'Koramangala', city: 'Bangalore', lat: 12.9352, lng: 77.6245, type: 'area' },
  { id: 'blr_indiranagar', name: 'Indiranagar', city: 'Bangalore', lat: 12.9784, lng: 77.6408, type: 'area' },
  { id: 'blr_hsr', name: 'HSR Layout', city: 'Bangalore', lat: 12.9122, lng: 77.6446, type: 'area' },
  { id: 'blr_jayanagar', name: 'Jayanagar', city: 'Bangalore', lat: 12.9250, lng: 77.5938, type: 'area' },
  { id: 'blr_hebbal', name: 'Hebbal', city: 'Bangalore', lat: 13.0358, lng: 77.5970, type: 'area' },
  { id: 'blr_yelahanka', name: 'Yelahanka', city: 'Bangalore', lat: 13.1006, lng: 77.5963, type: 'area' },

  // ─── Chennai ─────────────────────────────────────────────────
  { id: 'che_maa', name: 'Chennai International Airport', city: 'Chennai', lat: 12.9941, lng: 80.1709, type: 'airport' },
  { id: 'che_adyar', name: 'Adyar', city: 'Chennai', lat: 13.0012, lng: 80.2565, type: 'area' },
  { id: 'che_velachery', name: 'Velachery', city: 'Chennai', lat: 12.9815, lng: 80.2209, type: 'area' },
  { id: 'che_tnagar', name: 'T. Nagar', city: 'Chennai', lat: 13.0418, lng: 80.2341, type: 'hub' },
  { id: 'che_omr', name: 'OMR (Old Mahabalipuram Road)', city: 'Chennai', lat: 12.9116, lng: 80.2283, type: 'hub' },
  { id: 'che_egmore', name: 'Egmore', city: 'Chennai', lat: 13.0732, lng: 80.2609, type: 'station' },
  { id: 'che_anna', name: 'Anna Nagar', city: 'Chennai', lat: 13.0850, lng: 80.2101, type: 'area' },

  // ─── Hyderabad ───────────────────────────────────────────────
  { id: 'hyd_rgia', name: 'Rajiv Gandhi International Airport', city: 'Hyderabad', lat: 17.2403, lng: 78.4294, type: 'airport' },
  { id: 'hyd_hitec', name: 'HITEC City', city: 'Hyderabad', lat: 17.4435, lng: 78.3772, type: 'hub' },
  { id: 'hyd_banjara', name: 'Banjara Hills', city: 'Hyderabad', lat: 17.4126, lng: 78.4480, type: 'area' },
  { id: 'hyd_gachi', name: 'Gachibowli', city: 'Hyderabad', lat: 17.4402, lng: 78.3489, type: 'hub' },
  { id: 'hyd_secunderabad', name: 'Secunderabad', city: 'Hyderabad', lat: 17.4399, lng: 78.4983, type: 'station' },
  { id: 'hyd_lb', name: 'LB Nagar', city: 'Hyderabad', lat: 17.3488, lng: 78.5505, type: 'area' },
  { id: 'hyd_kukatpally', name: 'Kukatpally', city: 'Hyderabad', lat: 17.4849, lng: 78.3959, type: 'area' },

  // ─── Kolkata ─────────────────────────────────────────────────
  { id: 'kol_nsc', name: 'Netaji Subhas Chandra Airport', city: 'Kolkata', lat: 22.6520, lng: 88.4463, type: 'airport' },
  { id: 'kol_saltlake', name: 'Salt Lake City (Sector V)', city: 'Kolkata', lat: 22.5764, lng: 88.4348, type: 'hub' },
  { id: 'kol_howrah', name: 'Howrah Station', city: 'Kolkata', lat: 22.5851, lng: 88.3425, type: 'station' },
  { id: 'kol_park', name: 'Park Street', city: 'Kolkata', lat: 22.5533, lng: 88.3514, type: 'hub' },
  { id: 'kol_esplanade', name: 'Esplanade', city: 'Kolkata', lat: 22.5635, lng: 88.3511, type: 'hub' },
  { id: 'kol_dum', name: 'Dum Dum', city: 'Kolkata', lat: 22.6187, lng: 88.3943, type: 'area' },

  // ─── Pune ────────────────────────────────────────────────────
  { id: 'pun_pia', name: 'Pune International Airport', city: 'Pune', lat: 18.5822, lng: 73.9197, type: 'airport' },
  { id: 'pun_koregaon', name: 'Koregaon Park', city: 'Pune', lat: 18.5362, lng: 73.8938, type: 'area' },
  { id: 'pun_hinjawadi', name: 'Hinjawadi IT Park', city: 'Pune', lat: 18.5912, lng: 73.7381, type: 'hub' },
  { id: 'pun_kothrud', name: 'Kothrud', city: 'Pune', lat: 18.5074, lng: 73.8077, type: 'area' },
  { id: 'pun_magarpatta', name: 'Magarpatta City', city: 'Pune', lat: 18.5089, lng: 73.9260, type: 'hub' },
  { id: 'pun_shivajinagar', name: 'Shivajinagar', city: 'Pune', lat: 18.5304, lng: 73.8478, type: 'station' },

  // ─── Ahmedabad ───────────────────────────────────────────────
  { id: 'ahm_svpi', name: 'Sardar Vallabhbhai Patel International Airport', city: 'Ahmedabad', lat: 23.0777, lng: 72.6347, type: 'airport' },
  { id: 'ahm_gift', name: 'GIFT City', city: 'Ahmedabad', lat: 23.1611, lng: 72.6847, type: 'hub' },
  { id: 'ahm_cg', name: 'CG Road', city: 'Ahmedabad', lat: 23.0290, lng: 72.5605, type: 'hub' },
  { id: 'ahm_sg', name: 'SG Highway', city: 'Ahmedabad', lat: 23.0500, lng: 72.5000, type: 'hub' },

  // ─── Jaipur ──────────────────────────────────────────────────
  { id: 'jai_sanganer', name: 'Jaipur International Airport', city: 'Jaipur', lat: 26.8242, lng: 75.8122, type: 'airport' },
  { id: 'jai_mi', name: 'MI Road', city: 'Jaipur', lat: 26.9124, lng: 75.7873, type: 'hub' },
  { id: 'jai_vaishali', name: 'Vaishali Nagar', city: 'Jaipur', lat: 26.9259, lng: 75.7397, type: 'area' },
  { id: 'jai_mansarovar', name: 'Mansarovar', city: 'Jaipur', lat: 26.8511, lng: 75.7627, type: 'area' },

  // ─── Kochi ───────────────────────────────────────────────────
  { id: 'cok_int', name: 'Cochin International Airport', city: 'Kochi', lat: 10.1520, lng: 76.3918, type: 'airport' },
  { id: 'cok_infopark', name: 'Infopark Kochi', city: 'Kochi', lat: 10.0260, lng: 76.3533, type: 'hub' },
  { id: 'cok_ernakulam', name: 'Ernakulam South', city: 'Kochi', lat: 9.9816, lng: 76.2999, type: 'station' },
  { id: 'cok_marine', name: 'Marine Drive', city: 'Kochi', lat: 9.9674, lng: 76.2826, type: 'hub' },

  // ─── Goa ──────────────────────────────────────────────────────
  { id: 'goa_dabolim', name: 'Dabolim International Airport', city: 'Goa', lat: 15.3808, lng: 73.8314, type: 'airport' },
  { id: 'goa_mopa', name: 'Manohar International Airport (Mopa)', city: 'Goa', lat: 15.7656, lng: 73.8689, type: 'airport' },
  { id: 'goa_panaji', name: 'Panaji City Centre', city: 'Goa', lat: 15.4909, lng: 73.8278, type: 'hub' },
  { id: 'goa_baga', name: 'Baga & Calangute Beach', city: 'Goa', lat: 15.5553, lng: 73.7517, type: 'area' },
  { id: 'goa_candolim', name: 'Candolim', city: 'Goa', lat: 15.5173, lng: 73.7634, type: 'area' },
  { id: 'goa_margao', name: 'Margao Railway Station', city: 'Goa', lat: 15.2736, lng: 73.9582, type: 'station' },

  // ─── Lucknow ──────────────────────────────────────────────────
  { id: 'lko_ccs', name: 'Chaudhary Charan Singh Airport (LKO)', city: 'Lucknow', lat: 26.7606, lng: 80.8893, type: 'airport' },
  { id: 'lko_hazratganj', name: 'Hazratganj', city: 'Lucknow', lat: 26.8467, lng: 80.9462, type: 'hub' },
  { id: 'lko_gomtinagar', name: 'Gomti Nagar Extension', city: 'Lucknow', lat: 26.8537, lng: 81.0022, type: 'area' },
  { id: 'lko_charbagh', name: 'Charbagh Railway Station', city: 'Lucknow', lat: 26.8302, lng: 80.9234, type: 'station' },

  // ─── Chandigarh ───────────────────────────────────────────────
  { id: 'ixc_airport', name: 'Shaheed Bhagat Singh Airport (IXC)', city: 'Chandigarh', lat: 30.6735, lng: 76.7885, type: 'airport' },
  { id: 'ixc_sec17', name: 'Sector 17 Plaza', city: 'Chandigarh', lat: 30.7398, lng: 76.7827, type: 'hub' },
  { id: 'ixc_itpark', name: 'Rajiv Gandhi Chandigarh IT Park', city: 'Chandigarh', lat: 30.7247, lng: 76.8431, type: 'hub' },
  { id: 'ixc_mohali', name: 'Mohali Phase 7', city: 'Chandigarh', lat: 30.7046, lng: 76.7179, type: 'area' },

  // ─── Indore ───────────────────────────────────────────────────
  { id: 'idr_dabok', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', lat: 22.7217, lng: 75.8011, type: 'airport' },
  { id: 'idr_vijaynagar', name: 'Vijay Nagar', city: 'Indore', lat: 22.7533, lng: 75.8937, type: 'hub' },
  { id: 'idr_palasia', name: 'Old Palasia', city: 'Indore', lat: 22.7244, lng: 75.8839, type: 'area' },
  { id: 'idr_rajwada', name: 'Rajwada Chowk', city: 'Indore', lat: 22.7186, lng: 75.8554, type: 'hub' },
];

export const CITIES = [...new Set(PLACES.map(p => p.city))].sort();

export function getPlacesByCity(city: string): Place[] {
  return PLACES.filter(p => p.city === city);
}

export function getPlaceById(id: string): Place | undefined {
  return PLACES.find(p => p.id === id);
}

export function searchPlaces(query: string): Place[] {
  const q = query.toLowerCase();
  return PLACES.filter(
    p =>
      p.name.toLowerCase().includes(q) ||
      p.city.toLowerCase().includes(q)
  ).slice(0, 10);
}

// Popular inter-city routes
export const POPULAR_ROUTES: { from: string; to: string; label: string; distanceKm: number }[] = [
  // Delhi NCR
  { from: 'del_igi', to: 'del_cp', label: 'IGI Airport → Connaught Place', distanceKm: 22 },
  { from: 'del_cyber', to: 'del_huda', label: 'Cyber Hub → Huda City Centre', distanceKm: 7 },
  { from: 'del_noida', to: 'del_cp', label: 'Noida Sec 62 → Connaught Place', distanceKm: 25 },
  { from: 'del_cp', to: 'del_gurgaon', label: 'Connaught Place → DLF Gurgaon', distanceKm: 30 },
  // Mumbai
  { from: 'mum_csia', to: 'mum_bkc', label: 'Mumbai Airport → BKC', distanceKm: 9 },
  { from: 'mum_bkc', to: 'mum_bandra', label: 'BKC → Bandra West', distanceKm: 5 },
  { from: 'mum_andheri', to: 'mum_churchgate', label: 'Andheri → Churchgate', distanceKm: 24 },
  { from: 'mum_thane', to: 'mum_bkc', label: 'Thane → BKC', distanceKm: 28 },
  // Bangalore
  { from: 'blr_bia', to: 'blr_mg', label: 'BLR Airport → MG Road', distanceKm: 40 },
  { from: 'blr_whitefield', to: 'blr_koramangala', label: 'Whitefield → Koramangala', distanceKm: 19 },
  { from: 'blr_electronic', to: 'blr_mg', label: 'Electronic City → MG Road', distanceKm: 22 },
  { from: 'blr_bia', to: 'blr_whitefield', label: 'BLR Airport → Whitefield', distanceKm: 20 },
  // Chennai
  { from: 'che_maa', to: 'che_tnagar', label: 'Chennai Airport → T.Nagar', distanceKm: 15 },
  { from: 'che_omr', to: 'che_adyar', label: 'OMR → Adyar', distanceKm: 16 },
  // Hyderabad
  { from: 'hyd_rgia', to: 'hyd_hitec', label: 'Hyderabad Airport → HITEC City', distanceKm: 28 },
  { from: 'hyd_hitec', to: 'hyd_gachi', label: 'HITEC City → Gachibowli', distanceKm: 6 },
  // Kolkata
  { from: 'kol_nsc', to: 'kol_saltlake', label: 'Kolkata Airport → Salt Lake', distanceKm: 12 },
  { from: 'kol_howrah', to: 'kol_park', label: 'Howrah → Park Street', distanceKm: 8 },
  // Pune
  { from: 'pun_pia', to: 'pun_hinjawadi', label: 'Pune Airport → Hinjawadi', distanceKm: 23 },
  { from: 'pun_koregaon', to: 'pun_hinjawadi', label: 'Koregaon Park → Hinjawadi', distanceKm: 20 },
  // Goa
  { from: 'goa_mopa', to: 'goa_baga', label: 'Mopa Airport → Baga Beach', distanceKm: 31 },
  { from: 'goa_dabolim', to: 'goa_panaji', label: 'Dabolim Airport → Panaji', distanceKm: 28 },
  // Lucknow
  { from: 'lko_ccs', to: 'lko_gomtinagar', label: 'Lucknow Airport → Gomti Nagar', distanceKm: 24 },
  // Chandigarh
  { from: 'ixc_airport', to: 'ixc_sec17', label: 'Chandigarh Airport → Sector 17', distanceKm: 18 },
  // Indore
  { from: 'idr_dabok', to: 'idr_vijaynagar', label: 'Indore Airport → Vijay Nagar', distanceKm: 16 },
];

// Haversine distance in km
export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Nearest place to a given coordinate
export function nearestPlace(lat: number, lng: number): Place {
  let best = PLACES[0];
  let bestDist = Infinity;
  for (const p of PLACES) {
    const d = haversineKm(lat, lng, p.lat, p.lng);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

export function estimateDistance(from: Place, to: Place): number {
  // Road distance is roughly 1.35x straight-line distance
  return Math.round(haversineKm(from.lat, from.lng, to.lat, to.lng) * 1.35 * 10) / 10;
}

export function estimateDuration(distanceKm: number): number {
  // Average 25 km/h in Indian city traffic
  return Math.round((distanceKm / 25) * 60);
}
