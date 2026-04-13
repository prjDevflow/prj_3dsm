import React from 'react';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: number;
}

const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  icon: Icon, 
  change,
}) => {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        <div className="p-2 bg-[#0F3B5E]/10 rounded-lg">
          <Icon size={20} className="text-[#0F3B5E]" />
        </div>
      </div>
      
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-slate-800">{value}</span>
        {change !== undefined && (
          <span className={`text-sm font-medium ${change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      
      {change !== undefined && (
        <p className="text-xs text-slate-500 mt-1">vs. mês anterior</p>
      )}
    </div>
  );
};

export default KpiCard;