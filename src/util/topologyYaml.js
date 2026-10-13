// Pure helpers for the "View as YAML" panel. No React, no network.

const edgeLabel = (e) => `${e.service} -> ${e.depends_on_service}${e.dependency_type ? ` (${e.dependency_type})` : ''}`;

/** Turns the server's dry-run plan into display rows. Rows with nothing in them are dropped. */
export function summarizePlan(plan) {
  if (!plan) return [];
  const rows = [
    { key: 'edges_to_add', label: 'Links added', tone: 'add', items: (plan.edges_to_add || []).map(edgeLabel) },
    { key: 'edges_to_update', label: 'Links changed', tone: 'change', items: (plan.edges_to_update || []).map(edgeLabel) },
    { key: 'edges_to_remove', label: 'Links removed', tone: 'remove', items: (plan.edges_to_remove || []).map(edgeLabel) },
    { key: 'criticality_to_set', label: 'Criticality set', tone: 'change', items: (plan.criticality_to_set || []).map((c) => `${c.service}: ${c.criticality}`) },
    { key: 'services_to_create', label: 'Services created', tone: 'add', items: plan.services_to_create || [] },
    { key: 'edges_kept_manual', label: 'Console links kept as they are', tone: 'note', items: (plan.edges_kept_manual || []).map(edgeLabel) },
    { key: 'criticality_kept_manual', label: 'Console criticality kept (not overwritten)', tone: 'note', items: plan.criticality_kept_manual || [] },
  ];
  return rows.filter((r) => r.items.length > 0);
}

/** True when applying would change anything. */
export function planHasChanges(plan) {
  return summarizePlan(plan).some((r) => r.tone !== 'note');
}

/** Best readable message from an axios error. */
export function errorMessage(err, fallback) {
  return err?.response?.data?.error || err?.message || fallback;
}
