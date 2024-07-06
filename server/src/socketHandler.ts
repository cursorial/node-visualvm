import { Server, Socket } from 'socket.io';
import { getNodeProcesses, getDetailedMemoryUsage } from './processMonitor';
import { CONFIG } from './config';

const handleGetProcesses = (socket: Socket) => {
  const interval = setInterval(async () => {
    const processes = await getNodeProcesses();
    socket.emit('processList', processes);
  }, CONFIG.UPDATE_INTERVAL);
  return interval;
};

const handleStartDetailedProfiling = (socket: Socket, pid: number) => {
  const interval = setInterval(async () => {
    try {
      const memoryData = await getDetailedMemoryUsage(pid);
      socket.emit('detailedUsage', { memoryData });
    } catch (error) {
      console.error(`Error getting detailed usage for PID ${pid}:`, error);
      clearInterval(interval);
      socket.emit('profilingError', { message: `Error profiling process ${pid}` });
    }
  }, CONFIG.UPDATE_INTERVAL);
  return interval;
};

export const setupSocketHandlers = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected');
    let profilingInterval: NodeJS.Timeout | null = null;
    let processesInterval: NodeJS.Timeout | null = null;

    socket.on('getProcesses', () => {
      if (processesInterval) clearInterval(processesInterval);
      processesInterval = handleGetProcesses(socket);
    });

    socket.on('startDetailedProfiling', (pid: number) => {
      if (profilingInterval) clearInterval(profilingInterval);
      profilingInterval = handleStartDetailedProfiling(socket, pid);
    });

    socket.on('stopDetailedProfiling', () => {
      if (profilingInterval) clearInterval(profilingInterval);
    });

    socket.on('disconnect', () => {
      if (profilingInterval) clearInterval(profilingInterval);
      if (processesInterval) clearInterval(processesInterval);
      console.log('Client disconnected');
    });
  });
};
