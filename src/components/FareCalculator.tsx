'use client';

import React, { useState } from 'react';
import { FaRupeeSign, FaCar, FaUsers, FaChevronDown, FaInfoCircle } from 'react-icons/fa';
import { PLACES, CITIES, getPlacesByCity, estimateDistance } from '../lib/places';
import { VEHICLES, calculateSimpleFare, formatRupees } from '../lib/pricing';
import { Place, VehicleType } from '../lib/types';

export default function FareCalculator() {
  const [fromCity, setFromCity] = useState('');
  const [fromPlace, setFromPlace] = useState<Place | null>(null);
  const [toCity, setToCity] = useState('');
  const [toPlace, setToPlace] = useState<Place | null>(null);
  const [vehicleType, setVehicleType] = useState<VehicleType>('mini4');
  const [riders, setRiders] = useState(2);
  const [calculated, setCalculated] = useState(false);

  const fromPlaces = fromCity ? getPlacesByCity(fromCity) : [];
  const toPlaces = toCity ? getPlacesByCity(toCity) : [];

  const soloFare = fromPlace && toPlace
    ? calculateSimpleFare(fromPlace, toPlace, vehicleType, 'solo', 1)
    : null;
  const shareFare = fromPlace && toPlace
    ? calculateSimpleFare(fromPlace, toPlace, vehicleType, 'share', riders)
    : null;

  const vehicle = VEHICLES[vehicleType];

  const handleCalculate = () => {
    if (fromPlace && toPlace) setCalculated(true);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            <FaRupeeSign className="text-2xl text-indigo-200" />
            <div>
              <h2 className="text-xl font-bold">Fare Calculator</h2>
              <p className="text-sm text-indigo-200">See how much you save by sharing</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* From */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">From City</label>
              <div className="relative">
                <select
                  value={fromCity}
                  onChange={e => { setFromCity(e.target.value); setFromPlace(null); setCalculated(false); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                >
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 text-xs pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Pickup Point</label>
              <div className="relative">
                <select
                  value={fromPlace?.id ?? ''}
                  onChange={e => { setFromPlace(fromPlaces.find(p => p.id === e.target.value) ?? null); setCalculated(false); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                  disabled={!fromCity}
                >
                  <option value="">Select place</option>
                  {fromPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 text-xs pointer-events-none" />
              </div>
            </div>
          </div>

          {/* To */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">To City</label>
              <div className="relative">
                <select
                  value={toCity}
                  onChange={e => { setToCity(e.target.value); setToPlace(null); setCalculated(false); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                >
                  <option value="">Select city</option>
                  {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 text-xs pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Drop Point</label>
              <div className="relative">
                <select
                  value={toPlace?.id ?? ''}
                  onChange={e => { setToPlace(toPlaces.find(p => p.id === e.target.value) ?? null); setCalculated(false); }}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-gray-50"
                  disabled={!toCity}
                >
                  <option value="">Select place</option>
                  {toPlaces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 text-xs pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Vehicle + Riders */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">Vehicle Type</label>
              <div className="flex gap-2">
                {(['mini4', 'suv7'] as VehicleType[]).map(v => (
                  <button
                    key={v}
                    onClick={() => { setVehicleType(v); setCalculated(false); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                      vehicleType === v
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    {VEHICLES[v].icon} {v === 'mini4' ? '4-Seat' : '7-Seat'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">
                Pool Size (for share)
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
                <FaUsers className="text-gray-400" />
                <input
                  type="range"
                  min={1}
                  max={vehicle.poolSeats}
                  value={riders}
                  onChange={e => { setRiders(Number(e.target.value)); setCalculated(false); }}
                  className="flex-1 accent-indigo-600"
                />
                <span className="text-sm font-bold text-indigo-600 w-6 text-center">{riders}</span>
              </div>
            </div>
          </div>

          {/* Distance info */}
          {fromPlace && toPlace && (
            <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl px-3 py-2">
              <FaInfoCircle className="text-indigo-400" />
              Estimated distance: <strong>{estimateDistance(fromPlace, toPlace)} km</strong>
              &nbsp;·&nbsp;Route: {fromPlace.city} → {toPlace.city}
            </div>
          )}

          <button
            onClick={handleCalculate}
            disabled={!fromPlace || !toPlace}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold py-3.5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-indigo-800 active:scale-95 transition-all shadow-lg"
          >
            Calculate Fare
          </button>

          {/* Results */}
          {calculated && soloFare && shareFare && (
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                {/* Solo */}
                <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCar className="text-gray-500" />
                    <p className="font-bold text-gray-700 text-sm">Solo Cab</p>
                  </div>
                  <p className="text-2xl font-black text-gray-800">{formatRupees(soloFare.totalFare)}</p>
                  <p className="text-xs text-gray-500 mt-1">Just you, whole cab</p>
                  <div className="mt-3 space-y-1 text-xs text-gray-500">
                    <div className="flex justify-between"><span>Base</span><span>{formatRupees(soloFare.baseFare)}</span></div>
                    <div className="flex justify-between"><span>Distance</span><span>{formatRupees(soloFare.perKmCharge)}</span></div>
                    <div className="flex justify-between"><span>Fee</span><span>{formatRupees(soloFare.bookingFee)}</span></div>
                  </div>
                </div>

                {/* Share */}
                <div className="bg-indigo-50 rounded-2xl p-4 border-2 border-indigo-300 relative">
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">
                    BEST VALUE
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <FaUsers className="text-indigo-500" />
                    <p className="font-bold text-indigo-700 text-sm">Share ({riders} riders)</p>
                  </div>
                  <p className="text-2xl font-black text-indigo-700">{formatRupees(shareFare.totalFare)}</p>
                  <p className="text-xs text-indigo-500 mt-1">Per person</p>
                  <div className="mt-3 space-y-1 text-xs text-indigo-600">
                    <div className="flex justify-between"><span>Base (split)</span><span>{formatRupees(Math.round(shareFare.baseFare / riders))}</span></div>
                    <div className="flex justify-between"><span>Distance (split)</span><span>{formatRupees(Math.round(shareFare.perKmCharge / riders))}</span></div>
                    <div className="flex justify-between"><span>Fee</span><span>{formatRupees(shareFare.bookingFee)}</span></div>
                  </div>
                </div>
              </div>

              {/* Savings bar */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-bold text-green-700">💚 You save {formatRupees(shareFare.savingsVsSolo)} per person!</p>
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{shareFare.savingsPct}% off</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${shareFare.savingsPct}%` }}
                  />
                </div>
                <p className="text-xs text-green-600 mt-1.5">
                  If all {riders} riders save {formatRupees(shareFare.savingsVsSolo)}, total savings = {formatRupees(shareFare.savingsVsSolo * riders)}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
