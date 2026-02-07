import { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import SearchBar from '@/components/SearchBar';
import StatsFooter from '@/components/StatsFooter';
import DynamicHomeContent from '@/components/DynamicHomeContent';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Track every TCG card price - Pokémon and One Piece with real-time price tracking and market intelligence.',
  openGraph: {
    title: `${SITE_NAME} — TCG Card Price Intelligence`,
    description: 'Real-time price tracking for Pokémon and One Piece Trading Card Games.',
    url: SITE_URL,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} — TCG Card Price Intelligence`,
    description: 'Real-time price tracking for Pokémon and One Piece Trading Card Games.',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-radar-bg to-radar-surface">
      {/* Hero Section — static, renders immediately */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Track Every TCG Card Price
            </h1>
            <p className="text-xl sm:text-2xl text-radar-text-secondary max-w-2xl mx-auto">
              Monitor thousands of cards across multiple trading card games with real-time price tracking and market intelligence.
            </p>
          </div>

          {/* Search Bar */}
          <div className="pt-4">
            <SearchBar />
          </div>

          {/* Choose Your Game */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 max-w-3xl mx-auto">
            <Link
              href="/pokemon"
              className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-8 hover:shadow-xl transition-all hover:scale-105 transform"
            >
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-2xl font-bold text-white mb-2">Pokémon TCG</h3>
              <p className="text-white/90 mb-4">50K+ cards, 150+ sets</p>
            </Link>
            <Link
              href="/onepiece"
              className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-8 hover:shadow-xl transition-all hover:scale-105 transform"
            >
              <div className="text-4xl mb-4">🏴‍☠️</div>
              <h3 className="text-2xl font-bold text-white mb-2">One Piece TCG</h3>
              <p className="text-white/90 mb-4">2K+ cards, 15+ sets</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic sections load client-side after first paint */}
      <DynamicHomeContent />

      {/* Stats Footer — static */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-radar-border">
        <StatsFooter
          stats={{
            cardsTracked: 50000,
            setsCount: 150,
            updateFrequency: 'Hourly',
            dailyVolume: '$2.1M+',
          }}
        />
      </section>
    </div>
  );
}
