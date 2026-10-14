import { describe, it, expect } from 'vitest';
import { declarationUrl, incidentTimeline } from './incidents';
describe('incident declarations', () => {
  it('links the exact UTC incident and keeps org-wide scope unfiltered', () => {
    const incident = { id: 'a/b', opened_at: '2026-10-14T19:30:00Z', service: '*', environment: 'prod' };
    const url = new URL(declarationUrl(incident), 'https://console.example');
    expect(url.pathname).toBe('/rewind');
    expect(url.searchParams.get('incident')).toBe('a/b');
    expect(url.searchParams.get('incidentTime')).toBe('2026-10-14T19:30:00.000');
    expect(url.searchParams.get('service')).toBe(null);
    expect(url.searchParams.get('run')).toBe('1');
  });
  it('places the marker alongside preceding changes without inventing a risk score', () => {
    const rows = incidentTimeline([{event:{id:'deploy',occurred_at:'2026-10-14T19:25:00Z',summary:'Deploy'}}], [{id:'incident',opened_at:'2026-10-14T19:30:00Z'}]);
    expect(rows.map(r=>r.kind)).toEqual(['incident','change']);
    expect(rows[0].data.score).toBeUndefined();
    expect(incidentTimeline([{occurred_at:'invalid'}])).toEqual([]);
  });
});
