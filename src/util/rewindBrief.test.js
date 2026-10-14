import { describe, it, expect } from 'vitest';
import { buildCopySummary, plainReasons, contentFlags, leadTime } from './rewindBrief';

const item = (summary, service, score, extra = {}) => ({
  event: { summary, service, occurred_at: '2026-10-13T16:00:00Z' },
  risk_assessment: { score, reasons: ['Deployed 2h before the incident', 'Tier-1 service'], ...extra },
});

describe('rewindBrief', () => {
  it('formats lead time', () => {
    expect(leadTime({ occurred_at: '2026-10-13T16:00:00Z' }, '2026-10-13T18:05:00')).toBe('2h 5m before');
  });
  it('prefers plain reasons and never returns numeric breakdowns', () => {
    expect(plainReasons({ reasons: ['a', 'b', 'c', 'd'], reasons_detailed: ['x 0.3'] })).toEqual(['a', 'b', 'c']);
    expect(plainReasons({ explanation: 'fallback' })).toEqual(['fallback']);
  });
  it('flags risky content', () => {
    expect(contentFlags({ content: { categories: { migration: 2, test: 1 }, risky_files: ['a.sql'] } })).toEqual(['migration files']);
  });
  it('builds a paste-ready summary', () => {
    const text = buildCopySummary({
      items: [item('feat: add column', 'lastgood-be', 91, { content: { categories: { migration: 1 }, risky_files: ['m.sql'] } }), item('bump', 'lastgood-db', 80), item('x', 'ui', 50), item('y', 'ui', 40)],
      queryParams: { service: 'lastgood-ui', incidentTime: '2026-10-13T18:00:40.000', windowMinutes: 1440 },
      correlations: [{}, {}], envLabel: 'Production', url: 'https://console.lastgood.space/rewind',
    });
    expect(text).toContain('*Rewind: lastgood-ui / Production*');
    expect(text).toContain('*Primary suspect:* feat: add column');
    expect(text).toContain('Touches: migration files');
    expect(text).toContain('2. bump (lastgood-db) - risk 80/100');
    expect(text).toContain('3. x (ui) - risk 50/100');
    expect(text).not.toContain('4. y');
    expect(text).toContain('Related changes: 2');
    expect(text).toContain('https://console.lastgood.space/rewind');
  });
});
