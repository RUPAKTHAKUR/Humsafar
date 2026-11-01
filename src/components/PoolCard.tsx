'use client';

import React from 'react';
import { FaUsers, FaRupeeSign, FaLeaf, FaStar, FaClock } from 'react-icons/fa';
import { RiWomenLine } from 'react-icons/ri';
import { PoolMatch } from '../lib/pool';
import { VEHICLES, formatRupees } from '../lib/pricing';

interface PoolCardProps {
  match: PoolMatch;
  userId: string;
  onConfirm: () => void;
}

const AVATAR_EMOJIS = ['👩', '👨', '👩🏽', '👨🏽', '👩🏻', '👨🏻'];

export default function PoolCard({ match, userId, onConfirm }: PoolCardProps) {
  const vehicle = VEHICLES[match.vehicleType];
  const userFare = match.riderFares[userId] ?? 0;
  const riderCount = match.riders.length;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-5 py-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-indigo-200">Pool Found!</p>
            <h3 className="text-xl font-bold">{vehicle.label}</h3>
          </div>
          <div className="text-4xl">{vehicle.icon}</div>
        </div>
        <div className="flex gap-4 mt-3 text-sm">
          <span className="flex items-center gap-1">
            <FaUsers className="text-indigo-300" />
            {riderCount} riders
          </span>
          <span className="flex items-center gap-1">
            <FaClock className="text-indigo-300" />
            ~{match.estimatedDurationMin} min ride
          </span>
          <span className="flex items-center gap-1">
            <FaLeaf className="text-green-300" />
            {riderCount}x fewer cars
          </span>
        </div>
      </div>

      {/* Riders */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Pool Mates</p>
        <div className="space-y-2">
          {match.riders.map((rider, i) => {
            const fare = match.riderFares[rider.id] ?? 0;
            const isUser = rider.id === userId;
            return (
              <div
                key={rider.id}
                className={`flex items-center justify-between p-2.5 rounded-xl ${
                  isUser ? 'bg-indigo-50 border border-indigo-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]}</span>
                  <div>
                    <p className="font-semibold text-sm text-gray-800">
                      {rider.name} {isUser && <span className="text-indigo-600 text-xs">(You)</span>}
                    </p>
                    <p className="text-xs text-gray-500">{rider.pickup.name} → {rider.drop.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  {rider.womenOnly && (
                    <span className="text-xs bg-pink-100 text-pink-600 px-2 py-0.5 rounded-full flex items-center gap-1 mb-1">
                      <RiWomenLine /> Women-only
                    </span>
                  )}
                  <p className="text-sm font-bold text-gray-700">{formatRupees(fare)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fare Breakdown */}
      <div className="px-5 py-4 bg-gray-50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Your Fare Breakdown</p>
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Base fare (shared)</span>
            <span>{formatRupees(Math.round(vehicle.baseFare / riderCount))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Distance ({match.totalKm} km · shared)</span>
            <span>{formatRupees(Math.round(vehicle.perKmRate * match.totalKm / riderCount))}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Booking fee</span>
            <span>{formatRupees(vehicle.bookingFee)}</span>
          </div>
          <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-gray-800">
            <span>Your Total</span>
            <span className="text-indigo-700">{formatRupees(userFare)}</span>
          </div>
        </div>

        {/* Savings badge */}
        {match.poolSavings > 0 && (
          <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <FaRupeeSign className="text-green-600" />
            <div>
              <p className="text-sm font-bold text-green-700">You save {formatRupees(match.poolSavings)}!</p>
              <p className="text-xs text-green-600">vs booking a solo cab</p>
            </div>
          </div>
        )}
      </div>

      {/* Stars rating placeholder */}
      <div className="px-5 py-3 flex items-center gap-1 border-b border-gray-100">
        {[1,2,3,4,5].map(s => (
          <FaStar key={s} className={s <= 4 ? 'text-yellow-400' : 'text-gray-300'} size={12} />
        ))}
        <span className="text-xs text-gray-500 ml-1">Driver avg rating 4.7</span>
      </div>

      {/* Confirm Button */}
      <div className="px-5 py-4">
        <button
          onClick={onConfirm}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3.5 rounded-2xl text-base shadow-lg hover:from-indigo-700 hover:to-indigo-800 active:scale-95 transition-all"
        >
          Confirm Pool Ride · {formatRupees(userFare)}
        </button>
        <p className="text-center text-xs text-gray-400 mt-2">
          Fare may adjust ±5% if pickup order changes
        </p>
      </div>
    </div>
  );
}
