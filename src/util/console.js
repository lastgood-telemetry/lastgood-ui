// Display-only aliases. Keep raw API values intact for exact-match filtering/scoring.
export function environmentLabel(value) {
  const raw = String(value || '').trim();
  const key = raw.toLowerCase();
  if (['prod', 'production'].includes(key)) return 'Production';
  if (['stage', 'staging'].includes(key)) return 'Staging';
  // Preview deployments are not staging deployments.
  if (key === 'preview') return 'Preview';
  if (['dev', 'development'].includes(key)) return 'Development';
  return raw || 'Unspecified';
}

export function suspectedWording(value = '') {
  return String(value).replace(/PRIMARY_CULPRIT/gi, 'Suspected contributor')
    .replace(/primary culprit/gi, 'suspected contributor')
    .replace(/primary trigger/gi, 'suspected contributor')
    .replace(/\bCONTRIBUTING\b/g, 'Possible contributor');
}

export function utcTimestamp(value) {
  const date = new Date(value);
  return value && !Number.isNaN(date.getTime()) ? date.toISOString().replace('T', ' ').replace('Z', ' UTC') : 'Timestamp unavailable';
}

// GitHub deployment-created historically uses a default env label. An explicit
// provider environment or exact generated summary takes precedence for DISPLAY only.
export function eventEnvironmentLabel(event) {
  const supplied = event?.meta?.deployment?.environment || event?.meta?.deployment_environment;
  const created = /^Deployment created \(([^)]+)\)$/.exec(event?.summary || '');
  return environmentLabel(supplied || (event?.meta?.deployment_id != null && created?.[1]) || event?.environment);
}

export function groupDeploymentEvents(events = []) {
  const groups = new Map();
  const rows = [];
  const repository = event => event.meta?.repo_full_name || event.meta?.repository?.full_name || event.meta?.repo_url;
  for (const event of events) {
    const deploymentId = event.meta?.deployment_id ?? event.meta?.deployment?.id;
    if (!/commit|deploy/i.test(event.type || '') || deploymentId == null || !repository(event) || !event.service || !event.environment) {
      rows.push(event); continue;
    }
    const key = JSON.stringify([repository(event), String(deploymentId), event.service, eventEnvironmentLabel(event)]);
    const existing = groups.get(key);
    if (existing) existing.lifecycleEvents.push(event);
    else {
      const grouped = { ...event, lifecycleEvents: [event] };
      groups.set(key, grouped); rows.push(grouped);
    }
  }
  // Push evidence is associated only when an exact SHA has one nearby deployment
  // in the same scope. Multiple candidate rollouts are left separate.
  const associated = new Set();
  for (const event of rows) {
    if (event.lifecycleEvents || !event.meta?.after_commit || !event.meta?.commit) continue;
    const candidates = [...groups.values()].filter(group =>
      repository(group) === repository(event) && group.service === event.service &&
      eventEnvironmentLabel(group) === eventEnvironmentLabel(event) && group.meta?.commit === event.meta.commit &&
      group.lifecycleEvents.some(child => {
        const delta = new Date(child.occurred_at) - new Date(event.occurred_at);
        return delta >= 0 && delta <= 5 * 60 * 1000;
      }));
    if (candidates.length === 1) { candidates[0].lifecycleEvents.push({ ...event, relatedPush: true }); associated.add(event.id); }
  }
  return rows.filter(event => !associated.has(event.id));
}

// Older saved reports omit event IDs. Match the full source tuple, not names or
// time proximity. Ambiguous rows remain unresolved rather than linking wrongly.
export function resolveReportEvidence(timeline = [], events = []) {
  return timeline.map(row => {
    if (evidenceEventId(row)) return row;
    const matches = events.filter(event => event.service === row.service && event.type === row.event_type &&
      event.summary === row.summary && new Date(event.occurred_at).getTime() === new Date(row.timestamp).getTime());
    return matches.length === 1 ? { ...row, event_id: matches[0].id } : row;
  });
}

export const SETUP_PATH = '/integrations?channel=github';
export function rememberSetupDestination() {
  sessionStorage.setItem('lastgood:after-login', SETUP_PATH);
}
export function consumeLoginDestination() {
  const destination = sessionStorage.getItem('lastgood:after-login');
  sessionStorage.removeItem('lastgood:after-login');
  return destination === SETUP_PATH ? destination : '/rewind';
}

export function evidenceEventId(row) {
  const id = row?.event_id ?? row?.eventId ?? row?.event?.id;
  return typeof id === 'string' && id ? id : null;
}
export function isSuggestedOwner(owner) {
  return !owner || /^@?(oncall-sre|devops-team|tech-lead)$/i.test(String(owner).trim());
}
export function postmortemDraft(report, owners = {}, reviewed = false) {
  if (!report) return '';
  const actions = Array.isArray(report.action_items_json) ? report.action_items_json : [];
  const timeline = Array.isArray(report.timeline_json) ? report.timeline_json : [];
  const safeText = text => suspectedWording(text).replace(/[\r\n]/g, ' ');
  return [
    `# ${safeText(report.title)}`,
    `Incident: ${utcTimestamp(report.incident_at)}`,
    `Severity: ${safeText(report.severity)}`,
    `Review: ${reviewed ? 'Action owners reviewed by the editor' : 'Draft - action owners require human review'}`,
    '', '## Summary', suspectedWording(report.executive_summary),
    `Suspected contributor: ${safeText(report.primary_cause_headline)}`,
    'Correlation is not proof of causation. Verify against incident evidence.',
    '', '## Action items',
    ...actions.map((item, index) => {
      const owner = owners[index] ?? (isSuggestedOwner(item.owner) ? '' : item.owner);
      return `- [${safeText(item.priority)}] ${safeText(item.title)} - Owner: ${safeText(owner || 'Unassigned (human review required)')}`;
    }),
    '', '## Timeline',
    ...timeline.map(row => {
      const id = evidenceEventId(row);
      return `- ${utcTimestamp(row.timestamp)}: ${safeText(row.summary)} (${safeText(row.impact_level)})${id ? ` - [Source event](/events/${encodeURIComponent(id)})` : ' - Source event not linked by the report'}`;
    }),
  ].join('\n');
}

// Keep commit bodies out of scan views; the full value remains in details/tooltips.
export function eventTitle(value, fallback = 'Change', maxLength = 100) {
  const text = String(value || '').trim();
  const firstLine = text.split(/\r?\n/)[0].trim() || fallback;
  const chars = Array.from(firstLine);
  return chars.length > maxLength ? chars.slice(0, maxLength - 1).join('').trimEnd() + '…' : firstLine;
}

export function githubAppState(integration, { loading = false, error = false } = {}) {
  if (loading) return 'Checking';
  if (error) return 'Status unavailable';
  if (integration?.status === 'active' && integration?.credentials?.installation_id) return 'Connected';
  if (integration?.status === 'error') return 'Needs attention';
  return 'Not connected';
}
