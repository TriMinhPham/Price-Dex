import Link from 'next/link';
import Image from 'next/image';
import { PokemonSet } from '@/types/card';

interface SetCardProps {
  set: PokemonSet;
}

export default function SetCard({ set }: SetCardProps) {
  const releaseDate = set.releaseDate
    ? new Date(set.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <Link href={`/set/${set.id}`}>
      <div className="group rounded-lg border border-[#1e293b] bg-[#1a2236] p-4 transition-all hover:border-[#3b82f6] hover:shadow-lg hover:shadow-[#3b82f6]/20">
        {/* Set Logo */}
        <div className="relative mb-4 aspect-square overflow-hidden rounded bg-[#0b0f1a]">
          {set.images?.logo ? (
            <Image
              src={set.images.logo}
              alt={set.name}
              fill
              className="object-contain p-4 transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-[#64748b]">
              No logo
            </div>
          )}
        </div>

        {/* Set Info */}
        <div className="space-y-2">
          {/* Set Name */}
          <h3 className="line-clamp-2 text-sm font-semibold text-[#e2e8f0] group-hover:text-[#3b82f6]">
            {set.name}
          </h3>

          {/* Series */}
          {set.series && (
            <p className="text-xs text-[#94a3b8]">{set.series}</p>
          )}

          {/* Card Count and Release Date */}
          <div className="space-y-1 pt-2 border-t border-[#1e293b]">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94a3b8]">Cards:</span>
              <span className="font-mono font-semibold text-[#e2e8f0]">
                {set.printedTotal || set.total}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#94a3b8]">Released:</span>
              <span className="font-semibold text-[#e2e8f0]">{releaseDate}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
