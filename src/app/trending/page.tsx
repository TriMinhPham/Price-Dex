import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getMarketMovers } from '@/lib/price-service';
import { formatPrice } from '@/lib/format';
import TrendBadge from '@/components/TrendBadge';
import { SITE_NAME, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Trending',
  description: 'Track market movers and trending TCG cards with the biggest price changes',
  openGraph: {
    title: 'Trending - Market Movers | PriceDex',
    description: 'Track TCG cards with the biggest price changes in the last 24 hours, 7 days, and 30 days',
    url: `${SITE_URL}/trending`,
    type: 'website',
  },
};

// ISR: serve cached HTML, revalidate in background every hour
export const revalidate = 3600;

async function getTrendingData() {
  try {
    const movers24h = await getMarketMovers('24h');
    const movers7d = await getMarketMovers('7d');
    const movers30d = await getMarketMovers('30d');

    return {
      movers24h: movers24h || [],
      movers7d: movers7d || [],
      movers30d: movers30d || [],
    };
  } catch (error) {
    console.error('Error fetching market movers:', error);
    return {
      movers24h: [],
      movers7d: [],
      movers30d: [],
    };
  }
}

interface TrendingProps {
  searchParams: Promise<{ period?: string }>;
}

export default async function TrendingPage({ searchParams }: TrendingProps) {
  const { period = '24h' } = await searchParams;
  const { movers24h, movers7d, movers30d } = await getTrendingData();

  const periodData = {
    '24h': movers24h,
    '7d': movers7d,
    '30d': movers30d,
  };

  const currentMovers = periodData[period as keyof typeof periodData] || movers24h;
  const gainers = currentMovers.filter((m) => m.direction === 'up');
  const losers = currentMovers.filter((m) => m.direction === 'down');

  return (
    <div className="min-h-screen bg-gradient-to-b from-radar-bg to-radar-surface">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="text-blue-400 hover:text-blue-300 transition-colors text-sm mb-6 inline-block"
        >
          ← Back to Home
        </Link>

        <div className="space-y-4 mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Market Movers
          </h1>
          <p className="text-xl text-radar-text-secondary">
            Track TCG cards with the biggest price changes
          </p>
        </div>

        {/* Period Tabs */}
        <div className="flex gap-4 border-b border-radar-border pb-4 flex-wrap">
          {['24h', '7d', '30d'].map((p) => (
            <Link
              key={p}
              href={`/trending?period=${p}`}
              className={`px-4 py-2 font-medium transition-colors ${
                period === p
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-radar-text-secondary hover:text-radar-text'
              }`}
            >
              Last {p === '24h' ? '24 Hours' : p === '7d' ? '7 Days' : '30 Days'}
            </Link>
          ))}
        </div>
      </div>

      {/* Gainers and Losers */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Top Gainers */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-radar-text flex items-center gap-2">
              📈 Top Gainers
            </h2>

            {gainers.length > 0 ? (
              <div className="space-y-4">
                {gainers.map((mover, index) => (
                  <Link
                    key={mover.cardId}
                    href={`/pokemon/card/${mover.cardId}`}
                    className="flex gap-4 bg-radar-surface border border-radar-border rounded-lg p-4 hover:border-green-400 transition-colors group"
                  >
                    <div className="flex-shrink-0 text-lg font-bold text-green-400 w-8 text-center">
                      #{index + 1}
                    </div>

                    {mover.imageUrl && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={mover.imageUrl}
                          alt={mover.cardName}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-radar-text-secondary">
                        {mover.setName}
                      </p>
                      <h3 className="font-semibold text-radar-text group-hover:text-green-400 transition-colors truncate">
                        {mover.cardName}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-green-400 font-bold">
                          +${mover.priceChange.toFixed(2)}
                        </span>
                        <TrendBadge
                          value={mover.percentChange}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-radar-surface border border-radar-border rounded-lg p-8 text-center text-radar-text-secondary">
                No gainers data available for this period
              </div>
            )}
          </div>

          {/* Top Losers */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-radar-text flex items-center gap-2">
              📉 Top Losers
            </h2>

            {losers.length > 0 ? (
              <div className="space-y-4">
                {losers.map((mover, index) => (
                  <Link
                    key={mover.cardId}
                    href={`/pokemon/card/${mover.cardId}`}
                    className="flex gap-4 bg-radar-surface border border-radar-border rounded-lg p-4 hover:border-red-400 transition-colors group"
                  >
                    <div className="flex-shrink-0 text-lg font-bold text-red-400 w-8 text-center">
                      #{index + 1}
                    </div>

                    {mover.imageUrl && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={mover.imageUrl}
                          alt={mover.cardName}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-radar-text-secondary">
                        {mover.setName}
                      </p>
                      <h3 className="font-semibold text-radar-text group-hover:text-red-400 transition-colors truncate">
                        {mover.cardName}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-red-400 font-bold">
                          -${Math.abs(mover.priceChange).toFixed(2)}
                        </span>
                        <TrendBadge
                          value={mover.percentChange}
                        />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-radar-surface border border-radar-border rounded-lg p-8 text-center text-radar-text-secondary">
                No losers data available for this period
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {gainers.length === 0 && losers.length === 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-radar-surface border border-radar-border rounded-lg p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-radar-text">
              No trending data available
            </h2>
            <p className="text-radar-text-secondary">
              Market data is being updated. Please check back soon.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
