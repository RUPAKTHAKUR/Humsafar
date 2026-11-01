import React from 'react';
import Navbar from '@/components/Navbar';
import OwnerDashboard from '@/components/OwnerDashboard';

export const metadata = {
  title: 'Owner Dashboard — Humsafar',
  description: 'Full analytics, booking management, and revenue insights for Humsafar operators.',
};

export default function OwnerDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <OwnerDashboard />
    </div>
  );
}
