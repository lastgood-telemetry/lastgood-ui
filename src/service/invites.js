import api from '../api';

const config = { skipToast: true };
export const listInvites = async () => (await api.get('/users/invites', config)).data;
export const createInvite = async (email, role) => (await api.post('/users/invites', { email, role }, config)).data.data;
export const resendInvite = async id => (await api.post(`/users/invites/${encodeURIComponent(id)}/resend`, {}, config)).data.data;
export const revokeInvite = async id => (await api.delete(`/users/invites/${encodeURIComponent(id)}`, config)).data.data;
// Public requests must not inherit a previous user's JWT or log the invite token.
const publicConfig = { skipToast: true, publicRequest: true };
export const previewInvite = async token => {
    if (!/^[A-Za-z0-9_-]{43}$/.test(token || '')) {
        throw { response: { status: 400, data: { code: 'invalid_invite' } } };
    }
    try { return (await api.get(`/invites/${encodeURIComponent(token)}`, publicConfig)).data.data; }
    catch (error) {
        if (error.response?.status === 400) error.response.data = { code: 'invalid_invite' };
        throw error;
    }
};
export const acceptInvite = async (token, name, password) => (await api.post(`/invites/${encodeURIComponent(token)}/accept`, { name, password }, publicConfig)).data.data;
