'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Loader } from 'lucide-react';
import { PokemonCard } from '@/types/card';
import { formatPrice } from '@/lib/format';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PokemonCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout>(undefined);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      // Using Pokemon TCG API directly
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=name:${encodeURIComponent(searchQuery)}*&pageSize=8`
      );
      const data = await response.json();
      setResults(data.data || []);
      setIsOpen(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer for debounced search
    debounceTimer.current = setTimeout(() => {
      performSearch(value);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          const card = results[selectedIndex];
          inputRef.current?.blur();
          setIsOpen(false);
          // Navigation handled by Link component
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={searchRef} className="relative">
      <div className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[#94a3b8]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && isOpen && setIsOpen(true)}
          placeholder="Search 50,000+ cards..."
          className="w-full rounded-lg border border-[#1e293b] bg-[#111827] py-2 pl-10 pr-3 text-sm text-[#e2e8f0] placeholder-[#64748b] outline-none transition-colors focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]"
        />
        {isLoading && (
          <Loader className="pointer-events-none absolute right-3 h-4 w-4 animate-spin text-[#3b82f6]" />
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border border-[#1e293b] bg-[#111827] shadow-lg shadow-black/50">
          {results.map((card, index) => (
            <Link key={card.id} href={`/card/${card.id}`}>
              <div
                className={`flex items-center gap-3 border-b border-[#1e293b] p-3 transition-colors hover:bg-[#1a2236] ${
                  index === selectedIndex ? 'bg-[#1a2236]' : ''
                }`}
              >
                {/* Card Image */}
                {card.images.small && (
                  <div className="relative h-10 w-7 flex-shrink-0 overflow-hidden rounded bg-[#0b0f1a]">
                    <Image
                      src={card.images.small}
                      alt={card.name}
                      fill
                      className="object-cover"
                      sizes="28px"
                    />
                  </div>
                )}

                {/* Card Info */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-[#e2e8f0]">
                    {card.name}
                  </p>
                  <p className="truncate text-xs text-[#94a3b8]">
                    {card.set.name}
                  </p>
                </div>

                {/* Card Number */}
                <p className="flex-shrink-0 text-xs font-mono text-[#64748b]">
                  #{card.number}/{card.set.printedTotal}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && query.length >= 2 && !isLoading && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-2 rounded-lg border border-[#1e293b] bg-[#111827] p-4 text-center">
          <p className="text-sm text-[#94a3b8]">No cards found matching "{query}"</p>
        </div>
      )}
    </div>
  );
}
