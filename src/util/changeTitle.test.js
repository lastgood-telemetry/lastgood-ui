import { describe, it, expect } from 'vitest';
import { changeTitle, linkedPrTitle } from './changeTitle';

describe('changeTitle', () => {
  it('uses only the commit subject, never the body', () => {
    const { title, full } = changeTitle({ summary: 'Add retry to payments webhook\n\nThis body is long and\nshould never render inline.' });
    expect(title).toBe('Add retry to payments webhook');
    expect(full).toBe('Add retry to payments webhook');
    expect(title).not.toContain('body');
  });

  it('strips conventional-commit prefixes', () => {
    expect(changeTitle({ summary: 'feat(payments): add retry logic' }).title).toBe('add retry logic');
    expect(changeTitle({ summary: 'fix!: drop legacy route' }).title).toBe('drop legacy route');
  });

  it('truncates at a word boundary around 70 chars', () => {
    const long = 'refactor the entire settlement pipeline to batch database writes and reduce lock contention across shards';
    const { title } = changeTitle({ summary: long });
    expect(title.length).toBeLessThanOrEqual(73); // 70 + "..."
    expect(title.endsWith('...')).toBe(true);
    expect(title).not.toMatch(/\w-\w*$/); // no dangling half-word cut like "databa..."
    expect(title).toContain(' ');
  });

  it('prefers a linked PR title over the commit message', () => {
    const change = { summary: 'wip stuff\nmore wip', meta: { pull_requests: [{ title: 'Batch settlement writes' }] } };
    expect(changeTitle(change).title).toBe('Batch settlement writes');
    expect(linkedPrTitle({ meta: { pr_title: 'PR title wins' } })).toBe('PR title wins');
  });

  it('falls back to "<Type> on <service>" when there is no usable text', () => {
    expect(changeTitle({ type: 'migration', service: 'payments' }).title).toBe('Migration on payments');
    expect(changeTitle({ type: 'deployment' }).title).toBe('Deployment');
    expect(changeTitle(null).title).toBe('Change');
  });

  it('unwraps ranked items that carry the change as .event', () => {
    expect(changeTitle({ event: { summary: 'chore: bump deps' }, role: 'primary' }).title).toBe('bump deps');
  });
});
