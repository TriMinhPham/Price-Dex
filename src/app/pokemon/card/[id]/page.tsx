import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { pokemonTCGClient } from '@/lib/pokemon-tcg-api';
import { getPricesForCard } from '@/lib/price-service';
import {
  generateCardMeta,
  generateStructuredData,
  generateBreadcrumbs,
  SITE_URL,
} from '@/lib/seo';
import { formatPrice, formatDate } from '@/lib/format';
import {
  generateEbayAffiliateUrl,
  generateTCGPlayerAffiliateUrl,
} from '@/lib/affiliate';
import RarityBadge from '@/components/RarityBadge';
import PriceTiers from '@/components/PriceTiers';
import AffiliateButton from '@/components/AffiliateButton';
import CardGrid from '@/components/CardGrid';

export const revalidate = 86400;

/**
 * Generate static params for popular cards (ISR for others)
 */
export async function generateStaticParams() {
  // Popular Pokemon cards to pre-render
  const popularCardIds = [
    'base1-4', // Charizard Base Set
    'sv1-235', // Charizard ex SV
    'base1-102', // Mewtwo Base Set
    'base1-103', // Zapdos Base Set
    'base1-13', // Machamp Base Set
  ];

  return popularCardIds.map((id) => ({
    id,
  }));
}

/**
 * Generate metadata for the Pokemon card page
 */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    const card = await pokemonTCGClient.getCard(id);
    if (!card) {
      return {
        title: 'Card Not Found',
        description: 'The requested Pokémon card could not be found.',
      };
    }
    const prices = getPricesForCard(card);
    const meta = generateCardMeta(card, prices);

    return {
      title: card.name,
      description: meta.description,
      keywords: meta.keywords,
      openGraph: {
        title: meta.title,
        description: meta.description,
        url: `${SITE_URL}/pokemon/card/${id}`,
        type: 'website',
        images: [
          {
            url: card.images.large || '',
            width: 600,
            height: 825,
            alt: `${card.name} from ${card.set.name}`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: meta.title,
        description: meta.description,
        images: [card.images.large || ''],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for Pokemon card:', id, error);
    return {
      title: 'Card Not Found',
      description: 'The requested Pokémon card could not be found.',
    };
  }
}

async function getCardData(id: string) {
  try {
    const card = await pokemonTCGClient.getCard(id);
    const prices = card ? getPricesForCard(card) : null;
    return { card, prices };
  } catch (error) {
    console.error('Error fetching Pokemon card data:', error);
    return { card: null, prices: null };
  }
}

async function getRelatedCards(setId: string) {
  try {
    const response = await pokemonTCGClient.getCardsBySet(setId, 1, 6);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching related Pokemon cards:', error);
    return [];
  }
}

export default async function PokemonCardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { card, prices } = await getCardData(id);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-radar-text mb-4">
            Card Not Found
          </h1>
          <p className="text-radar-text-secondary mb-8">
            The Pokémon card you're looking for doesn't exist.
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

  const relatedCards = await getRelatedCards(card.set.id);
  const structuredData = generateStructuredData(card, prices ?? undefined);
  const breadcrumbs = generateBreadcrumbs([
    { label: 'Home', href: '/' },
    { label: 'Pokémon', href: '/pokemon' },
    { label: card.set.name, href: `/pokemon/set/${card.set.id}` },
    { label: card.name },
  ]);

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
        <Link
          href={`/pokemon/set/${card.set.id}`}
          className="hover:text-blue-400 transition-colors"
        >
          {card.set.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-radar-text">{card.name}</span>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Card Image */}
          <div className="flex flex-col items-center justify-center">
            {card.images.large ? (
              <Image
                src={card.images.large}
                alt={`${card.name} card`}
                width={400}
                height={560}
                className="rounded-lg shadow-2xl max-w-full h-auto"
                priority
              />
            ) : (
              <div className="w-full aspect-[400/560] bg-radar-surface rounded-lg flex items-center justify-center border border-radar-border">
                <span className="text-radar-text-secondary">No image available</span>
              </div>
            )}
            {card.set.images.symbol && (
              <div className="mt-6 flex items-center gap-4">
                <span className="text-sm text-radar-text-secondary">Set Symbol:</span>
                <Image
                  src={card.set.images.symbol}
                  alt={`${card.set.name} symbol`}
                  width={40}
                  height={40}
                  className="rounded"
                />
              </div>
            )}
          </div>

          {/* Right Column - Card Details */}
          <div className="space-y-8">
            {/* Card Title and Basic Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-radar-text">
                    {card.name}
                  </h1>
                  <p className="text-lg text-radar-text-secondary mt-2">
                    {card.set.name} • #{card.number}
                  </p>
                </div>
                {card.rarity && <RarityBadge rarity={card.rarity} />}
              </div>

              {/* Card Stats */}
              <div className="grid grid-cols-2 gap-4 bg-radar-surface border border-radar-border rounded-lg p-4">
                {card.hp && (
                  <div>
                    <p className="text-sm text-radar-text-secondary">HP</p>
                    <p className="text-2xl font-bold text-radar-text">
                      {card.hp}
                    </p>
                  </div>
                )}
                {card.types && card.types.length > 0 && (
                  <div>
                    <p className="text-sm text-radar-text-secondary">Type</p>
                    <p className="text-lg font-semibold text-radar-text">
                      {card.types.join(', ')}
                    </p>
                  </div>
                )}
                {card.artist && (
                  <div className="col-span-2">
                    <p className="text-sm text-radar-text-secondary">Artist</p>
                    <p className="text-radar-text">{card.artist}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Prices Section */}
            {prices ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-radar-text">Market Price</h2>
                <PriceTiers price={prices} />
                <p className="text-sm text-radar-text-secondary">
                  Last updated: {formatDate(prices.lastUpdated)}
                </p>
              </div>
            ) : (
              <div className="bg-radar-surface border border-radar-border rounded-lg p-4 text-center text-radar-text-secondary">
                Price data not available
              </div>
            )}

            {/* Affiliate Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <AffiliateButton
                cardName={card.name}
                setName={card.set.name}
                platform="ebay"
              />
              <AffiliateButton
                cardName={card.name}
                setName={card.set.name}
                platform="tcgplayer"
              />
            </div>

            {/* Price History Placeholder */}
            <div className="bg-radar-surface border border-radar-border rounded-lg p-6 text-center">
              <p className="text-radar-text-secondary">
                📈 Price history chart coming soon
              </p>
            </div>
          </div>
        </div>

        {/* Card Details Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Attacks */}
          {card.attacks && card.attacks.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-radar-text">Attacks</h3>
              <div className="space-y-4">
                {card.attacks.map((attack, index) => (
                  <div
                    key={index}
                    className="bg-radar-surface border border-radar-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-radar-text">
                        {attack.name}
                      </h4>
                      {attack.damage && (
                        <span className="text-pink-400 font-bold">
                          {attack.damage}
                        </span>
                      )}
                    </div>
                    {attack.cost && (
                      <p className="text-sm text-radar-text-secondary mb-2">
                        Cost: {attack.cost.join(', ')}
                      </p>
                    )}
                    {attack.text && (
                      <p className="text-sm text-radar-text">{attack.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Weaknesses, Resistances, Retreat Cost */}
          <div className="space-y-4">
            {card.weaknesses && card.weaknesses.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-radar-text mb-3">
                  Weaknesses
                </h3>
                <div className="space-y-2">
                  {card.weaknesses.map((weakness, index) => (
                    <div
                      key={index}
                      className="bg-radar-surface border border-radar-border rounded p-3"
                    >
                      <p className="text-radar-text">
                        {weakness.type}
                        <span className="text-pink-400 ml-2">
                          ×{weakness.value}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {card.resistances && card.resistances.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-radar-text mb-3">
                  Resistances
                </h3>
                <div className="space-y-2">
                  {card.resistances.map((resistance, index) => (
                    <div
                      key={index}
                      className="bg-radar-surface border border-radar-border rounded p-3"
                    >
                      <p className="text-radar-text">
                        {resistance.type}
                        <span className="text-green-400 ml-2">
                          {resistance.value}
                        </span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {card.retreatCost !== undefined && (
              <div>
                <h3 className="text-xl font-bold text-radar-text mb-3">
                  Retreat Cost
                </h3>
                <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
                  <p className="text-2xl font-bold text-blue-400">
                    {card.retreatCost}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Cards */}
        {relatedCards.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-radar-text mb-8">
              More from {card.set.name}
            </h2>
            <CardGrid cards={relatedCards} />
          </div>
        )}
      </div>

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbs),
        }}
      />
    </div>
  );
}
