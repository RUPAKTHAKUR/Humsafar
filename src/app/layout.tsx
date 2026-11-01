import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';

export const viewport: Viewport = {
  themeColor: '#4f46e5',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Humsafar — Share the Cab, Save Big',
    template: '%s — Humsafar',
  },
  description:
    'India-wide shared cab platform with fair segment-based pricing. Book shared or solo rides across 14 cities with women-only option.',
  keywords: ['cab sharing', 'India', 'pool cab', 'shared taxi', 'women only cab', 'humsafar', 'delhi cab', 'mumbai cab', 'bangalore cab'],
  authors: [{ name: 'Humsafar Technologies' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
