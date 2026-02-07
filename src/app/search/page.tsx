import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';
import { onePieceTCGClient } from '@/lib/onepiece-tcg-api';
import { SITE_NAME, SITE_URL } from '@/lib/seo';
import CardGrid from '@/components/CardGrid';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q } = await searchParams;
  const query = q || '';

  return {
    title: `Search Results for "${query}" | ${SITE_NAME}`,
    description: `Search results for TCG cards matching "${query}" on ${SITE_NAME}`,
    openGraph: {
      title: `Search: ${query}`,
      description: `Found TCG cards matching "${query}"`,
      url: `${SITE_URL}/search?q=${encodeURIComponent(query)}`,
      type: 'website',
    },
  };
}

async function searchPokemonCards(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      return { data: [] };
    }

    const response = await pokemonTCGClient.searchCards(query);
    return response;
  } catch (error) {
    console.error('Error searching Pokémon cards:', error);
    return { data: [] };
  }
}

async function searchOnePieceCards(query: string) {
  try {
    if (!query || query.trim().length === 0) {
      return { data: [] };
    }

    const response = await onePieceTCGClient.searchCards(query);
    return response;
  } catch (error) {
    console.error('Error searching One Piece cards:', error);
    return { data: [] };
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() || '';

  const [pokemonResults, onePieceResults] = await Promise.all([
    query ? searchPokemonCards(query) : Promise.resolve({ data: [] }),
    query ? searchOnePieceCards(query) : Promise.resolve({ data: [] }),
  ]);

  const pokemonCards = pokemonResults.data || [];
  const onePieceCards = onePieceResults.data || [];
  const totalResults = pokemonCards.length + onePieceCards.length;

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

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-radar-text">Search Results</h1>

          {query ? (
            <div className="space-y-2">
              <p className="text-xl text-radar-text-secondary">
                Searching for: <span className="text-blue-400 font-semibold">"{query}"</span>
              </p>
              <p className="text-radar-text-secondary">
                {totalResults} result{totalResults !== 1 ? 's' : ''} found
              </p>
            </div>
          ) : (
            <p className="text-lg text-radar-text-secondary">
              Enter a search query to find TCG cards.
            </p>
          )}
        </div>
      </div>

      {/* Results */}
      {query ? (
        totalResults > 0 ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
            {/* Pokémon Results */}
            {pokemonCards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-radar-text mb-8">
                  Pokémon Results ({pokemonCards.length})
                </h2>
                <CardGrid cards={pokemonCards} />
              </div>
            )}

            {/* One Piece Results */}
            {onePieceCards.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-radar-text mb-8">
                  One Piece Results ({onePieceCards.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {onePieceCards.map(card => (
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
            )}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-radar-surface border border-radar-border rounded-lg p-12 text-center space-y-4">
              <h2 className="text-2xl font-bold text-radar-text">
                No results found
              </h2>
              <p className="text-radar-text-secondary max-w-md mx-auto">
                We couldn't find any TCG cards matching "{query}". Try
                searching for a different card name or set.
              </p>
              <Link
                href="/"
                className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        )
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-radar-surface border border-radar-border rounded-lg p-12 text-center space-y-4">
            <h2 className="text-2xl font-bold text-radar-text">
              Start Searching
            </h2>
            <p className="text-radar-text-secondary max-w-md mx-auto">
              Use the search bar to find specific TCG cards by name, set,
              or number.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
