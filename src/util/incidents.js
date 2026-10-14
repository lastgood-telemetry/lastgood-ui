export function declarationUrl(incident) {
  const params = new URLSearchParams({ incidentTime: new Date(incident.opened_at).toISOString().replace('Z', ''), window: '60m', run: '1', incident: incident.id });
  if (incident.service && incident.service !== '*') params.set('service', incident.service);
  if (incident.environment) params.set('environment', incident.environment);
  return `/rewind?${params}`;
}
export function incidentTimeline(changes = [], incidents = []) {
  return [...changes.map(item => ({ kind: 'change', time: (item.event || item).occurred_at, data: item.event || item })),
    ...incidents.map(data => ({ kind: 'incident', time: data.opened_at, data }))]
    .filter(row => Number.isFinite(Date.parse(row.time)))
    .sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
}
