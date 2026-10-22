import { describe, it, expect } from 'vitest';
import { buildSuspectSignature, culpritOptions, suggestionQueryParams } from './rewindResolution';

const ranked = [
  { event: { id: 'e1', type: 'migration', service: 'payments', summary: 'alter table orders', occurred_at: '2026-10-22T14:10:00Z' }, risk_assessment: { score: 78, content: { content_class: 'mixed' } }, role: 'primary' },
  { event: { id: 'e2', type: 'deployment', service: 'api', summary: 'deploy abc123', occurred_at: '2026-10-22T14:20:00Z' }, risk_assessment: { score: 41 }, role: 'contributing' },
  { event: { id: 'e3', type: 'config-change', service: 'api', summary: 'config bump', occurred_at: '2026-10-22T14:25:00Z' }, risk_assessment: { score: 12 }, role: 'contributing' },
  { event: { id: 'e4', type: 'hotfix', service: 'web', summary: 'hotfix', occurred_at: '2026-10-22T14:28:00Z' }, risk_assessment: { score: 5 }, role: 'contributing' },
];

describe('buildSuspectSignature', () => {
  it('snapshots the top suspects with the fields matching needs', () => {
    const signature = buildSuspectSignature(ranked);
    expect(signature).toHaveLength(3);
    expect(signature[0]).toEqual({
      event_id: 'e1', type: 'migration', service: 'payments',
      summary: 'alter table orders', occurred_at: '2026-10-22T14:10:00Z',
      score: 78, role: 'primary', content_class: 'mixed',
    });
    expect(signature[1].content_class).toBeNull();
    expect(signature.every(item => !('risk_assessment' in item))).toBe(true);
  });

  it('handles empty and malformed input', () => {
    expect(buildSuspectSignature([])).toEqual([]);
    expect(buildSuspectSignature(null)).toEqual([]);
    expect(buildSuspectSignature([null, {}])).toEqual([
      { event_id: null, type: null, service: null, summary: null, occurred_at: null, score: null, role: null, content_class: null },
      { event_id: null, type: null, service: null, summary: null, occurred_at: null, score: null, role: null, content_class: null },
    ]);
  });

  it('truncates long summaries', () => {
    const long = 'x'.repeat(600);
    expect(buildSuspectSignature([{ event: { id: 'e', summary: long } }])[0].summary).toHaveLength(500);
  });
});

describe('suggestionQueryParams', () => {
  const scope = { incidentTime: '2026-10-22T14:32:00.000', windowMinutes: 30, service: 'payments', environment: 'prod' };

  it('carries the rewind scope and deduped suspect signals', () => {
    const params = suggestionQueryParams(scope, ranked, 'inc-1');
    expect(params).toEqual({
      incident_at: '2026-10-22T14:32:00.000Z',
      window_minutes: 30,
      service: 'payments',
      environment: 'prod',
      incident_id: 'inc-1',
      suspect_types: 'migration,deployment,config-change,hotfix',
      content_classes: 'mixed',
    });
  });

  it('omits optional fields and handles empty suspects', () => {
    const params = suggestionQueryParams({ incidentTime: '2026-10-22T14:32:00.000', windowMinutes: 60 }, []);
    expect(params).toEqual({
      incident_at: '2026-10-22T14:32:00.000Z',
      window_minutes: 60,
      suspect_types: '',
      content_classes: '',
    });
  });
});

describe('culpritOptions', () => {
  it('lists ranked changes that have an event id', () => {
    const options = culpritOptions(ranked);
    expect(options).toHaveLength(4);
    expect(options[0]).toEqual({ id: 'e1', label: '#1 alter table orders - payments' });
  });

  it('skips items without an event id', () => {
    expect(culpritOptions([{ type: 'deployment' }, ...ranked.slice(0, 1)])).toHaveLength(1);
    expect(culpritOptions(null)).toEqual([]);
  });
});
