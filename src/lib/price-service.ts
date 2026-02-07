/**
 * Price Service
 * Service for managing and retrieving Pokemon card pricing data
 */

import { PokemonCard, CardPrice, PriceTier } from '@/types/card';
import { OnePieceCard } from '@/types/onepiece';
import { MarketMover } from '@/types/price';

/**
 * Helper to create a PriceTier object
 */
function createPriceTier(price: number | null): PriceTier {
  return {
    price,
    change24h: null,
    change7d: null,
    change30d: null,
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * Extract and process price data from a Pokemon card
 * Maps TCGPlayer pricing data to our internal price tiers
 */
export function getPricesForCard(card: PokemonCard): CardPrice {
  const prices = card.tcgplayer?.prices;
  const now = new Date().toISOString();

  // Initialize with nulls
  let rawPrice: number | null = null;
  let psa9Price: number | null = null;
  let psa10Price: number | null = null;
  let marketPrice: number | null = null;

  if (prices) {
    // Map normal condition to 'raw' tier
    if (prices.normal?.market) {
      rawPrice = Math.round(prices.normal.market * 100); // Convert to cents
    }

    // Map holofoil to 'psa9' tier (approximate graded equivalent)
    if (prices.holofoil?.market) {
      psa9Price = Math.round(prices.holofoil.market * 100);
    }

    // Map reverseHolofoil to alternative pricing (use as psa10 proxy if no holofoil)
    if (prices.reverseHolofoil?.market) {
      if (!psa9Price) {
        psa9Price = Math.round(prices.reverseHolofoil.market * 100);
      }
      psa10Price = Math.round(prices.reverseHolofoil.market * 100);
    }

    // 1st Edition Holo for premium pricing
    if (prices.firstEditionHolofoil?.market) {
      psa10Price = Math.round(prices.firstEditionHolofoil.market * 100);
    }

    // Determine market price (highest available)
    const allPrices = [rawPrice, psa9Price, psa10Price].filter(
      (p) => p !== null
    );
    if (allPrices.length > 0) {
      marketPrice = Math.max(...allPrices);
    }
  }

  return {
    cardId: card.id,
    market: marketPrice !== null ? createPriceTier(marketPrice) : null,
    raw: rawPrice !== null ? createPriceTier(rawPrice) : null,
    psa9: psa9Price !== null ? createPriceTier(psa9Price) : null,
    psa10: psa10Price !== null ? createPriceTier(psa10Price) : null,
    lastUpdated: now,
  };
}

/**
 * Calculate the percentage change between two prices
 * @param currentPrice - Current price in cents
 * @param previousPrice - Previous price in cents
 * @returns Percentage change as a decimal (e.g., 0.05 = 5%)
 */
export function calculateTrend(
  currentPrice: number | null,
  previousPrice: number | null
): number | null {
  if (
    currentPrice === null ||
    previousPrice === null ||
    previousPrice === 0
  ) {
    return null;
  }

  const change = (currentPrice - previousPrice) / previousPrice;
  return change;
}

/**
 * Format price change for display
 * @param change - Percentage change as decimal
 * @returns Formatted change string
 */
export function formatPriceChange(change: number | null): string {
  if (change === null) {
    return 'N/A';
  }

  const percent = (change * 100).toFixed(2);
  const sign = change > 0 ? '+' : '';
  return `${sign}${percent}%`;
}

/**
 * Get sample market movers data
 * This is a placeholder that returns sample data
 * In production, this will be replaced with real historical price data
 */
export function getMarketMovers(
  period: '24h' | '7d' | '30d'
): MarketMover[] {
  // Placeholder data - returns empty array
  // This will be implemented with real data from a database
  // that tracks historical prices
  return [];
}

/**
 * Helper to determine trend direction
 */
export function getTrendDirection(
  change: number | null
): 'up' | 'down' | 'neutral' {
  if (change === null) {
    return 'neutral';
  }
  if (change > 0) {
    return 'up';
  }
  if (change < 0) {
    return 'down';
  }
  return 'neutral';
}

/**
 * Group prices by condition tier
 */
export interface PriceBytier {
  raw: number | null;
  psa9: number | null;
  psa10: number | null;
}

export function getPricesByTier(cardPrice: CardPrice): PriceBytier {
  return {
    raw: cardPrice.raw?.price ?? null,
    psa9: cardPrice.psa9?.price ?? null,
    psa10: cardPrice.psa10?.price ?? null,
  };
}

/**
 * Find the lowest non-null price
 */
export function getLowestPrice(cardPrice: CardPrice): number | null {
  const prices = [cardPrice.raw?.price, cardPrice.psa9?.price, cardPrice.psa10?.price].filter(
    (p) => p !== null
  ) as number[];

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

/**
 * Find the highest non-null price
 */
export function getHighestPrice(cardPrice: CardPrice): number | null {
  const prices = [cardPrice.raw?.price, cardPrice.psa9?.price, cardPrice.psa10?.price].filter(
    (p) => p !== null
  ) as number[];

  if (prices.length === 0) {
    return null;
  }

  return Math.max(...prices);
}

/**
 * Calculate average price across all tiers
 */
export function getAveragePrice(cardPrice: CardPrice): number | null {
  const prices = [cardPrice.raw?.price, cardPrice.psa9?.price, cardPrice.psa10?.price].filter(
    (p) => p !== null
  ) as number[];

  if (prices.length === 0) {
    return null;
  }

  const sum = prices.reduce((a, b) => a + b, 0);
  return Math.round(sum / prices.length);
}

/**
 * Extract and process price data from a One Piece card
 * Placeholder - One Piece prices will come from scraping/manual data
 */
export function getPricesForOnePieceCard(card: OnePieceCard): CardPrice {
  const now = new Date().toISOString();
  return {
    cardId: card.id,
    game: 'onepiece',
    market: null,
    raw: null,
    psa9: null,
    psa10: null,
    lastUpdated: now,
  };
}
