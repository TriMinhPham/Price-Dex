import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';
import {
  generateSetMeta,
  SITE_URL,
} from '@/lib/seo';
import { formatDate } from '@/lib/format';
import CardGrid from '@/components/CardGrid';

export const revalidate = 3600;

/**
 * Generate static params for popular Pokemon sets
 */
export async function generateStaticParams() {
  const popularSetIds = [
    'base1', // Base Set
    'base2', // Jungle
    'base3', // Fossil
    'base4', // Base Set 2
    'swsh1', // Sword & Shield
    'sv01', // Scarlet & Violet
  ];

  return popularSetIds.map((setId) => ({
    setId,
  }));
}

/**
 * Generate metadata for the Pokemon set page
 */
export async function generateMetadata(
  { params }: { params: Promise<{ setId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { setId } = await params;

  try {
    const set = await pokemonTCGClient.getSet(setId);
    if (!set) {
      return {
        title: 'Set Not Found',
        description: 'The requested Pokémon TCG set could not be found.',
      };
    }
    const meta = generateSetMeta(set);

    return {
      title: set.name,
      description: meta.description,
      keywords: meta.keywords,
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${SITE_URL}/pokemon/set/${setId}`,
        type: 'website',
        images: [
          {
            url: set.images.logo || '',
            width: 500,
            height: 500,
            alt: `${set.name} set logo`,
          },
        ],
      },
      twitter: {
        card: 'summary',
        title: meta.title,
        description: meta.description,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for Pokemon set:', setId, error);
    return {
      title: 'Set Not Found',
      description: 'The requested Pokémon TCG set could not be found.',
    };
  }
}

async function getSetData(setId: string) {
  try {
    const set = await pokemonTCGClient.getSet(setId);
    return set;
  } catch (error) {
    console.error('Error fetching Pokemon set data:', error);
    return null;
  }
}

async function getSetCards(setId: string, page: number = 1, pageSize: number = 50) {
  try {
    const response = await pokemonTCGClient.getCardsBySet(setId, page, pageSize);
    return response;
  } catch (error) {
    console.error('Error fetching Pokemon set cards:', error);
    return { data: [], page: 1, pageSize: 50, count: 0, totalCount: 0 };
  }
}

export default async function PokemonSetPage({
  params,
  searchParams,
}: {
  params: Promise<{ setId: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { setId } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = parseInt(pageParam || '1', 10);

  const set = await getSetData(setId);

  if (!set) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-radar-text mb-4">
            Set Not Found
          </h1>
          <p className="text-radar-text-secondary mb-8">
            The Pokémon TCG set you're looking for doesn't exist.
          </p>
          <Link
            href="/pokemon"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to Pokémon
          </Link>
        </div>
      </div>
    );
  }

  const cardsResponse = await getSetCards(setId, currentPage, 50);
  const cards = cardsResponse.data || [];
  const totalCount = cardsResponse.totalCount || set.total;
  const totalPages = Math.ceil(totalCount / 50);

  return (
    <div className="min-h-screen bg-gradient-to-b from-radar-bg to-radar-surface">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-radar-text-secondary">
        <Link href="/" className="hover:text-blue-400 transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <Link href="/pokemon" className="hover:text-blue-400 transition-colors">
          Pokémon
        </Link>
        <span className="mx-2">/</span>
        <span className="text-radar-text">{set.name}</span>
      </div>

      {/* Set Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start mb-16">
          {/* Set Logo */}
          {set.images.logo && (
            <div className="flex justify-center md:justify-start">
              <Image
                src={set.images.logo}
                alt={`${set.name} set logo`}
                width={300}
                height={300}
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
          )}

          {/* Set Info */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold text-radar-text mb-2">
                {set.name}
              </h1>
              <p className="text-xl text-radar-text-secondary">{set.series}</p>
            </div>

            {/* Set Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
                <p className="text-sm text-radar-text-secondary mb-1">
                  Total Cards
                </p>
                <p className="text-2xl font-bold text-blue-400">{set.total}</p>
              </div>
              <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
                <p className="text-sm text-radar-text-secondary mb-1">
                  Printed Cards
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {set.printedTotal}
                </p>
              </div>
              <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
                <p className="text-sm text-radar-text-secondary mb-1">
                  Released
                </p>
                <p className="text-lg font-semibold text-radar-text">
                  {formatDate(set.releaseDate)}
                </p>
              </div>
            </div>

            {/* Set Description */}
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
              <p className="text-radar-text">
                Browse all {set.total} cards from the {set.name} Pokémon Trading
                Card Game set. Track price trends and market value for each card
                in this set.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-bold text-radar-text mb-8">Cards</h2>

        {cards.length > 0 ? (
          <>
            <CardGrid cards={cards} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/pokemon/set/${setId}?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    ← Previous
                  </Link>
                )}

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }).map(
                    (_, i) => {
                      const pageNum = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                      if (pageNum > totalPages) return null;

                      return (
                        <Link
                          key={pageNum}
                          href={`/pokemon/set/${setId}?page=${pageNum}`}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            pageNum === currentPage
                              ? 'bg-blue-600 text-white'
                              : 'bg-radar-surface border border-radar-border text-radar-text hover:border-blue-400'
                          }`}
                        >
                          {pageNum}
                        </Link>
                      );
                    }
                  )}
                </div>

                {currentPage < totalPages && (
                  <Link
                    href={`/pokemon/set/${setId}?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-radar-text-secondary text-lg">
              No cards found for this set.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
