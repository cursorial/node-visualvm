import { PerformanceObserver } from 'perf_hooks';
import { GCMetrics, GCEntry } from './types';

let gcMetrics: GCMetrics = {
  minorGCs: 0,
  majorGCs: 0,
  incrementalMarkingDuration: 0,
  gcPauseDuration: 0
};

const processGCEntry = (entry: GCEntry) => {
  if (entry.entryType === 'gc') {
    if (entry.kind === 1 || entry.kind === 2) {
      gcMetrics.minorGCs++;
    } else if (entry.kind === 3 || entry.kind === 4) {
      gcMetrics.majorGCs++;
    }
    if (entry.flags & 1) {
      gcMetrics.incrementalMarkingDuration += entry.duration;
    } else {
      gcMetrics.gcPauseDuration += entry.duration;
    }
  }
};

export const initGCObserver = () => {
  const observer = new PerformanceObserver((list) => {
    list.getEntries().forEach(entry => processGCEntry(entry as GCEntry));
  });
  observer.observe({ entryTypes: ['gc'] });
};

export const getGCMetrics = (): GCMetrics => ({ ...gcMetrics });
