/**
 * Shared Constants
 * Application-wide constants and configuration values
 */

/**
 * Pokemon types with their associated colors
 */
export const POKEMON_TYPES = [
  { name: 'Normal', color: '#A8A878', hex: '#A8A878' },
  { name: 'Fire', color: '#F08030', hex: '#F08030' },
  { name: 'Water', color: '#6890F0', hex: '#6890F0' },
  { name: 'Electric', color: '#F8D030', hex: '#F8D030' },
  { name: 'Grass', color: '#78C850', hex: '#78C850' },
  { name: 'Ice', color: '#98D8D8', hex: '#98D8D8' },
  { name: 'Fighting', color: '#C03028', hex: '#C03028' },
  { name: 'Poison', color: '#A040A0', hex: '#A040A0' },
  { name: 'Ground', color: '#E0C068', hex: '#E0C068' },
  { name: 'Flying', color: '#A890F0', hex: '#A890F0' },
  { name: 'Psychic', color: '#F85888', hex: '#F85888' },
  { name: 'Bug', color: '#A8B820', hex: '#A8B820' },
  { name: 'Rock', color: '#B8A038', hex: '#B8A038' },
  { name: 'Ghost', color: '#705898', hex: '#705898' },
  { name: 'Dragon', color: '#7038F8', hex: '#7038F8' },
  { name: 'Dark', color: '#705848', hex: '#705848' },
  { name: 'Steel', color: '#B8B8D0', hex: '#B8B8D0' },
  { name: 'Fairy', color: '#EE99AC', hex: '#EE99AC' },
] as const;

/**
 * Get color for a Pokemon type
 */
export function getTypeColor(typeName: string): string {
  const type = POKEMON_TYPES.find(
    (t) => t.name.toLowerCase() === typeName.toLowerCase()
  );
  return type?.color || '#A8A878'; // Default to Normal type color
}

/**
 * One Piece card colors with hex values
 */
export const ONEPIECE_COLORS: Record<string, string> = {
  Red: '#dc2626',
  Green: '#16a34a',
  Blue: '#2563eb',
  Purple: '#9333ea',
  Black: '#1f2937',
  Yellow: '#eab308',
};

export function getOnePieceColorHex(color: string): string {
  return ONEPIECE_COLORS[color] || '#94a3b8';
}

/**
 * One Piece card type colors
 */
export const ONEPIECE_CARD_TYPE_COLORS: Record<string, string> = {
  Leader: '#f59e0b',
  Character: '#3b82f6',
  Event: '#8b5cf6',
  Stage: '#10b981',
  'DON!!': '#ef4444',
};

/**
 * Rarity order for sorting
 */
export const RARITY_ORDER = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Rare Holo EX',
  'Rare Holo GX',
  'Rare Holo LV.X',
  'Rare Holo Star',
  'Rare Holo V',
  'Rare Holo VMAX',
  'Rare Holo VSTAR',
  'Rare Prime',
  'Rare ACE SPEC',
  'Rare Holo ex',
] as const;

/**
 * Get rarity sort order
 */
export function getRarityOrder(rarity: string): number {
  const index = RARITY_ORDER.indexOf(rarity as never);
  return index === -1 ? RARITY_ORDER.length : index;
}

/**
 * Price tiers available
 */
export const PRICE_TIERS = ['raw', 'psa9', 'psa10'] as const;

/**
 * Pagination defaults
 */
export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 250;

/**
 * Cache revalidation intervals (in seconds)
 */
export const REVALIDATE_INTERVAL = 86400; // 24 hours
export const REVALIDATE_INTERVAL_SHORT = 3600; // 1 hour
export const REVALIDATE_INTERVAL_MARKET = 300; // 5 minutes

/**
 * Navigation links
 */
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/pokemon', label: 'Pokémon' },
  { href: '/onepiece', label: 'One Piece' },
  { href: '/trending', label: 'Trending' },
  { href: '/search', label: 'Search' },
];

/**
 * Number of market movers to display
 */
export const MARKET_MOVERS_LIMIT = 10;

/**
 * Sort orders for cards
 */
export const CARD_SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name:asc' },
  { label: 'Name (Z-A)', value: 'name:desc' },
  { label: 'Price (Low to High)', value: 'price:asc' },
  { label: 'Price (High to Low)', value: 'price:desc' },
  { label: 'Newest', value: 'released:desc' },
  { label: 'Oldest', value: 'released:asc' },
] as const;

/**
 * Time periods for trend analysis
 */
export const TREND_PERIODS = ['24h', '7d', '30d'] as const;

/**
 * Supported image sizes
 */
export const IMAGE_SIZES = {
  thumbnail: 125,
  small: 225,
  medium: 400,
  large: 600,
  xlarge: 1000,
} as const;

/**
 * API configuration
 */
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  timeout: 10000,
} as const;

/**
 * Feature flags
 */
export const FEATURES = {
  priceAlerts: true,
  comparePrices: true,
  priceHistory: true,
  affiliateLinks: true,
  userCollections: false, // Coming soon
} as const;
