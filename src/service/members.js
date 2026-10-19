import api from '../api';

const config = { skipToast: true };
export const listMembers = async () => (await api.get('/users/members', config)).data.data;
export const removeMember = async id => (await api.delete(`/users/members/${encodeURIComponent(id)}`, config)).data.data;
