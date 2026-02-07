import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import CardGrid from '@/components/CardGrid';

export const metadata: Metadata = {
  title: 'Pokémon TCG Price Tracker',
  description:
    'Track prices for 50,000+ Pokémon Trading Card Game cards across 150+ sets. Real-time market intelligence and price history.',
  keywords: 'pokemon tcg, pokemon card prices, price tracker, trading cards, pokemon',
  openGraph: {
    title: 'Pokémon TCG Price Tracker | PriceDex',
    description:
      'Track prices for 50,000+ Pokémon Trading Card Game cards across 150+ sets. Real-time market intelligence and price history.',
    url: `${SITE_URL}/pokemon`,
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pokémon TCG Price Tracker | PriceDex',
    description:
      'Track prices for 50,000+ Pokémon Trading Card Game cards across 150+ sets.',
  },
};

export const revalidate = 3600;

async function getRecentPokemonCards() {
  try {
    const response = await pokemonTCGClient.getCards(1, 12);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching recent Pokemon cards:', error);
    return [];
  }
}

export default async function PokemonPage() {
  const recentCards = await getRecentPokemonCards();

  return (
    <div className="min-h-screen bg-gradient-to-b from-radar-bg to-radar-surface">
      {/* Hero Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-blue-400 to-red-400 bg-clip-text text-transparent">
              Pokémon TCG Price Tracker
            </h1>
            <p className="text-xl sm:text-2xl text-radar-text-secondary max-w-2xl mx-auto">
              Monitor 50,000+ Pokémon cards across 150+ sets with real-time price tracking and market intelligence.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
              <div className="text-3xl font-bold text-blue-400">50K+</div>
              <div className="text-sm text-radar-text-secondary mt-2">Cards</div>
            </div>
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
              <div className="text-3xl font-bold text-purple-400">150+</div>
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
                <p className="text-radar-text-secondary mt-2">Latest Pokémon cards with price changes</p>
              </div>
            </div>

            <CardGrid cards={recentCards} />
          </div>
        </section>
      )}

      {/* Browse Sets Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 border-t border-radar-border bg-radar-surface">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-radar-text">Browse by Set</h2>
            <p className="text-radar-text-secondary text-lg max-w-2xl mx-auto">
              Explore all Pokémon TCG sets and track card values across different eras and generations.
            </p>
          </div>

          <Link
            href="/pokemon/set"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            View All Sets →
          </Link>
        </div>
      </section>
    </div>
  );
}
