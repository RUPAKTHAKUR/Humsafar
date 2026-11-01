"use client";

import { useState } from "react";
import {
  FiBell,
  FiMapPin,
  FiStar,
  FiUser,
  FiClock,
  FiHeart,
  FiTrendingDown,
  FiCheck,
  FiX,
  FiChevronRight,
  FiPhone,
  FiToggleLeft,
  FiToggleRight,
  FiShield,
} from "react-icons/fi";
import {
  MdDirectionsCar,
  MdPeople,
  MdFemale,
  MdNotifications,
} from "react-icons/md";
import { RiCarLine } from "react-icons/ri";
import { useAuth } from "@/lib/authContext";

// ─── Types ──────────────────────────────────────────────────────────────────

type TripStatus = "completed" | "cancelled";
type RideMode = "share" | "solo" | "women-only";

interface Trip {
  id: string;
  from: string;
  to: string;
  date: string;
  fare: number;
  savings: number;
  status: TripStatus;
  rating: number;
  driver: string;
  mode: RideMode;
}

interface RecentRoute {
  from: string;
  to: string;
  fare: number;
  savings: number;
  date: string;
}

interface FavoriteRoute {
  from: string;
  to: string;
  frequency: string;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────

const TRIPS: Trip[] = [
  {
    id: "t1",
    from: "Connaught Place",
    to: "Saket District Centre",
    date: "Today, 09:15 AM",
    fare: 142,
    savings: 58,
    status: "completed",
    rating: 5,
    driver: "Ramesh Kumar",
    mode: "share",
  },
  {
    id: "t2",
    from: "Lajpat Nagar",
    to: "Cyber City, Gurugram",
    date: "Yesterday, 06:40 PM",
    fare: 285,
    savings: 115,
    status: "completed",
    rating: 4,
    driver: "Sunil Verma",
    mode: "share",
  },
  {
    id: "t3",
    from: "Hauz Khas Village",
    to: "IGI Airport T3",
    date: "28 Oct, 04:30 AM",
    fare: 420,
    savings: 0,
    status: "completed",
    rating: 5,
    driver: "Anita Sharma",
    mode: "solo",
  },
  {
    id: "t4",
    from: "Vasant Kunj",
    to: "Khan Market",
    date: "27 Oct, 11:20 AM",
    fare: 0,
    savings: 0,
    status: "cancelled",
    rating: 0,
    driver: "Priya Singh",
    mode: "women-only",
  },
  {
    id: "t5",
    from: "Dwarka Sector 21",
    to: "Rajiv Chowk Metro",
    date: "25 Oct, 08:05 AM",
    fare: 95,
    savings: 40,
    status: "completed",
    rating: 4,
    driver: "Mohit Yadav",
    mode: "share",
  },
];

const RECENT_ROUTES: RecentRoute[] = [
  {
    from: "Connaught Place",
    to: "Saket",
    fare: 142,
    savings: 58,
    date: "Today",
  },
  {
    from: "Lajpat Nagar",
    to: "Cyber City",
    fare: 285,
    savings: 115,
    date: "Yesterday",
  },
  {
    from: "Hauz Khas",
    to: "IGI Airport",
    fare: 420,
    savings: 0,
    date: "28 Oct",
  },
  {
    from: "Vasant Kunj",
    to: "Khan Market",
    fare: 0,
    savings: 0,
    date: "27 Oct",
  },
  {
    from: "Dwarka Sec 21",
    to: "Rajiv Chowk",
    fare: 95,
    savings: 40,
    date: "25 Oct",
  },
];

const FAVORITE_ROUTES: FavoriteRoute[] = [
  {
    from: "Connaught Place",
    to: "Saket District Centre",
    frequency: "Daily",
  },
  {
    from: "Lajpat Nagar",
    to: "Cyber City, Gurugram",
    frequency: "3x / week",
  },
  { from: "Dwarka Sec 21", to: "Rajiv Chowk", frequency: "Weekdays" },
];

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    message: "Your ride from Connaught Place arrived. Driver Ramesh Kumar is 2 min away.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    message: "You saved ₹115 on your last pool ride to Cyber City. Great choice! 🎉",
    time: "Yesterday",
    read: false,
  },
  {
    id: "n3",
    message: "Special offer: Book a Women-Only ride this weekend and get ₹50 off.",
    time: "2 days ago",
    read: true,
  },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          className={
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }
          size={13}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: TripStatus }) {
  const cfg = {
    completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed", icon: <FiCheck size={11} /> },
    cancelled: { bg: "bg-red-100", text: "text-red-600", label: "Cancelled", icon: <FiX size={11} /> },
  };
  const { bg, text, label, icon } = cfg[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${bg} ${text}`}>
      {icon}
      {label}
    </span>
  );
}

function ModeBadge({ mode }: { mode: RideMode }) {
  const cfg: Record<RideMode, { bg: string; text: string; label: string }> = {
    share: { bg: "bg-indigo-50", text: "text-indigo-600", label: "Pool" },
    solo: { bg: "bg-blue-50", text: "text-blue-600", label: "Solo" },
    "women-only": { bg: "bg-pink-50", text: "text-pink-600", label: "Women-Only" },
  };
  const { bg, text, label } = cfg[mode];
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}

// ─── Tab: Book Ride ───────────────────────────────────────────────────────────

function BookRideTab() {
  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: <MdPeople size={28} />,
              label: "Share Ride",
              sub: "Save up to 60%",
              color: "from-indigo-500 to-indigo-600",
            },
            {
              icon: <RiCarLine size={28} />,
              label: "Solo Ride",
              sub: "Private & comfortable",
              color: "from-blue-500 to-blue-600",
            },
            {
              icon: <MdFemale size={28} />,
              label: "Women-Only",
              sub: "Female driver & riders",
              color: "from-pink-500 to-rose-500",
            },
          ].map((action) => (
            <button
              key={action.label}
              className={`bg-gradient-to-br ${action.color} flex flex-col items-center gap-2 rounded-2xl p-4 text-white shadow-md transition hover:opacity-90 hover:shadow-lg active:scale-95`}
            >
              {action.icon}
              <span className="text-sm font-bold leading-tight">{action.label}</span>
              <span className="text-xs opacity-80 leading-tight text-center">{action.sub}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Recent Routes */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Recent Routes
        </h3>
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm divide-y divide-gray-50">
          {RECENT_ROUTES.map((route, i) => (
            <button
              key={i}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-indigo-50/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <FiMapPin size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {route.from} → {route.to}
                </p>
                <p className="text-xs text-gray-400">{route.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-gray-800">
                  {route.fare > 0 ? `₹${route.fare}` : "Cancelled"}
                </p>
                {route.savings > 0 && (
                  <p className="text-xs text-green-600 font-medium">
                    −₹{route.savings} saved
                  </p>
                )}
              </div>
              <FiChevronRight className="text-gray-300 shrink-0" size={16} />
            </button>
          ))}
        </div>
      </section>

      {/* Favorite Routes */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          Favorite Routes
        </h3>
        <div className="space-y-2">
          {FAVORITE_ROUTES.map((route, i) => (
            <button
              key={i}
              className="flex w-full items-center gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3 text-left shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50/40"
            >
              <FiHeart className="text-rose-400 shrink-0" size={18} />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-semibold text-gray-800">
                  {route.from} → {route.to}
                </p>
                <p className="text-xs text-gray-400">{route.frequency}</p>
              </div>
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                Book
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

// ─── Tab: My Trips ────────────────────────────────────────────────────────────

function MyTripsTab() {
  return (
    <div className="space-y-3">
      {TRIPS.map((trip) => (
        <div
          key={trip.id}
          className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-bold text-gray-800">
                {trip.from}
              </p>
              <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                <FiMapPin size={11} />
                <span className="truncate">{trip.to}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <StatusBadge status={trip.status} />
              <ModeBadge mode={trip.mode} />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <FiUser size={12} />
              {trip.driver}
            </span>
            <span className="flex items-center gap-1">
              <FiClock size={12} />
              {trip.date}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              {trip.status === "completed" && (
                <>
                  <div>
                    <p className="text-xs text-gray-400">Paid</p>
                    <p className="text-sm font-bold text-gray-800">₹{trip.fare}</p>
                  </div>
                  {trip.savings > 0 && (
                    <div>
                      <p className="text-xs text-gray-400">Saved</p>
                      <p className="text-sm font-bold text-green-600">
                        ₹{trip.savings}
                      </p>
                    </div>
                  )}
                </>
              )}
              {trip.status === "cancelled" && (
                <p className="text-sm text-gray-400 italic">No charge applied</p>
              )}
            </div>
            {trip.status === "completed" && trip.rating > 0 && (
              <StarRating rating={trip.rating} />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Tab: Profile ─────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user } = useAuth();
  const [preferredMode, setPreferredMode] = useState<RideMode>("share");
  const [womenOnly, setWomenOnly] = useState(false);

  const displayName = user?.name || "Priya Mehta";
  const displayPhone = user?.phone ? `+91 ${user.phone}` : "+91 98765 43210";

  return (
    <div className="space-y-5">
      {/* Avatar & Info */}
      <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 text-3xl shadow-md">
          👩
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{displayName}</h3>
          <p className="flex items-center gap-1.5 text-sm text-gray-500">
            <FiPhone size={13} />
            {displayPhone}
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="text-center">
              <p className="text-base font-bold text-indigo-600">47</p>
              <p className="text-xs text-gray-400">Rides</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-base font-bold text-yellow-500">4.8 ⭐</p>
              <p className="text-xs text-gray-400">Rating</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-base font-bold text-green-600">₹1,840</p>
              <p className="text-xs text-gray-400">Saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferred Mode */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <h4 className="mb-3 text-sm font-semibold text-gray-600">
          Preferred Ride Mode
        </h4>
        <div className="flex gap-2">
          {(["share", "solo", "women-only"] as RideMode[]).map((mode) => {
            const labels: Record<RideMode, string> = {
              share: "🚗 Share",
              solo: "🚖 Solo",
              "women-only": "🛡️ Women-Only",
            };
            return (
              <button
                key={mode}
                onClick={() => setPreferredMode(mode)}
                className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${
                  preferredMode === mode
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {labels[mode]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Gender Filter Toggle */}
      <div className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-600">
            <FiShield size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">Women-Only Filter</p>
            <p className="text-xs text-gray-400">Match only female riders & drivers</p>
          </div>
        </div>
        <button
          onClick={() => setWomenOnly(!womenOnly)}
          className={`transition ${womenOnly ? "text-pink-600" : "text-gray-300"}`}
        >
          {womenOnly ? <FiToggleRight size={30} /> : <FiToggleLeft size={30} />}
        </button>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h4 className="text-sm font-semibold text-gray-600">Notifications</h4>
          <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-700">
            {NOTIFICATIONS.filter((n) => !n.read).length} new
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className={`flex gap-3 px-4 py-3 ${!n.read ? "bg-indigo-50/50" : ""}`}
            >
              <div
                className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
                  !n.read ? "bg-indigo-500" : "bg-transparent"
                }`}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                <p className="mt-1 text-xs text-gray-400">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = "book" | "trips" | "profile";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("book");
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = NOTIFICATIONS.filter((n) => !n.read).length;

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "book", label: "Book Ride", icon: <MdDirectionsCar size={18} /> },
    { id: "trips", label: "My Trips", icon: <FiClock size={16} /> },
    { id: "profile", label: "Profile", icon: <FiUser size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-indigo-100 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-3">
          <div>
            <p className="text-xs text-gray-400">Good morning,</p>
            <h1 className="text-lg font-bold text-indigo-700">Priya Mehta 👋</h1>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 transition hover:bg-indigo-100"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 top-12 z-20 w-80 rounded-2xl border border-gray-100 bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
                  <span className="font-semibold text-gray-800">Notifications</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX size={16} />
                  </button>
                </div>
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 border-b border-gray-50 last:border-0 ${
                      !n.read ? "bg-indigo-50/60" : ""
                    }`}
                  >
                    <MdNotifications
                      className={!n.read ? "text-indigo-500 mt-0.5 shrink-0" : "text-gray-300 mt-0.5 shrink-0"}
                      size={18}
                    />
                    <div>
                      <p className="text-sm text-gray-700 leading-snug">{n.message}</p>
                      <p className="mt-1 text-xs text-gray-400">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-lg gap-1 px-4 pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-sm font-semibold transition ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow"
                  : "bg-indigo-50 text-gray-500 hover:bg-indigo-100"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-lg px-4 py-5 pb-10">
        {activeTab === "book" && <BookRideTab />}
        {activeTab === "trips" && <MyTripsTab />}
        {activeTab === "profile" && <ProfileTab />}
      </main>

      {/* Savings Banner */}
      {activeTab === "book" && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-indigo-100 bg-white/95 backdrop-blur-sm px-4 py-3">
          <div className="mx-auto flex max-w-lg items-center gap-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-white shadow-lg">
            <FiTrendingDown size={22} className="shrink-0" />
            <div>
              <p className="text-sm font-bold">Total Savings This Month</p>
              <p className="text-xs opacity-80">
                You saved ₹1,840 by choosing pool rides 🎉
              </p>
            </div>
            <span className="ml-auto text-xl font-black">₹1,840</span>
          </div>
        </div>
      )}
    </div>
  );
}
