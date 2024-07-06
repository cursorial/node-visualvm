import React from 'react';
import { HeapSpaceInfo } from '../types';
import { formatBytes } from '../utils';
import { Typography } from '@mui/material';

interface HeapSpaceViewerProps {
  heapSpaces: HeapSpaceInfo[];
}

const COLORS = {
  'new_space': '#36a2eb',
  'old_space': '#ff6384',
  'code_space': '#4bc0c0',
  'map_space': '#ff9f40',
  'large_object_space': '#9966ff',
};

export const HeapSpaceViewer: React.FC<HeapSpaceViewerProps> = ({ heapSpaces }) => {
  const totalSize = heapSpaces.reduce((sum, space) => sum + space.space_size, 0);
  const barHeight = 30;
  const gap = 10;
  const width = 800; // Increased width for better visibility
  const height = (barHeight + gap) * heapSpaces.length - gap;
  const minBarWidth = 200; // Minimum width to ensure text visibility

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        Heap Space Visualizer
      </Typography>
      <svg width={width} height={height} style={{ fontFamily: 'Arial, sans-serif' }}>
        {heapSpaces.map((space, index) => {
          const y = index * (barHeight + gap);
          let spaceWidth = Math.max((space.space_size / totalSize) * width, minBarWidth);
          const usedWidth = (space.space_used_size / space.space_size) * spaceWidth;

          return (
            <g key={space.space_name}>
              <rect
                x={0}
                y={y}
                width={spaceWidth}
                height={barHeight}
                fill={COLORS[space.space_name as keyof typeof COLORS] || '#cccccc'}
              />
              <rect
                x={0}
                y={y}
                width={usedWidth}
                height={barHeight}
                fill="#6c757d"
                fillOpacity={0.7}
              />
              <text
                x={5}
                y={y + barHeight / 2}
                dy=".35em"
                fill="white"
                fontSize="12px"
                fontWeight="bold"
              >
                {`${space.space_name} (${formatBytes(space.space_used_size)} / ${formatBytes(space.space_size)})`}
              </text>
            </g>
          );
        })}
      </svg>
    </>
  );
};