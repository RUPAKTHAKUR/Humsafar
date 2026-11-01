import React from 'react';
import Navbar from '@/components/Navbar';
import FareCalculator from '@/components/FareCalculator';

export const metadata = {
  title: 'Fare Calculator — Humsafar',
  description: 'Calculate shared vs solo cab fares across India. See exactly how much you save with Humsafar pool rides.',
};

export default function FarePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Fare Calculator
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Compare solo vs shared cab fares for any route across India. Transparent, segment-based pricing with no surprises.
          </p>
        </div>

        <FareCalculator />

        {/* How pricing works */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">How Humsafar Pricing Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🛣️',
                title: 'Segment-Based Splitting',
                desc: 'The route is split at every pickup and drop. Each rider only pays for the km they are in the cab — not the full route.',
              },
              {
                icon: '🤝',
                title: 'Fair Cost Share',
                desc: 'When multiple riders are in the cab on the same segment, that segment\'s cost is divided equally among them.',
              },
              {
                icon: '📍',
                title: 'Detour Accountability',
                desc: 'If a rider\'s pickup/drop causes a detour, the extra kilometers are billed to that specific rider — fair and transparent.',
              },
            ].map(card => (
              <div key={card.title} className="flex flex-col gap-2">
                <div className="text-3xl">{card.icon}</div>
                <h3 className="font-bold text-gray-800">{card.title}</h3>
                <p className="text-sm text-gray-500">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Example */}
        <div className="mt-6 bg-indigo-900 rounded-2xl p-6 text-white">
          <h2 className="text-lg font-bold mb-4">📊 Worked Example: Cyber Hub → Huda City Centre (7 km)</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-indigo-300 text-sm mb-2">Rider A: Full route (Cyber Hub → Huda)</p>
              <p className="text-indigo-300 text-sm mb-4">Rider B: Partial route (Golf Course Rd → Huda, joins at km 3)</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-indigo-700 pb-1">
                  <span className="text-indigo-300">Segment 1 (km 0–3, Rider A only)</span>
                  <span>₹33 → A pays ₹33</span>
                </div>
                <div className="flex justify-between border-b border-indigo-700 pb-1">
                  <span className="text-indigo-300">Segment 2 (km 3–7, A + B)</span>
                  <span>₹44 → each pays ₹22</span>
                </div>
                <div className="flex justify-between font-bold text-green-400">
                  <span>Rider A Total</span>
                  <span>₹55 (vs ₹77 solo)</span>
                </div>
                <div className="flex justify-between font-bold text-green-400">
                  <span>Rider B Total</span>
                  <span>₹22 (vs ₹44 solo)</span>
                </div>
              </div>
            </div>
            <div className="bg-indigo-800 rounded-xl p-4">
              <p className="text-sm font-bold text-indigo-200 mb-3">Total Savings</p>
              <div className="text-4xl font-black text-green-400">₹44</div>
              <p className="text-indigo-300 text-sm">saved across 2 riders on this trip</p>
              <div className="mt-4 bg-indigo-700 rounded-lg p-3">
                <p className="text-xs text-indigo-300">Base fare: ₹30 (split by riders in cab)</p>
                <p className="text-xs text-indigo-300">Per-km: ₹11/km</p>
                <p className="text-xs text-indigo-300">Booking fee: ₹9 per rider</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
