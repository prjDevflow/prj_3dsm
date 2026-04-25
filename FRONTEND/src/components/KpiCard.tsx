import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, icon: Icon, change }) => {
  const isPositive = change !== undefined && change >= 0;
  const isNegative = change !== undefined && change < 0;

  const accentColor  = isPositive ? 'bg-emerald-500' : isNegative ? 'bg-rose-500' : 'bg-[var(--color-primary)]';
  const iconBg       = isPositive ? 'bg-emerald-50'  : isNegative ? 'bg-rose-50'  : 'bg-[var(--color-primary-10)]';
  const iconColor    = isPositive ? 'text-emerald-600': isNegative ? 'text-rose-500': 'text-[var(--color-primary)]';
  const changeColor  = isPositive ? 'text-emerald-600': 'text-rose-500';

  return (
    <div className="card relative overflow-hidden pt-1">
      {/* Barra de acento no topo */}
      <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-xl ${accentColor}`} />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
          <div className={`p-2.5 rounded-xl ${iconBg}`}>
            <Icon size={18} className={iconColor} />
          </div>
        </div>

        <span className="text-2xl font-bold text-slate-800">{value}</span>

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
