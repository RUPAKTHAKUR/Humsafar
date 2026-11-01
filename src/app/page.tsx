import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Humsafar — India\'s Smartest Shared Cab Platform',
  description: 'Book shared or solo cabs anywhere in India. Segment-based fair pricing, women-only rides, 12 cities, 70+ locations.',
};

const STATS = [
  { label: 'Cities', value: '12', icon: '🏙️' },
  { label: 'Locations', value: '70+', icon: '📍' },
  { label: 'Avg Savings', value: '₹85', icon: '💰' },
  { label: 'Women-Only', value: '100%', icon: '🛡️' },
];

const HOW_IT_WORKS = [
  { step: 1, icon: '📍', title: 'Enter Your Route', desc: 'Select pickup and drop from 70+ locations across 12 Indian cities. Or use your current location.' },
  { step: 2, icon: '🚕', title: 'Choose Cab & Mode', desc: 'Pick 4-seater or 7-seater. Share with others for lower fares or book solo for privacy.' },
  { step: 3, icon: '🤝', title: 'Get Pool Matched', desc: 'Our algorithm finds nearby riders going your way. Women-only filter available.' },
  { step: 4, icon: '✅', title: 'Ride & Pay Fairly', desc: 'Pay only for the km you\'re in the cab. Full fare breakdown before you confirm.' },
];

const VEHICLES = [
  {
    icon: '🚕',
    name: '4-Seater Mini',
    poolSeats: 3,
    baseFare: '₹30',
    perKm: '₹11/km',
    features: ['AC', 'Hatchback/Sedan', 'Up to 3 pool riders', 'Economy choice'],
    color: 'from-indigo-500 to-indigo-700',
  },
  {
    icon: '🚐',
    name: '7-Seater SUV',
    poolSeats: 6,
    baseFare: '₹45',
    perKm: '₹14/km',
    features: ['AC', 'SUV/MUV', 'Up to 6 pool riders', 'Best value for groups'],
    color: 'from-purple-500 to-purple-700',
  },
];

const CITIES = [
  { name: 'Delhi NCR', places: 10, icon: '🏛️' },
  { name: 'Mumbai', places: 10, icon: '🌊' },
  { name: 'Bangalore', places: 10, icon: '🌿' },
  { name: 'Chennai', places: 7, icon: '🏖️' },
  { name: 'Hyderabad', places: 7, icon: '💎' },
  { name: 'Kolkata', places: 6, icon: '🌸' },
  { name: 'Pune', places: 6, icon: '🎓' },
  { name: 'Ahmedabad', places: 4, icon: '🔶' },
  { name: 'Jaipur', places: 4, icon: '🏰' },
  { name: 'Kochi', places: 4, icon: '🌴' },
];

const FAQS = [
  {
    q: 'How is Humsafar different from Uber or Ola?',
    a: 'Humsafar uses segment-based fare splitting — you only pay for the km you are physically in the cab. Uber Pool and Ola Share split total fares per-head regardless of distance. This makes Humsafar fairer for shorter-distance poolers.',
  },
  {
    q: 'What is a "women-only" ride?',
    a: 'Women-only rides match female riders exclusively. The pool only contains women passengers, and drivers are verified. This is available on all vehicle types and routes.',
  },
  {
    q: 'How does the fare change if I\'m the only rider in the cab?',
    a: 'If no pool match is found (or you choose Solo mode), you pay the full cab fare: base fare + per-km rate + ₹9 booking fee. Pool fares are always equal to or lower than solo.',
  },
  {
    q: 'What happens if someone causes a detour?',
    a: 'Extra kilometers caused by a specific rider\'s pickup/drop are billed to that rider. Other riders are not charged for detours they didn\'t cause.',
  },
  {
    q: 'Is my booking confirmed immediately?',
    a: 'Yes. Once you confirm the pool, you receive an OTP. The driver verifies this OTP at pickup. No surprise cancellations after confirmation.',
  },
  {
    q: 'Which cities are currently covered?',
    a: 'We currently cover 12 cities: Delhi NCR, Mumbai, Bangalore, Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, Jaipur, and Kochi. More cities are being added monthly.',
  },
  {
    q: 'How do I become a driver on Humsafar?',
    a: 'Visit the Driver Dashboard and complete the onboarding form. You\'ll need a valid Indian driving license, RC, and insurance. Our team reviews in 24 hours.',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-400 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
              <span className="text-yellow-300">⭐</span>
              <span className="text-sm font-medium text-indigo-200">India&apos;s fairest shared cab pricing</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Share the Cab,<br />
              <span className="bg-gradient-to-r from-orange-400 to-yellow-300 bg-clip-text text-transparent">
                Save Big.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-200 mb-8 leading-relaxed max-w-xl">
              Humsafar (हमसफ़र) — your travel companion. Segment-based fare splitting so you only pay for the km you&apos;re in the cab. 12 cities, 70+ locations, women-only option.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/book"
                className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-8 py-4 rounded-2xl text-lg shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 text-center"
              >
                🚕 Book a Ride Now
              </Link>
              <Link
                href="/fare"
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-8 py-4 rounded-2xl text-lg backdrop-blur-sm transition-all text-center"
              >
                💰 Calculate Fare
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {STATS.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-center">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-indigo-300 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Book a shared ride in 4 simple steps</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step) => (
            <div key={step.step} className="text-center group">
              <div className="w-16 h-16 bg-indigo-50 group-hover:bg-indigo-100 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 transition-colors">
                {step.icon}
              </div>
              <div className="w-7 h-7 bg-indigo-600 text-white text-sm font-bold rounded-full flex items-center justify-center mx-auto -mt-2 mb-3">
                {step.step}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vehicles */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Choose Your Vehicle</h2>
            <p className="text-gray-500 text-lg">From economical 4-seaters to spacious 7-seaters</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {VEHICLES.map(v => (
              <div key={v.name} className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`bg-gradient-to-r ${v.color} p-6 text-white`}>
                  <div className="text-5xl mb-3">{v.icon}</div>
                  <h3 className="text-2xl font-bold">{v.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm opacity-90">
                    <span>Base: {v.baseFare}</span>
                    <span>{v.perKm}</span>
                    <span>Pool: {v.poolSeats} seats</span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    {v.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/book"
                    className={`mt-5 block w-full bg-gradient-to-r ${v.color} text-white font-bold py-3 rounded-xl text-center hover:opacity-90 transition-opacity`}
                  >
                    Book This
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fare Engine Explanation */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-indigo-900 rounded-3xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-10 text-white">
              <div className="inline-flex items-center gap-2 bg-indigo-700 rounded-full px-4 py-1.5 mb-6">
                <span>⚙️</span>
                <span className="text-sm text-indigo-200">Fare Engine</span>
              </div>
              <h2 className="text-3xl font-extrabold mb-4">Segment-Based Pricing</h2>
              <p className="text-indigo-200 mb-6 leading-relaxed">
                Unlike other apps that split the total fare per-head, Humsafar cuts the route into segments at every pickup and drop. You only pay for the km you&apos;re actually in the cab.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  'Route cut at every pickup/drop point',
                  'Each segment cost divided equally among riders in that segment',
                  'Detour km billed to the rider causing it',
                  '₹9 booking fee + base fare per rider',
                  'Full breakdown visible before you confirm',
                ].map(item => (
                  <div key={item} className="flex items-start gap-2 text-indigo-200">
                    <span className="text-green-400 mt-0.5">✓</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-800 p-10 flex items-center">
              <div className="w-full space-y-3">
                <p className="text-indigo-300 text-sm font-semibold uppercase tracking-wider">Example: 20 km ride, 3 riders</p>
                {[
                  { seg: 'Seg 1: km 0–5 (Rider A only)', cost: '₹55', riders: 1 },
                  { seg: 'Seg 2: km 5–14 (A + B)', cost: '₹99 / 2 = ₹49.5', riders: 2 },
                  { seg: 'Seg 3: km 14–20 (A + B + C)', cost: '₹66 / 3 = ₹22', riders: 3 },
                ].map(s => (
                  <div key={s.seg} className="bg-indigo-700/50 rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white text-sm font-medium">{s.seg}</p>
                        <p className="text-indigo-300 text-xs mt-0.5">{s.riders} rider{s.riders > 1 ? 's' : ''} sharing</p>
                      </div>
                      <span className="text-orange-300 font-bold text-sm">{s.cost}</span>
                    </div>
                  </div>
                ))}
                <div className="border-t border-indigo-600 pt-3 flex justify-between">
                  <span className="text-indigo-300 text-sm">Rider A pays</span>
                  <span className="text-green-400 font-bold">₹135 (vs ₹220 solo)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Three Perspectives */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Three Perspectives</h2>
            <p className="text-gray-500 text-lg">Humsafar serves riders, drivers, and fleet owners equally</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '👤',
                role: 'Rider',
                color: 'indigo',
                href: '/dashboard/user',
                features: [
                  'Book shared or solo rides',
                  'Women-only filter',
                  'Trip history & ratings',
                  'Fare breakdown transparency',
                  'Favorite routes saved',
                  'Emergency SOS button',
                ],
              },
              {
                icon: '🚗',
                role: 'Driver',
                color: 'orange',
                href: '/dashboard/driver',
                features: [
                  'Accept/decline ride requests',
                  'Live navigation assistance',
                  'Earnings tracker (daily/weekly)',
                  'Pool schedule view',
                  'Per-rider payment breakdown',
                  'Online/offline toggle',
                ],
              },
              {
                icon: '📊',
                role: 'Owner',
                color: 'purple',
                href: '/dashboard/owner',
                features: [
                  'All bookings at a glance',
                  'Revenue & KPI metrics',
                  'Driver management',
                  'City-wise analytics',
                  'Export data (CSV)',
                  'Pool savings reports',
                ],
              },
            ].map(p => {
              const colorMap: Record<string, string> = {
                indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100',
                orange: 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100',
                purple: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',
              };
              const btnMap: Record<string, string> = {
                indigo: 'bg-indigo-600 hover:bg-indigo-700',
                orange: 'bg-orange-500 hover:bg-orange-600',
                purple: 'bg-purple-600 hover:bg-purple-700',
              };
              return (
                <div key={p.role} className={`bg-white rounded-3xl border-2 ${colorMap[p.color]} p-6 transition-all`}>
                  <div className="text-4xl mb-3">{p.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{p.role} View</h3>
                  <ul className="space-y-2 mt-4 mb-6">
                    {p.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-green-500">✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={p.href}
                    className={`block w-full ${btnMap[p.color]} text-white font-bold py-2.5 rounded-xl text-center text-sm transition-colors`}
                  >
                    Open {p.role} Dashboard →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cities */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Available Across India
          </h2>
          <p className="text-gray-500 text-lg">12 cities and growing fast</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {CITIES.map(c => (
            <div
              key={c.name}
              className="bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-2xl p-4 text-center transition-all cursor-default"
            >
              <div className="text-2xl mb-2">{c.icon}</div>
              <p className="font-semibold text-gray-800 text-sm">{c.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{c.places} places</p>
            </div>
          ))}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-dashed border-indigo-200 rounded-2xl p-4 text-center flex flex-col items-center justify-center">
            <div className="text-2xl mb-2">🗺️</div>
            <p className="font-semibold text-indigo-600 text-sm">More Coming</p>
            <p className="text-xs text-indigo-400 mt-0.5">Every month!</p>
          </div>
        </div>
      </section>

      {/* Why Share */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Why Sharing Wins</h2>
            <p className="text-gray-500 text-lg">Better for your pocket. Better for the planet.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '💰',
                title: 'Riders Pay Less',
                desc: 'Sharing a cab cuts your fare by up to 60%. Segment-based pricing means you pay only for your portion of the route.',
                stat: 'Avg ₹85 saved per ride',
              },
              {
                icon: '📈',
                title: 'Drivers Earn More',
                desc: 'Drivers earn from multiple riders per trip. A fully pooled 7-seater earns 3–4x more than a solo ride on the same route.',
                stat: 'Up to 4x earnings per trip',
              },
              {
                icon: '🌱',
                title: 'Fewer Cars on Roads',
                desc: 'Every shared cab removes 2–5 solo cars from the road. Less congestion, lower emissions, cleaner Indian cities.',
                stat: '2–5 fewer cars per trip',
              },
            ].map(card => (
              <div key={card.title} className="bg-white rounded-3xl p-6 shadow-sm border border-green-100">
                <div className="text-4xl mb-4">{card.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{card.desc}</p>
                <div className="bg-green-50 border border-green-200 rounded-xl px-3 py-2 text-sm font-bold text-green-700">
                  {card.stat}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Extra Features */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Packed with Features</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: '🛡️', title: 'Women-Only Mode', desc: 'All-female pool with verified female riders' },
            { icon: '🆘', title: 'Emergency SOS', desc: 'One-tap emergency contact during any ride' },
            { icon: '⭐', title: 'Ratings System', desc: 'Rate drivers and riders after each trip' },
            { icon: '📊', title: 'Full Transparency', desc: 'Every rupee explained before you confirm' },
            { icon: '🔔', title: 'Smart Notifications', desc: 'Real-time updates on driver arrival & ride status' },
            { icon: '🕐', title: 'Ride Scheduling', desc: 'Pre-book rides up to 7 days in advance' },
            { icon: '💳', title: 'UPI / Card Payments', desc: 'Pay digitally, get instant receipts' },
            { icon: '🗺️', title: 'Live Tracking', desc: 'Watch your cab approach in real time' },
          ].map(f => (
            <div key={f.title} className="bg-gray-50 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200 rounded-2xl p-5 transition-all">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">{f.title}</h3>
              <p className="text-xs text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-4">
            {FAQS.map((faq, i) => (
              <details key={i} className="bg-white border border-gray-200 rounded-2xl group">
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-gray-800 hover:text-indigo-700 transition-colors">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform text-xl font-light">+</span>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-800 py-20 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ready to Ride Smarter?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Join thousands of commuters saving money daily with Humsafar&apos;s fair shared rides.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/book"
              className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-10 py-4 rounded-2xl text-lg shadow-2xl transition-all hover:scale-105"
            >
              🚕 Book Now — Free
            </Link>
            <Link
              href="/fare"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold px-10 py-4 rounded-2xl text-lg backdrop-blur-sm transition-all"
            >
              Calculate My Savings
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm">🚕</div>
                <span className="font-bold text-white">Humsafar</span>
              </div>
              <p className="text-sm leading-relaxed">India&apos;s fairest shared cab platform. हमसफ़र — your travel companion.</p>
            </div>
            {[
              { title: 'Product', links: ['Book Ride', 'Fare Calculator', 'User Dashboard', 'Driver Dashboard'] },
              { title: 'Cities', links: ['Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad'] },
              { title: 'Company', links: ['About Us', 'Safety', 'Privacy Policy', 'Terms of Service'] },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white mb-3 text-sm">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map(l => (
                    <li key={l}><span className="text-sm hover:text-white cursor-pointer transition-colors">{l}</span></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© 2026 Humsafar Technologies Pvt. Ltd. All rights reserved.</p>
            <p className="text-sm text-indigo-400">Made with ❤️ for India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
