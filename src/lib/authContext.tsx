'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'rider';
  createdAt: string;
}

export interface DriverAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'driver';
  carNumber: string;
  carOwnerName: string;
  dlNumber: string;
  vehicleType: 'mini4' | 'suv7';
  drivingLicenceUrl?: string;
  aadhaarUrl?: string;
  selfieUrl?: string;
  rating: number;
  totalTrips: number;
  isVerified: boolean;
  createdAt: string;
}

export type AuthUser = UserAccount | DriverAccount;

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (identifier: string, pass: string, role: 'rider' | 'driver') => Promise<{ success: boolean; message?: string }>;
  signupRider: (data: { name: string; email: string; phone: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  signupDriver: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    carNumber: string;
    carOwnerName: string;
    dlNumber: string;
    vehicleType: 'mini4' | 'suv7';
    drivingLicenceUrl?: string;
    aadhaarUrl?: string;
    selfieUrl?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'humsafar_users_db';
const DRIVERS_STORAGE_KEY = 'humsafar_drivers_db';
const CURRENT_AUTH_KEY = 'humsafar_current_auth';

// Initial pre-seeded demo accounts
const DEFAULT_USERS: Array<UserAccount & { password: string }> = [
  {
    id: 'user_1',
    name: 'Aarav Sharma',
    email: 'rider@humsafar.in',
    phone: '9876543210',
    password: 'password123',
    role: 'rider',
    createdAt: '2026-10-15',
  },
  {
    id: 'user_2',
    name: 'Priya Verma',
    email: 'priya@humsafar.in',
    phone: '9876543211',
    password: 'password123',
    role: 'rider',
    createdAt: '2026-10-20',
  },
];

const DEFAULT_DRIVERS: Array<DriverAccount & { password: string }> = [
  {
    id: 'drv_1',
    name: 'Rajesh Kumar',
    email: 'driver@humsafar.in',
    phone: '9812345678',
    password: 'password123',
    role: 'driver',
    carNumber: 'DL 01 AB 1234',
    carOwnerName: 'Rajesh Kumar',
    dlNumber: 'DL-0420110023456',
    vehicleType: 'mini4',
    selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    drivingLicenceUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
    aadhaarUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&auto=format&fit=crop&q=80',
    rating: 4.88,
    totalTrips: 342,
    isVerified: true,
    createdAt: '2026-09-01',
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize DB in localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        if (!localStorage.getItem(USERS_STORAGE_KEY)) {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
        }
        if (!localStorage.getItem(DRIVERS_STORAGE_KEY)) {
          localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(DEFAULT_DRIVERS));
        }

        const storedAuth = localStorage.getItem(CURRENT_AUTH_KEY);
        if (storedAuth) {
          setUser(JSON.parse(storedAuth));
        }
      }
    } catch (e) {
      console.error('Failed to initialize auth storage:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (identifier: string, pass: string, role: 'rider' | 'driver') => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (role === 'rider') {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      const users: Array<UserAccount & { password: string }> = stored ? JSON.parse(stored) : DEFAULT_USERS;
      const found = users.find(
        (u) => (u.email.toLowerCase() === cleanId || u.phone === cleanId) && u.password === cleanPass
      );

      if (found) {
        const { password, ...safeUser } = found;
        setUser(safeUser);
        localStorage.setItem(CURRENT_AUTH_KEY, JSON.stringify(safeUser));
        return { success: true };
      }
      return { success: false, message: 'Invalid email/phone or password for Rider account.' };
    } else {
      const stored = localStorage.getItem(DRIVERS_STORAGE_KEY);
      const drivers: Array<DriverAccount & { password: string }> = stored ? JSON.parse(stored) : DEFAULT_DRIVERS;
      const found = drivers.find(
        (d) => (d.email.toLowerCase() === cleanId || d.phone === cleanId) && d.password === cleanPass
      );

      if (found) {
        const { password, ...safeDriver } = found;
        setUser(safeDriver);
        localStorage.setItem(CURRENT_AUTH_KEY, JSON.stringify(safeDriver));
        return { success: true };
      }
      return { success: false, message: 'Invalid email/phone or password for Driver account.' };
    }
  };

  const signupRider = async (data: { name: string; email: string; phone: string; password: string }) => {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    const users: Array<UserAccount & { password: string }> = stored ? JSON.parse(stored) : DEFAULT_USERS;

    const exists = users.some(
      (u) => u.email.toLowerCase() === data.email.trim().toLowerCase() || u.phone === data.phone.trim()
    );

    if (exists) {
      return { success: false, message: 'An account with this email or phone number already exists.' };
    }

    const newUser: UserAccount & { password: string } = {
      id: `user_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password.trim(),
      role: 'rider',
      createdAt: new Date().toISOString().slice(0, 10),
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

    const { password, ...safeUser } = newUser;
    setUser(safeUser);
    localStorage.setItem(CURRENT_AUTH_KEY, JSON.stringify(safeUser));
    return { success: true };
  };

  const signupDriver = async (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    carNumber: string;
    carOwnerName: string;
    dlNumber: string;
    vehicleType: 'mini4' | 'suv7';
    drivingLicenceUrl?: string;
    aadhaarUrl?: string;
    selfieUrl?: string;
  }) => {
    const stored = localStorage.getItem(DRIVERS_STORAGE_KEY);
    const drivers: Array<DriverAccount & { password: string }> = stored ? JSON.parse(stored) : DEFAULT_DRIVERS;

    const exists = drivers.some(
      (d) => d.email.toLowerCase() === data.email.trim().toLowerCase() || d.phone === data.phone.trim()
    );

    if (exists) {
      return { success: false, message: 'A driver with this email or phone number already exists.' };
    }

    const newDriver: DriverAccount & { password: string } = {
      id: `drv_${Date.now()}`,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      password: data.password.trim(),
      role: 'driver',
      carNumber: data.carNumber.toUpperCase().trim(),
      carOwnerName: data.carOwnerName.trim(),
      dlNumber: data.dlNumber.toUpperCase().trim(),
      vehicleType: data.vehicleType,
      drivingLicenceUrl: data.drivingLicenceUrl,
      aadhaarUrl: data.aadhaarUrl,
      selfieUrl: data.selfieUrl,
      rating: 5.0,
      totalTrips: 0,
      isVerified: true,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    drivers.push(newDriver);
    localStorage.setItem(DRIVERS_STORAGE_KEY, JSON.stringify(drivers));

    const { password, ...safeDriver } = newDriver;
    setUser(safeDriver);
    localStorage.setItem(CURRENT_AUTH_KEY, JSON.stringify(safeDriver));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CURRENT_AUTH_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signupRider, signupDriver, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
