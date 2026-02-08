import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://price-dex.com'),
  verification: {
    google: 'tUTYyOKHDQjD3vSPDHTyhyPB7z5UafgUaGOc3mhjAIU',
  },
  alternates: {
    canonical: '/',
  },
  title: {
    template: '%s | PriceDex',
    default: 'PriceDex — TCG Price Intelligence',
  },
  description:
    'Real-time TCG card prices, market trends, and price history. Track Pokémon, One Piece, and more trading card games.',
  keywords: [
    'Pokémon TCG',
    'one piece card game',
    'one piece tcg',
    'card prices',
    'price tracking',
    'Pokemon cards',
    'TCG',
    'price intelligence',
  ],
  authors: [
    {
      name: 'PriceDex',
      url: 'https://price-dex.com',
    },
  ],
  creator: 'PriceDex',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://price-dex.com',
    title: 'PriceDex — TCG Card Price Intelligence',
    description:
      'Track real-time prices for thousands of trading card game cards. Monitor Pokémon, One Piece, and more. Track price trends and make informed collecting and trading decisions.',
    siteName: 'PriceDex',
    images: [
      {
        url: 'https://price-dex.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'PriceDex - TCG Card Price Tracking',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PriceDex — TCG Card Price Intelligence',
    description:
      'Track real-time prices for thousands of trading card game cards including Pokémon and One Piece.',
    images: ['https://price-dex.com/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#0b0f1a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-radar-bg text-radar-text min-h-screen">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
