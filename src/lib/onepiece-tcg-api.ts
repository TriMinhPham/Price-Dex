/**
 * One Piece TCG API Client
 * In-memory API client for One Piece Trading Card Game data
 * Reads from seed data and provides pagination, search, and filtering
 */

import { OnePieceCard, OnePieceSet, OnePieceApiResponse } from '@/types/onepiece';
import { ONEPIECE_CARDS } from '@/data/onepiece-cards';
import { ONEPIECE_SETS } from '@/data/onepiece-sets';

const DEFAULT_PAGE_SIZE = 50;

/**
 * One Piece TCG API Client
 * Provides methods to access card and set data with pagination and search capabilities
 */
class OnePieceTCGClient {
  /**
   * Get a single card by ID
   */
  async getCard(id: string): Promise<OnePieceCard | null> {
    try {
      const card = ONEPIECE_CARDS.find((card) => card.id === id);
      return card || null;
    } catch (error) {
      console.error(`Error fetching card ${id}:`, error);
      return null;
    }
  }

  /**
   * Search for cards by name query
   */
  async searchCards(
    query: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<OnePieceApiResponse<OnePieceCard>> {
    try {
      const lowerQuery = query.toLowerCase();

      // Filter cards by name match
      const filtered = ONEPIECE_CARDS.filter((card) =>
        card.name.toLowerCase().includes(lowerQuery)
      );

      return this.paginateResults(filtered, page, pageSize);
    } catch (error) {
      console.error(`Error searching cards with query "${query}":`, error);
      return {
        data: [],
        page,
        pageSize,
        count: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Get all cards with pagination
   */
  async getCards(
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<OnePieceApiResponse<OnePieceCard>> {
    try {
      return this.paginateResults(ONEPIECE_CARDS, page, pageSize);
    } catch (error) {
      console.error('Error fetching cards:', error);
      return {
        data: [],
        page,
        pageSize,
        count: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Get a single set by ID
   */
  async getSet(id: string): Promise<OnePieceSet | null> {
    try {
      const set = ONEPIECE_SETS.find((set) => set.id === id);
      return set || null;
    } catch (error) {
      console.error(`Error fetching set ${id}:`, error);
      return null;
    }
  }

  /**
   * Get all sets
   */
  async getSets(): Promise<OnePieceSet[]> {
    try {
      return ONEPIECE_SETS;
    } catch (error) {
      console.error('Error fetching sets:', error);
      return [];
    }
  }

  /**
   * Get cards from a specific set with pagination
   */
  async getCardsBySet(
    setId: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<OnePieceApiResponse<OnePieceCard>> {
    try {
      // Filter cards by set ID
      const filtered = ONEPIECE_CARDS.filter((card) => card.set.id === setId);

      return this.paginateResults(filtered, page, pageSize);
    } catch (error) {
      console.error(`Error fetching cards for set ${setId}:`, error);
      return {
        data: [],
        page,
        pageSize,
        count: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Get cards by card type
   */
  async getCardsByType(
    cardType: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<OnePieceApiResponse<OnePieceCard>> {
    try {
      const filtered = ONEPIECE_CARDS.filter(
        (card) => card.cardType === cardType
      );

      return this.paginateResults(filtered, page, pageSize);
    } catch (error) {
      console.error(`Error fetching cards by type ${cardType}:`, error);
      return {
        data: [],
        page,
        pageSize,
        count: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Get cards by color
   */
  async getCardsByColor(
    color: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<OnePieceApiResponse<OnePieceCard>> {
    try {
      const filtered = ONEPIECE_CARDS.filter((card) =>
        card.color.includes(color as any)
      );

      return this.paginateResults(filtered, page, pageSize);
    } catch (error) {
      console.error(`Error fetching cards by color ${color}:`, error);
      return {
        data: [],
        page,
        pageSize,
        count: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Get cards by rarity
   */
  async getCardsByRarity(
    rarity: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<OnePieceApiResponse<OnePieceCard>> {
    try {
      const filtered = ONEPIECE_CARDS.filter(
        (card) => card.rarity === rarity
      );

      return this.paginateResults(filtered, page, pageSize);
    } catch (error) {
      console.error(`Error fetching cards by rarity ${rarity}:`, error);
      return {
        data: [],
        page,
        pageSize,
        count: 0,
        totalCount: 0,
      };
    }
  }

  /**
   * Helper method to paginate results
   */
  private paginateResults(
    items: OnePieceCard[],
    page: number,
    pageSize: number
  ): OnePieceApiResponse<OnePieceCard> {
    const totalCount = items.length;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const data = items.slice(startIndex, endIndex);

    return {
      data,
      page,
      pageSize,
      count: data.length,
      totalCount,
    };
  }
}

// Export singleton instance
export const onePieceTCGClient = new OnePieceTCGClient();
export { OnePieceTCGClient };
