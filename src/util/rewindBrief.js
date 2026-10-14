// Pure helpers for the Rewind results view: lead time, plain reasons, and the shareable text summary.

export const itemScore = item => {
  const r = item.risk_assessment || item.riskAssessment || item.score || {};
  return typeof r.score === 'number' ? r.score : (typeof item.score === 'number' ? item.score : null);
};

export const leadMinutes = (change, incidentTime) => {
  const at = new Date(change.occurred_at).getTime();
  const inc = incidentTime ? new Date(`${incidentTime}Z`).getTime() : NaN;
  if (Number.isNaN(at) || Number.isNaN(inc)) return null;
  return Math.round((inc - at) / 60000);
};

export const leadTime = (change, incidentTime) => {
  const m = leadMinutes(change, incidentTime);
  if (m === null) return null;
  if (m < 0) return `${Math.abs(m)} min after incident time`;
  if (m < 1) return 'at incident time';
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m before` : `${m} min before`;
};

export const LEVEL_LABEL = { critical: 'Critical', high: 'High', medium: 'Medium', low: 'Low' };

// Plain-language reasons only. Numeric breakdowns (reasons_detailed, factor weights) stay out of this view.
export const plainReasons = (risk = {}, limit = 3) => {
  const list = Array.isArray(risk.reasons) ? risk.reasons : [];
  const cleaned = list.filter(r => typeof r === 'string' && r.trim());
  if (cleaned.length) return cleaned.slice(0, limit);
  return typeof risk.explanation === 'string' && risk.explanation.trim() ? [risk.explanation.trim()] : [];
};

const RISKY_CATEGORIES = ['migration', 'schema', 'config', 'deps'];
export const contentFlags = (risk = {}) => {
  const content = risk.content;
  if (!content) return [];
  const flags = RISKY_CATEGORIES.filter(key => content.categories?.[key]).map(key => `${key} files`);
  if (!flags.length && content.risky_files?.length) flags.push(`${content.risky_files.length} risky file${content.risky_files.length === 1 ? '' : 's'}`);
  return flags;
};

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();

// Slack-friendly plain text: *bold*, bullets, no tables.
export const buildCopySummary = ({ items = [], queryParams = {}, correlations = [], envLabel = '', url = '', executiveSummary = '' }) => {
  const [primary, ...rest] = items;
  if (!primary) return '';
  const change = primary.event || primary;
  const risk = primary.risk_assessment || primary.riskAssessment || {};
  const lines = [];
  lines.push(`*Rewind: ${clean(queryParams.service || change.service || 'All services')} / ${clean(envLabel || queryParams.environment || 'all environments')}*`);
  const when = queryParams.incidentTime ? `${queryParams.incidentTime.replace('T', ' ').slice(0, 19)} UTC` : 'time not set';
  lines.push(`Incident: ${when} · ${queryParams.windowMinutes || '?'} min window · ${items.length} change${items.length === 1 ? '' : 's'} analyzed`);
  lines.push('');
  const lead = leadTime(change, queryParams.incidentTime);
  lines.push(`*Primary suspect:* ${clean(change.summary || change.type || 'Change')}`);
  lines.push(`${clean(change.service || 'Unspecified')}${lead ? ` · ${lead}` : ''}${itemScore(primary) != null ? ` · risk ${itemScore(primary)}/100` : ''}`);
  const flags = contentFlags(risk);
  if (flags.length) lines.push(`Touches: ${flags.join(', ')}`);
  plainReasons(risk).forEach(reason => lines.push(`• ${clean(reason)}`));
  if (typeof executiveSummary === 'string' && executiveSummary.trim()) {
    lines.push('');
    lines.push('*AI summary:*');
    lines.push(clean(executiveSummary));
  }
  if (rest.length) {
    lines.push('');
    lines.push('*Next suspects:*');
    rest.slice(0, 2).forEach((item, i) => {
      const c = item.event || item;
      lines.push(`${i + 2}. ${clean(c.summary || c.type || 'Change')} (${clean(c.service || 'Unspecified')}) - risk ${itemScore(item) ?? '-'}/100`);
    });
  }
  lines.push('');
  lines.push(`Related changes: ${correlations.length}`);
  lines.push('Risk ranks investigation order, not causation. Verify against incident evidence.');
  if (url) lines.push(url);
  return lines.join('\n');
};
