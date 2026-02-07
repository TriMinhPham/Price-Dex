import { formatNumber } from '@/lib/format';

interface StatsFooterProps {
  stats: {
    cardsTracked: number;
    setsCount: number;
    updateFrequency: string;
    dailyVolume: string;
  };
}

export default function StatsFooter({ stats }: StatsFooterProps) {
  return (
    <div className="bg-[#111827] border-t border-b border-[#1e293b] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Cards Tracked */}
          <div className="text-center">
            <p className="font-mono text-3xl font-bold text-[#22c55e]">
              {formatNumber(stats.cardsTracked)}
            </p>
            <p className="mt-2 text-sm text-[#94a3b8]">Cards Tracked</p>
          </div>

          {/* Sets Count */}
          <div className="text-center">
            <p className="font-mono text-3xl font-bold text-[#3b82f6]">
              {formatNumber(stats.setsCount)}
            </p>
            <p className="mt-2 text-sm text-[#94a3b8]">Sets Available</p>
          </div>

          {/* Update Frequency */}
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-[#a78bfa]">
              {stats.updateFrequency}
            </p>
            <p className="mt-2 text-sm text-[#94a3b8]">Update Frequency</p>
          </div>

          {/* Daily Volume */}
          <div className="text-center">
            <p className="font-mono text-lg font-bold text-[#06b6d4]">
              {stats.dailyVolume}
            </p>
            <p className="mt-2 text-sm text-[#94a3b8]">Daily Trade Volume</p>
          </div>
        </div>
      </div>
    </div>
  );
}
