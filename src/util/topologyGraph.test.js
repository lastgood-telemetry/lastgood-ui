import { describe, it, expect } from 'vitest';
import { layoutGraph, edgePath, buildViewModel, isEditable, sourceLabel, NODE_W, NODE_H, COL_GAP } from './topologyGraph';

const n = (...names) => names.map(service => ({ service }));
const e = (service, depends_on_service, extra = {}) => ({ service, depends_on_service, dependency_type: 'hard', source: 'manual', ...extra });

describe('layoutGraph', () => {
  it('puts dependencies to the right of dependents, one column per hop', () => {
    const { positions } = layoutGraph(n('web', 'api', 'db'), [e('web', 'api'), e('api', 'db')]);
    expect(positions.web.x).toBeLessThan(positions.api.x);
    expect(positions.api.x).toBeLessThan(positions.db.x);
    expect(positions.api.x - positions.web.x).toBe(NODE_W + COL_GAP);
  });
  it('uses the longest chain when a node is reachable two ways', () => {
    const { positions } = layoutGraph(n('a', 'b', 'c'), [e('a', 'b'), e('b', 'c'), e('a', 'c')]);
    expect(positions.c.x).toBeGreaterThan(positions.b.x);
  });
  it('terminates on cycles and still places every node', () => {
    const { positions } = layoutGraph(n('a', 'b'), [e('a', 'b'), e('b', 'a')]);
    expect(Object.keys(positions).sort()).toEqual(['a', 'b']);
  });
  it('puts unconnected services in their own last column', () => {
    const { positions } = layoutGraph(n('a', 'b', 'lonely'), [e('a', 'b')]);
    expect(positions.lonely.x).toBeGreaterThan(positions.b.x);
  });
  it('lays out a graph with no edges and ignores edges to unknown nodes', () => {
    const r = layoutGraph(n('x', 'y'), [e('x', 'ghost')]);
    expect(r.positions.x.x).toBe(r.positions.y.x);
    expect(r.positions.x.y).not.toBe(r.positions.y.y);
    expect(layoutGraph([], []).width).toBeGreaterThan(0);
  });
  it('never overlaps nodes in the same column', () => {
    const { positions } = layoutGraph(n('a', 'b', 'c', 'd'), [e('a', 'b'), e('a', 'c'), e('a', 'd')]);
    const ys = ['b', 'c', 'd'].map(k => positions[k].y).sort((p, q) => p - q);
    expect(new Set(ys).size).toBe(3);
  });
});

describe('edgePath', () => {
  it('draws from the right of the source to the left of the target', () => {
    const { positions } = layoutGraph(n('a', 'b'), [e('a', 'b')]);
    const p = edgePath(positions, 'a', 'b');
    expect(p.d.startsWith(`M ${positions.a.x + NODE_W} `)).toBe(true);
    expect(p.d.endsWith(`${positions.b.x} ${positions.b.y + NODE_H / 2}`)).toBe(true);
  });
  it('returns null for unknown nodes and handles back edges', () => {
    const { positions } = layoutGraph(n('a', 'b'), [e('a', 'b')]);
    expect(edgePath(positions, 'a', 'zzz')).toBeNull();
    expect(edgePath(positions, 'b', 'a').d).toMatch(/^M /);
  });
});

describe('buildViewModel', () => {
  it('flags yaml edges read-only and drops suggestions that duplicate an edge in either direction', () => {
    const vm = buildViewModel({
      nodes: n('a', 'b', 'c'),
      edges: [e('a', 'b', { source: 'yaml' }), e('b', 'c')],
      suggested_edges: [{ service: 'b', depends_on_service: 'a' }, { service: 'a', depends_on_service: 'c' }],
    });
    expect(vm.edges.map(x => x.readOnly)).toEqual([true, false]);
    expect(vm.suggested).toHaveLength(1);
    expect(vm.suggested[0]).toMatchObject({ service: 'a', depends_on_service: 'c', kind: 'suggested', source: 'suggested' });
  });
  it('tolerates an empty or malformed payload', () => {
    expect(buildViewModel(undefined)).toEqual({ nodes: [], edges: [], suggested: [] });
    expect(buildViewModel({ nodes: 'x' }).nodes).toEqual([]);
  });
});

describe('source rules', () => {
  it('only yaml-owned things are read-only', () => {
    expect(isEditable({ source: 'yaml' })).toBe(false);
    expect(isEditable({ criticality_source: 'yaml' })).toBe(false);
    expect(isEditable({ readOnly: true })).toBe(false);
    expect(isEditable({ source: 'manual' })).toBe(true);
    expect(isEditable({ criticality_source: 'default' })).toBe(true);
  });
  it('labels sources', () => {
    expect(sourceLabel('yaml')).toBe('from lastgood.yml');
    expect(sourceLabel('manual')).toBe('manual');
    expect(sourceLabel('suggested')).toBe('suggested');
    expect(sourceLabel('default')).toBe('not set');
  });
});
