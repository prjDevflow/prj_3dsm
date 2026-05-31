import { useEffect, useRef, useState } from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
}

function useCountUp(target: number, duration = 900) {
  const [count, setCount] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    if (target === prev.current) return;
    const start  = prev.current;
    const diff   = target - start;
    const startTs = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTs;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(start + diff * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };

    requestAnimationFrame(tick);
  }, [target, duration]);

  return count;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, change }) => {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  const isNumber  = typeof value === 'number';
  const animated  = useCountUp(isNumber ? value : 0);
  const displayed = isNumber ? animated : value;

  const accentColor = isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-[var(--color-primary)]';
  const iconBg      = isPositive ? 'bg-emerald-50'  : isNegative ? 'bg-rose-50'  : 'bg-[var(--color-primary-10)]';
  const iconColor   = isPositive ? 'text-emerald-600': isNegative ? 'text-rose-500': 'text-[var(--color-primary)]';
  const changeColor = isPositive ? 'text-emerald-600': 'text-rose-500';

  return (
    <div className="card relative overflow-hidden pt-1">
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${accentColor}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon size={22} className={iconColor} />
          </div>
        </div>

        <span
          className="text-4xl font-bold text-slate-800"
          style={{ animation: "countUp 0.4s ease-out" }}
        >
          {displayed}
        </span>

        {change !== undefined && (
          <div className="flex items-center mt-2 space-x-1">
            {isPositive
              ? <TrendingUp  size={14} className="text-emerald-500" />
              : <TrendingDown size={14} className="text-rose-500" />
            }
            <span className={`text-sm font-semibold ${changeColor}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-xs text-slate-400">vs. mês anterior</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
