import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { onePieceTCGClient } from '@/lib/onepiece-tcg-api';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'One Piece Card Game Price Tracker',
  description:
    'Track prices for 2,000+ One Piece Trading Card Game cards across 15+ sets. Real-time market intelligence and price history for One Piece cards.',
  keywords: 'one piece tcg, one piece card prices, price tracker, trading cards, one piece',
  openGraph: {
    title: 'One Piece Card Game Price Tracker | PriceDex',
    description:
      'Track prices for 2,000+ One Piece Trading Card Game cards across 15+ sets. Real-time market intelligence and price history.',
    url: `${SITE_URL}/onepiece`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'One Piece Card Game Price Tracker | PriceDex',
    description:
      'Track prices for 2,000+ One Piece Trading Card Game cards across 15+ sets.',
  },
};

export const revalidate = 3600;

async function getRecentOnePieceCards() {
  try {
    const response = await onePieceTCGClient.getCards(1, 12);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recent One Piece cards:', error);
    return [];
  }
}

export default async function OnePiecePage() {
  const recentCards = await getRecentOnePieceCards();

  return (
    <div className="min-h-screen bg-gradient-to-b from-radar-bg to-radar-surface">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-red-500 via-yellow-400 to-red-600 bg-clip-text text-transparent">
              One Piece Card Game Price Tracker
            </h1>
            <p className="text-xl sm:text-2xl text-radar-text-secondary max-w-2xl mx-auto">
              Monitor 2,000+ One Piece cards across 15+ sets with real-time price tracking and market intelligence.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
              <div className="text-3xl font-bold text-red-400">2K+</div>
              <div className="text-sm text-radar-text-secondary mt-2">Cards</div>
            </div>
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
              <div className="text-3xl font-bold text-yellow-400">15+</div>
              <div className="text-sm text-radar-text-secondary mt-2">Sets</div>
            </div>
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
              <div className="text-3xl font-bold text-pink-400">Hourly</div>
              <div className="text-sm text-radar-text-secondary mt-2">Updates</div>
            </div>
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
              <div className="text-3xl font-bold text-green-400">Real-time</div>
              <div className="text-sm text-radar-text-secondary mt-2">Data</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Cards Section */}
      {recentCards.length > 0 && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-radar-text">Recently Updated</h2>
                <p className="text-radar-text-secondary mt-2">Latest One Piece cards with price changes</p>
              </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {recentCards.map((card) => (
                <Link key={card.id} href={`/onepiece/card/${card.id}`}>
                  <div className="group h-full rounded-lg border border-[#1e293b] bg-[#1a2236] p-3 transition-all hover:border-[#3b82f6] hover:shadow-lg hover:shadow-[#3b82f6]/20">
                    {/* Card Image */}
                    <div className="relative mb-3 aspect-[2.5/3.5] overflow-hidden rounded bg-[#0b0f1a]">
                      {card.images.large ? (
                        <Image
                          src={card.images.large}
                          alt={card.name}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[#64748b]">
                          No image
                        </div>
                      )}
                    </div>

                    {/* Card Info */}
                    <div className="space-y-2">
                      {/* Name */}
                      <h3 className="truncate text-sm font-semibold text-[#e2e8f0] group-hover:text-[#3b82f6]">
                        {card.name}
                      </h3>

                      {/* Set Name */}
                      <p className="text-xs text-[#94a3b8]">{card.set.name}</p>

                      {/* Card Type Badge */}
                      <div className="pt-1">
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-purple-900 text-purple-200">
                          {card.cardType}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Browse Sets Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-radar-border bg-radar-surface">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-radar-text">Browse by Set</h2>
            <p className="text-radar-text-secondary text-lg max-w-2xl mx-auto">
              Explore all One Piece Trading Card Game sets and track card values across different eras.
            </p>
          </div>

          <Link
            href="/onepiece/set"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            View All Sets →
          </Link>
        </div>
      </section>
    </div>
  );
}
