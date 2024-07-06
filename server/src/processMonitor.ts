import find from 'find-process';
import pidusage from 'pidusage';
import v8 from 'v8';
import { ProcessInfo, DetailedMemoryInfo } from './types';
import { getGCMetrics } from './gcObserver';

const getProcessInfo = async (process: { pid: number; name: string }): Promise<ProcessInfo | null> => {
  try {
    const usage = await pidusage(process.pid);
    return {
      pid: process.pid,
      name: process.name,
      cpu: usage.cpu,
      memory: usage.memory
    };
  } catch (error) {
    console.error(`Error getting usage for PID ${process.pid}:`, error);
    return null;
  }
};

export const getNodeProcesses = async (): Promise<ProcessInfo[]> => {
  try {
    const processes = await find('name', 'node', true);
    const nextProcesses = await find('name', 'next-server', true);
    const allProcesses = [...processes, ...nextProcesses];
    const processInfos = await Promise.all(allProcesses.map(getProcessInfo));
    return processInfos.filter((info): info is ProcessInfo => info !== null);
  } catch (error) {
    console.error('Error finding Node processes:', error);
    return [];
  }
};

export const getDetailedMemoryUsage = async (pid: number): Promise<DetailedMemoryInfo> => {
  const usage = await pidusage(pid);
  const heapStats = v8.getHeapStatistics();
  const heapSpaceStats = v8.getHeapSpaceStatistics();

  return {
    heapUsed: usage.memory,
    heapTotal: heapStats.total_heap_size,
    rss: usage.memory,
    external: heapStats.external_memory,
    gcMetrics: getGCMetrics(),
    heapSpaceStats,
    timestamp: Date.now()
  };
};
