import { describe, it, expect, vi } from 'vitest';
vi.mock('../api', () => ({ default: { get: vi.fn(), delete: vi.fn() } }));
import api from '../api';
import { listMembers, removeMember } from './members';
import { inviteMessage } from '../util/invites';

describe('member management service', () => {
    it('lists members without global error toasts', async () => {
        api.get.mockResolvedValueOnce({ data: { data: [{ id: 'u1', email: 'a@b.test', role: 'admin', you: true }] } });
        const members = await listMembers();
        expect(api.get).toHaveBeenCalledWith('/users/members', { skipToast: true });
        expect(members[0].you).toBe(true);
    });
    it('removes a member by encoded id without global error toasts', async () => {
        api.delete.mockResolvedValueOnce({ data: { data: { id: 'u/2', email: 'x@y.test' } } });
        const removed = await removeMember('u/2');
        expect(api.delete).toHaveBeenCalledWith('/users/members/u%2F2', { skipToast: true });
        expect(removed.email).toBe('x@y.test');
    });
    it('explains removal failures in plain language', () => {
        const error = code => ({ response: { data: { code } } });
        expect(inviteMessage(error('cannot_remove_self'))).toContain('another admin');
        expect(inviteMessage(error('last_admin'))).toContain('only admin');
        expect(inviteMessage(error('not_found'))).toContain('no longer exists');
    });
});
