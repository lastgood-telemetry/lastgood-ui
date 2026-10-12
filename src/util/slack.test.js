import { describe, it, expect } from 'vitest';
import { parseEnvironments, slackReturnState, severityLabel } from './slack';

describe('slack util', () => {
  it('parses environments with prod fallback', () => {
    expect(parseEnvironments('Prod, staging ,prod')).toEqual(['prod', 'staging']);
    expect(parseEnvironments('  ')).toEqual(['prod']);
  });
  it('maps OAuth return states', () => {
    expect(slackReturnState('connected').tone).toBe('success');
    expect(slackReturnState('denied').tone).toBe('warn');
    expect(slackReturnState('error').tone).toBe('error');
    expect(slackReturnState('x')).toBeNull();
  });
  it('labels severities', () => { expect(severityLabel('sev2')).toBe('SEV2 and above'); });
});
