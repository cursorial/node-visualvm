import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { GCMetrics as GCMetricsType } from '../types';
import { formatNumber } from '../utils';

interface GCMetricsProps {
  gcMetrics: GCMetricsType;
}

export const GCMetrics: React.FC<GCMetricsProps> = ({ gcMetrics }) => (
  <>
    <Typography variant="h6" gutterBottom>
      Garbage Collection Metrics
    </Typography>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Metric</TableCell>
            <TableCell align="right">Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>Minor GCs</TableCell>
            <TableCell align="right">{formatNumber(gcMetrics.minorGCs)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Major GCs</TableCell>
            <TableCell align="right">{formatNumber(gcMetrics.majorGCs)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Incremental Marking Duration</TableCell>
            <TableCell align="right">{gcMetrics.incrementalMarkingDuration.toFixed(2)} ms</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>GC Pause Duration</TableCell>
            <TableCell align="right">{gcMetrics.gcPauseDuration.toFixed(2)} ms</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  </>
);
