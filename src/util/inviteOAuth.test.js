import { describe, it, expect } from 'vitest';
import { inviteOAuthUrl, inviteOAuthError, inviteErrorDestination } from './invites';
const token = 'a'.repeat(43);
describe('invite OAuth helpers', () => {
    it.each(['google','github'])('starts %s through the invite API', provider => {
        expect(inviteOAuthUrl('https://api.example.com/api/', token, provider)).toBe(`https://api.example.com/api/invites/${token}/oauth/${provider}`);
    });
    it('rejects malformed tokens and providers', () => {
        expect(inviteOAuthUrl('/api','bad','google')).toBeNull();
        expect(inviteOAuthUrl('/api',token,'other')).toBeNull();
    });
    it('renders actionable errors without echoing query text', () => {
        expect(inviteOAuthError('email_mismatch')).toContain('account the invite was sent to');
        for (const code of ['expired','revoked','invalid_invite']) expect(inviteOAuthError(code)).toContain('admin');
        expect(inviteOAuthError('accepted')).toContain('Sign in');
        expect(inviteOAuthError('<script>')).not.toContain('<script>');
    });
    it('allows only same-origin invite destinations', () => {
        const path=`/invite/${token}?error=email_mismatch`;
        expect(inviteErrorDestination(path,'https://console.example.com')).toBe(path);
        expect(inviteErrorDestination(`https://console.example.com${path}`,'https://console.example.com')).toBe(path);
        for (const bad of ['https://evil.example.com'+path,'//evil.example.com'+path,'/login','javascript:alert(1)']) expect(inviteErrorDestination(bad,'https://console.example.com')).toBeNull();
    });
});
