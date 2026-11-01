'use client';

import React, { useState, useMemo } from 'react';
import {
  FaChartLine,
  FaCar,
  FaUsers,
  FaRupeeSign,
  FaDownload,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaClock,
  FaShieldAlt,
  FaArrowUp,
  FaArrowDown,
  FaCity,
  FaSyncAlt,
} from 'react-icons/fa';
import { RiWomenLine } from 'react-icons/ri';
import { formatRupees } from '@/lib/pricing';

interface BookingRecord {
  id: string;
  riderName: string;
  city: string;
  from: string;
  to: string;
  vehicle: '4-Seater Mini' | '7-Seater SUV';
  mode: 'Share' | 'Solo';
  isWomenOnly: boolean;
  fare: number;
  poolSavings: number;
  passengers: number;
  status: 'Completed' | 'In Progress' | 'Scheduled' | 'Cancelled';
  date: string;
  driverName: string;
}

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'BK-9481',
    riderName: 'Aarav Sharma',
    city: 'Delhi NCR',
    from: 'Connaught Place',
    to: 'Cyber Hub (Gurugram)',
    vehicle: '4-Seater Mini',
    mode: 'Share',
    isWomenOnly: false,
    fare: 185,
    poolSavings: 115,
    passengers: 3,
    status: 'Completed',
    date: '2026-11-01 11:42',
    driverName: 'Vikram Singh',
  },
  {
    id: 'BK-9480',
    riderName: 'Pooja Verma',
    city: 'Mumbai',
    from: 'Bandra Kurla Complex',
    to: 'CSIA Terminal 2',
    vehicle: '7-Seater SUV',
    mode: 'Share',
    isWomenOnly: true,
    fare: 140,
    poolSavings: 95,
    passengers: 4,
    status: 'Completed',
    date: '2026-11-01 11:15',
    driverName: 'Meera Deshmukh',
  },
  {
    id: 'BK-9479',
    riderName: 'Rohan Iyer',
    city: 'Bangalore',
    from: 'Koramangala 4th Block',
    to: 'Kempegowda Airport (BLR)',
    vehicle: '4-Seater Mini',
    mode: 'Solo',
    isWomenOnly: false,
    fare: 540,
    poolSavings: 0,
    passengers: 1,
    status: 'In Progress',
    date: '2026-11-01 10:55',
    driverName: 'Karthik Gowda',
  },
  {
    id: 'BK-9478',
    riderName: 'Ananya Reddy',
    city: 'Hyderabad',
    from: 'HITEC City',
    to: 'RGIA Airport',
    vehicle: '7-Seater SUV',
    mode: 'Share',
    isWomenOnly: true,
    fare: 210,
    poolSavings: 180,
    passengers: 5,
    status: 'In Progress',
    date: '2026-11-01 10:30',
    driverName: 'Lakshmi Bai',
  },
  {
    id: 'BK-9477',
    riderName: 'Debanjan Sen',
    city: 'Kolkata',
    from: 'Salt Lake Sector V',
    to: 'Howrah Station',
    vehicle: '4-Seater Mini',
    mode: 'Share',
    isWomenOnly: false,
    fare: 125,
    poolSavings: 85,
    passengers: 2,
    status: 'Completed',
    date: '2026-11-01 09:45',
    driverName: 'Subhashish Roy',
  },
  {
    id: 'BK-9476',
    riderName: 'Divya Nair',
    city: 'Chennai',
    from: 'T. Nagar',
    to: 'OMR Tech Corridor',
    vehicle: '4-Seater Mini',
    mode: 'Share',
    isWomenOnly: true,
    fare: 160,
    poolSavings: 110,
    passengers: 3,
    status: 'Scheduled',
    date: '2026-11-01 13:00',
    driverName: 'Saravanan M',
  },
  {
    id: 'BK-9475',
    riderName: 'Amit Joshi',
    city: 'Pune',
    from: 'Hinjawadi IT Park',
    to: 'Koregaon Park',
    vehicle: '4-Seater Mini',
    mode: 'Share',
    isWomenOnly: false,
    fare: 195,
    poolSavings: 130,
    passengers: 3,
    status: 'Completed',
    date: '2026-11-01 09:10',
    driverName: 'Dnyaneshwar P',
  },
  {
    id: 'BK-9474',
    riderName: 'Simran Kaur',
    city: 'Delhi NCR',
    from: 'Dwarka Sector 21',
    to: 'Connaught Place',
    vehicle: '7-Seater SUV',
    mode: 'Share',
    isWomenOnly: true,
    fare: 175,
    poolSavings: 145,
    passengers: 5,
    status: 'Completed',
    date: '2026-11-01 08:30',
    driverName: 'Gurpreet Singh',
  },
  {
    id: 'BK-9473',
    riderName: 'Kunal Patil',
    city: 'Ahmedabad',
    from: 'GIFT City',
    to: 'SG Highway',
    vehicle: '4-Seater Mini',
    mode: 'Solo',
    isWomenOnly: false,
    fare: 310,
    poolSavings: 0,
    passengers: 1,
    status: 'Cancelled',
    date: '2026-11-01 08:15',
    driverName: 'Unassigned',
  },
];

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'drivers' | 'revenue'>('overview');
  const [bookings, setBookings] = useState<BookingRecord[]>(INITIAL_BOOKINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.riderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.to.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCity = cityFilter === 'All' || b.city === cityFilter;
      const matchStatus = statusFilter === 'All' || b.status === statusFilter;
      return matchSearch && matchCity && matchStatus;
    });
  }, [bookings, searchQuery, cityFilter, statusFilter]);

  // Aggregate Metrics
  const totalBookings = 1247;
  const totalRevenue = 482350;
  const activeDrivers = 38;
  const avgPoolSavings = 127;
  const womenOnlyPercent = 23;
  const completionRate = 94.3;

  const handleExportCSV = () => {
    const headers = ['Booking ID,Rider,City,From,To,Vehicle,Mode,Women Only,Fare (INR),Savings (INR),Passengers,Status,Date,Driver\n'];
    const rows = filteredBookings.map(
      (b) =>
        `"${b.id}","${b.riderName}","${b.city}","${b.from}","${b.to}","${b.vehicle}","${b.mode}","${b.isWomenOnly ? 'Yes' : 'No'}",${b.fare},${b.poolSavings},${b.passengers},"${b.status}","${b.date}","${b.driverName}"`
    );
    const csvContent = headers.join('') + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `humsafar-bookings-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Control Bar */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 md:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-200 border border-purple-400/30 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <FaShieldAlt className="text-purple-300" /> Operator Admin Console
          </div>
          <h1 className="text-3xl md:text-4xl font-black">Owner & Fleet Operations</h1>
          <p className="text-purple-200 text-sm md:text-base mt-1 max-w-xl">
            Real-time India-wide ride pooling logistics, dynamic segment revenue, driver allocation, and safety analytics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2.5 rounded-xl text-sm font-semibold transition backdrop-blur-sm"
          >
            <FaSyncAlt className={isRefreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 transition active:scale-95"
          >
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Bookings</span>
            <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg"><FaCar /></span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">{totalBookings.toLocaleString('en-IN')}</div>
            <div className="flex items-center text-xs text-emerald-600 font-semibold mt-1">
              <FaArrowUp className="mr-1" /> +12.4% vs last wk
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Gross Revenue</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg"><FaRupeeSign /></span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">{formatRupees(totalRevenue)}</div>
            <div className="flex items-center text-xs text-emerald-600 font-semibold mt-1">
              <FaArrowUp className="mr-1" /> +18.2% vs last wk
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Active Drivers</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg"><FaUsers /></span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-gray-900">{activeDrivers} / 45</div>
            <div className="flex items-center text-xs text-blue-600 font-semibold mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-1.5" /> 84% on-road
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Avg Pool Savings</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg"><FaChartLine /></span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-600">{formatRupees(avgPoolSavings)}</div>
            <div className="text-xs text-gray-500 font-medium mt-1">per rider / ride</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Women-Only</span>
            <span className="p-1.5 bg-pink-50 text-pink-600 rounded-lg"><RiWomenLine /></span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-pink-600">{womenOnlyPercent}%</div>
            <div className="text-xs text-pink-500 font-semibold mt-1">287 safe trips</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500 text-xs font-bold uppercase">
            <span>Fulfilled</span>
            <span className="p-1.5 bg-teal-50 text-teal-600 rounded-lg"><FaCheckCircle /></span>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-teal-600">{completionRate}%</div>
            <div className="text-xs text-gray-500 font-medium mt-1">Only 5.7% drops</div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200">
        {[
          { key: 'overview', label: 'Analytics & Overview' },
          { key: 'bookings', label: 'All Bookings' },
          { key: 'drivers', label: 'Fleet & Drivers' },
          { key: 'revenue', label: 'Segment Revenue Breakdown' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`py-3.5 px-5 font-bold text-sm border-b-2 transition-all ${
              activeTab === tab.key
                ? 'border-purple-600 text-purple-700 bg-purple-50/50'
                : 'border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SVG Revenue Trend Chart */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-gray-900 text-lg">7-Day Revenue Velocity (₹)</h3>
                  <p className="text-xs text-gray-500">Includes shared corridor segment splits & platform fees</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    +24.5% Peak Growth
                  </span>
                </div>
              </div>

              {/* Pure SVG Line & Area Chart */}
              <div className="relative w-full h-64 mt-4">
                <svg viewBox="0 0 700 240" className="w-full h-full overflow-visible">
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  {[40, 90, 140, 190].map((y) => (
                    <line key={y} x1="50" y1={y} x2="680" y2={y} stroke="#f3f4f6" strokeWidth="1" />
                  ))}

                  {/* Area fill */}
                  <polygon
                    points="50,200 50,170 150,140 250,155 350,110 450,120 550,75 650,45 650,200"
                    fill="url(#revenueGrad)"
                  />

                  {/* Data Line */}
                  <polyline
                    fill="none"
                    stroke="#7c3aed"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="50,170 150,140 250,155 350,110 450,120 550,75 650,45"
                  />

                  {/* Nodes & Labels */}
                  {[
                    { x: 50, y: 170, val: '₹42k', day: 'Mon' },
                    { x: 150, y: 140, val: '₹51k', day: 'Tue' },
                    { x: 250, y: 155, val: '₹48k', day: 'Wed' },
                    { x: 350, y: 110, val: '₹64k', day: 'Thu' },
                    { x: 450, y: 120, val: '₹61k', day: 'Fri' },
                    { x: 550, y: 75, val: '₹82k', day: 'Sat' },
                    { x: 650, y: 45, val: '₹98k', day: 'Sun' },
                  ].map((pt, i) => (
                    <g key={i}>
                      <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#7c3aed" strokeWidth="3" />
                      <text x={pt.x} y={pt.y - 12} textAnchor="middle" fontSize="11" fontWeight="700" fill="#4c1d95">
                        {pt.val}
                      </text>
                      <text x={pt.x} y="222" textAnchor="middle" fontSize="11" fill="#6b7280" fontWeight="500">
                        {pt.day}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* City Distribution (SVG Bar Chart) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">City Ride Volume</h3>
                <p className="text-xs text-gray-500 mb-6">Percentage of total rides across India</p>

                <div className="space-y-4">
                  {[
                    { city: 'Delhi NCR', count: '412 rides', pct: 33, color: 'bg-purple-600' },
                    { city: 'Bangalore', count: '320 rides', pct: 26, color: 'bg-indigo-600' },
                    { city: 'Mumbai', count: '245 rides', pct: 20, color: 'bg-blue-600' },
                    { city: 'Hyderabad', count: '148 rides', pct: 12, color: 'bg-teal-600' },
                    { city: 'Chennai & Others', count: '122 rides', pct: 9, color: 'bg-emerald-600' },
                  ].map((item) => (
                    <div key={item.city}>
                      <div className="flex justify-between text-xs font-bold mb-1">
                        <span className="text-gray-700">{item.city}</span>
                        <span className="text-gray-500">{item.count} ({item.pct}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                        <div className={`${item.color} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-purple-50 rounded-2xl p-4 mt-6 border border-purple-100">
                <div className="flex items-center gap-2 text-xs font-bold text-purple-900">
                  <FaCity className="text-purple-600" /> 12 Active Indian Metros
                </div>
                <p className="text-xs text-purple-700 mt-1">
                  Tier-1 routes Cyber Hub-CP, BLR Airport, and BKC-Andheri generate 68% of shared seats.
                </p>
              </div>
            </div>
          </div>

          {/* Top Corridors & Safety Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-extrabold text-gray-900 text-lg mb-1">Top Shared Corridors</h3>
              <p className="text-xs text-gray-500 mb-4">Highest pooling density & passenger overlap</p>

              <div className="divide-y divide-gray-100">
                {[
                  { corridor: 'Cyber Hub ↔ Connaught Place', distance: '28 km', poolRatio: '3.4 pax/car', savings: '₹145/pax' },
                  { corridor: 'BLR Airport ↔ Koramangala / MG Rd', distance: '42 km', poolRatio: '3.8 pax/car', savings: '₹220/pax' },
                  { corridor: 'Bandra Kurla Complex ↔ Powai', distance: '14 km', poolRatio: '2.9 pax/car', savings: '₹95/pax' },
                  { corridor: 'HITEC City ↔ Gachibowli Outer Ring', distance: '12 km', poolRatio: '3.1 pax/car', savings: '₹75/pax' },
                ].map((c) => (
                  <div key={c.corridor} className="py-3.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm text-gray-900">{c.corridor}</p>
                      <p className="text-xs text-gray-500">{c.distance} · Density: {c.poolRatio}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Avg Save: {c.savings}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">
              <h3 className="font-extrabold text-gray-900 text-lg mb-1">Safety & Women-Only Compliance</h3>
              <p className="text-xs text-gray-500 mb-4">Security metrics & automated SOS alerts</p>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
                  <div className="text-2xl font-black text-pink-700">287</div>
                  <div className="text-xs font-semibold text-pink-900 mt-0.5">Women-Only Pools Today</div>
                  <div className="text-[11px] text-pink-600 mt-1">100% Verified Identity</div>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                  <div className="text-2xl font-black text-emerald-700">0</div>
                  <div className="text-xs font-semibold text-emerald-900 mt-0.5">Active SOS Triggers</div>
                  <div className="text-[11px] text-emerald-600 mt-1">Avg response &lt; 90s</div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  <span>Segment-by-segment GPS corridor tracking active on all 38 running cabs.</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  <span>Mandatory 4-digit OTP handshake verified before car motion.</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-emerald-500" />
                  <span>Detour limiter: max 3.0 km allowance per additional passenger.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-gray-900 text-xl">All Live & Completed Bookings</h3>
              <p className="text-xs text-gray-500">Filter by city, route, rider, or status</p>
            </div>

            {/* Filter controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <FaSearch className="absolute left-3.5 top-3 text-gray-400 text-xs" />
                <input
                  type="text"
                  placeholder="Search ID, rider, route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-400 w-56"
                />
              </div>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="All">All Cities</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Chennai">Chennai</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-extrabold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Booking ID</th>
                  <th className="py-3 px-4">Rider</th>
                  <th className="py-3 px-4">City & Corridor</th>
                  <th className="py-3 px-4">Vehicle / Mode</th>
                  <th className="py-3 px-4">Fare</th>
                  <th className="py-3 px-4">Savings</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Driver</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      No bookings matching your search or filters.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-purple-50/40 transition">
                      <td className="py-3 px-4 font-mono font-bold text-purple-700">{b.id}</td>
                      <td className="py-3 px-4">
                        <div className="font-bold text-gray-900">{b.riderName}</div>
                        <div className="text-[11px] text-gray-400">{b.date}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-gray-800">{b.city}</span>
                        <div className="text-[11px] text-gray-500 truncate max-w-[200px]">
                          {b.from} → {b.to}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 font-medium">
                          <span>{b.vehicle}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              b.mode === 'Share'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {b.mode} ({b.passengers} pax)
                          </span>
                          {b.isWomenOnly && (
                            <span className="bg-pink-100 text-pink-700 text-[10px] px-1.5 py-0.5 rounded font-bold">
                              Women-Only
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-gray-900">{formatRupees(b.fare)}</td>
                      <td className="py-3 px-4 font-bold text-emerald-600">
                        {b.poolSavings > 0 ? `+${formatRupees(b.poolSavings)}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                            b.status === 'Completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : b.status === 'Scheduled'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-600">{b.driverName}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
            <span>Showing {filteredBookings.length} of {bookings.length} recorded trips</span>
            <span className="text-gray-400">Auto-synced with Cloudflare edge</span>
          </div>
        </div>
      )}

      {/* TAB CONTENT: DRIVERS */}
      {activeTab === 'drivers' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-extrabold text-gray-900 text-xl">Fleet Drivers Roster</h3>
              <p className="text-xs text-gray-500">Live operational status, driver ratings, and segment split earnings</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              38 Active / 7 Standby
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: 'Vikram Singh', city: 'Delhi NCR', cab: 'Swift Dzire (DL 01 AB 9021)', rating: 4.9, rides: 14, earned: '₹3,420', status: 'Online' },
              { name: 'Meera Deshmukh', city: 'Mumbai', cab: 'Innova Crysta (MH 02 CK 4410)', rating: 5.0, rides: 9, earned: '₹4,110', status: 'On Ride' },
              { name: 'Karthik Gowda', city: 'Bangalore', cab: 'Toyota Etios (KA 05 MN 1832)', rating: 4.8, rides: 11, earned: '₹2,890', status: 'On Ride' },
              { name: 'Lakshmi Bai', city: 'Hyderabad', cab: 'Kia Carens (TS 09 XY 7721)', rating: 4.95, rides: 8, earned: '₹3,750', status: 'Online' },
              { name: 'Subhashish Roy', city: 'Kolkata', cab: 'Hyundai Aura (WB 04 EE 3390)', rating: 4.75, rides: 13, earned: '₹2,640', status: 'Offline' },
              { name: 'Gurpreet Singh', city: 'Delhi NCR', cab: 'Ertiga Hybrid (DL 03 XY 8812)', rating: 4.9, rides: 10, earned: '₹3,980', status: 'Online' },
            ].map((d) => (
              <div key={d.name} className="border border-gray-200 rounded-2xl p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-gray-900">{d.name}</div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      d.status === 'Online'
                        ? 'bg-emerald-100 text-emerald-800'
                        : d.status === 'On Ride'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{d.cab}</div>
                <div className="text-xs text-purple-600 font-semibold mt-0.5">{d.city}</div>

                <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <div className="text-gray-400 text-[10px] uppercase font-bold">Rating</div>
                    <div className="font-bold text-amber-500">★ {d.rating}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-[10px] uppercase font-bold">Trips</div>
                    <div className="font-bold text-gray-800">{d.rides}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-[10px] uppercase font-bold">Earnings</div>
                    <div className="font-bold text-emerald-600">{d.earned}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: REVENUE */}
      {activeTab === 'revenue' && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 space-y-6">
          <div>
            <h3 className="font-extrabold text-gray-900 text-xl">Segment-by-Segment Revenue Math</h3>
            <p className="text-xs text-gray-500">
              How Humsafar generates 35% higher gross yields than single-passenger aggregators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Driver Payout</span>
              <div className="text-3xl font-black text-indigo-900 mt-2">82%</div>
              <p className="text-xs text-indigo-600 mt-1">
                Drivers keep 100% of base fare + ₹9.50/km segment rates across pooled riders.
              </p>
            </div>

            <div className="bg-purple-50/60 border border-purple-100 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Platform Take</span>
              <div className="text-3xl font-black text-purple-900 mt-2">18%</div>
              <p className="text-xs text-purple-600 mt-1">
                Derived from the ₹9 flat booking fee per rider + corridor optimization margin.
              </p>
            </div>

            <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-5">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Passenger Net Savings</span>
              <div className="text-3xl font-black text-emerald-900 mt-2">42.8%</div>
              <p className="text-xs text-emerald-600 mt-1">
                Total consumer savings generated over traditional solo cab fares.
              </p>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl p-5 bg-gray-50">
            <h4 className="font-bold text-sm text-gray-900 mb-3">Sample Live Corridor Split: 4-Seater Mini</h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="text-gray-600">Rider 1 (22 km) - Boarded Cyber Hub, Dropped CP</span>
                <span className="font-bold text-gray-800">Paid: ₹185 (Saved ₹115)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="text-gray-600">Rider 2 (14 km) - Boarded Ambience Mall, Dropped Dhaula Kuan</span>
                <span className="font-bold text-gray-800">Paid: ₹130 (Saved ₹90)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="text-gray-600">Rider 3 (10 km) - Boarded Mahipalpur, Dropped CP</span>
                <span className="font-bold text-gray-800">Paid: ₹98 (Saved ₹72)</span>
              </div>
              <div className="flex justify-between pt-2 font-bold text-sm text-purple-900">
                <span>Total Driver Car Gross for Trip</span>
                <span>₹413 (vs ₹300 solo taxi)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
