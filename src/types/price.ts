/**
 * Price Tracking System Type Definitions
 * Defines types for the price tracking and monitoring system
 */

/**
 * Historical price record for a card
 */
export interface PriceHistory {
  cardId: string;
  date: string;
  rawPrice: number | null;
  psa9Price: number | null;
  psa10Price: number | null;
  source: PriceSource;
}

/**
 * Supported price data sources
 */
export type PriceSource = 'tcgplayer' | 'ebay' | 'cardmarket';

/**
 * Market mover card (cards with significant price changes)
 */
export interface MarketMover {
  cardId: string;
  cardName: string;
  setName: string;
  imageUrl?: string;
  priceChange: number;
  percentChange: number;
  period: '24h' | '7d' | '30d';
  direction: 'up' | 'down';
}

/**
 * Price alert configuration
 */
export interface PriceAlert {
  id: string;
  cardId: string;
  targetPrice: number;
  condition: 'above' | 'below';
  active: boolean;
  createdAt: string;
}
