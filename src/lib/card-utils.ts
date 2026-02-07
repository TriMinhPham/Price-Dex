/**
 * Card Utility Functions
 * Convert game-specific cards to the UnifiedCard format for multi-game support
 */

import { PokemonCard, PokemonSet } from '@/types/card';
import { OnePieceCard, OnePieceSet } from '@/types/onepiece';
import { UnifiedCard, UnifiedSet, GameType } from '@/types/game';

/**
 * Convert a Pokemon card to UnifiedCard format
 */
export function pokemonToUnified(card: PokemonCard): UnifiedCard {
  // Build subtitle from types and HP
  let subtitle = '';
  if (card.types && card.types.length > 0) {
    subtitle = card.types.join('/') + ' Type';
    if (card.hp) {
      subtitle += ` • HP ${card.hp}`;
    }
  } else if (card.hp) {
    subtitle = `HP ${card.hp}`;
  }

  return {
    id: card.id,
    game: 'pokemon',
    name: card.name,
    number: card.number,
    rarity: card.rarity,
    images: {
      small: card.images?.small,
      large: card.images?.large,
    },
    set: {
      id: card.set.id,
      name: card.set.name,
      series: card.set.series,
    },
    subtitle: subtitle || undefined,
  };
}

/**
 * Convert an One Piece card to UnifiedCard format
 */
export function onepieceToUnified(card: OnePieceCard): UnifiedCard {
  // Build subtitle based on card type
  let subtitle = '';

  if (card.cardType === 'Leader' && card.life) {
    subtitle = `Leader • ${card.color.join('/')} • Life ${card.life}`;
  } else if (card.cardType === 'Character' && card.power) {
    subtitle = `Character • ${card.color.join('/')} • Power ${card.power}`;
  } else if (card.cardType === 'Event') {
    subtitle = `Event • ${card.color.join('/')}`;
  } else if (card.cardType === 'Stage' && card.power) {
    subtitle = `Stage • ${card.color.join('/')} • Power ${card.power}`;
  } else if (card.cardType === 'DON!!') {
    subtitle = `DON!! • ${card.color.join('/')}`;
  } else {
    subtitle = `${card.cardType} • ${card.color.join('/')}`;
  }

  return {
    id: card.id,
    game: 'onepiece',
    name: card.name,
    number: card.number,
    rarity: card.rarity,
    images: {
      small: card.images?.small,
      large: card.images?.large,
    },
    set: {
      id: card.set.id,
      name: card.set.name,
      series: card.set.series,
    },
    subtitle: subtitle || undefined,
  };
}

/**
 * Convert a Pokemon set to UnifiedSet format
 */
export function pokemonSetToUnified(set: PokemonSet): UnifiedSet {
  return {
    id: set.id,
    game: 'pokemon',
    name: set.name,
    series: set.series,
    total: set.total,
    releaseDate: set.releaseDate,
    images: {
      symbol: set.images?.symbol,
      logo: set.images?.logo,
    },
  };
}

/**
 * Convert an One Piece set to UnifiedSet format
 */
export function onepieceSetToUnified(set: OnePieceSet): UnifiedSet {
  return {
    id: set.id,
    game: 'onepiece',
    name: set.name,
    series: set.series,
    total: set.total,
    releaseDate: set.releaseDate,
    images: {
      symbol: set.images?.symbol,
      logo: set.images?.logo,
    },
  };
}

/**
 * Convert any game-specific card to UnifiedCard format
 * Helper function for dynamic conversion
 */
export function cardToUnified(
  card: PokemonCard | OnePieceCard,
  game: GameType
): UnifiedCard {
  if (game === 'pokemon') {
    return pokemonToUnified(card as PokemonCard);
  } else if (game === 'onepiece') {
    return onepieceToUnified(card as OnePieceCard);
  }

  throw new Error(`Unsupported game type: ${game}`);
}

/**
 * Convert any game-specific set to UnifiedSet format
 * Helper function for dynamic conversion
 */
export function setToUnified(
  set: PokemonSet | OnePieceSet,
  game: GameType
): UnifiedSet {
  if (game === 'pokemon') {
    return pokemonSetToUnified(set as PokemonSet);
  } else if (game === 'onepiece') {
    return onepieceSetToUnified(set as OnePieceSet);
  }

  throw new Error(`Unsupported game type: ${game}`);
}
