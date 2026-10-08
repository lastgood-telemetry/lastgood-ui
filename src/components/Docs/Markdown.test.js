import { describe, it, expect } from 'vitest';
import { parseMarkdown } from './Markdown';
import guide from '../../../docs/integrations.md?raw';

describe('parseMarkdown', () => {
  it('parses headings, code fences, lists and tables', () => {
    const b = parseMarkdown('# T\n\ntext\n\n```\ncode\n```\n\n1. a\n2. b\n\n| x | y |\n|---|---|\n| 1 | 2 |\n');
    expect(b.map(x => x.type)).toEqual(['h', 'p', 'code', 'list', 'table']);
    expect(b[3].ordered).toBe(true);
    expect(b[4].rows).toEqual([['1', '2']]);
  });
  it('renders the integrations guide with no unclosed code fences', () => {
    const b = parseMarkdown(guide);
    expect(b.filter(x => x.type === 'code').length).toBeGreaterThan(5);
    expect(b.some(x => x.type === 'table')).toBe(true);
    expect(b.some(x => x.type === 'p' && x.text.includes('```'))).toBe(false);
  });
});
