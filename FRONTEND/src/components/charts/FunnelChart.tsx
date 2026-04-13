import React from 'react';
import { ResponsiveContainer, Funnel, FunnelChart as ReFunnelChart, LabelList, Tooltip } from 'recharts';

interface FunnelChartProps {
  data: { stage: string; count: number }[];
}

const FunnelChart: React.FC<FunnelChartProps> = ({ data }) => {
  const chartData = data.map((item, index) => ({
    ...item,
    fill: `hsl(${index * 30}, 70%, 60%)`,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ReFunnelChart>
        <Tooltip />
        <Funnel
          dataKey="count"
          data={chartData}
          isAnimationActive
        >
          <LabelList position="right" fill="#666" stroke="none" dataKey="stage" />
        </Funnel>
      </ReFunnelChart>
    </ResponsiveContainer>
  );
};

export default FunnelChart;