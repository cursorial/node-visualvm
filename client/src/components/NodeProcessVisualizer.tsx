import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid } from '@mui/material';
import { useSocket } from '../hooks/useSocket';
import { ProcessList } from './ProcessList';
import { MemoryChart } from './MemoryChart';
import { GCMetrics } from './GCMetrics';
import { HeapSpaceChart } from './HeapSpaceChart';
import { DetailedMemoryInfo, HeapSpaceSnapshot } from '../types';
import { HeapSpaceViewer } from './HeapSpaceViewer';

const NodeProcessVisualizer: React.FC = () => {
  const { processes, detailedUsage, error, startDetailedProfiling, stopDetailedProfiling } = useSocket();
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [memoryHistory, setMemoryHistory] = useState<DetailedMemoryInfo[]>([]);
  const [heapSpaceHistory, setHeapSpaceHistory] = useState<HeapSpaceSnapshot[]>([]);

  useEffect(() => {
    if (detailedUsage) {
      setMemoryHistory(prev => [...prev.slice(-50), detailedUsage.memoryData]);
      
      const newHeapSpaceSnapshot: HeapSpaceSnapshot = {
        timestamp: detailedUsage.memoryData.timestamp,
        spaces: {}
      };
      
      detailedUsage.memoryData.heapSpaceStats.forEach(space => {
        newHeapSpaceSnapshot.spaces[space.space_name] = space.space_used_size;
      });
      
      setHeapSpaceHistory(prev => [...prev.slice(-50), newHeapSpaceSnapshot]);
    }
  }, [detailedUsage]);

  const handleStartProfiling = () => {
    if (selectedPid) {
      startDetailedProfiling(selectedPid);
    }
  };

  const handleStopProfiling = () => {
    stopDetailedProfiling();
    setMemoryHistory([]);
    setHeapSpaceHistory([]);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Node.js Process Visualizer
      </Typography>
      {error && (
        <Typography color="error" gutterBottom>
          Error: {error}
        </Typography>
      )}
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <ProcessList
            processes={processes}
            selectedPid={selectedPid}
            onSelectProcess={setSelectedPid}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Detailed Usage
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleStartProfiling} 
                  disabled={!selectedPid}
                  sx={{ mr: 2 }}
                >
                  Start Detailed Profiling
                </Button>
                <Button 
                  variant="contained" 
                  onClick={handleStopProfiling} 
                  disabled={!selectedPid}
                >
                  Stop Detailed Profiling
                </Button>
              </Box>
              {detailedUsage && (
                <>
                  <MemoryChart memoryHistory={memoryHistory} />
                  <GCMetrics gcMetrics={detailedUsage.memoryData.gcMetrics} />
                  <HeapSpaceViewer heapSpaces={detailedUsage.memoryData.heapSpaceStats}/>
                  <HeapSpaceChart heapSpaceHistory={heapSpaceHistory} />
                </>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NodeProcessVisualizer;
