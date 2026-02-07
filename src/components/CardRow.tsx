import Link from 'next/link';
import Image from 'next/image';
import { PokemonCard, CardPrice } from '@/types/card';
import { GameType } from '@/types/game';
import RarityBadge from './RarityBadge';
import TrendBadge from './TrendBadge';
import { formatPrice } from '@/lib/format';

interface CardRowProps {
  card: PokemonCard;
  price?: CardPrice;
  rank?: number;
  game?: GameType;
}

export default function CardRow({ card, price, rank, game = 'pokemon' }: CardRowProps) {
  return (
    <Link href={`/${game}/card/${card.id}`}>
      <div className="flex items-center gap-4 rounded-lg border border-[#1e293b] bg-[#1a2236] px-4 py-3 transition-all hover:border-[#3b82f6] hover:bg-[#111827]">
        {/* Rank */}
        {rank !== undefined && (
          <div className="w-8 text-right">
            <p className="font-mono text-sm font-semibold text-[#94a3b8]">#{rank}</p>
          </div>
        )}

        {/* Card Image */}
        <div className="relative h-12 w-9 flex-shrink-0 overflow-hidden rounded bg-[#0b0f1a]">
          {card.images.small ? (
            <Image
              src={card.images.small}
              alt={card.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-[#64748b]">
              —
            </div>
          )}
        </div>

        {/* Card Info */}
        <div className="flex-1 min-w-0">
          <h3 className="truncate text-sm font-semibold text-[#e2e8f0]">
            {card.name}
          </h3>
          <p className="truncate text-xs text-[#94a3b8]">{card.set.name}</p>
        </div>

        {/* Rarity */}
        {card.rarity && (
          <div className="flex-shrink-0">
            <RarityBadge rarity={card.rarity} />
          </div>
        )}

        {/* Price Tiers */}
        {price && (
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Raw */}
            {price.raw && (
              <div className="text-right">
                <p className="text-xs text-[#94a3b8]">Raw</p>
                <p className="font-mono text-sm font-semibold text-[#e2e8f0]">
                  {formatPrice(price.raw.price)}
                </p>
              </div>
            )}

            {/* PSA 9 */}
            {price.psa9 && (
              <div className="text-right">
                <p className="text-xs text-[#94a3b8]">PSA 9</p>
                <p className="font-mono text-sm font-semibold text-[#e2e8f0]">
                  {formatPrice(price.psa9.price)}
                </p>
              </div>
            )}

            {/* PSA 10 */}
            {price.psa10 && (
              <div className="text-right">
                <p className="text-xs text-[#94a3b8]">PSA 10</p>
                <p className="font-mono text-sm font-semibold text-[#e2e8f0]">
                  {formatPrice(price.psa10.price)}
                </p>
              </div>
            )}

            {/* Trend */}
            {price.market && price.market.change7d !== null && price.market.change7d !== undefined && (
              <div className="flex-shrink-0">
                <TrendBadge value={price.market.change7d} size="sm" />
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
