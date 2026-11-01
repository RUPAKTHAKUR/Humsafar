'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaCar, FaUser, FaBell, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { useAuth } from '@/lib/authContext';

interface NavbarProps {
  currentView?: 'user' | 'driver' | 'owner' | null;
  onViewChange?: (view: 'user' | 'driver' | 'owner') => void;
}

export default function Navbar({ currentView, onViewChange }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();

  const notifications = [
    { id: 1, text: 'Your ride is arriving in 3 min!', time: '2 min ago', unread: true },
    { id: 2, text: 'Pool saved you ₹85 on your last ride', time: '1 hr ago', unread: true },
    { id: 3, text: 'Women-only rides now available in Pune!', time: '3 hr ago', unread: false },
  ];
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-indigo-200 transition-shadow">
              <FaCar className="text-white text-lg" />
            </div>
            <div>
              <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                Humsafar
              </span>
              <span className="text-xs text-gray-400 block leading-none">हमसफ़र</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Home
            </Link>
            <Link href="/book" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Book Cab
            </Link>
            <Link href="/fare" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Fare Calc
            </Link>
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1 text-xs font-semibold">
              <Link
                href="/dashboard/user"
                className="px-2.5 py-1 rounded-lg text-gray-600 hover:text-indigo-700 hover:bg-white transition-all"
              >
                👤 Rider
              </Link>
              <Link
                href="/dashboard/driver"
                className="px-2.5 py-1 rounded-lg text-gray-600 hover:text-orange-700 hover:bg-white transition-all"
              >
                🚗 Driver
              </Link>
              <Link
                href="/dashboard/owner"
                className="px-2.5 py-1 rounded-lg text-gray-600 hover:text-purple-700 hover:bg-white transition-all"
              >
                📊 Owner
              </Link>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
                title="Notifications"
              >
                <FaBell className="text-gray-500 text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                    <p className="font-bold text-gray-800">Notifications</p>
                    <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                      <FaTimes />
                    </button>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 border-b border-gray-50 ${n.unread ? 'bg-indigo-50' : ''}`}>
                      <p className="text-sm text-gray-700">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  ))}
                  <div className="px-4 py-2 text-center">
                    <button className="text-xs text-indigo-600 font-medium">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Auth Profile / Login & Register Buttons */}
            {user ? (
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.role === 'driver' ? '🚗' : '👤'}
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold text-gray-900 leading-none">{user.name.split(' ')[0]}</p>
                  <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition"
                >
                  <FaSignOutAlt size={13} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
                >
                  <FaSignInAlt /> Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden sm:flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-md transition"
                >
                  <FaUserPlus /> Register
                </Link>
              </div>
            )}

            <Link
              href="/book"
              className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-md active:scale-95"
            >
              Book Now
            </Link>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              {menuOpen ? <FaTimes className="text-gray-600" /> : <FaBars className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
            >
              Home
            </Link>
            <Link
              href="/book"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
            >
              Book Cab
            </Link>
            <Link
              href="/fare"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
            >
              Fare Calculator
            </Link>
            <Link
              href="/dashboard/user"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
            >
              Rider Dashboard
            </Link>
            <Link
              href="/dashboard/driver"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
            >
              Driver Dashboard
            </Link>
            <Link
              href="/dashboard/owner"
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium"
            >
              Owner Console
            </Link>

            <div className="pt-2 border-t border-gray-100 px-4 space-y-2">
              {user ? (
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-bold text-gray-800">
                    Signed in as {user.name} ({user.role})
                  </span>
                  <button onClick={logout} className="text-xs text-red-600 font-bold">
                    Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center border border-gray-300 py-2 rounded-xl text-xs font-bold text-gray-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center bg-indigo-600 text-white py-2 rounded-xl text-xs font-bold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
