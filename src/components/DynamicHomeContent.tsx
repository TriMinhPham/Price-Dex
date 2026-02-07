'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import CardRow from '@/components/CardRow';
import TrendBadge from '@/components/TrendBadge';
import type { PokemonCard } from '@/types/card';
import type { MarketMover } from '@/types/price';

interface OnePieceCardBasic {
  id: string;
  name: string;
  images: { small?: string; large?: string };
}

interface HomeData {
  recentCards: PokemonCard[];
  recentOnePieceCards: OnePieceCardBasic[];
  marketMovers: MarketMover[];
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-lg border border-[#1e293b] bg-[#1a2236] px-4 py-3 animate-pulse">
      <div className="h-12 w-9 rounded bg-[#0b0f1a]" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-[#0b0f1a]" />
        <div className="h-3 w-20 rounded bg-[#0b0f1a]" />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="rounded-lg border border-[#1e293b] bg-[#1a2236] overflow-hidden animate-pulse">
      <div className="w-full aspect-[150/210] bg-[#0b0f1a]" />
    </div>
  );
}

export default function DynamicHomeContent() {
  const [data, setData] = useState<HomeData | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    fetch('/api/home-data', { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
      })
      .then((json: HomeData) => setData(json))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Failed to load home data:', err);
          setFailed(true);
        }
      });

    return () => controller.abort();
  }, []);

  // Complete failure — hide the section gracefully
  if (failed) return null;

  const loading = data === null;
  const { recentCards = [], recentOnePieceCards = [], marketMovers = [] } = data ?? {};

  return (
    <>
      {/* Market Movers Section */}
      {(loading || marketMovers.length > 0) && (
        <section className="px-4 py-16 sm:px-6 lg:px-8 bg-radar-surface border-y border-radar-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-radar-text">Market Movers</h2>
                <p className="text-radar-text-secondary mt-2">
                  Cards with the biggest price changes in the last 24 hours
                </p>
              </div>
              <Link
                href="/trending"
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="rounded-lg border border-[#1e293b] bg-[#0b0f1a] p-4 animate-pulse">
                    <div className="space-y-3">
                      <div className="h-4 w-20 rounded bg-[#1e293b]" />
                      <div className="h-5 w-28 rounded bg-[#1e293b]" />
                      <div className="h-4 w-16 rounded bg-[#1e293b]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
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
                        <TrendBadge value={mover.percentChange} />
                      </div>
                      <p className="font-semibold text-radar-text group-hover:text-blue-400 transition-colors line-clamp-2">
                        {mover.cardName}
                      </p>
                      <p className="text-sm text-radar-text-secondary">
                        {mover.direction === 'up' ? '+' : '-'}$
                        {Math.abs(mover.priceChange).toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Recent Pokémon Cards Section */}
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

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : recentCards.length > 0 ? (
            recentCards.map((card) => <CardRow key={card.id} card={card} />)
          ) : (
            <p className="text-radar-text-secondary text-center py-8">
              Unable to load cards right now. Try refreshing.
            </p>
          )}
        </div>
      </section>

      {/* One Piece Cards Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-radar-surface border-y border-radar-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-radar-text">One Piece Cards</h2>
              <p className="text-radar-text-secondary mt-2">
                Latest One Piece Trading Card Game cards
              </p>
            </div>
            <Link
              href="/onepiece"
              className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
            >
              Browse All →
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : recentOnePieceCards.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentOnePieceCards.map((card) => (
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
          ) : (
            <p className="text-radar-text-secondary text-center py-8">
              Unable to load cards right now. Try refreshing.
            </p>
          )}
        </div>
      </section>
    </>
  );
}
