import { describe, it, expect } from 'vitest';
import { eventRewindContext, eventRewindUrl, readRewindContext, rewindRequestParams, rewindOptions } from './rewind';

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
