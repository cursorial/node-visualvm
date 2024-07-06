import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Paper, Typography } from '@mui/material';
import { DetailedMemoryInfo } from '../types';
import { formatBytes } from '../utils';

interface MemoryChartProps {
  memoryHistory: DetailedMemoryInfo[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p className="label">{`Time: ${new Date(label).toLocaleTimeString()}`}</p>
        {payload.map((pld: any) => (
          <p key={pld.name} style={{ color: pld.color }}>
            {`${pld.name}: ${formatBytes(pld.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const MemoryChart: React.FC<MemoryChartProps> = ({ memoryHistory }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Memory Usage Over Time
    </Typography>
    <Paper style={{ height: 300, width: '100%', marginBottom: '20px' }}>
      <ResponsiveContainer>
        <LineChart data={memoryHistory}>
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
          <Line type="monotone" dataKey="heapUsed" name="Heap Used" stroke="#8884d8" />
          <Line type="monotone" dataKey="heapTotal" name="Heap Total" stroke="#82ca9d" />
          <Line type="monotone" dataKey="rss" name="RSS" stroke="#ffc658" />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  </>
);
