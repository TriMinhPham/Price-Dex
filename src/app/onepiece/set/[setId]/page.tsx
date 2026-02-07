import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { onePieceTCGClient } from '@/lib/onepiece-tcg-api';
import { SITE_URL } from '@/lib/seo';
import { formatDate } from '@/lib/format';

export const revalidate = 3600;

/**
 * Generate static params for popular One Piece sets
 */
export async function generateStaticParams() {
  const popularSetIds = [
    'OP01',
    'OP02',
    'OP03',
    'OP04',
    'OP05',
  ];

  return popularSetIds.map((setId) => ({
    setId,
  }));
}

/**
 * Generate metadata for the One Piece set page
 */
export async function generateMetadata(
  { params }: { params: Promise<{ setId: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { setId } = await params;

  try {
    const set = await onePieceTCGClient.getSet(setId);
    if (!set) {
      return {
        title: 'Set Not Found',
        description: 'The requested One Piece TCG set could not be found.',
      };
    }

    const title = `${set.name} One Piece Card Game - Prices & Card Values | PriceDex`;
    const description = `Browse and track prices for all ${set.total} cards in the ${set.name} One Piece Trading Card Game set. Released ${formatDate(set.releaseDate)}.`;

    return {
      title: set.name,
      description,
      keywords: 'one piece tcg set, one piece cards, card prices',
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/onepiece/set/${setId}`,
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
        title,
        description,
      },
    };
  } catch (error) {
    console.error('Error generating metadata for One Piece set:', setId, error);
    return {
      title: 'Set Not Found',
      description: 'The requested One Piece TCG set could not be found.',
    };
  }
}

async function getSetData(setId: string) {
  try {
    const set = await onePieceTCGClient.getSet(setId);
    return set;
  } catch (error) {
    console.error('Error fetching One Piece set data:', error);
    return null;
  }
}

async function getSetCards(setId: string, page: number = 1, pageSize: number = 50) {
  try {
    const response = await onePieceTCGClient.getCardsBySet(setId, page, pageSize);
    return response;
  } catch (error) {
    console.error('Error fetching One Piece set cards:', error);
    return { data: [], page: 1, pageSize: 50, count: 0, totalCount: 0 };
  }
}

export default async function OnePieceSetPage({
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
            The One Piece TCG set you're looking for doesn't exist.
          </p>
          <Link
            href="/onepiece"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Back to One Piece
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
        <Link href="/onepiece" className="hover:text-blue-400 transition-colors">
          One Piece
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
                <p className="text-2xl font-bold text-red-400">{set.total}</p>
              </div>
              <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
                <p className="text-sm text-radar-text-secondary mb-1">
                  Series
                </p>
                <p className="text-lg font-semibold text-radar-text">
                  {set.series}
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
                Browse all {set.total} cards from the {set.name} One Piece Trading
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cards.map((card) => (
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
                      <h3 className="truncate text-sm font-semibold text-[#e2e8f0] group-hover:text-[#3b82f6]">
                        {card.name}
                      </h3>
                      <p className="text-xs text-[#94a3b8]">{card.number}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/onepiece/set/${setId}?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
                          href={`/onepiece/set/${setId}?page=${pageNum}`}
                          className={`px-3 py-2 rounded-lg transition-colors ${
                            pageNum === currentPage
                              ? 'bg-red-600 text-white'
                              : 'bg-radar-surface border border-radar-border text-radar-text hover:border-red-400'
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
                    href={`/onepiece/set/${setId}?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
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
