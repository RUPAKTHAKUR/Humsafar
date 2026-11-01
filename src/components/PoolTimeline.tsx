'use client';

import React from 'react';
import { Place } from '../lib/types';

interface PoolTimelineProps {
  stops: Place[];
  riders: {
    id: string;
    name: string;
    color: string;
    pickupIdx: number;
    dropIdx: number;
    fare: number;
  }[];
  totalKm: number;
}

const COLORS = ['#6366f1', '#f97316', '#22c55e', '#ec4899', '#14b8a6', '#eab308'];

export default function PoolTimeline({ stops, riders, totalKm }: PoolTimelineProps) {
  const width = 600;
  const height = 120 + riders.length * 36;
  const margin = { left: 80, right: 24, top: 40, bottom: 24 };
  const chartWidth = width - margin.left - margin.right;
  const rowH = 32;

  // X position for a stop index
  const xOf = (idx: number) =>
    margin.left + (idx / Math.max(1, stops.length - 1)) * chartWidth;

  return (
    <div className="overflow-x-auto rounded-xl bg-gray-900 p-4">
      <p className="text-xs text-gray-400 mb-2 font-medium">Shared Road Timeline · {totalKm} km total route</p>
      <svg width={width} height={height} className="block mx-auto" viewBox={`0 0 ${width} ${height}`}>
        {/* Road line */}
        <line
          x1={margin.left} y1={margin.top}
          x2={margin.left + chartWidth} y2={margin.top}
          stroke="#374151" strokeWidth={4} strokeLinecap="round"
        />

        {/* Stop markers */}
        {stops.map((stop, i) => (
          <g key={stop.id + i}>
            <circle cx={xOf(i)} cy={margin.top} r={6} fill="#6366f1" stroke="#1f2937" strokeWidth={2} />
            <text
              x={xOf(i)} y={margin.top - 12}
              textAnchor="middle"
              fontSize={9}
              fill="#9ca3af"
              className="select-none"
            >
              {stop.name.length > 12 ? stop.name.slice(0, 10) + '…' : stop.name}
            </text>
          </g>
        ))}

        {/* Rider bars */}
        {riders.map((rider, ri) => {
          const y = margin.top + 24 + ri * rowH;
          const x1 = xOf(rider.pickupIdx);
          const x2 = xOf(rider.dropIdx);
          const color = COLORS[ri % COLORS.length];

          return (
            <g key={rider.id}>
              {/* Bar */}
              <rect
                x={x1} y={y}
                width={Math.max(8, x2 - x1)} height={20}
                rx={10} fill={color} fillOpacity={0.85}
              />
              {/* Rider name */}
              <text x={x1 + 8} y={y + 14} fontSize={10} fill="#fff" fontWeight={600}>
                {rider.name.split(' ')[0]}
              </text>
              {/* Fare label */}
              <text
                x={Math.max(x1 + 8, x2 - 30)} y={y + 14}
                fontSize={9} fill="#e5e7eb" textAnchor="end"
              >
                ₹{rider.fare}
              </text>
              {/* Left label */}
              <text x={margin.left - 8} y={y + 14} fontSize={9} fill="#6b7280" textAnchor="end">
                {rider.name.split(' ')[0]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
