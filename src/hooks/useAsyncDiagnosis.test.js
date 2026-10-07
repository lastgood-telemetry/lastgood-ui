import { describe, expect, it } from 'vitest';
import { readDiagnosis, diagnosisFailure, diagnosisPresentation } from './useAsyncDiagnosis';
const rules = { executive_summary: 'Rules', primary_cause_headline: 'Deploy', recommended_action: 'Inspect logs', status: 'pending', stage: 'rules', job_id: 'job-1' };

describe('async diagnosis contract', () => {
  it('accepts pending rules and validated triage/deep results only', () => {
    expect(readDiagnosis(rules)).toMatchObject(rules);
    expect(readDiagnosis({ ...rules, stage: 'triage', raw_tokens: 'secret' })).not.toHaveProperty('raw_tokens');
    expect(readDiagnosis({ ...rules, status: 'completed', stage: 'deep' })).toMatchObject({ status: 'completed', stage: 'deep' });
    for (const change of [{ stage: 'tokens' }, { status: 'streaming' }, { executive_summary: {} }, { job_id: '' }]) expect(readDiagnosis({ ...rules, ...change })).toBeNull();
  });
  it('maps expiry separately and degrades Redis/network errors quietly', () => {
    expect(diagnosisFailure({ response: { status: 404 } })).toBe('expired');
    for (const status of [503, 500, 403]) expect(diagnosisFailure({ response: { status } })).toBe('unavailable');
    expect(diagnosisFailure(new Error('Network error'))).toBe('unavailable');
  });
  it('renders rules immediately, updates in place, and restores rules on failure', () => {
    expect(diagnosisPresentation(rules)).toEqual({ ai: rules, state: 'pending' });
    const triage = { ...rules, stage: 'triage', executive_summary: 'Triage' };
    expect(diagnosisPresentation(rules, triage).ai).toBe(triage);
    expect(diagnosisPresentation(rules, { ...triage, status: 'failed' })).toEqual({ ai: rules, state: 'unavailable' });
    expect(diagnosisPresentation(rules, triage, 'expired')).toEqual({ ai: rules, state: 'expired' });
  });
  it('hides disabled AI and never retains partial triage as rule evidence', () => {
    expect(diagnosisPresentation({ ...rules, status: 'disabled' })).toEqual({ ai: {}, state: null });
    expect(diagnosisPresentation({ ...rules, stage: 'triage' }, null, 'unavailable').ai).toEqual({});
    expect(diagnosisPresentation({ ...rules, job_id: null }).state).toBe('unavailable');
  });
});
