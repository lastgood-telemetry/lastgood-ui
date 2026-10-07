import { describe, it, expect } from 'vitest';
import { inviteMessage, joinErrors, sessionClaims } from './invites';
const error = code => ({ response: { data: { code } } });
describe('invite validation and states', () => {
    it('reads role claims without treating broken tokens as admin', () => {
        expect(sessionClaims('bad')).toEqual({});
        expect(sessionClaims(`x.${btoa(JSON.stringify({ role: 'admin', orgId: 'org' }))}.x`).role).toBe('admin');
    });
    it('matches the API name and bcrypt byte limits', () => {
        expect(joinErrors('  ', '12345678')).toContain('name');
        expect(joinErrors('a'.repeat(256), '12345678')).toContain('255');
        expect(joinErrors('Alex', '1234567')).toContain('8');
        expect(joinErrors('Alex', 'a'.repeat(72))).toBe('');
        expect(joinErrors('Alex', 'a'.repeat(73))).toContain('72');
        expect(joinErrors('Alex', '🙂'.repeat(19))).toContain('72');
    });
    it.each(['expired', 'revoked', 'accepted', 'invalid_invite'])('explains unusable %s links', code => {
        expect(inviteMessage(error(code))).toMatch(/admin|Sign in/);
    });
    it('explains seat limits, existing accounts and email failure', () => {
        expect(inviteMessage(error('seat_limit'))).toContain('Pending invites');
        expect(inviteMessage(error('account_exists'))).toContain('cannot');
        expect(inviteMessage(error('email_failed'))).toContain('no longer usable');
    });
});
