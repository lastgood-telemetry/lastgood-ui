import { describe, it, expect } from 'vitest';
import { summarizePlan, planHasChanges, errorMessage } from './topologyYaml';

const plan = {
  edges_to_add: [{ service: 'a', depends_on_service: 'b', dependency_type: 'hard' }],
  edges_to_update: [],
  edges_to_remove: [{ service: 'c', depends_on_service: 'd' }],
  edges_kept_manual: [],
  criticality_to_set: [{ service: 'a', criticality: 'critical' }],
  criticality_kept_manual: ['x'],
  services_to_create: [],
};

describe('summarizePlan', () => {
  it('drops empty rows and formats items', () => {
    const rows = summarizePlan(plan);
    expect(rows.map((r) => r.key)).toEqual(['edges_to_add', 'edges_to_remove', 'criticality_to_set', 'criticality_kept_manual']);
    expect(rows[0].items).toEqual(['a -> b (hard)']);
    expect(rows[1].items).toEqual(['c -> d']);
    expect(rows[2].items).toEqual(['a: critical']);
  });
  it('handles null and empty plans', () => {
    expect(summarizePlan(null)).toEqual([]);
    expect(summarizePlan({})).toEqual([]);
  });
});

describe('planHasChanges', () => {
  it('is false when only notes remain', () => {
    expect(planHasChanges({ criticality_kept_manual: ['x'], edges_kept_manual: [{ service: 'a', depends_on_service: 'b' }] })).toBe(false);
  });
  it('is true when something is added, changed or removed', () => {
    expect(planHasChanges(plan)).toBe(true);
    expect(planHasChanges({ services_to_create: ['n'] })).toBe(true);
  });
});

describe('errorMessage', () => {
  it('prefers the server error text', () => {
    expect(errorMessage({ response: { data: { error: 'lastgood.yml line 3: bad' } } }, 'x')).toBe('lastgood.yml line 3: bad');
    expect(errorMessage(new Error('boom'), 'x')).toBe('boom');
    expect(errorMessage(null, 'fallback')).toBe('fallback');
  });
});
