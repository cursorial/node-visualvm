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

export interface HeapSpaceInfo {
  space_name: string;
  space_used_size: number;
  space_available_size: number;
  space_size: number;
}

export interface HeapSpaceSnapshot {
  timestamp: number;
  spaces: {
    [key: string]: number; 
  };
}


export interface DetailedUsage {
  memoryData: DetailedMemoryInfo;
}