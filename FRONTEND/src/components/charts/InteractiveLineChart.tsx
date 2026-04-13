import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Brush,
  ReferenceLine,
  Label
} from 'recharts';
import { format } from 'date-fns';

interface DataPoint {
  date: string;
  leads: number;
  conversions: number;
}

interface InteractiveLineChartProps {
  data: DataPoint[];
  onPointClick?: (point: DataPoint) => void;
  onBrushChange?: (startIndex: number, endIndex: number) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-slate-200">
        <p className="text-sm font-medium text-slate-800 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <span style={{ color: entry.color }} className="mr-4">
              {entry.name === 'leads' ? '📊 Leads' : '🎯 Conversões'}:
            </span>
            <span className="font-medium text-slate-800">{entry.value}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
          Taxa de conversão: {((payload[1]?.value / payload[0]?.value) * 100).toFixed(1)}%
        </div>
      </div>
    );
  }
  return null;
};

const InteractiveLineChart: React.FC<InteractiveLineChartProps> = ({
  data,
  onPointClick,
  onBrushChange
}) => {
  const [hiddenSeries, setHiddenSeries] = useState<string[]>([]);
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null);

  const handleLegendClick = (dataKey: string) => {
    setHiddenSeries(prev =>
      prev.includes(dataKey)
        ? prev.filter(key => key !== dataKey)
        : [...prev, dataKey]
    );
  };

  const handleChartClick = (e: any) => {
    if (e && e.activePayload && onPointClick) {
      onPointClick(e.activePayload[0].payload);
    }
  };

  const handleBrushChange = (brushData: any) => {
    if (brushData && onBrushChange) {
      onBrushChange(brushData.startIndex, brushData.endIndex);
      setZoomDomain({
        start: brushData.startIndex,
        end: brushData.endIndex
      });
    }
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
    if (onBrushChange) {
      onBrushChange(0, data.length - 1);
    }
  };

  return (
    <div className="w-full">
      {zoomDomain && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleResetZoom}
            className="text-xs text-[#0F3B5E] hover:text-[#1E5A7A] font-medium"
          >
            ↺ Resetar zoom
          </button>
        </div>
      )}

      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          onClick={handleChartClick}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
          
          <XAxis
            dataKey="date"
            stroke="#64748B"
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          
          <YAxis
            stroke="#64748B"
            tick={{ fill: '#64748B', fontSize: 12 }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            onClick={(e) => {
              // @ts-ignore - Ignorando erro de tipagem do Recharts
              handleLegendClick(e.dataKey);
            }}
            wrapperStyle={{
              cursor: 'pointer',
              paddingTop: 20
            }}
          />
          
          <Line
            type="monotone"
            dataKey="leads"
            stroke="#0F3B5E"
            strokeWidth={2}
            dot={{ r: 4, fill: '#0F3B5E', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#0F3B5E', stroke: '#fff', strokeWidth: 2 }}
            hide={hiddenSeries.includes('leads')}
            name="Leads"
          />
          
          <Line
            type="monotone"
            dataKey="conversions"
            stroke="#2C7DA0"
            strokeWidth={2}
            dot={{ r: 4, fill: '#2C7DA0', strokeWidth: 0 }}
            activeDot={{ r: 6, fill: '#2C7DA0', stroke: '#fff', strokeWidth: 2 }}
            hide={hiddenSeries.includes('conversions')}
            name="Conversões"
          />
          
          <ReferenceLine
            y={data.reduce((acc, curr) => acc + curr.leads, 0) / data.length}
            stroke="#94A3B8"
            strokeDasharray="3 3"
          >
            <Label
              value="Média leads"
              position="right"
              fill="#64748B"
              fontSize={11}
            />
          </ReferenceLine>
          
          <Brush
            dataKey="date"
            height={30}
            stroke="#0F3B5E"
            fill="#F1F5F9"
            onChange={handleBrushChange}
            startIndex={zoomDomain?.start}
            endIndex={zoomDomain?.end}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* Estatísticas rápidas */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500">Total Leads</p>
          <p className="text-lg font-semibold text-slate-800">
            {data.reduce((acc, curr) => acc + curr.leads, 0)}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500">Total Conversões</p>
          <p className="text-lg font-semibold text-slate-800">
            {data.reduce((acc, curr) => acc + curr.conversions, 0)}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500">Média Leads/dia</p>
          <p className="text-lg font-semibold text-slate-800">
            {(data.reduce((acc, curr) => acc + curr.leads, 0) / data.length).toFixed(1)}
          </p>
        </div>
        <div className="bg-slate-50 p-3 rounded-lg">
          <p className="text-xs text-slate-500">Taxa Média</p>
          <p className="text-lg font-semibold text-slate-800">
            {((data.reduce((acc, curr) => acc + curr.conversions, 0) / 
               data.reduce((acc, curr) => acc + curr.leads, 0)) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractiveLineChart;