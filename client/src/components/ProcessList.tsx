import React from 'react';
import { List, ListItem, ListItemText, Card, CardContent, Typography } from '@mui/material';
import { ProcessInfo } from '../types';
import { formatBytes } from '../utils';

interface ProcessListProps {
  processes: ProcessInfo[];
  selectedPid: number | null;
  onSelectProcess: (pid: number) => void;
}

export const ProcessList: React.FC<ProcessListProps> = ({ processes, selectedPid, onSelectProcess }) => (
  <Card>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        Node.js Processes
      </Typography>
      <List>
        {processes.map((process) => (
          <ListItem
            key={process.pid}
            button
            selected={selectedPid === process.pid}
            onClick={() => onSelectProcess(process.pid)}
          >
            <ListItemText 
              primary={`PID: ${process.pid}`}
              secondary={`Name: ${process.name}, CPU: ${process.cpu.toFixed(2)}%, Memory: ${formatBytes(process.memory)}`}
            />
          </ListItem>
        ))}
      </List>
    </CardContent>
  </Card>
);
