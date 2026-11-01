'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import Navbar from '@/components/Navbar';
import {
  FaUser,
  FaCar,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaIdCard,
  FaCamera,
  FaCloudUploadAlt,
  FaCheckCircle,
  FaArrowRight,
  FaShieldAlt,
} from 'react-icons/fa';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole = searchParams.get('role') === 'driver' ? 'driver' : 'rider';

  const { signupRider, signupDriver } = useAuth();
  const [role, setRole] = useState<'rider' | 'driver'>(initialRole);

  // Common Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  // Driver Specific Fields
  const [carNumber, setCarNumber] = useState('');
  const [carOwnerName, setCarOwnerName] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  const [vehicleType, setVehicleType] = useState<'mini4' | 'suv7'>('mini4');

  // File Upload Previews (Base64 data URLs)
  const [dlPreview, setDlPreview] = useState<string>('');
  const [aadhaarPreview, setAadhaarPreview] = useState<string>('');
  const [selfiePreview, setSelfiePreview] = useState<string>('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (role === 'rider') {
        const res = await signupRider({ name, email, phone, password });
        if (res.success) {
          router.push('/dashboard/user');
        } else {
          setError(res.message || 'Signup failed');
        }
      } else {
        // Driver verification checks
        if (!carNumber || !carOwnerName || !dlNumber) {
          setError('Please provide car number, car owner name, and driving licence number.');
          setIsLoading(false);
          return;
        }

        const res = await signupDriver({
          name,
          email,
          phone,
          password,
          carNumber,
          carOwnerName,
          dlNumber,
          vehicleType,
          drivingLicenceUrl: dlPreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300',
          aadhaarUrl: aadhaarPreview || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300',
          selfieUrl: selfiePreview || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        });

        if (res.success) {
          router.push('/dashboard/driver');
        } else {
          setError(res.message || 'Driver registration failed');
        }
      }
    } catch (err: any) {
      setError(err?.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-800 p-6 sm:p-8 text-white text-center">
          <h1 className="text-2xl sm:text-3xl font-black">Create Your Account</h1>
          <p className="text-indigo-200 text-xs sm:text-sm mt-1">
            Join India&apos;s Smartest Shared Cab Network
          </p>

          {/* Role Switcher */}
          <div className="bg-white/10 p-1.5 rounded-2xl flex gap-1.5 max-w-sm mx-auto mt-6 backdrop-blur-md">
            <button
              type="button"
              onClick={() => { setRole('rider'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                role === 'rider'
                  ? 'bg-white text-indigo-800 shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FaUser /> Rider Account
            </button>
            <button
              type="button"
              onClick={() => { setRole('driver'); setError(''); }}
              className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                role === 'driver'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <FaCar /> Driver Partner
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Basic Details */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-indigo-700">
                Basic Contact Details
              </h3>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <FaUser className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Set Password</label>
                <div className="relative">
                  <FaLock className="absolute left-3.5 top-3.5 text-gray-400 text-sm" />
                  <input
                    type="password"
                    required
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              </div>
            </div>

            {/* Driver Specific Documents & Vehicle Details */}
            {role === 'driver' && (
              <div className="space-y-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                    <FaShieldAlt /> Driver & Vehicle KYC Verification
                  </h3>
                  <span className="text-[11px] bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded-full">
                    Mandatory
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Car Number (RC Plate)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. DL 01 AB 1234"
                      value={carNumber}
                      onChange={(e) => setCarNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Car Owner Name (as on RC)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Owner Name"
                      value={carOwnerName}
                      onChange={(e) => setCarOwnerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                      Driving Licence Number
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. MH02 20180012345"
                      value={dlNumber}
                      onChange={(e) => setDlNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-orange-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Vehicle Type</label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-orange-400"
                    >
                      <option value="mini4">4-Seater Mini (Swift/Dzire/Aura)</option>
                      <option value="suv7">7-Seater SUV (Ertiga/Innova/Carens)</option>
                    </select>
                  </div>
                </div>

                {/* Document Uploads */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold text-gray-700 uppercase">KYC Document Uploads</p>

                  {/* 1. Driving Licence Upload */}
                  <div className="border border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-lg">
                        <FaIdCard />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Upload Driving Licence (Front & Back)</p>
                        <p className="text-[11px] text-gray-500">JPG, PNG or PDF under 5MB</p>
                      </div>
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5">
                      <FaCloudUploadAlt /> {dlPreview ? 'Replace' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setDlPreview)}
                      />
                    </label>
                  </div>
                  {dlPreview && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
                      <FaCheckCircle /> Driving Licence attached
                    </div>
                  )}

                  {/* 2. Aadhaar Card Upload */}
                  <div className="border border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg">
                        <FaShieldAlt />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Upload Aadhaar Card (Govt ID)</p>
                        <p className="text-[11px] text-gray-500">Identity verification record</p>
                      </div>
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5">
                      <FaCloudUploadAlt /> {aadhaarPreview ? 'Replace' : 'Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setAadhaarPreview)}
                      />
                    </label>
                  </div>
                  {aadhaarPreview && (
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl">
                      <FaCheckCircle /> Aadhaar Card attached
                    </div>
                  )}

                  {/* 3. Driver Selfie Photo */}
                  <div className="border border-dashed border-gray-300 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-lg">
                        <FaCamera />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">Driver Selfie Photo</p>
                        <p className="text-[11px] text-gray-500">Clear frontal face photograph</p>
                      </div>
                    </div>
                    <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-2 rounded-xl transition flex items-center gap-1.5">
                      <FaCamera /> {selfiePreview ? 'Change' : 'Take / Upload'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, setSelfiePreview)}
                      />
                    </label>
                  </div>
                  {selfiePreview && (
                    <div className="flex items-center gap-3 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selfiePreview}
                        alt="Selfie preview"
                        className="w-10 h-10 rounded-full object-cover border border-emerald-400"
                      />
                      <span className="text-xs text-emerald-700 font-bold">Selfie attached successfully</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl text-white font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                role === 'rider'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-800 hover:from-indigo-700 hover:to-indigo-900 shadow-indigo-500/25'
                  : 'bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 shadow-orange-500/25'
              }`}
            >
              {isLoading ? 'Creating Account...' : `Register & Join as ${role === 'rider' ? 'Rider' : 'Driver'}`}
              <FaArrowRight />
            </button>
          </form>

          <div className="text-center pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-indigo-600 hover:underline">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 pb-16">
      <Navbar />
      <Suspense fallback={<div className="text-center py-20 text-gray-500 font-medium">Loading registration form...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
