import { describe, it, expect } from 'vitest';
import { diagnosisTerminalState } from './diagnosisTerminal';

describe('polling-driven diagnosis terminal', () => {
  it('describes waiting, not invented token-level progress', () => {
    expect(diagnosisTerminalState('pending', 'rules', true)).toMatchObject({ label: 'AI diagnosis pending', pending: true, stageLabel: 'Rule triage' });
    expect(diagnosisTerminalState('pending', 'triage', true)).toMatchObject({ label: 'Deep analysis pending', stageLabel: 'AI triage' });
  });
  it('accepts a direct deep result without requiring a triage poll', () => {
    expect(diagnosisTerminalState('completed', 'deep', true)).toMatchObject({ label: 'Complete', pending: false, message: 'Deep analysis received.' });
  });
  it('does not imply deep analysis succeeded when only triage is returned', () => {
    expect(diagnosisTerminalState('completed', 'triage', true).message).toContain('No deep summary was returned');
  });
  it('retains honest failure, expiry, disabled and legacy presentation', () => {
    for (const state of ['failed', 'unavailable']) expect(diagnosisTerminalState(state, 'rules')).toMatchObject({ failed: true, label: 'Unavailable', pending: false });
    expect(diagnosisTerminalState('expired', 'rules').label).toBe('Expired');
    expect(diagnosisTerminalState(null, undefined).label).toBe('AI not enabled');
    expect(diagnosisTerminalState(null, undefined, true).label).toBe('Summary available');
  });
});
