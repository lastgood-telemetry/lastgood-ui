import { describe, it, expect, vi } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { STALE, queryKeys, invalidateTopologyAndServices } from './queryConfig';

const fetcher = (qc, key, fn, staleTime) => qc.fetchQuery({ queryKey: key, queryFn: fn, staleTime });

describe('query cache policy', () => {
  it('reference and moderate data are 1-5 minutes, live data is under a minute', () => {
    expect(STALE.reference).toBe(5 * 60 * 1000);
    expect(STALE.moderate).toBe(2 * 60 * 1000);
    expect(STALE.live).toBeLessThan(60 * 1000);
  });

  it('serves a second visit from cache within staleTime for services, topology and postmortems', async () => {
    const qc = new QueryClient();
    for (const key of [queryKeys.services, queryKeys.topologyGraph, queryKeys.topologyDeps, queryKeys.topologyConfig]) {
      const fn = vi.fn().mockResolvedValue([]);
      await fetcher(qc, key, fn, STALE.reference);
      await fetcher(qc, key, fn, STALE.reference);
      expect(fn).toHaveBeenCalledTimes(1);
    }
    const pm = vi.fn().mockResolvedValue([]);
    await fetcher(qc, queryKeys.postmortems, pm, STALE.moderate);
    await fetcher(qc, queryKeys.postmortems, pm, STALE.moderate);
    expect(pm).toHaveBeenCalledTimes(1);
  });

  it('a topology or criticality edit invalidates topology and services so the next read refetches', async () => {
    const qc = new QueryClient();
    const g = vi.fn().mockResolvedValue({});
    const s = vi.fn().mockResolvedValue([]);
    const c = vi.fn().mockResolvedValue('');
    await fetcher(qc, queryKeys.topologyGraph, g, STALE.reference);
    await fetcher(qc, queryKeys.topologyConfig, c, STALE.reference);
    await fetcher(qc, queryKeys.services, s, STALE.reference);
    await invalidateTopologyAndServices(qc);
    await fetcher(qc, queryKeys.topologyGraph, g, STALE.reference);
    await fetcher(qc, queryKeys.topologyConfig, c, STALE.reference);
    await fetcher(qc, queryKeys.services, s, STALE.reference);
    expect(g).toHaveBeenCalledTimes(2);
    expect(c).toHaveBeenCalledTimes(2);
    expect(s).toHaveBeenCalledTimes(2);
  });
});
