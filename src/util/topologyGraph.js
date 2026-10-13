// Pure helpers for the topology graph builder: layout, edge geometry and view-model.
// No React, no network: everything here is unit-tested.

export const NODE_W = 176;
export const NODE_H = 56;
export const COL_GAP = 132;
export const ROW_GAP = 20;
export const PAD = 24;

export const CRITICALITY = ['critical', 'high', 'medium', 'low'];
export const CRITICALITY_COLOR = { critical: '#f43f5e', high: '#fb923c', medium: '#94a3b8', low: '#34d399' };

const key = (a, b) => `${a}\u0000${b}`;

/**
 * Layered layout. An edge A -> B means "A depends on B", so B sits to the right of A.
 * Column = longest chain of dependents above the node (cycle-safe). Services with no edges at all go
 * in a final "unconnected" column so the graph part stays readable.
 */
export function layoutGraph(nodes, edges) {
  const names = nodes.map(n => n.service);
  const known = new Set(names);
  const valid = edges.filter(e => known.has(e.service) && known.has(e.depends_on_service) && e.service !== e.depends_on_service);
  const connected = new Set();
  valid.forEach(e => { connected.add(e.service); connected.add(e.depends_on_service); });

  const level = {};
  names.forEach(n => { level[n] = 0; });
  // Relax edges at most |V| times: stops cycles from growing forever.
  for (let i = 0; i < names.length; i++) {
    let changed = false;
    for (const e of valid) {
      const next = level[e.service] + 1;
      if (level[e.depends_on_service] < next && next < names.length) { level[e.depends_on_service] = next; changed = true; }
    }
    if (!changed) break;
  }

  const maxLevel = Math.max(0, ...names.filter(n => connected.has(n)).map(n => level[n]));
  const cols = [];
  names.filter(n => connected.has(n)).forEach(n => { (cols[level[n]] = cols[level[n]] || []).push(n); });
  const loose = names.filter(n => !connected.has(n));
  if (loose.length) cols[connected.size ? maxLevel + 1 : 0] = loose;

  const positions = {};
  let height = 0;
  cols.forEach((col, ci) => {
    if (!col) return;
    col.sort((a, b) => a.localeCompare(b));
    col.forEach((n, ri) => {
      positions[n] = { x: PAD + ci * (NODE_W + COL_GAP), y: PAD + ri * (NODE_H + ROW_GAP) };
    });
    height = Math.max(height, PAD * 2 + col.length * NODE_H + (col.length - 1) * ROW_GAP);
  });
  const width = PAD * 2 + Math.max(1, cols.length) * NODE_W + Math.max(0, cols.length - 1) * COL_GAP;
  return { positions, width, height: Math.max(height, PAD * 2 + NODE_H) };
}

/** Cubic path from the right side of `from` to the left side of `to` (or looping back for cycles). */
export function edgePath(positions, from, to) {
  const a = positions[from], b = positions[to];
  if (!a || !b) return null;
  const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2;
  const x2 = b.x, y2 = b.y + NODE_H / 2;
  if (x2 > x1) {
    const dx = Math.max(40, (x2 - x1) / 2);
    return { d: `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`, mid: { x: (x1 + x2) / 2, y: (y1 + y2) / 2 } };
  }
  // same column or a back edge: leave from the right, arc, and enter from the left
  const out = 56;
  const lift = (a.y <= b.y ? -1 : 1) * (NODE_H + 18);
  const my = Math.min(y1, y2) + (y1 === y2 ? lift : (y2 - y1) / 2);
  return { d: `M ${x1} ${y1} C ${x1 + out} ${y1}, ${x2 - out} ${y2}, ${x2} ${y2}`, mid: { x: (x1 + x2) / 2, y: my } };
}

/** Normalises the /v1/topology/graph payload into what the component draws. */
export function buildViewModel(data) {
  const nodes = Array.isArray(data?.nodes) ? data.nodes : [];
  const edges = (Array.isArray(data?.edges) ? data.edges : []).map(e => ({
    ...e,
    kind: 'confirmed',
    readOnly: e.source === 'yaml' || e.read_only === true,
  }));
  const taken = new Set(edges.flatMap(e => [key(e.service, e.depends_on_service), key(e.depends_on_service, e.service)]));
  const suggested = (Array.isArray(data?.suggested_edges) ? data.suggested_edges : [])
    .filter(s => !taken.has(key(s.service, s.depends_on_service)))
    .map(s => ({ ...s, kind: 'suggested', readOnly: false, dependency_type: 'hard', source: 'suggested' }));
  return { nodes, edges, suggested };
}

export function sourceLabel(source) {
  if (source === 'yaml') return 'from lastgood.yml';
  if (source === 'suggested') return 'suggested';
  if (source === 'default') return 'not set';
  return 'manual';
}

/** Can the console change this item? lastgood.yml owns anything with source yaml. */
export function isEditable(item) {
  return !(item && (item.source === 'yaml' || item.readOnly === true || item.criticality_source === 'yaml'));
}
