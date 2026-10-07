import { describe, expect, it } from 'vitest';
import { sameRewindScope } from './useRewindSession';
const scope = { incidentTime: '2026-10-07T08:00:00.000', windowMinutes: 30, service: 'api', environment: 'prod' };
describe('retained Rewind scope', () => {
  it('compares normalized UTC instants rather than formatting', () => {
    expect(sameRewindScope(scope, { ...scope, incidentTime: '2026-10-07T08:00:00' })).toBe(true);
  });
  it('marks each changed selector as previous analysis', () => {
    for (const change of [{ incidentTime: '2026-10-07T09:00:00' }, { windowMinutes: 60 }, { service: 'web' }, { environment: 'preview' }]) {
      expect(sameRewindScope(scope, { ...scope, ...change })).toBe(false);
    }
    expect(sameRewindScope(scope, { ...scope })).toBe(true);
  });
  it('does not label an absent analysis as current', () => {
    expect(sameRewindScope(scope, null)).toBe(false);
  });
});
