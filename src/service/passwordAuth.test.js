import { describe, it, expect, vi } from 'vitest';
vi.mock('../api', () => ({ default: { post: vi.fn() } }));
import api from '../api';
import { loginUser, magicLinkSignup, resetPasswordWithLink } from './auth';
import { acceptInvite } from './invites';
describe('email password API requests', () => {
    it('uses one public login attempt with cookies, not the expired-session retry path', async () => {
        api.post.mockResolvedValueOnce({ data: { data: { token: 'session' } } });
        expect(await loginUser('me@custom.test', 'password value')).toEqual({ token: 'session' });
        expect(api.post).toHaveBeenLastCalledWith('/users/login', { email: 'me@custom.test', password: 'password value' }, { withCredentials: true, skipToast: true, publicRequest: true });
    });
    it('includes the password and proof but never a client-chosen email in magic signup', async () => {
        api.post.mockResolvedValueOnce({ data: { success: true } });
        await magicLinkSignup({ signup_token: 'proof', name: 'Me', org_name: 'Team', org_slug: 'team', password: 'password value', email: 'ignored@other.test' });
        expect(api.post).toHaveBeenLastCalledWith('/auth/magic-link/signup', { signup_token: 'proof', name: 'Me', org_name: 'Team', org_slug: 'team', password: 'password value' }, { withCredentials: true, skipToast: true, publicRequest: true });
    });
    it('recovers by signed proof, never user ID', async () => {
        api.post.mockResolvedValueOnce({ data: { success: true } });
        await resetPasswordWithLink('reset-proof', 'new password value');
        expect(api.post).toHaveBeenLastCalledWith('/auth/magic-link/reset-password', { reset_token: 'reset-proof', password: 'new password value' }, { withCredentials: true, skipToast: true, publicRequest: true });
    });
    it('accepts an invite with password and session cookies', async () => {
        api.post.mockResolvedValueOnce({ data: { data: { token: 'invite-session' } } });
        expect(await acceptInvite('a'.repeat(43), 'Me', 'password value')).toEqual({ token: 'invite-session' });
        expect(api.post).toHaveBeenLastCalledWith(`/invites/${'a'.repeat(43)}/accept`, { name: 'Me', password: 'password value' }, { withCredentials: true, skipToast: true, publicRequest: true });
    });
});
