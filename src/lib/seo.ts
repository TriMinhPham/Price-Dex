/**
 * SEO Utilities
 * Tools for generating SEO metadata and structured data
 */

import { PokemonCard, PokemonSet, CardPrice } from '@/types/card';
import { OnePieceCard, OnePieceSet } from '@/types/onepiece';
import { GameType, GAMES } from '@/types/game';

// Site constants
export const SITE_NAME = 'PriceDex';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://price-dex.com';
export const SITE_DESCRIPTION =
  'Real-time TCG card prices, market trends, and price history. Track Pokémon, One Piece, and more.';

/**
 * SEO metadata for a page
 */
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
}

/**
 * Generate SEO metadata for a card page
 */
export function generateCardMeta(
  card: PokemonCard,
  prices?: CardPrice
): PageMeta {
  const title = `${card.name} Price - ${card.set.name} | ${SITE_NAME}`;

  let description = `Current price trends for ${card.name} from the ${card.set.name} Pokemon TCG set. `;

  if (prices) {
    const priceRange = getPriceRangeText(prices);
    description += priceRange;

    if (prices.market && prices.market.change7d !== null && prices.market.change7d !== 0) {
      const trend =
        prices.market.change7d > 0
          ? `up ${prices.market.change7d.toFixed(1)}%`
          : `down ${Math.abs(prices.market.change7d).toFixed(1)}%`;
      description += ` 7-day trend is ${trend}.`;
    }
  }

  description += ` Compare prices and track value with ${SITE_NAME}.`;

  const keywords = [
    card.name,
    'pokemon tcg',
    'pokemon card price',
    card.set.name,
    'trading card game',
    'price tracking',
  ].join(', ');

  return {
    title,
    description,
    keywords,
    image: card.images.large,
    url: `${SITE_URL}/cards/${card.id}`,
  };
}

/**
 * Generate SEO metadata for a set page
 */
export function generateSetMeta(set: PokemonSet): PageMeta {
  const title = `${set.name} Pokemon TCG Set - Prices & Card Values | ${SITE_NAME}`;
  const description = `Browse and track prices for all ${set.total} cards in the ${set.name} Pokemon Trading Card Game set. Released ${formatDateForSEO(set.releaseDate)}.`;
  const keywords = [
    set.name,
    'pokemon tcg set',
    'pokemon cards',
    'card prices',
    set.series,
  ].join(', ');

  return {
    title,
    description,
    keywords,
    image: set.images.logo,
    url: `${SITE_URL}/sets/${set.id}`,
  };
}

/**
 * Generate JSON-LD structured data for a Product
 */
export function generateStructuredData(
  card: PokemonCard,
  prices?: CardPrice
): Record<string, unknown> {
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${card.name} - ${card.set.name}`,
    description: getCardDescription(card),
    image: card.images.large,
    brand: {
      '@type': 'Brand',
      name: 'The Pokemon Company',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'The Pokemon Company',
    },
  };

  if (prices) {
    const offers: Record<string, unknown>[] = [];

    if (prices.raw !== null && prices.raw.price !== null) {
      offers.push({
        '@type': 'Offer',
        name: 'Raw',
        price: (prices.raw.price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });
    }

    if (prices.psa9 !== null && prices.psa9.price !== null) {
      offers.push({
        '@type': 'Offer',
        name: 'PSA 9',
        price: (prices.psa9.price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });
    }

    if (prices.psa10 !== null && prices.psa10.price !== null) {
      offers.push({
        '@type': 'Offer',
        name: 'PSA 10',
        price: (prices.psa10.price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });
    }

    if (offers.length > 0) {
      structuredData.offers = offers;
    }
  }

  return structuredData;
}

/**
 * Generate JSON-LD BreadcrumbList
 */
export function generateBreadcrumbs(
  segments: Array<{ label: string; href?: string }>
): Record<string, unknown> {
  const itemListElement = segments.map((segment, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: segment.label,
    item: segment.href ? `${SITE_URL}${segment.href}` : undefined,
  }));

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };
}

/**
 * Get a human-readable price range from CardPrice
 */
function getPriceRangeText(prices: CardPrice): string {
  const validPrices = [prices.raw?.price, prices.psa9?.price, prices.psa10?.price].filter(
    (p) => p !== null
  ) as number[];

  if (validPrices.length === 0) {
    return 'Price data not available.';
  }

  const min = Math.min(...validPrices);
  const max = Math.max(...validPrices);

  const minStr = (min / 100).toFixed(2);
  const maxStr = (max / 100).toFixed(2);

  if (minStr === maxStr) {
    return `Current market price: $${minStr}.`;
  }

  return `Market price ranges from $${minStr} to $${maxStr}.`;
}

/**
 * Format a date for SEO purposes
 */
function formatDateForSEO(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Generate a description for a card
 */
function getCardDescription(card: PokemonCard): string {
  const parts: string[] = [];

  if (card.supertype) {
    parts.push(`${card.supertype} card`);
  }

  if (card.subtypes && card.subtypes.length > 0) {
    parts.push(`(${card.subtypes.join(', ')})`);
  }

  if (card.hp) {
    parts.push(`HP ${card.hp}`);
  }

  if (card.types && card.types.length > 0) {
    parts.push(`Type: ${card.types.join(', ')}`);
  }

  if (card.artist) {
    parts.push(`Illustrated by ${card.artist}`);
  }

  return parts.join(' | ');
}

/**
 * Generate SEO metadata for a One Piece card page
 */
export function generateOnePieceCardMeta(
  card: OnePieceCard,
  prices?: CardPrice
): PageMeta {
  const title = `${card.name} Price - ${card.set.name} | ${SITE_NAME}`;

  let description = `Current price trends for ${card.name} from the ${card.set.name} One Piece TCG set. `;

  if (prices) {
    const priceRange = getPriceRangeText(prices);
    description += priceRange;

    if (prices.market && prices.market.change7d !== null && prices.market.change7d !== 0) {
      const trend =
        prices.market.change7d > 0
          ? `up ${prices.market.change7d.toFixed(1)}%`
          : `down ${Math.abs(prices.market.change7d).toFixed(1)}%`;
      description += ` 7-day trend is ${trend}.`;
    }
  }

  description += ` Compare prices and track value with ${SITE_NAME}.`;

  const keywords = [
    card.name,
    'one piece card game',
    'one piece tcg',
    'one piece card price',
    card.set.name,
    card.cardType,
    card.color.join(', '),
    'trading card game',
    'price tracking',
  ].join(', ');

  return {
    title,
    description,
    keywords,
    image: card.images.large,
    url: `${SITE_URL}/onepiece/card/${card.id}`,
  };
}

/**
 * Generate SEO metadata for a One Piece set page
 */
export function generateOnePieceSetMeta(set: OnePieceSet): PageMeta {
  const title = `${set.name} One Piece TCG Set - Prices & Card Values | ${SITE_NAME}`;
  const description = `Browse and track prices for all ${set.total} cards in the ${set.name} One Piece Trading Card Game set. Released ${formatDateForSEO(set.releaseDate)}.`;
  const keywords = [
    set.name,
    'one piece tcg set',
    'one piece cards',
    'card prices',
    'bandai',
  ].join(', ');

  return {
    title,
    description,
    keywords,
    image: set.images?.logo,
    url: `${SITE_URL}/sets/onepiece/${set.id}`,
  };
}

/**
 * Generate JSON-LD structured data for a One Piece Product
 */
export function generateOnePieceStructuredData(
  card: OnePieceCard,
  prices?: CardPrice
): Record<string, unknown> {
  const structuredData: Record<string, unknown> = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: `${card.name} - ${card.set.name}`,
    description: `One Piece TCG card: ${card.name} (${card.cardType}) from ${card.set.name}`,
    image: card.images.large,
    brand: {
      '@type': 'Brand',
      name: 'Bandai',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'Bandai',
    },
  };

  if (prices) {
    const offers: Record<string, unknown>[] = [];

    if (prices.raw !== null && prices.raw.price !== null) {
      offers.push({
        '@type': 'Offer',
        name: 'Raw',
        price: (prices.raw.price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });
    }

    if (prices.psa9 !== null && prices.psa9.price !== null) {
      offers.push({
        '@type': 'Offer',
        name: 'PSA 9',
        price: (prices.psa9.price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });
    }

    if (prices.psa10 !== null && prices.psa10.price !== null) {
      offers.push({
        '@type': 'Offer',
        name: 'PSA 10',
        price: (prices.psa10.price / 100).toFixed(2),
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      });
    }

    if (offers.length > 0) {
      structuredData.offers = offers;
    }
  }

  return structuredData;
}

/**
 * Get a game-aware description
 */
export function getGameDescription(game: GameType): string {
  return GAMES[game].description;
}
