'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Place } from '@/lib/types';
import { FaLocationArrow, FaCarSide, FaMapPin, FaCompass, FaExpand, FaCheckCircle } from 'react-icons/fa';

interface LiveRideMapProps {
  from: Place;
  to: Place;
  progressPct: number; // 0 to 100
  driverName?: string;
  carNumber?: string;
}

export default function LiveRideMap({
  from,
  to,
  progressPct,
  driverName = 'Rajesh Kumar',
  carNumber = 'DL 01 AB 1234',
}: LiveRideMapProps) {
  // Interpolated car position
  const fraction = Math.max(0, Math.min(1, progressPct / 100));

  // Simulated curve / waypoints along Indian city roads
  const currentLat = from.lat + (to.lat - from.lat) * fraction;
  const currentLng = from.lng + (to.lng - from.lng) * fraction;

  // Bearing angle calculation
  const dLng = to.lng - from.lng;
  const y = Math.sin(dLng) * Math.cos(to.lat);
  const x =
    Math.cos(from.lat) * Math.sin(to.lat) -
    Math.sin(from.lat) * Math.cos(to.lat) * Math.cos(dLng);
  const bearingRad = Math.atan2(y, x);
  const bearingDeg = ((bearingRad * 180) / Math.PI + 360) % 360;

  // Realistic fluctuating speed simulation (20-45 km/h in city traffic)
  const [speed, setSpeed] = useState(28);
  useEffect(() => {
    const timer = setInterval(() => {
      setSpeed(Math.floor(22 + Math.random() * 20));
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Distance remaining in km
  const totalDistEst = 12.5; // default base estimate
  const distRemaining = Math.max(0.1, ((1 - fraction) * totalDistEst)).toFixed(1);
  const etaMinutes = Math.max(1, Math.round((parseFloat(distRemaining) / Math.max(15, speed)) * 60));

  // Convert GPS coordinates into 2D SVG canvas bounds
  const minLat = Math.min(from.lat, to.lat) - 0.02;
  const maxLat = Math.max(from.lat, to.lat) + 0.02;
  const minLng = Math.min(from.lng, to.lng) - 0.02;
  const maxLng = Math.max(from.lng, to.lng) + 0.02;

  const svgWidth = 800;
  const svgHeight = 460;

  const latToY = (lat: number) => {
    return svgHeight - ((lat - minLat) / (maxLat - minLat || 0.01)) * svgHeight;
  };

  const lngToX = (lng: number) => {
    return ((lng - minLng) / (maxLng - minLng || 0.01)) * svgWidth;
  };

  const startX = lngToX(from.lng);
  const startY = latToY(from.lat);
  const endX = lngToX(to.lng);
  const endY = latToY(to.lat);
  const carX = lngToX(currentLng);
  const carY = latToY(currentLat);

  // Subtle intermediate corridor curvature
  const midX = (startX + endX) / 2 + 30;
  const midY = (startY + endY) / 2 - 20;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl select-none">
      {/* Real-time Map Background Canvas */}
      <div className="relative w-full h-80 sm:h-96 bg-[#0f172a] overflow-hidden">
        {/* OpenStreetMap Stylized Tile Grid Lines */}
        <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#38bdf8_1px,transparent_1px),linear-gradient(to_bottom,#38bdf8_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Road & Corridor SVG Layer */}
        <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Full Planned Route Shadow/Gaze */}
          <path
            d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
            fill="none"
            stroke="#1e293b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Active Route Path */}
          <path
            d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
            fill="none"
            stroke="url(#routeGradient)"
            strokeWidth="6"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* Dashed Navigation Tracking Line */}
          <path
            d={`M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`}
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
            strokeDasharray="6 8"
            strokeLinecap="round"
            className="opacity-70 animate-[dash_20s_linear_infinite]"
          />

          {/* Pickup Marker */}
          <g transform={`translate(${startX}, ${startY})`}>
            <circle r="18" fill="#22c55e" fillOpacity="0.25" className="animate-ping" />
            <circle r="10" fill="#22c55e" stroke="#ffffff" strokeWidth="2.5" />
            <text x="0" y="24" textAnchor="middle" fill="#86efac" fontSize="11" fontWeight="700">
              Pickup ({from.name.slice(0, 14)})
            </text>
          </g>

          {/* Drop-off Marker */}
          <g transform={`translate(${endX}, ${endY})`}>
            <circle r="12" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
            <text x="0" y="24" textAnchor="middle" fill="#fca5a5" fontSize="11" fontWeight="700">
              Drop ({to.name.slice(0, 14)})
            </text>
          </g>

          {/* Real-time Moving Cab Marker */}
          <g transform={`translate(${carX}, ${carY}) rotate(${bearingDeg})`}>
            {/* GPS Pulse Radar */}
            <circle r="26" fill="#6366f1" fillOpacity="0.3" className="animate-pulse" />
            <circle r="18" fill="#4f46e5" stroke="#ffffff" strokeWidth="2.5" />
            {/* Cab Symbol */}
            <text x="0" y="5" textAnchor="middle" fontSize="14" fill="#ffffff">
              🚕
            </text>
          </g>
        </svg>

        {/* Live Top HUD Panel */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="font-bold text-slate-200">GPS Live Satellite Tracking</span>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-xl text-right text-xs text-slate-300 shadow-lg">
            <span className="text-[10px] text-indigo-400 font-bold uppercase block">Speed</span>
            <span className="font-mono font-black text-white text-sm">{speed} km/h</span>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
              <FaCarSide />
            </div>
            <div>
              <p className="font-extrabold text-white text-sm">{driverName}</p>
              <p className="text-slate-400 font-mono text-[11px]">{carNumber} · Live In Transit</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Distance Left</span>
              <span className="font-black text-emerald-400 text-sm">{distRemaining} km</span>
            </div>
            <div className="border-l border-slate-700 pl-3">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Arrival</span>
              <span className="font-black text-amber-400 text-sm">~{etaMinutes} mins</span>
            </div>
          </div>
        </div>
      </div>

      {/* GPS Telemetry Bar */}
      <div className="bg-slate-950 px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-mono border-t border-slate-800">
        <span className="flex items-center gap-1.5">
          <FaCompass className="text-indigo-400" />
          LAT: {currentLat.toFixed(5)}° N | LNG: {currentLng.toFixed(5)}° E
        </span>
        <span className="text-emerald-400 font-bold flex items-center gap-1">
          <FaCheckCircle size={10} /> 4G High Accuracy Fix
        </span>
      </div>
    </div>
  );
}
