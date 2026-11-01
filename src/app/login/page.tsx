'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import { FaCar, FaUser, FaLock, FaEnvelope, FaShieldAlt, FaArrowRight, FaKey } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [role, setRole] = useState<'rider' | 'driver'>('rider');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(identifier, password, role);
      if (result.success) {
        if (role === 'driver') {
          router.push('/dashboard/driver');
        } else {
          router.push('/dashboard/user');
        }
      } else {
        setError(result.message || 'Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Demo credential autofill helper
  const handleAutofillDemo = () => {
    if (role === 'rider') {
      setIdentifier('rider@humsafar.in');
      setPassword('password123');
    } else {
      setIdentifier('driver@humsafar.in');
      setPassword('password123');
    }
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100">
      <Navbar />
      <main className="max-w-md mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 p-8 text-white text-center">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <FaCar className="text-2xl text-orange-400" />
            </div>
            <h1 className="text-2xl font-black">Welcome Back</h1>
            <p className="text-indigo-200 text-xs mt-1">Sign in to your Humsafar Account</p>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Role Switcher Tabs */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex gap-1.5">
              <button
                type="button"
                onClick={() => { setRole('rider'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  role === 'rider'
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FaUser /> Rider Login
              </button>
              <button
                type="button"
                onClick={() => { setRole('driver'); setError(''); }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  role === 'driver'
                    ? 'bg-white text-orange-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800'
                }`}
              >
                <FaCar /> Driver Login
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Email ID or Mobile Number
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={role === 'rider' ? 'rider@humsafar.in or 9876543210' : 'driver@humsafar.in or 9812345678'}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  role === 'rider'
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 shadow-indigo-500/25'
                    : 'bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 shadow-orange-500/25'
                }`}
              >
                {isLoading ? 'Signing In...' : `Sign In as ${role === 'rider' ? 'Rider' : 'Driver'}`}
                <FaArrowRight />
              </button>
            </form>

            {/* Quick Demo Autofill */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-center">
              <p className="text-[11px] text-slate-500 font-semibold mb-2">Want to test without signing up?</p>
              <button
                type="button"
                onClick={handleAutofillDemo}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 transition flex items-center justify-center gap-1.5"
              >
                <FaKey className="text-amber-500" /> Autofill Demo {role === 'rider' ? 'Rider' : 'Driver'} Account
              </button>
            </div>

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Don&apos;t have an account yet?{' '}
                <Link href={`/signup?role=${role}`} className="font-bold text-indigo-600 hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
