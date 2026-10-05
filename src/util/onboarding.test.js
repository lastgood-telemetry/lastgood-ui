import { describe, it, expect } from 'vitest';
import { workspaceSlug, profileErrors } from './onboarding';
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
