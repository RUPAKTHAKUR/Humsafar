import React from 'react';
import Navbar from '@/components/Navbar';
import DriverDashboard from '@/components/DriverDashboard';

export const metadata = {
  title: 'Driver Dashboard — Humsafar',
  description: 'Accept rides, track earnings, and navigate with Humsafar driver tools.',
};

export default function DriverDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <DriverDashboard />
    </div>
  );
}
