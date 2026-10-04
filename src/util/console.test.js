import { describe, it, expect } from 'vitest';
import { environmentLabel, groupDeploymentEvents, suspectedWording, utcTimestamp, postmortemDraft, isSuggestedOwner, evidenceEventId } from './console';
const event = (id, extra = {}) => ({ id, type: 'deployment', service: 'checkout', environment: 'prod', meta: { deployment_id: 12, repo_full_name: 'org/repo' }, ...extra });
describe('console trust helpers', () => {
  it('normalizes display aliases without merging preview into staging', () => {
    expect(environmentLabel('prod')).toBe('Production'); expect(environmentLabel('Production')).toBe('Production');
    expect(environmentLabel('stage')).toBe('Staging'); expect(environmentLabel('Preview')).toBe('Preview');
    expect(environmentLabel('custom-env')).toBe('custom-env'); expect(environmentLabel(null)).toBe('Unspecified');
  });
  it('groups only explicit deployment identities and keeps every source', () => {
    const events = [event('a'), event('b', { type: 'deployment-success', environment: 'Production' }), event('c', { type: 'commit' })];
    const rows = groupDeploymentEvents(events);
    expect(rows).toHaveLength(1); expect(rows[0].lifecycleEvents.map(e => e.id)).toEqual(['a','b','c']);
    expect(events[0].lifecycleEvents).toBeUndefined();
  });
  it('does not collapse SHA-only, different deployment, repo, env, service, or alert events', () => {
    const events = [event('a'), event('b', { meta: { commit: 'same' } }), event('c', { meta: { deployment_id: 13, repo_full_name: 'org/repo' } }), event('d', { environment: 'Preview' }), event('e', { service: 'other' }), event('f', { type: 'alert' }), event('g', { meta: { deployment_id: 12, repo_full_name: 'org/other' } })];
    expect(groupDeploymentEvents(events)).toHaveLength(7);
  });
  it('shows dates and seconds in UTC and handles missing/invalid timestamps', () => {
    expect(utcTimestamp('2026-10-04T10:12:30Z')).toBe('2026-10-04 10:12:30.000 UTC');
    expect(utcTimestamp('broken')).toBe('Timestamp unavailable'); expect(utcTimestamp(null)).toBe('Timestamp unavailable');
  });
  it('uses cautious attribution and recognizes generic owner placeholders', () => {
    expect(suspectedWording('PRIMARY_CULPRIT primary trigger')).toBe('Suspected contributor suspected contributor');
    expect(isSuggestedOwner('@oncall-sre')).toBe(true); expect(isSuggestedOwner('@devops-team')).toBe(true); expect(isSuggestedOwner('Kishan')).toBe(false);
  });
  it('exports edited owners and full UTC timeline without leaking stale markdown placeholders', () => {
    const report = { title:'Incident', severity:'HIGH', incident_at:'2026-10-04T10:12:30Z', primary_cause_headline:'PRIMARY_CULPRIT', executive_summary:'primary culprit', action_items_json:[{ owner:'@oncall-sre', title:'Fix', priority:'P1' }], timeline_json:[{timestamp:'2026-10-03T23:55:12Z',summary:'Deploy',impact_level:'PRIMARY_CULPRIT',event_id:'a/b'}], markdown_report:'STALE PRIMARY_CULPRIT @oncall-sre' };
    const draft = postmortemDraft(report, {0:'Kishan'}, true);
    expect(draft).toContain('Owner: Kishan'); expect(draft).toContain('2026-10-03 23:55:12.000 UTC'); expect(draft).toContain('/events/a%2Fb');
    expect(draft).not.toContain('STALE'); expect(draft).not.toContain('PRIMARY_CULPRIT'); expect(draft).not.toContain('@oncall-sre');
    expect(postmortemDraft(report)).toContain('Unassigned (human review required)');
    expect(report.action_items_json[0].owner).toBe('@oncall-sre');
  });
  it('links only explicit event identifiers', () => { expect(evidenceEventId({event_id:'123'})).toBe('123'); expect(evidenceEventId({summary:'event 123'})).toBeNull(); });
});
import { eventEnvironmentLabel, resolveReportEvidence } from './console';
it('uses explicit Preview deployment target without changing raw staging data', () => {
  const created = event('p', { environment:'staging', summary:'Deployment created (Preview)' });
  expect(eventEnvironmentLabel(created)).toBe('Preview'); expect(created.environment).toBe('staging');
  expect(groupDeploymentEvents([created, event('s', {environment:'Preview'})])).toHaveLength(1);
});
it('associates a unique exact nearby push but not repeated rollouts', () => {
  const deploy = event('d', {occurred_at:'2026-10-04T10:00:30Z',meta:{deployment_id:12,repo_full_name:'org/repo',commit:'sha'}});
  const push = event('p', {occurred_at:'2026-10-04T10:00:00Z',meta:{after_commit:'sha',commit:'sha',repo_full_name:'org/repo'}});
  expect(groupDeploymentEvents([push,deploy])[0].lifecycleEvents).toHaveLength(2);
  expect(groupDeploymentEvents([push,deploy,{...deploy,id:'d2',meta:{...deploy.meta,deployment_id:13}}])).toHaveLength(3);
});
it('resolves saved report source links only from a unique exact tuple', () => {
  const row={timestamp:'2026-10-04T10:00:00Z',service:'checkout',event_type:'deployment',summary:'release'};
  const source=event('s',{occurred_at:row.timestamp,summary:'release'});
  expect(resolveReportEvidence([row],[source])[0].event_id).toBe('s');
  expect(resolveReportEvidence([row],[source,{...source,id:'duplicate'}])[0].event_id).toBeUndefined();
  expect(resolveReportEvidence([row],[{...source,service:'other'}])[0].event_id).toBeUndefined();
});
