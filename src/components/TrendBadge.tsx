import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatPercent } from '@/lib/format';

interface TrendBadgeProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function TrendBadge({ value, size = 'md' }: TrendBadgeProps) {
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-2 text-sm gap-1.5',
    lg: 'px-4 py-2.5 text-base gap-2',
  };

  const bgColor = isPositive ? 'bg-[#22c55e]/20' : isNeutral ? 'bg-[#64748b]/20' : 'bg-[#ef4444]/20';
  const textColor = isPositive ? 'text-[#22c55e]' : isNeutral ? 'text-[#94a3b8]' : 'text-[#ef4444]';
  const borderColor = isPositive ? 'border-[#22c55e]/30' : isNeutral ? 'border-[#64748b]/30' : 'border-[#ef4444]/30';

  const iconSize = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const formattedValue = formatPercent(value);

  return (
    <div
      className={`inline-flex items-center rounded border ${bgColor} ${textColor} ${borderColor} font-mono font-semibold ${sizeClasses[size]}`}
    >
      {isPositive ? (
        <TrendingUp size={iconSize[size]} className="flex-shrink-0" />
      ) : isNeutral ? (
        <span className="text-[#94a3b8]">–</span>
      ) : (
        <TrendingDown size={iconSize[size]} className="flex-shrink-0" />
      )}
      <span>{formattedValue}</span>
    </div>
  );
}
