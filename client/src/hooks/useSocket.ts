import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { ProcessInfo, DetailedUsage } from '../types';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [processes, setProcesses] = useState<ProcessInfo[]>([]);
  const [detailedUsage, setDetailedUsage] = useState<DetailedUsage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io('ws://localhost:3001');

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('getProcesses');
    });

    newSocket.on('processList', (processList: ProcessInfo[]) => {
      setProcesses(processList);
    });

    newSocket.on('detailedUsage', (usage: DetailedUsage) => {
      setDetailedUsage(usage);
    });

    newSocket.on('profilingError', (errorData: { message: string }) => {
      setError(errorData.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const startDetailedProfiling = useCallback((pid: number) => {
    if (socket) {
      setError(null);
      socket.emit('startDetailedProfiling', pid);
    }
  }, [socket]);

  const stopDetailedProfiling = useCallback(() => {
    if (socket) {
      socket.emit('stopDetailedProfiling');
      setDetailedUsage(null);
    }
  }, [socket]);

  return { processes, detailedUsage, error, startDetailedProfiling, stopDetailedProfiling };
};
