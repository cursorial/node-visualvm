import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';
import { HeapSpaceSnapshot } from '../types';
import { formatBytes } from '../utils';

interface HeapSpaceChartProps {
  heapSpaceHistory: HeapSpaceSnapshot[];
}

const COLORS = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a4de6c", 
  "#d0ed57", "#ffc0cb", "#008080", "#purple", "#brown"
];

export const HeapSpaceChart: React.FC<HeapSpaceChartProps> = ({ heapSpaceHistory }) => {
  const spaceNames = useMemo(() => {
    if (heapSpaceHistory.length === 0) return [];
    return Object.keys(heapSpaceHistory[0].spaces);
  }, [heapSpaceHistory]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
          <p className="label">{`Time: ${new Date(label).toLocaleTimeString()}`}</p>
          {payload.map((pld: any, index: number) => (
            <p key={index} style={{ color: pld.color }}>
              {`${pld.name}: ${formatBytes(pld.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Heap Space Usage Over Time
      </Typography>
      <Paper style={{ height: 400, width: '100%', marginBottom: '20px' }}>
        <ResponsiveContainer>
          <AreaChart data={heapSpaceHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={(unixTime) => new Date(unixTime).toLocaleTimeString()}
            />
            <YAxis tickFormatter={(value) => formatBytes(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {spaceNames.map((spaceName, index) => (
              <Area 
                isAnimationActive={false}
                key={spaceName}
                type="monotone"
                dataKey={`spaces.${spaceName}`}
                name={spaceName}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </Paper>
    </>
  );
};
