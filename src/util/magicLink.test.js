import { describe, expect, it } from 'vitest';
import { readMagicToken } from './magicLink';

describe('readMagicToken', () => {
    const token = 'a'.repeat(43);
    it('reads a valid fragment token', () => expect(readMagicToken(`#token=${token}`)).toBe(token));
    it('rejects missing, short or padded tokens', () => {
        expect(readMagicToken('')).toBe('');
        expect(readMagicToken('#token=abc')).toBe('');
        expect(readMagicToken(`#token=${token}&x=1`)).toBe('');
        expect(readMagicToken(`?token=${token}`)).toBe('');
    });
});
