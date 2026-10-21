import { describe, it, expect } from 'vitest';
import { workspaceSlug, profileErrors, passwordErrors } from './onboarding';
const valid = { name: 'Jane', org_name: 'Acme', org_slug: 'acme-team' };
describe('onboarding validation', () => {
    it('generates URL-safe slugs', () => {
        expect(workspaceSlug('  Acme & Team!  ')).toBe('acme-team');
        expect(workspaceSlug('___')).toBe('');
    });
    it('reports every empty field together', () => {
        expect(Object.keys(profileErrors({ name: ' ', org_name: ' ', org_slug: '' }))).toEqual(['name', 'org_name', 'org_slug']);
    });
    it('accepts a valid workspace', () => expect(profileErrors(valid)).toEqual({}));
    it.each(['-acme', 'acme-', 'acme--team', 'acme_team', 'Acme'])('rejects malformed slug %s', org_slug => {
        expect(profileErrors({ ...valid, org_slug }).org_slug).toBeTruthy();
    });
});

describe('mandatory magic-link password', () => {
    it('does not require passwords for OAuth', () => expect(profileErrors({ ...valid, provider: 'google' })).toEqual({}));
    it('requires a long password and matching confirmation for email signup', () => {
        expect(profileErrors({ ...valid, provider: 'magic' }).password).toBeTruthy();
        expect(profileErrors({ ...valid, provider: 'magic', password: 'long password 123', confirmPassword: 'long password 123' })).toEqual({});
        expect(passwordErrors('long password 123', 'different').confirmPassword).toBeTruthy();
    });
    it('rejects bcrypt truncation including multibyte input', () => {
        expect(passwordErrors('a'.repeat(73), 'a'.repeat(73)).password).toBeTruthy();
        expect(passwordErrors('😀'.repeat(19), '😀'.repeat(19)).password).toBeTruthy();
        expect(passwordErrors('a'.repeat(72), 'a'.repeat(72))).toEqual({});
    });
});
