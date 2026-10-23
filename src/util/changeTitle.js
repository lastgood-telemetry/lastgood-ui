// Lightweight display title for a change event. No AI, fully local:
// a linked PR title beats the raw commit message, the commit subject beats its body,
// and conventional-commit prefixes ("feat(api):") are stripped so the ranked list
// stays scannable. The full message stays available via the `full` field (hover).
const MAX_TITLE = 70;
const CONVENTIONAL_PREFIX = /^(feat|fix|chore|docs|refactor|perf|test|build|ci|style|revert)(\([^)]*\))?!?:\s+/i;

const clean = value => String(value ?? '').replace(/\s+/g, ' ').trim();

// Cut at a word boundary at or before the limit; only called when over the limit.
const truncate = (text, max = MAX_TITLE) => {
  const chars = Array.from(text);
  if (chars.length <= max) return text;
  const window = chars.slice(0, max).join('');
  const lastSpace = window.lastIndexOf(' ');
  const cut = lastSpace >= Math.floor(max * 0.6) ? window.slice(0, lastSpace) : window;
  return cut.trimEnd() + '...';
};

// A linked PR title is usually cleaner than the commit subject.
export const linkedPrTitle = (change) => {
  const meta = change?.meta && typeof change.meta === 'object' ? change.meta : {};
  if (typeof meta.pr_title === 'string' && meta.pr_title.trim()) return clean(meta.pr_title);
  if (typeof meta.pull_request?.title === 'string' && meta.pull_request.title.trim()) return clean(meta.pull_request.title);
  const prs = Array.isArray(meta.pull_requests) ? meta.pull_requests : [];
  const titled = prs.find(pr => typeof pr?.title === 'string' && pr.title.trim());
  return titled ? clean(titled.title) : '';
};

const capitalize = value => value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

/**
 * Returns { title, full } for a change (or a ranked item wrapping one as `.event`).
 * `title` is short and safe to render inline; `full` is the complete commit subject
 * (or PR title) for a hover tooltip. Never renders the multi-line commit body inline.
 */
export const changeTitle = (item) => {
  const change = (item && typeof item === 'object' && (item.event || item)) || {};
  const full = linkedPrTitle(change) || clean(String(change.summary ?? '').split(/\r?\n/)[0]);
  const stripped = full.replace(CONVENTIONAL_PREFIX, '').trim() || full;
  if (stripped) return { title: truncate(stripped), full: stripped };
  const type = clean(change.type) || 'Change';
  const service = clean(change.service);
  const fallback = service ? `${capitalize(type)} on ${service}` : capitalize(type);
  return { title: fallback, full: fallback };
};
