import { Metadata, ResolvingMetadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { onePieceTCGClient } from '@/lib/onepiece-tcg-api';
import { SITE_URL } from '@/lib/seo';
import { formatDate } from '@/lib/format';
import AffiliateButton from '@/components/AffiliateButton';
import { ONEPIECE_CARD_TYPES, ONEPIECE_COLORS, OnePieceColor } from '@/types/onepiece';

export const revalidate = 86400;

/**
 * Generate static params for popular One Piece cards
 */
export async function generateStaticParams() {
  const popularCardIds = [
    'OP01-001',
    'OP01-060',
    'OP01-120',
    'OP02-001',
  ];

  return popularCardIds.map((id) => ({
    id,
  }));
}

/**
 * Generate metadata for the One Piece card page
 */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;

  try {
    const card = await onePieceTCGClient.getCard(id);
    if (!card) {
      return {
        title: 'Card Not Found',
        description: 'The requested One Piece card could not be found.',
      };
    }

    const title = `${card.name} Price - ${card.set.name} | PriceDex`;
    const description = `One Piece Card Game - ${card.name} from ${card.set.name}. Track prices and market value for this ${card.cardType} card.`;

    return {
      title: card.name,
      description,
      keywords: 'one piece, card game, trading cards, price tracking',
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/onepiece/card/${id}`,
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
        title,
        description,
        images: [card.images.large || ''],
      },
    };
  } catch (error) {
    console.error('Error generating metadata for One Piece card:', id, error);
    return {
      title: 'Card Not Found',
      description: 'The requested One Piece card could not be found.',
    };
  }
}

async function getCardData(id: string) {
  try {
    const card = await onePieceTCGClient.getCard(id);
    return card;
  } catch (error) {
    console.error('Error fetching One Piece card data:', error);
    return null;
  }
}

async function getRelatedCards(setId: string) {
  try {
    const response = await onePieceTCGClient.getCardsBySet(setId, 1, 6);
    return response.data || [];
  } catch (error) {
    console.error('Error fetching related One Piece cards:', error);
    return [];
  }
}

export default async function OnePieceCardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const card = await getCardData(id);

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-radar-text mb-4">
            Card Not Found
          </h1>
          <p className="text-radar-text-secondary mb-8">
            The One Piece card you're looking for doesn't exist.
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

  const relatedCards = await getRelatedCards(card.set.id);
  const cardTypeInfo = ONEPIECE_CARD_TYPES[card.cardType];

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
        <Link
          href={`/onepiece/set/${card.set.id}`}
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
              </div>

              {/* Card Type and Rarity Badge */}
              <div className="flex flex-wrap gap-2">
                {cardTypeInfo && (
                  <span
                    className="px-3 py-1 rounded-full font-semibold text-white"
                    style={{ backgroundColor: cardTypeInfo.color }}
                  >
                    {cardTypeInfo.label}
                  </span>
                )}
                {card.rarity && (
                  <span className="px-3 py-1 rounded-full font-semibold bg-purple-900 text-purple-200">
                    {card.rarity}
                  </span>
                )}
              </div>

              {/* Color Badges */}
              {card.color && card.color.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {card.color.map((color) => (
                    <span
                      key={color}
                      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: ONEPIECE_COLORS[color as OnePieceColor] }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              )}

              {/* Card Stats */}
              <div className="grid grid-cols-2 gap-4 bg-radar-surface border border-radar-border rounded-lg p-4">
                {card.power !== undefined && (
                  <div>
                    <p className="text-sm text-radar-text-secondary">Power</p>
                    <p className="text-2xl font-bold text-radar-text">
                      {card.power}
                    </p>
                  </div>
                )}
                {card.cost !== undefined && (
                  <div>
                    <p className="text-sm text-radar-text-secondary">Cost</p>
                    <p className="text-2xl font-bold text-radar-text">
                      {card.cost}
                    </p>
                  </div>
                )}
                {card.counter !== undefined && (
                  <div>
                    <p className="text-sm text-radar-text-secondary">Counter</p>
                    <p className="text-2xl font-bold text-radar-text">
                      {card.counter}
                    </p>
                  </div>
                )}
                {card.life !== undefined && (
                  <div>
                    <p className="text-sm text-radar-text-secondary">Life</p>
                    <p className="text-2xl font-bold text-radar-text">
                      {card.life}
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

            {/* Price Section - Placeholder */}
            <div className="bg-radar-surface border border-radar-border rounded-lg p-4 text-center">
              <h3 className="text-lg font-semibold text-radar-text mb-2">Market Price</h3>
              <p className="text-radar-text-secondary">
                Price data coming soon
              </p>
            </div>

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
          </div>
        </div>

        {/* Card Details Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Effect Text */}
          {card.effect && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-radar-text">Effect</h3>
              <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
                <p className="text-radar-text whitespace-pre-wrap">{card.effect}</p>
              </div>
            </div>
          )}

          {/* Trigger Text */}
          {card.trigger && (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-radar-text">Trigger</h3>
              <div className="bg-radar-surface border border-radar-border rounded-lg p-4">
                <p className="text-radar-text whitespace-pre-wrap">{card.trigger}</p>
              </div>
            </div>
          )}
        </div>

        {/* Related Cards */}
        {relatedCards.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-radar-text mb-8">
              More from {card.set.name}
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {relatedCards.map((relatedCard) => (
                <Link key={relatedCard.id} href={`/onepiece/card/${relatedCard.id}`}>
                  <div className="group h-full rounded-lg border border-[#1e293b] bg-[#1a2236] p-3 transition-all hover:border-[#3b82f6] hover:shadow-lg hover:shadow-[#3b82f6]/20">
                    {/* Card Image */}
                    <div className="relative mb-3 aspect-[2.5/3.5] overflow-hidden rounded bg-[#0b0f1a]">
                      {relatedCard.images.large ? (
                        <Image
                          src={relatedCard.images.large}
                          alt={relatedCard.name}
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
                        {relatedCard.name}
                      </h3>
                      <p className="text-xs text-[#94a3b8]">{relatedCard.set.name}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
