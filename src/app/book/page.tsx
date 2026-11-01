import React from 'react';
import Navbar from '@/components/Navbar';
import BookingFlow from '@/components/BookingFlow';

export const metadata = {
  title: 'Book a Ride — Humsafar',
  description: 'Book a shared or solo cab ride anywhere in India. Fair segment-based pricing, women-only option, 12 cities covered.',
};

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50/30 to-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Book Your Ride</h1>
          <p className="text-gray-500">12 cities · 70+ locations · Fair shared pricing</p>
        </div>
        <BookingFlow />
      </main>
    </div>
  );
}
