"use client";

import { useState } from "react";
import {
  FiNavigation,
  FiStar,
  FiPhone,
  FiCheck,
  FiX,
  FiMapPin,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiUsers,
  FiAlertCircle,
} from "react-icons/fi";
import {
  MdDirectionsCar,
  MdPeople,
  MdAttachMoney,
  MdEmojiEvents,
  MdWifiOff,
  MdWifi,
} from "react-icons/md";
import { RiShieldStarLine } from "react-icons/ri";
import LiveRideMap from "./LiveRideMap";
import { PLACES } from "@/lib/places";
import { useAuth } from "@/lib/authContext";

// ─── Types ───────────────────────────────────────────────────────────────────

type RideStatus = "pending" | "active" | "completed";

interface IncomingRide {
  id: string;
  riders: string[];
  pickup: string;
  drop: string;
  estimatedFare: number;
  poolSize: number;
  distance: string;
  eta: string;
}

interface ScheduledRide {
  id: string;
  time: string;
  from: string;
  to: string;
  riders: number;
  fare: number;
  status: RideStatus;
}

interface EarningEntry {
  id: string;
  time: string;
  route: string;
  riders: number;
  fare: number;
  tip: number;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const INCOMING_RIDE: IncomingRide = {
  id: "r1",
  riders: ["Priya M.", "Ankit S."],
  pickup: "Connaught Place, Gate No. 3",
  drop: "Saket District Centre",
  estimatedFare: 142,
  poolSize: 2,
  distance: "14.2 km",
  eta: "3 min",
};

const ACTIVE_RIDE = {
  rider: "Priya Mehta",
  pickup: "Connaught Place",
  drop: "Saket District Centre",
  otp: "7283",
  progress: 40,
  phone: "+91 98765 43210",
  riderCount: 2,
  fareOnMeter: "₹58 / ₹142",
};

const SCHEDULE: ScheduledRide[] = [
  {
    id: "s1",
    time: "09:15 AM",
    from: "Connaught Place",
    to: "Saket",
    riders: 2,
    fare: 142,
    status: "active",
  },
  {
    id: "s2",
    time: "10:40 AM",
    from: "Saket",
    to: "Lajpat Nagar",
    riders: 3,
    fare: 210,
    status: "pending",
  },
  {
    id: "s3",
    time: "12:15 PM",
    from: "Lajpat Nagar",
    to: "Cyber City",
    riders: 2,
    fare: 285,
    status: "pending",
  },
  {
    id: "s4",
    time: "03:30 PM",
    from: "Cyber City",
    to: "Dwarka Sector 21",
    riders: 1,
    fare: 320,
    status: "completed",
  },
  {
    id: "s5",
    time: "06:00 PM",
    from: "Rajiv Chowk",
    to: "Vasant Kunj",
    riders: 3,
    fare: 195,
    status: "pending",
  },
];

const EARNINGS: EarningEntry[] = [
  { id: "e1", time: "09:15 AM", route: "CP → Saket", riders: 2, fare: 142, tip: 20 },
  { id: "e2", time: "10:40 AM", route: "Saket → Lajpat", riders: 3, fare: 210, tip: 0 },
  { id: "e3", time: "12:15 PM", route: "Lajpat → Cyber City", riders: 2, fare: 285, tip: 50 },
  { id: "e4", time: "03:30 PM", route: "Cyber City → Dwarka", riders: 1, fare: 320, tip: 30 },
  { id: "e5", time: "06:00 PM", route: "Rajiv Chowk → Vasant Kunj", riders: 3, fare: 195, tip: 0 },
];

const WEEKLY_EARNINGS = [820, 1450, 1920, 1340, 2180, 1670, 1152];
const WEEKLY_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// ─── Sub-components ──────────────────────────────────────────────────────────

function OnlineStatusIndicator({ online }: { online: boolean }) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
        online ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${online ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
      />
      {online ? "Online" : "Offline"}
    </span>
  );
}

function ScheduleStatusBadge({ status }: { status: RideStatus }) {
  const cfg: Record<RideStatus, { bg: string; text: string; label: string }> = {
    active: { bg: "bg-orange-100", text: "text-orange-700", label: "Active" },
    pending: { bg: "bg-blue-50", text: "text-blue-600", label: "Upcoming" },
    completed: { bg: "bg-green-100", text: "text-green-700", label: "Done" },
  };
  const { bg, text, label } = cfg[status];
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${bg} ${text}`}>
      {label}
    </span>
  );
}

// ─── Tab: Today's Rides ───────────────────────────────────────────────────────

function TodaysRidesTab({ online }: { online: boolean }) {
  const [accepted, setAccepted] = useState<null | boolean>(null);

  if (!online) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <MdWifiOff size={40} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-700">You're Offline</h3>
          <p className="mt-1 text-sm text-gray-400">
            Toggle online to start receiving ride requests
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Incoming Ride Request */}
      {accepted === null && (
        <div className="rounded-2xl border-2 border-orange-400 bg-white shadow-lg overflow-hidden">
          <div className="flex items-center gap-2 bg-orange-500 px-4 py-2">
            <FiAlertCircle className="text-white" size={16} />
            <span className="text-sm font-bold text-white">New Ride Request</span>
            <span className="ml-auto rounded-full bg-white/20 px-2 py-0.5 text-xs font-bold text-white">
              Expires in 25s
            </span>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <FiUsers size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">
                  {INCOMING_RIDE.riders.join(" & ")}
                </p>
                <p className="text-xs text-gray-400">
                  Pool · {INCOMING_RIDE.poolSize} riders · {INCOMING_RIDE.distance}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-lg font-black text-orange-600">
                  ₹{INCOMING_RIDE.estimatedFare}
                </p>
                <p className="text-xs text-gray-400">Est. fare</p>
              </div>
            </div>

            <div className="space-y-2 rounded-xl bg-orange-50 p-3">
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {INCOMING_RIDE.pickup}
                  </p>
                </div>
                <span className="ml-auto text-xs text-orange-600 font-semibold">
                  {INCOMING_RIDE.eta}
                </span>
              </div>
              <div className="ml-1.5 w-px h-3 bg-gray-300 ml-[5px]" />
              <div className="flex items-start gap-2">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-red-500 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Drop-off</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {INCOMING_RIDE.drop}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setAccepted(false)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-3 text-sm font-bold text-gray-600 transition hover:border-red-300 hover:text-red-600"
              >
                <FiX size={18} />
                Decline
              </button>
              <button
                onClick={() => setAccepted(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-sm font-bold text-white shadow-md transition hover:bg-orange-600"
              >
                <FiCheck size={18} />
                Accept
              </button>
            </div>
          </div>
        </div>
      )}

      {accepted === true && (
        <div className="rounded-2xl border border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 p-4 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-sm font-bold text-orange-700">Active Ride</span>
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{ACTIVE_RIDE.pickup}</span>
              <span>{ACTIVE_RIDE.drop}</span>
            </div>
            <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all"
                style={{ width: `${ACTIVE_RIDE.progress}%` }}
              />
            </div>
            <p className="mt-1 text-right text-xs text-orange-600 font-semibold">
              {ACTIVE_RIDE.progress}% complete
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-400">Rider</p>
              <p className="font-bold text-gray-800">{ACTIVE_RIDE.rider}</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-400">OTP</p>
              <p className="text-xl font-black tracking-widest text-orange-600">
                {ACTIVE_RIDE.otp}
              </p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-400">On Meter</p>
              <p className="font-bold text-gray-800">{ACTIVE_RIDE.fareOnMeter}</p>
            </div>
            <div className="rounded-xl bg-white p-3 shadow-sm">
              <p className="text-xs text-gray-400">Riders</p>
              <p className="font-bold text-gray-800">{ACTIVE_RIDE.riderCount} in pool</p>
            </div>
          </div>
        </div>
      )}

      {accepted === false && (
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center">
          <p className="text-gray-500 text-sm">Ride declined. Next request incoming…</p>
        </div>
      )}

      {/* Today's Schedule */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Today's Schedule
        </h3>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
          {SCHEDULE.map((ride) => (
            <div key={ride.id} className="flex items-center gap-3 px-4 py-3">
              <span className="w-16 shrink-0 text-xs font-mono font-semibold text-gray-400">
                {ride.time}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {ride.from} → {ride.to}
                </p>
                <p className="text-xs text-gray-400">
                  {ride.riders} rider{ride.riders > 1 ? "s" : ""}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-800">₹{ride.fare}</p>
                <ScheduleStatusBadge status={ride.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Tab: Navigation ──────────────────────────────────────────────────────────

function NavigationTab({ online }: { online: boolean }) {
  if (!online) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
          <FiNavigation size={40} />
        </div>
        <p className="text-sm text-gray-400">Go online to see navigation</p>
      </div>
    );
  }

  const cpPlace = PLACES.find((p) => p.id === 'del_cp') || PLACES[0];
  const saketPlace = PLACES.find((p) => p.id === 'del_saket') || PLACES[1];

  return (
    <div className="space-y-4">
      {/* Live Moving GPS Map */}
      <LiveRideMap
        from={cpPlace}
        to={saketPlace}
        progressPct={55}
        driverName="Rajesh Kumar"
        carNumber="DL 01 AB 1234"
      />

      {/* Ride Details */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <div>
            <p className="text-xs text-gray-400">Pickup</p>
            <p className="text-sm font-bold text-gray-800">
              Connaught Place, Gate No. 3
            </p>
          </div>
          <span className="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
            Picked Up ✓
          </span>
        </div>
        <div className="ml-1 h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <div>
            <p className="text-xs text-gray-400">Drop-off</p>
            <p className="text-sm font-bold text-gray-800">
              Saket District Centre
            </p>
          </div>
          <span className="ml-auto text-sm font-bold text-orange-600">18 min</span>
        </div>
      </div>

      {/* OTP & Contact */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4 text-center">
          <p className="text-xs font-semibold text-orange-500 mb-1">Ride OTP</p>
          <p className="text-3xl font-black tracking-widest text-orange-700">
            7283
          </p>
          <p className="text-xs text-orange-400 mt-1">Share with rider</p>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-sm">
          <p className="text-xs font-semibold text-gray-400 mb-1">Rider Contact</p>
          <p className="text-sm font-bold text-gray-800 mb-2">Priya Mehta</p>
          <a
            href="tel:+919876543210"
            className="inline-flex items-center gap-1.5 rounded-xl bg-orange-500 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-orange-600"
          >
            <FiPhone size={13} />
            Call
          </a>
        </div>
      </div>

      {/* Pool Info */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-gray-600">Pool Riders</h4>
        <div className="space-y-2">
          {[
            { name: "Priya Mehta", status: "On board", drop: "Saket" },
            { name: "Ankit Sharma", status: "On board", drop: "Lajpat Nagar" },
          ].map((rider, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-base">
                {i === 0 ? "👩" : "👨"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-800">{rider.name}</p>
                <p className="text-xs text-gray-400">→ {rider.drop}</p>
              </div>
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                {rider.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Earnings ────────────────────────────────────────────────────────────

function EarningsTab() {
  const todayTotal = EARNINGS.reduce((s, e) => s + e.fare + e.tip, 0);
  const weekTotal = 10532;
  const monthTotal = 38450;

  const maxEarning = Math.max(...WEEKLY_EARNINGS);

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Today", value: todayTotal, icon: <FiDollarSign size={18} />, color: "from-orange-500 to-amber-500" },
          { label: "This Week", value: weekTotal, icon: <FiTrendingUp size={18} />, color: "from-amber-500 to-yellow-500" },
          { label: "This Month", value: monthTotal, icon: <MdAttachMoney size={20} />, color: "from-yellow-500 to-lime-500" },
        ].map((card) => (
          <div
            key={card.label}
            className={`rounded-2xl bg-gradient-to-br ${card.color} p-3 text-white shadow-md`}
          >
            <div className="mb-1 opacity-80">{card.icon}</div>
            <p className="text-xs font-semibold opacity-80">{card.label}</p>
            <p className="text-base font-black">₹{card.value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      {/* Weekly Bar Chart */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-gray-600">Weekly Earnings</h4>
        <div className="flex items-end gap-2 h-28">
          {WEEKLY_EARNINGS.map((val, i) => (
            <div key={i} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-orange-500 to-amber-400 transition-all"
                style={{ height: `${(val / maxEarning) * 100}%` }}
              />
              <span className="text-xs text-gray-400">{WEEKLY_DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Incentive Badges */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50 p-4">
        <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-700">
          <MdEmojiEvents size={18} />
          Incentive Badges
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "🏆 Top Driver", sub: "10+ rides/day" },
            { label: "⭐ 5-Star Week", sub: "All 5-star ratings" },
            { label: "🔥 Peak Hours", sub: "Bonus ₹200" },
          ].map((badge) => (
            <div
              key={badge.label}
              className="rounded-xl border border-orange-200 bg-white px-3 py-2 shadow-sm"
            >
              <p className="text-sm font-bold text-gray-800">{badge.label}</p>
              <p className="text-xs text-gray-400">{badge.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Ride Breakdown */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="grid grid-cols-4 gap-2 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
          <span>Time</span>
          <span>Route</span>
          <span className="text-right">Fare</span>
          <span className="text-right">Tip</span>
        </div>
        <div className="divide-y divide-gray-50">
          {EARNINGS.map((entry) => (
            <div key={entry.id} className="grid grid-cols-4 gap-2 px-4 py-3 text-sm">
              <span className="text-xs text-gray-400 font-mono">{entry.time}</span>
              <span className="text-xs text-gray-700 truncate">{entry.route}</span>
              <span className="text-right font-bold text-gray-800">₹{entry.fare}</span>
              <span className={`text-right text-xs font-semibold ${entry.tip > 0 ? "text-green-600" : "text-gray-300"}`}>
                {entry.tip > 0 ? `+₹${entry.tip}` : "—"}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-gray-100 bg-orange-50 px-4 py-3">
          <span className="text-sm font-bold text-gray-700">Today's Total</span>
          <span className="text-lg font-black text-orange-700">₹{todayTotal}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "rides" | "navigation" | "earnings";

export default function DriverDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("rides");
  const [online, setOnline] = useState(true);
  const driverRating = 4.9;

  const driverName = user?.role === "driver" ? user.name : "Rajesh Kumar";
  const driverCar = user?.role === "driver" && "carNumber" in user ? user.carNumber : "DL 01 AB 1234";

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "rides", label: "Today's Rides", icon: <MdPeople size={17} /> },
    { id: "navigation", label: "Navigation", icon: <FiNavigation size={15} /> },
    { id: "earnings", label: "Earnings", icon: <FiTrendingUp size={15} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-orange-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xl shadow-md">
              🧔
            </div>
            <div>
              <h1 className="text-base font-bold text-gray-900">{driverName}</h1>
              <div className="flex items-center gap-1">
                <FiStar className="fill-yellow-400 text-yellow-400" size={13} />
                <span className="text-sm font-semibold text-gray-700">
                  {driverRating}
                </span>
                <span className="text-xs text-gray-400 font-mono">· {driverCar}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <OnlineStatusIndicator online={online} />
            <button
              onClick={() => setOnline(!online)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                online ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                  online ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mx-auto flex max-w-lg items-center justify-around border-t border-orange-50 px-4 py-2">
          {[
            { label: "Today's Rides", value: "5" },
            { label: "Distance", value: "84 km" },
            { label: "Earned", value: "₹1,152" },
            { label: "Rating", value: "4.9 ⭐" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-sm font-black text-orange-600">{stat.value}</p>
              <p className="text-xs text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-lg gap-1 px-4 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white shadow"
                  : "bg-orange-50 text-gray-500 hover:bg-orange-100"
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === "rides" ? "Rides" : tab.id === "navigation" ? "Nav" : "Earn"}
              </span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-lg px-4 py-5 pb-10">
        {activeTab === "rides" && <TodaysRidesTab online={online} />}
        {activeTab === "navigation" && <NavigationTab online={online} />}
        {activeTab === "earnings" && <EarningsTab />}
      </main>

      {/* Vehicle Badge */}
      <div className="fixed bottom-4 right-4">
        <div className="flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-lg border border-orange-100">
          <MdDirectionsCar className="text-orange-500" size={18} />
          <span className="text-xs font-bold text-gray-700">Swift Dzire · DL-1CA-1234</span>
          <span className={`h-2 w-2 rounded-full ${online ? "bg-green-500 animate-pulse" : "bg-gray-300"}`} />
        </div>
      </div>
    </div>
  );
}
