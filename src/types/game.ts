/**
 * Multi-Game Type System
 * Defines game types, configuration, and unified card interfaces for multi-TCG support
 */

/**
 * Supported trading card games
 */
export type GameType = 'pokemon' | 'onepiece';

/**
 * Game configuration for display and routing
 */
export interface GameConfig {
  id: GameType;
  name: string;
  shortName: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  cardCount: string;
  setCount: string;
  searchCategory: string; // Used in TCGPlayer/eBay search
}

/**
 * Game configurations
 */
export const GAMES: Record<GameType, GameConfig> = {
  pokemon: {
    id: 'pokemon',
    name: 'Pokémon TCG',
    shortName: 'Pokémon',
    slug: 'pokemon',
    description:
      'Track prices for 50,000+ Pokémon Trading Card Game cards across 150+ sets.',
    icon: '⚡',
    color: '#f59e0b',
    cardCount: '50K+',
    setCount: '150+',
    searchCategory: 'pokemon',
  },
  onepiece: {
    id: 'onepiece',
    name: 'One Piece Card Game',
    shortName: 'One Piece',
    slug: 'onepiece',
    description:
      'Track prices for One Piece Card Game cards including Leaders, Characters, Events, and Stages.',
    icon: '🏴‍☠️',
    color: '#ef4444',
    cardCount: '2K+',
    setCount: '15+',
    searchCategory: 'one piece card game',
  },
};

/**
 * All supported game types as array
 */
export const GAME_LIST: GameType[] = ['pokemon', 'onepiece'];

/**
 * Get game config by slug
 */
export function getGameBySlug(slug: string): GameConfig | undefined {
  return Object.values(GAMES).find((g) => g.slug === slug);
}

/**
 * Unified card interface for components that work across all games
 * Components like CardGrid, CardRow use this to render any card type
 */
export interface UnifiedCard {
  id: string;
  game: GameType;
  name: string;
  number: string;
  rarity?: string;
  images: {
    small?: string;
    large?: string;
  };
  set: {
    id: string;
    name: string;
    series: string;
  };
  subtitle?: string;
}

/**
 * Unified set interface for components that work across all games
 */
export interface UnifiedSet {
  id: string;
  game: GameType;
  name: string;
  series: string;
  total: number;
  releaseDate: string;
  images: {
    symbol?: string;
    logo?: string;
  };
}
