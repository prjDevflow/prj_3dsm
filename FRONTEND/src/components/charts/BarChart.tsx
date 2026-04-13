import React from 'react';
import { ResponsiveContainer, BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface BarChartProps {
  data: { name: string; value: number }[];
  color?: string;
  dataKey?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, color = "#8884d8", dataKey = "value" }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReBarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={dataKey} fill={color} />
      </ReBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;