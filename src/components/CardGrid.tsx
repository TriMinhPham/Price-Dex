import Link from 'next/link';
import Image from 'next/image';
import { PokemonCard, CardPrice } from '@/types/card';
import { GameType } from '@/types/game';
import RarityBadge from './RarityBadge';
import TrendBadge from './TrendBadge';
import { formatPrice } from '@/lib/format';

interface CardGridProps {
  cards: PokemonCard[];
  prices?: Map<string, CardPrice>;
  game?: GameType;
}

export default function CardGrid({ cards, prices, game = 'pokemon' }: CardGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {cards.map((card) => {
        const price = prices?.get(card.id);

        return (
          <Link key={card.id} href={`/${game}/card/${card.id}`}>
            <div className="group h-full rounded-lg border border-[#1e293b] bg-[#1a2236] p-3 transition-all hover:border-[#3b82f6] hover:shadow-lg hover:shadow-[#3b82f6]/20">
              {/* Card Image */}
              <div className="relative mb-3 aspect-[2.5/3.5] overflow-hidden rounded bg-[#0b0f1a]">
                {card.images.large ? (
                  <Image
                    src={card.images.large}
                    alt={card.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#64748b]">
                    No image
                  </div>
                )}
              </div>

              {/* Card Info */}
              <div className="space-y-2">
                {/* Name */}
                <h3 className="truncate text-sm font-semibold text-[#e2e8f0] group-hover:text-[#3b82f6]">
                  {card.name}
                </h3>

                {/* Set Name */}
                <p className="text-xs text-[#94a3b8]">{card.set.name}</p>

                {/* Rarity Badge */}
                {card.rarity && (
                  <div className="pt-1">
                    <RarityBadge rarity={card.rarity} />
                  </div>
                )}

                {/* Price and Trend */}
                {price && price.market ? (
                  <div className="flex items-end justify-between gap-2 pt-2">
                    <div>
                      <p className="text-xs text-[#94a3b8]">Market</p>
                      <p className="font-mono text-sm font-semibold text-[#22c55e]">
                        {formatPrice(price.market.price)}
                      </p>
                    </div>
                    {price.market.change7d !== null && price.market.change7d !== undefined && (
                      <TrendBadge value={price.market.change7d} size="sm" />
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-[#64748b]">Price unavailable</p>
                )}
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
