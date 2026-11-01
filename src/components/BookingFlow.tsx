"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaCarAlt,
  FaUsers,
  FaCheck,
  FaMotorcycle,
  FaStar,
  FaShieldAlt,
  FaPhone,
  FaLocationArrow,
  FaChevronDown,
  FaClock,
  FaRupeeSign,
} from "react-icons/fa";
import { RiWomenLine } from "react-icons/ri";

import {
  PLACES,
  CITIES,
  getPlacesByCity,
  POPULAR_ROUTES,
  nearestPlace,
  estimateDistance,
  estimateDuration,
} from "../lib/places";
import {
  VEHICLES,
  calculateSimpleFare,
  formatRupees,
  estimateArrivalTime,
} from "../lib/pricing";
import { generatePoolRiders, createPoolMatch } from "../lib/pool";
import type { Place, VehicleType, RideMode, GenderFilter } from "../lib/types";
import type { PoolMatch, PoolRider } from "../lib/pool";
import type { FareResult } from "../lib/pricing";
import LiveRideMap from "./LiveRideMap";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "route" | "cab" | "pool" | "ride" | "done";

interface SimDriver {
  name: string;
  rating: number;
  totalRides: number;
  vehicleModel: string;
  vehicleNumber: string;
  vehicleColor: string;
  phone: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PHASES: Phase[] = ["route", "cab", "pool", "ride", "done"];

const PHASE_LABELS: Record<Phase, string> = {
  route: "Route",
  cab: "Cab",
  pool: "Pool",
  ride: "Ride",
  done: "Done",
};

const PHASE_ICONS: Record<Phase, React.ReactNode> = {
  route: <FaMapMarkerAlt />,
  cab: <FaCarAlt />,
  pool: <FaUsers />,
  ride: <FaLocationArrow />,
  done: <FaCheck />,
};

const MOCK_DRIVERS: SimDriver[] = [
  {
    name: "Rajesh Kumar",
    rating: 4.8,
    totalRides: 1240,
    vehicleModel: "Maruti Swift Dzire",
    vehicleNumber: "DL 01 AB 1234",
    vehicleColor: "White",
    phone: "+91 98765 43210",
  },
  {
    name: "Suresh Yadav",
    rating: 4.6,
    totalRides: 876,
    vehicleModel: "Toyota Innova Crysta",
    vehicleNumber: "MH 02 CD 5678",
    vehicleColor: "Silver",
    phone: "+91 87654 32109",
  },
  {
    name: "Amit Sharma",
    rating: 4.9,
    totalRides: 2100,
    vehicleModel: "Honda Amaze",
    vehicleNumber: "KA 03 EF 9012",
    vehicleColor: "Grey",
    phone: "+91 76543 21098",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepHeader({ phase }: { phase: Phase }) {
  const currentIdx = PHASES.indexOf(phase);
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-4 py-5">
      <h1 className="text-white text-xl font-bold text-center mb-4 tracking-wide">
        🚗 Humsafar
      </h1>
      <div className="flex items-center justify-between">
        {PHASES.map((p, idx) => {
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;
          return (
            <React.Fragment key={p}>
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isDone
                      ? "bg-green-400 text-white"
                      : isActive
                      ? "bg-orange-400 text-white ring-2 ring-white ring-offset-1 ring-offset-indigo-700"
                      : "bg-indigo-400 text-indigo-100 opacity-60"
                  }`}
                >
                  {isDone ? <FaCheck className="text-xs" /> : PHASE_ICONS[p]}
                </div>
                <span
                  className={`text-xs font-medium ${
                    isActive ? "text-orange-300" : isDone ? "text-green-300" : "text-indigo-300"
                  }`}
                >
                  {PHASE_LABELS[p]}
                </span>
              </div>
              {idx < PHASES.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 rounded-full transition-all duration-300 ${
                    idx < currentIdx ? "bg-green-400" : "bg-indigo-400 opacity-40"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// City+Place selector pair
interface PlaceSelectorProps {
  label: string;
  icon: React.ReactNode;
  city: string;
  place: Place | null;
  onCityChange: (c: string) => void;
  onPlaceChange: (p: Place) => void;
  excludePlace?: Place | null;
}

function PlaceSelector({
  label,
  icon,
  city,
  place,
  onCityChange,
  onPlaceChange,
  excludePlace,
}: PlaceSelectorProps) {
  const places = city
    ? getPlacesByCity(city).filter((p) => p.id !== excludePlace?.id)
    : [];

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-600 flex items-center gap-2">
        {icon}
        {label}
      </label>
      <div className="relative">
        <select
          value={city}
          onChange={(e) => onCityChange(e.target.value)}
          className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        >
          <option value="">Select City</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
      </div>
      {city && (
        <div className="relative">
          <select
            value={place?.id ?? ""}
            onChange={(e) => {
              const found = places.find((p) => p.id === e.target.value);
              if (found) onPlaceChange(found);
            }}
            className="w-full appearance-none border border-gray-300 rounded-xl px-4 py-3 pr-10 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
          >
            <option value="">Select Place</option>
            {places.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs" />
        </div>
      )}
    </div>
  );
}

// Fare badge
function FareBadge({ fare }: { fare: FareResult }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-lg font-bold text-indigo-700 flex items-center">
        <FaRupeeSign className="text-sm" />
        {fare.totalFare}
      </span>
      {fare.savingsVsSolo > 0 && (
        <span className="text-xs bg-green-100 text-green-700 font-semibold px-2 py-0.5 rounded-full">
          Save ₹{fare.savingsVsSolo}
        </span>
      )}
    </div>
  );
}

// Pool rider card
interface PoolCardProps {
  rider: PoolRider;
  fare: number;
}

function PoolCard({ rider, fare }: PoolCardProps) {
  const initials = rider.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const avatarColor =
    rider.gender === "female"
      ? "bg-pink-100 text-pink-700 border-pink-200"
      : "bg-blue-100 text-blue-700 border-blue-200";

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
      <div
        className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm flex-shrink-0 ${avatarColor}`}
      >
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-gray-800 text-sm truncate">{rider.name}</span>
          {rider.gender === "female" && (
            <RiWomenLine className="text-pink-500 flex-shrink-0" title="Women rider" />
          )}
          {rider.womenOnly && (
            <span className="text-xs bg-pink-50 text-pink-600 border border-pink-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
              Women only
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 truncate">
          📍 {rider.pickup.name} → {rider.drop.name}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-bold text-indigo-700 text-sm flex items-center">
          <FaRupeeSign className="text-xs" />
          {fare}
        </div>
        <div className="text-xs text-gray-400">pool fare</div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function BookingFlow() {
  // Phase
  const [phase, setPhase] = useState<Phase>("route");

  // Phase 1 – Route
  const [fromCity, setFromCity] = useState<string>("");
  const [fromPlace, setFromPlace] = useState<Place | null>(null);
  const [toCity, setToCity] = useState<string>("");
  const [toPlace, setToPlace] = useState<Place | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState<string>("");

  // Phase 2 – Cab options
  const [vehicleType, setVehicleType] = useState<VehicleType>("mini4");
  const [mode, setMode] = useState<RideMode>("share");
  const [genderFilter, setGenderFilter] = useState<GenderFilter>("any");

  // Phase 3 – Pool
  const [poolSearching, setPoolSearching] = useState(false);
  const [poolMatch, setPoolMatch] = useState<PoolMatch | null>(null);

  // Phase 4 – Ride
  const [progress, setProgress] = useState<number>(0);
  const [otp] = useState<string>(
    () => String(Math.floor(1000 + Math.random() * 9000))
  );
  const [driver] = useState<SimDriver>(
    () => MOCK_DRIVERS[Math.floor(Math.random() * MOCK_DRIVERS.length)]
  );
  const rideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Phase 5 – Done
  const [rating, setRating] = useState<number>(0);

  // ── Derived values ──────────────────────────────────────────────────────────

  const distanceKm =
    fromPlace && toPlace ? estimateDistance(fromPlace, toPlace) : 0;

  const durationMin = distanceKm > 0 ? estimateDuration(distanceKm) : 0;

  const minifareSolo =
    fromPlace && toPlace
      ? calculateSimpleFare(fromPlace, toPlace, "mini4", "solo")
      : null;

  const minifareShare =
    fromPlace && toPlace
      ? calculateSimpleFare(fromPlace, toPlace, "mini4", "share", 2)
      : null;

  const suvfareSolo =
    fromPlace && toPlace
      ? calculateSimpleFare(fromPlace, toPlace, "suv7", "solo")
      : null;

  const suvfareShare =
    fromPlace && toPlace
      ? calculateSimpleFare(fromPlace, toPlace, "suv7", "share", 3)
      : null;

  const selectedFare =
    fromPlace && toPlace
      ? calculateSimpleFare(fromPlace, toPlace, vehicleType, mode, mode === "share" ? 2 : 1)
      : null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  const handleUseCurrentLocation = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation not supported on this device.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = nearestPlace(pos.coords.latitude, pos.coords.longitude);
        setFromCity(nearest.city);
        setFromPlace(nearest);
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(
          err.code === 1
            ? "Location access denied. Please enable it in browser settings."
            : "Unable to detect location. Please select manually."
        );
        setLocationLoading(false);
      },
      { timeout: 8000 }
    );
  }, []);

  const handleFromCityChange = (c: string) => {
    setFromCity(c);
    setFromPlace(null);
  };

  const handleToCityChange = (c: string) => {
    setToCity(c);
    setToPlace(null);
  };

  const handlePopularRoute = (fromId: string, toId: string) => {
    const fp = PLACES.find((p) => p.id === fromId);
    const tp = PLACES.find((p) => p.id === toId);
    if (fp && tp) {
      setFromCity(fp.city);
      setFromPlace(fp);
      setToCity(tp.city);
      setToPlace(tp);
    }
  };

  const handlePhase1Next = () => {
    if (fromPlace && toPlace) setPhase("cab");
  };

  const handlePhase2Next = () => {
    if (mode === "share") {
      setPhase("pool");
      setPoolSearching(true);
      setPoolMatch(null);
      // Simulate 2s search delay
      setTimeout(() => {
        if (fromPlace && toPlace) {
          const userRider: PoolRider = {
            id: "user",
            name: "You",
            gender: "female",
            pickup: fromPlace,
            drop: toPlace,
            womenOnly: genderFilter === "women",
          };
          const extraRiders = generatePoolRiders(
            fromPlace,
            toPlace,
            vehicleType,
            genderFilter
          );
          const match = createPoolMatch(userRider, extraRiders, vehicleType);
          setPoolMatch(match);
          setPoolSearching(false);
        }
      }, 2000);
    } else {
      // Solo – skip pool phase
      setProgress(0);
      setPhase("ride");
      startRideSimulation();
    }
  };

  const handleConfirmPool = () => {
    setProgress(0);
    setPhase("ride");
    startRideSimulation();
  };

  const startRideSimulation = () => {
    if (rideIntervalRef.current) clearInterval(rideIntervalRef.current);
    setProgress(0);
    const startTime = Date.now();
    const totalMs = 30_000;
    rideIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / totalMs) * 100));
      setProgress(pct);
      if (pct >= 100) {
        clearInterval(rideIntervalRef.current!);
        rideIntervalRef.current = null;
        setTimeout(() => setPhase("done"), 800);
      }
    }, 300);
  };

  // Cleanup ride interval on unmount
  useEffect(() => {
    return () => {
      if (rideIntervalRef.current) clearInterval(rideIntervalRef.current);
    };
  }, []);

  const handleBookAnother = () => {
    // Reset all state
    setPhase("route");
    setFromCity("");
    setFromPlace(null);
    setToCity("");
    setToPlace(null);
    setLocationError("");
    setVehicleType("mini4");
    setMode("share");
    setGenderFilter("any");
    setPoolSearching(false);
    setPoolMatch(null);
    setProgress(0);
    setRating(0);
    if (rideIntervalRef.current) {
      clearInterval(rideIntervalRef.current);
      rideIntervalRef.current = null;
    }
  };

  // ── Render phases ───────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start">
      <div className="w-full max-w-md bg-white shadow-xl rounded-b-3xl overflow-hidden min-h-screen flex flex-col">
        <StepHeader phase={phase} />

        <div className="flex-1 flex flex-col">
          {/* ── PHASE 1: Route ── */}
          {phase === "route" && (
            <div className="p-4 space-y-5 flex-1 flex flex-col">
              <div className="space-y-4">
                {/* From */}
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-3">
                  <PlaceSelector
                    label="From"
                    icon={<FaLocationArrow className="text-indigo-500" />}
                    city={fromCity}
                    place={fromPlace}
                    onCityChange={handleFromCityChange}
                    onPlaceChange={setFromPlace}
                    excludePlace={toPlace}
                  />
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locationLoading}
                    className="w-full mt-2 py-2.5 px-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <FaLocationArrow />
                    {locationLoading ? "Detecting GPS Position..." : "🎯 Use Current Location for Pickup"}
                  </button>
                  {fromPlace && fromCity && (
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Detected Area: <span className="underline">{fromPlace.name}</span> ({fromCity})
                    </div>
                  )}
                  {locationError && (
                    <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg p-2">{locationError}</p>
                  )}
                </div>

                {/* To */}
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                  <PlaceSelector
                    label="To"
                    icon={<FaMapMarkerAlt className="text-orange-500" />}
                    city={toCity}
                    place={toPlace}
                    onCityChange={handleToCityChange}
                    onPlaceChange={setToPlace}
                    excludePlace={fromPlace}
                  />
                </div>

                {/* Distance info */}
                {fromPlace && toPlace && (
                  <div className="flex items-center justify-around bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="text-center">
                      <div className="text-lg font-bold text-indigo-700">{distanceKm} km</div>
                      <div className="text-xs text-gray-500">Distance</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-orange-600">{durationMin} min</div>
                      <div className="text-xs text-gray-500">Est. time</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Popular routes */}
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  Popular Routes
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {POPULAR_ROUTES.slice(0, 10).map((r) => (
                    <button
                      key={`${r.from}-${r.to}`}
                      onClick={() => handlePopularRoute(r.from, r.to)}
                      className="w-full text-left flex items-center justify-between bg-white border border-gray-200 rounded-xl px-3 py-2.5 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FaCarAlt className="text-indigo-400 flex-shrink-0 text-sm" />
                        <span className="text-sm text-gray-700 truncate group-hover:text-indigo-700">
                          {r.label}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                        {r.distanceKm} km
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Next button */}
              <button
                onClick={handlePhase1Next}
                disabled={!fromPlace || !toPlace}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-colors text-base shadow-lg shadow-indigo-200"
              >
                Find Cabs →
              </button>
            </div>
          )}

          {/* ── PHASE 2: Cab Options ── */}
          {phase === "cab" && fromPlace && toPlace && (
            <div className="p-4 space-y-4 flex-1 flex flex-col">
              <div className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
                <FaLocationArrow className="text-indigo-500 flex-shrink-0" />
                <span className="font-medium text-gray-700 truncate">{fromPlace.name}</span>
                <span>→</span>
                <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                <span className="font-medium text-gray-700 truncate">{toPlace.name}</span>
              </div>

              {/* Vehicle cards */}
              <div className="space-y-3">
                {(["mini4", "suv7"] as VehicleType[]).map((vt) => {
                  const v = VEHICLES[vt];
                  const soloFare = vt === "mini4" ? minifareSolo : suvfareSolo;
                  const shareFare = vt === "mini4" ? minifareShare : suvfareShare;
                  const displayFare = mode === "share" ? shareFare : soloFare;
                  const isSelected = vehicleType === vt;

                  return (
                    <button
                      key={vt}
                      onClick={() => setVehicleType(vt)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                        isSelected
                          ? "border-indigo-500 bg-indigo-50 shadow-md shadow-indigo-100"
                          : "border-gray-200 bg-white hover:border-indigo-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                            isSelected ? "bg-indigo-100" : "bg-gray-100"
                          }`}
                        >
                          {vt === "mini4" ? (
                            <FaCarAlt className={isSelected ? "text-indigo-600" : "text-gray-500"} />
                          ) : (
                            <FaMotorcycle
                              className={`rotate-90 ${isSelected ? "text-indigo-600" : "text-gray-500"}`}
                              style={{ fontSize: "1.4rem" }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800">{v.label}</span>
                            {isSelected && (
                              <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                                Selected
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <FaUsers className="text-gray-400" />
                              {v.seats} seats
                            </span>
                            <span>·</span>
                            <span>₹{v.perKmRate}/km</span>
                            <span>·</span>
                            <span>Base ₹{v.baseFare}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {displayFare && <FareBadge fare={displayFare} />}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Ride mode toggle */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Ride Mode</p>
                  <div className="flex rounded-xl overflow-hidden border border-gray-200">
                    {(["share", "solo"] as RideMode[]).map((m) => (
                      <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`flex-1 py-2.5 text-sm font-semibold transition-colors ${
                          mode === m
                            ? "bg-indigo-600 text-white"
                            : "bg-white text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {m === "share" ? "🤝 Share" : "🚗 Solo"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Women-only toggle */}
                {mode === "share" && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <RiWomenLine className="text-pink-500 text-lg" />
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Women only</p>
                        <p className="text-xs text-gray-400">Pool with women riders only</p>
                      </div>
                    </div>
                    <button
                      onClick={() =>
                        setGenderFilter((g) => (g === "women" ? "any" : "women"))
                      }
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        genderFilter === "women" ? "bg-pink-500" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                          genderFilter === "women" ? "translate-x-6" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                )}
              </div>

              {/* Selected fare summary */}
              {selectedFare && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Estimated fare</span>
                    <span className="text-lg font-bold text-indigo-700 flex items-center">
                      <FaRupeeSign className="text-sm" />
                      {selectedFare.totalFare}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">
                      {distanceKm} km · ~{durationMin} min
                    </span>
                    {selectedFare.savingsVsSolo > 0 && (
                      <span className="text-xs text-green-600 font-semibold">
                        Save ₹{selectedFare.savingsVsSolo} vs solo
                      </span>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handlePhase2Next}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors text-base shadow-lg shadow-indigo-200 mt-auto"
              >
                {mode === "share" ? "Find Pool Riders →" : "Book Solo Ride →"}
              </button>
            </div>
          )}

          {/* ── PHASE 3: Pool ── */}
          {phase === "pool" && (
            <div className="p-4 space-y-4 flex-1 flex flex-col">
              {poolSearching ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-6">
                  <div className="relative w-24 h-24">
                    {/* Pulsing rings */}
                    <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-60" />
                    <div className="absolute inset-2 rounded-full bg-indigo-200 animate-ping opacity-40 animation-delay-300" />
                    <div className="w-24 h-24 bg-indigo-600 rounded-full flex items-center justify-center relative z-10">
                      <FaUsers className="text-white text-3xl" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-800">Searching nearby riders…</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Finding the best pool matches for you
                    </p>
                    <div className="flex justify-center gap-1.5 mt-4">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 150}ms` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : poolMatch ? (
                <>
                  {/* Match found header */}
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-green-800">Pool Match Found!</p>
                      <p className="text-sm text-green-600">
                        {poolMatch.riders.length - 1} rider
                        {poolMatch.riders.length - 1 !== 1 ? "s" : ""} matched on your route
                      </p>
                    </div>
                    {poolMatch.poolSavings > 0 && (
                      <span className="ml-auto bg-orange-400 text-white text-sm font-bold px-3 py-1 rounded-full flex-shrink-0">
                        Save ₹{poolMatch.poolSavings}
                      </span>
                    )}
                  </div>

                  {/* Your trip info */}
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-3">
                    <p className="text-xs font-semibold text-indigo-600 uppercase mb-2">
                      Your Trip
                    </p>
                    {fromPlace && toPlace && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <FaLocationArrow className="text-indigo-500 flex-shrink-0" />
                          <span className="text-gray-700 truncate">{fromPlace.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                          <span className="text-gray-700 truncate">{toPlace.name}</span>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-indigo-100">
                      <span className="text-sm text-gray-600">Pool fare</span>
                      <span className="font-bold text-indigo-700 flex items-center text-base">
                        <FaRupeeSign className="text-xs" />
                        {poolMatch.riderFares["user"] ?? selectedFare?.totalFare ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Pool riders */}
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Your Pool Companions
                    </p>
                    <div className="space-y-2">
                      {poolMatch.riders
                        .filter((r) => r.id !== "user")
                        .map((rider) => (
                          <PoolCard
                            key={rider.id}
                            rider={rider}
                            fare={poolMatch.riderFares[rider.id] ?? 0}
                          />
                        ))}
                    </div>
                  </div>

                  {/* Route & time */}
                  <div className="flex items-center justify-around bg-gray-50 rounded-xl p-3 border border-gray-200">
                    <div className="text-center">
                      <div className="font-bold text-gray-800">{poolMatch.totalKm} km</div>
                      <div className="text-xs text-gray-500">Total route</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <div className="font-bold text-gray-800">
                        {poolMatch.estimatedDurationMin} min
                      </div>
                      <div className="text-xs text-gray-500">Est. duration</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200" />
                    <div className="text-center">
                      <div className="font-bold text-orange-600 flex items-center justify-center">
                        <FaClock className="text-xs mr-0.5" />
                        {estimateArrivalTime(distanceKm, 5)}
                      </div>
                      <div className="text-xs text-gray-500">Arrive by</div>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmPool}
                    className="w-full py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-2xl transition-colors text-base shadow-lg shadow-green-200"
                  >
                    Confirm Pool Ride →
                  </button>
                </>
              ) : null}
            </div>
          )}

          {/* ── PHASE 4: Ride ── */}
          {phase === "ride" && fromPlace && toPlace && (
            <div className="p-4 space-y-4 flex-1 flex flex-col">
              {/* Live GPS Satellite Tracking Map */}
              <LiveRideMap
                from={fromPlace}
                to={toPlace}
                progressPct={progress}
                driverName={driver.name}
                carNumber={driver.vehicleNumber}
              />
              {/* Live progress */}
              <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-4 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-bold text-lg">
                      {progress < 100 ? "Ride in Progress" : "Almost there!"}
                    </p>
                    <p className="text-indigo-200 text-sm">
                      {progress < 10
                        ? "Driver on the way…"
                        : progress < 50
                        ? "Picked up, en route"
                        : progress < 90
                        ? "Heading to destination"
                        : "Arriving soon…"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black">{progress}%</div>
                    <div className="text-indigo-200 text-xs">complete</div>
                  </div>
                </div>
                <div className="w-full bg-indigo-900 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-orange-400 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-xs text-indigo-300">
                  <span className="flex items-center gap-1">
                    <FaLocationArrow className="text-xs" />
                    {fromPlace?.name ?? "Pickup"}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-xs" />
                    {toPlace?.name ?? "Drop"}
                  </span>
                </div>
              </div>

              {/* OTP */}
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-700">Share OTP with driver</p>
                  <p className="text-xs text-orange-500">Do NOT share with anyone else</p>
                </div>
                <div className="text-3xl font-black text-orange-600 tracking-widest bg-white rounded-xl px-4 py-2 shadow-sm border border-orange-200">
                  {otp}
                </div>
              </div>

              {/* Driver card */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  Your Driver
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg flex-shrink-0">
                    {driver.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800">{driver.name}</p>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar
                          key={s}
                          className={
                            s <= Math.round(driver.rating) ? "text-yellow-400" : "text-gray-200"
                          }
                          style={{ fontSize: "0.7rem" }}
                        />
                      ))}
                      <span className="text-xs text-gray-500 ml-1">
                        {driver.rating} · {driver.totalRides.toLocaleString()} rides
                      </span>
                    </div>
                  </div>
                  <a
                    href={`tel:${driver.phone}`}
                    className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white hover:bg-indigo-700 transition-colors flex-shrink-0"
                    title="Call driver"
                  >
                    <FaPhone className="text-sm" />
                  </a>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{driver.vehicleModel}</p>
                    <p className="text-xs text-gray-500">{driver.vehicleColor}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-700 tracking-wider">
                      {driver.vehicleNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pool riders during ride */}
              {poolMatch && poolMatch.riders.length > 1 && (
                <div className="bg-white border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Co-passengers
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {poolMatch.riders
                      .filter((r) => r.id !== "user")
                      .map((rider) => (
                        <div
                          key={rider.id}
                          className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5"
                        >
                          {rider.gender === "female" ? (
                            <RiWomenLine className="text-pink-500 text-xs" />
                          ) : (
                            <FaUsers className="text-blue-400 text-xs" />
                          )}
                          <span className="text-xs font-medium text-gray-700">{rider.name}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ETA */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200">
                <FaClock className="text-indigo-500" />
                <div>
                  <p className="text-sm font-semibold text-gray-700">Estimated arrival</p>
                  <p className="text-xs text-gray-500">{estimateArrivalTime(distanceKm)}</p>
                </div>
              </div>

              {/* SOS button */}
              <button
                onClick={() =>
                  alert(
                    "🚨 SOS Alert Sent!\n\nEmergency services and your emergency contact have been notified with your current location.\n\nStay calm. Help is on the way."
                  )
                }
                className="w-full py-3 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white font-bold rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-200"
              >
                <FaShieldAlt />
                SOS Emergency
              </button>
            </div>
          )}

          {/* ── PHASE 5: Done ── */}
          {phase === "done" && (
            <div className="p-4 space-y-4 flex-1 flex flex-col">
              {/* Success banner */}
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-5 text-white text-center">
                <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FaCheck className="text-3xl" />
                </div>
                <h2 className="text-xl font-black">Ride Complete!</h2>
                <p className="text-green-100 text-sm mt-1">
                  Thanks for riding with Humsafar 🎉
                </p>
              </div>

              {/* Receipt */}
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-700">Trip Receipt</p>
                </div>
                <div className="p-4 space-y-2">
                  {fromPlace && toPlace && (
                    <>
                      <div className="flex items-center gap-2 text-sm">
                        <FaLocationArrow className="text-indigo-500 flex-shrink-0" />
                        <span className="text-gray-600 truncate">{fromPlace.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <FaMapMarkerAlt className="text-orange-500 flex-shrink-0" />
                        <span className="text-gray-600 truncate">{toPlace.name}</span>
                      </div>
                    </>
                  )}
                  <div className="border-t border-gray-100 pt-3 mt-3 space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Vehicle</span>
                      <span className="font-medium text-gray-700">
                        {VEHICLES[vehicleType].label}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Mode</span>
                      <span className="font-medium text-gray-700 capitalize">{mode}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Distance</span>
                      <span className="font-medium text-gray-700">{distanceKm} km</span>
                    </div>
                    {selectedFare && (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Base fare</span>
                          <span className="font-medium text-gray-700">
                            ₹{selectedFare.baseFare}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Distance charge</span>
                          <span className="font-medium text-gray-700">
                            ₹{selectedFare.perKmCharge}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Booking fee</span>
                          <span className="font-medium text-gray-700">
                            ₹{selectedFare.bookingFee}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Total Paid</span>
                      <span className="text-xl font-black text-indigo-700 flex items-center">
                        <FaRupeeSign className="text-sm" />
                        {poolMatch
                          ? (poolMatch.riderFares["user"] ?? selectedFare?.totalFare ?? 0)
                          : (selectedFare?.totalFare ?? 0)}
                      </span>
                    </div>
                    {(poolMatch?.poolSavings ?? 0) > 0 && (
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-green-600">You saved</span>
                        <span className="text-sm font-bold text-green-600">
                          ₹{poolMatch?.poolSavings}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Driver details */}
              <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold flex-shrink-0">
                  {driver.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">{driver.name}</p>
                  <p className="text-xs text-gray-500">{driver.vehicleNumber}</p>
                </div>
                <div className="flex items-center gap-1 text-sm text-yellow-500 font-bold">
                  <FaStar />
                  {driver.rating}
                </div>
              </div>

              {/* Rating */}
              <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 text-center">
                <p className="font-semibold text-gray-700 mb-1">Rate your ride</p>
                <p className="text-xs text-gray-500 mb-3">How was your experience?</p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-125 active:scale-110"
                      aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                    >
                      <FaStar
                        className={`text-3xl transition-colors ${
                          star <= rating ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm font-medium text-yellow-700 mt-2">
                    {rating === 5
                      ? "Excellent! 🌟"
                      : rating === 4
                      ? "Great ride! 👍"
                      : rating === 3
                      ? "It was okay 😊"
                      : rating === 2
                      ? "Could be better 😐"
                      : "Sorry to hear that 😔"}
                  </p>
                )}
              </div>

              {/* Book another */}
              <button
                onClick={handleBookAnother}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-colors text-base shadow-lg shadow-indigo-200"
              >
                Book Another Ride
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
