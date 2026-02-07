/**
 * One Piece Card Game Type Definitions
 * Defines all TypeScript types for One Piece TCG data model
 */

/**
 * One Piece card types
 */
export type OnePieceCardType = 'Leader' | 'Character' | 'Event' | 'Stage' | 'DON!!';

/**
 * One Piece card colors
 */
export type OnePieceColor = 'Red' | 'Green' | 'Blue' | 'Purple' | 'Black' | 'Yellow';

/**
 * One Piece card interface
 */
export interface OnePieceCard {
  id: string;
  name: string;
  cardType: OnePieceCardType;
  color: OnePieceColor[];
  cost?: number;
  power?: number;
  counter?: number;
  life?: number;
  attribute?: string;
  effect?: string;
  trigger?: string;
  artist?: string;
  rarity?: string;
  number: string;
  set: OnePieceSet;
  images: {
    small?: string;
    large?: string;
  };
}

/**
 * One Piece set information
 */
export interface OnePieceSet {
  id: string;
  name: string;
  series: string;
  total: number;
  releaseDate: string;
  updatedAt: string;
  images: {
    symbol?: string;
    logo?: string;
  };
}

/**
 * One Piece card color definitions with hex values
 */
export const ONEPIECE_COLORS: Record<OnePieceColor, string> = {
  Red: '#dc2626',
  Green: '#16a34a',
  Blue: '#2563eb',
  Purple: '#9333ea',
  Black: '#1f2937',
  Yellow: '#eab308',
};

/**
 * One Piece card type display info
 */
export const ONEPIECE_CARD_TYPES: Record<OnePieceCardType, { label: string; color: string }> = {
  Leader: { label: 'Leader', color: '#f59e0b' },
  Character: { label: 'Character', color: '#3b82f6' },
  Event: { label: 'Event', color: '#8b5cf6' },
  Stage: { label: 'Stage', color: '#10b981' },
  'DON!!': { label: 'DON!!', color: '#ef4444' },
};

/**
 * One Piece rarity definitions
 */
export const ONEPIECE_RARITIES = [
  'Common',
  'Uncommon',
  'Rare',
  'Super Rare',
  'Secret Rare',
  'Leader',
  'Promo',
] as const;

export type OnePieceRarity = (typeof ONEPIECE_RARITIES)[number];

/**
 * API response wrapper for One Piece cards
 */
export interface OnePieceApiResponse<T> {
  data: T[];
  page?: number;
  pageSize?: number;
  count?: number;
  totalCount?: number;
}
