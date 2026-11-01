import React from 'react';
import Navbar from '@/components/Navbar';
import UserDashboard from '@/components/UserDashboard';

export const metadata = {
  title: 'User Dashboard — Humsafar',
  description: 'View your ride history, book new rides, and manage your Humsafar profile.',
};

export default function UserDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <UserDashboard />
    </div>
  );
}
