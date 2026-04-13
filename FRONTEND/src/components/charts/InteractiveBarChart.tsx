import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LabelList
} from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface InteractiveBarChartProps {
  data: DataPoint[];
  title?: string;
  onBarClick?: (point: DataPoint) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        <p className="text-sm text-slate-600 mt-1">
          <span style={{ color: payload[0].color }}>●</span>{' '}
          <span className="font-medium">{payload[0].value}</span> leads
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% do total
        </p>
      </div>
    );
  }
  return null;
};

const InteractiveBarChart: React.FC<InteractiveBarChartProps> = ({
  data,
  title,
  onBarClick
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  const handleBarClick = (data: any, index: number) => {
    setActiveIndex(index);
    if (onBarClick) {
      onBarClick(data.payload);
    }
  };

  const handleMouseEnter = (index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="w-full">
      {title && (
        <h4 className="text-sm font-medium text-slate-700 mb-4">{title}</h4>
      )}

      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          
          <XAxis
            dataKey="name"
            stroke="#64748B"
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          
          <YAxis
            stroke="#64748B"
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            onClick={handleBarClick}
            onMouseEnter={(_, index) => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            cursor="pointer"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color || (index === activeIndex ? '#1E5A7A' : '#0F3B5E')}
                opacity={index === activeIndex ? 1 : 0.8}
              />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              fill="#64748B"
              fontSize={11}
              formatter={(value: number) => value}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Mini legenda com percentuais */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
        {data.map((item, index) => (
          <div
            key={index}
            className={`text-xs p-2 rounded-lg transition-colors cursor-pointer
              ${activeIndex === index ? 'bg-slate-100' : 'hover:bg-slate-50'}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
            onClick={() => onBarClick?.(item)}
          >
            <div className="flex items-center">
              <span
                className="w-2 h-2 rounded-full mr-2"
                style={{ backgroundColor: item.color || '#0F3B5E' }}
              />
              <span className="text-slate-600">{item.name}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-medium text-slate-800">{item.value}</span>
              <span className="text-slate-400">
                {((item.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveBarChart;