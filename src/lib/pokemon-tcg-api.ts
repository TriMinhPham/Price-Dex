/**
 * Pokemon TCG API Client
 * Robust API client for https://api.pokemontcg.io/v2
 */

import { PokemonCard, PokemonSet, ApiResponse } from '@/types/card';

const BASE_URL = 'https://api.pokemontcg.io/v2';
const DEFAULT_PAGE_SIZE = 50;
const RATE_LIMIT_DELAY = 100; // ms between requests
const FETCH_TIMEOUT = 8_000; // 8s timeout — fail fast, let ISR/CDN cache handle retries
const RETRY_DELAY = 1_000; // 1s between retries (down from 2s)
const MAX_RETRIES = 2; // 2 retries max (down from 3)

interface RequestOptions {
  headers?: Record<string, string>;
  retries?: number;
}

class PokemonTCGClient {
  private apiKey?: string;
  private lastRequestTime: number = 0;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.POKEMON_TCG_API_KEY;
  }

  /**
   * Build request headers with optional API key
   */
  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'User-Agent': 'PriceDex/1.0',
    };

    if (this.apiKey) {
      headers['X-Api-Key'] = this.apiKey;
    }

    return headers;
  }

  /**
   * Respect rate limiting by adding small delay between requests
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      await new Promise((resolve) =>
        setTimeout(resolve, RATE_LIMIT_DELAY - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
  }

  /**
   * Make a GET request to the API
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { headers = {}, retries = MAX_RETRIES } = options;

    await this.enforceRateLimit();

    const url = `${BASE_URL}${endpoint}`;
    const mergedHeaders = { ...this.getHeaders(), ...headers };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);

      const response = await fetch(url, {
        method: 'GET',
        headers: mergedHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Handle rate limiting
      if (response.status === 429) {
        if (retries > 0) {
          const retryAfter = parseInt(
            response.headers.get('Retry-After') || '5',
            10
          );
          await new Promise((resolve) =>
            setTimeout(resolve, retryAfter * 1000)
          );
          return this.request<T>(endpoint, { ...options, retries: retries - 1 });
        }
        throw new Error('API rate limit exceeded');
      }

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data: T = await response.json();
      return data;
    } catch (error) {
      // Retry on timeout/abort errors
      if (retries > 0 && error instanceof Error && error.name === 'AbortError') {
        console.warn(`API request timed out for ${endpoint}, retrying... (${retries} left)`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
        return this.request<T>(endpoint, { ...options, retries: retries - 1 });
      }
      if (error instanceof Error) {
        throw new Error(`Failed to fetch from Pokemon TCG API: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Get a single card by ID
   */
  async getCard(id: string): Promise<PokemonCard | null> {
    try {
      const response = await this.request<{ data: PokemonCard }>(
        `/cards/${id}`
      );
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching card ${id}:`, error);
      return null;
    }
  }

  /**
   * Search for cards with a query string
   */
  async searchCards(
    query: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<ApiResponse<PokemonCard>> {
    try {
      const encodedQuery = encodeURIComponent(query);
      const endpoint = `/cards?q=${encodedQuery}&page=${page}&pageSize=${pageSize}`;
      return await this.request<ApiResponse<PokemonCard>>(endpoint);
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
  ): Promise<ApiResponse<PokemonCard>> {
    try {
      const endpoint = `/cards?page=${page}&pageSize=${pageSize}`;
      return await this.request<ApiResponse<PokemonCard>>(endpoint);
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
  async getSet(id: string): Promise<PokemonSet | null> {
    try {
      const response = await this.request<{ data: PokemonSet }>(
        `/sets/${id}`
      );
      return response.data || null;
    } catch (error) {
      console.error(`Error fetching set ${id}:`, error);
      return null;
    }
  }

  /**
   * Get all sets
   */
  async getSets(): Promise<PokemonSet[]> {
    try {
      const response = await this.request<ApiResponse<PokemonSet>>('/sets');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching sets:', error);
      return [];
    }
  }

  /**
   * Get cards from a specific set
   */
  async getCardsBySet(
    setId: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE
  ): Promise<ApiResponse<PokemonCard>> {
    try {
      const query = encodeURIComponent(`set.id:${setId}`);
      const endpoint = `/cards?q=${query}&page=${page}&pageSize=${pageSize}`;
      return await this.request<ApiResponse<PokemonCard>>(endpoint);
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
}

// Export singleton instance
export const pokemonTCGClient = new PokemonTCGClient();
export { PokemonTCGClient };
