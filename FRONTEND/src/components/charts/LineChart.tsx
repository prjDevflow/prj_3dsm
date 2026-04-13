import React from 'react';
import { ResponsiveContainer, LineChart as ReLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface LineChartProps {
  data: { date: string; leads: number; conversions: number }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReLineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="leads" stroke="#8884d8" activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="conversions" stroke="#82ca9d" />
      </ReLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;