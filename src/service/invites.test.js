import { describe, it, expect, vi } from 'vitest';
vi.mock('../api', () => ({ default: { get: vi.fn() } }));
import api from '../api';
import { previewInvite } from './invites';
import { inviteMessage } from '../util/invites';
describe('invalid invite previews', () => {
    it('does not fetch malformed tokens', async () => {
        api.get.mockClear();
        for (const token of ['', 'short', 'a'.repeat(44), '!'.repeat(43)]) {
            await expect(previewInvite(token)).rejects.toMatchObject({ response: { status: 400, data: { code: 'invalid_invite' } } });
        }
        expect(api.get).not.toHaveBeenCalled();
    });
    it('normalizes a server 400 without showing schema internals', async () => {
        api.get.mockRejectedValueOnce({ response: { status: 400, data: { message: 'params/token must match pattern' } } });
        try { await previewInvite('a'.repeat(43)); } catch (error) {
            expect(inviteMessage(error)).toBe('This invite link is invalid. Ask your admin to resend it.');
        }
    });
});
