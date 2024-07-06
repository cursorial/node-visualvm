import { HeapSpaceInfo } from 'v8';

export interface ProcessInfo {
  pid: number;
  name: string;
  cpu: number;
  memory: number;
}

export interface DetailedMemoryInfo {
  heapUsed: number;
  heapTotal: number;
  rss: number;
  external: number;
  gcMetrics: GCMetrics;
  heapSpaceStats: HeapSpaceInfo[];
  timestamp: number;
}

export interface GCMetrics {
  minorGCs: number;
  majorGCs: number;
  incrementalMarkingDuration: number;
  gcPauseDuration: number;
}

export interface GCEntry extends PerformanceEntry {
  kind: number;
  flags: number;
}
