import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';
import { onePieceTCGClient } from '@/lib/onepiece-tcg-api';
import { getMarketMovers } from '@/lib/price-service';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '@/lib/seo';
import SearchBar from '@/components/SearchBar';
import CardRow from '@/components/CardRow';
import StatsFooter from '@/components/StatsFooter';
import TrendBadge from '@/components/TrendBadge';

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

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

async function getRecentCards() {
  try {
    const response = await pokemonTCGClient.getCards(1, 12);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recent cards:', error);
    return [];
  }
}

async function getRecentOnePieceCards() {
  try {
    const response = await onePieceTCGClient.getCards(1, 6);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching One Piece cards:', error);
    return [];
  }
}

async function getMarketMoversData() {
  try {
    const movers = await getMarketMovers('24h');
    return movers || [];
  } catch (error) {
    console.error('Error fetching market movers:', error);
    return [];
  }
}

export default async function HomePage() {
  const [recentCards, recentOnePieceCards, marketMovers] = await Promise.all([
    getRecentCards(),
    getRecentOnePieceCards(),
    getMarketMoversData(),
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-radar-bg to-radar-surface">
      {/* Hero Section */}
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

      {/* Market Movers Section */}
      {marketMovers.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-radar-surface border-y border-radar-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-radar-text">Market Movers</h2>
                <p className="text-radar-text-secondary mt-2">Cards with the biggest price changes in the last 24 hours</p>
              </div>
              <Link
                href="/trending"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto">
              {marketMovers.slice(0, 5).map((mover) => (
                <Link
                  key={mover.cardId}
                  href={`/card/${mover.cardId}`}
                  className="bg-radar-bg border border-radar-border rounded-lg p-4 hover:border-blue-400 transition-colors group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-radar-text-secondary truncate">
                        {mover.setName}
                      </span>
                      <TrendBadge
                        value={mover.percentChange}
                      />
                    </div>
                    <p className="font-semibold text-radar-text group-hover:text-blue-400 transition-colors line-clamp-2">
                      {mover.cardName}
                    </p>
                    <p className="text-sm text-radar-text-secondary">
                      {mover.direction === 'up' ? '+' : '-'}${Math.abs(mover.priceChange).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Pokémon Cards Section */}
      {recentCards.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-radar-text">Recent Pokémon Cards</h2>
                <p className="text-radar-text-secondary mt-2">Latest cards with price changes</p>
              </div>
              <Link
                href="/pokemon"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Browse All →
              </Link>
            </div>

            {recentCards.map(card => <CardRow key={card.id} card={card} />)}
          </div>
        </section>
      )}

      {/* One Piece Cards Section */}
      {recentOnePieceCards.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-radar-surface border-y border-radar-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-radar-text">One Piece Cards</h2>
                <p className="text-radar-text-secondary mt-2">Latest One Piece Trading Card Game cards</p>
              </div>
              <Link
                href="/onepiece"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Browse All →
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentOnePieceCards.map(card => (
                <Link
                  key={card.id}
                  href={`/onepiece/card/${card.id}`}
                  className="group relative bg-radar-bg border border-radar-border rounded-lg overflow-hidden hover:border-blue-400 transition-colors"
                >
                  {card.images?.large ? (
                    <Image
                      src={card.images.large}
                      alt={card.name}
                      width={150}
                      height={210}
                      className="w-full h-auto object-cover group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="w-full aspect-[150/210] bg-radar-surface flex items-center justify-center">
                      <span className="text-xs text-radar-text-secondary">No image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                    <p className="text-xs text-white font-semibold line-clamp-2">{card.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Footer */}
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
