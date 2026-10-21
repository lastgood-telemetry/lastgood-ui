import { describe, it, expect } from 'vitest';
import { eventRewindContext, eventRewindUrl, readRewindContext, rewindRequestParams, rewindOptions, readRewindDeepLink, suggestedFailureEvent } from './rewind';

const event = { occurred_at: '2026-08-29T14:22:32.123Z', service: 'user fe/&', environment: 'Production' };
describe('Rewind event context', () => {
    it('round trips scope and exact UTC timestamp through a reloadable URL', () => {
        const url = eventRewindUrl(event);
        const context = readRewindContext(url.split('?')[1]);
        expect(context).toEqual(eventRewindContext(event));
        expect(rewindRequestParams({ ...context, windowMinutes: 30 })).toEqual({
            incidentAt: event.occurred_at, window: '30m', service: event.service, environment: event.environment,
        });
    });
    it('normalizes timezone offsets without rounding below the triggering event', () => {
        expect(eventRewindContext({ ...event, occurred_at: '2026-08-29T19:52:32.123+05:30' }).incidentTime).toBe('2026-08-29T14:22:32.123');
    });
    it('handles invalid or absent dates and missing scope', () => {
        expect(eventRewindContext({ occurred_at: 'invalid' })).toBeNull();
        expect(eventRewindUrl({})).toBe('/rewind');
        expect(readRewindContext('?incidentTime=invalid').incidentTime).not.toBe('Invalid Date');
        expect(rewindRequestParams({ incidentTime: '2026-08-29T14:22:32', windowMinutes: 60 })).toEqual({ incidentAt: '2026-08-29T14:22:32.000Z', window: '60m' });
    });
    it('deduplicates options and preserves linked scope outside the discovery list', () => {
        expect(rewindOptions([{ service: 'b' }, { service: 'a' }, { service: 'b' }, {}], 'service', 'old')).toEqual(['a', 'b', 'old']);
        expect(rewindOptions([], 'environment')).toEqual([]);
    });
});


describe('readRewindDeepLink', () => {
  it('reads window, highlight and run from an alert link', () => {
    expect(readRewindDeepLink('?incidentTime=2026-10-12T18:02:17.000&window=60m&highlight=abc&run=1'))
      .toEqual({ windowMinutes: 60, highlight: 'abc', autorun: true });
  });
  it('accepts hours and plain minutes, ignores unsupported windows', () => {
    expect(readRewindDeepLink('?window=2h').windowMinutes).toBe(120);
    expect(readRewindDeepLink('?windowMinutes=30').windowMinutes).toBe(30);
    expect(readRewindDeepLink('?window=7m').windowMinutes).toBeNull();
    expect(readRewindDeepLink('?window=abc').windowMinutes).toBeNull();
  });
  it('does not autorun without an incident time, and plain links keep old behaviour', () => {
    expect(readRewindDeepLink('?run=1').autorun).toBe(false);
    expect(readRewindDeepLink('?incidentTime=2026-10-12T18:02:17.000&service=api')).toEqual({ windowMinutes: null, highlight: '', autorun: false });
  });
});

describe('suggestedFailureEvent', () => {
    const run = (conclusion, extra = {}) => ({ occurred_at: '2026-10-20T10:00:00Z', service: 'api', environment: 'prod', meta: { github_event: 'workflow_run', conclusion }, ...extra });
    it('picks the newest failed or timed out workflow run', () => {
        const events = [run('success'), run('timed_out', { id: 'b' }), run('failure', { id: 'c' })];
        expect(suggestedFailureEvent(events).id).toBe('b');
    });
    it('ignores successes, cancelled runs, other event types and bad dates', () => {
        expect(suggestedFailureEvent([run('success'), run('cancelled'), { ...run('failure'), meta: { github_event: 'push', conclusion: 'failure' } }, run('failure', { occurred_at: 'bad' })])).toBeNull();
        expect(suggestedFailureEvent(undefined)).toBeNull();
    });
    it('reads meta stored as a JSON string', () => {
        expect(suggestedFailureEvent([{ ...run('x'), meta: JSON.stringify({ github_event: 'workflow_run', conclusion: 'failure' }) }])).not.toBeNull();
    });
});
