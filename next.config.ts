import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {},
  typescript: {
    // Allow production builds even with TS errors during development
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
