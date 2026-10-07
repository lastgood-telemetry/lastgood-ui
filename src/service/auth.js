import api from "../api";


export const loginUser = async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    return response.data.data;
}

export const resetPassword = async (id, password) => {
    const response = await api.post('/users/password/reset', { id, password })
    return response.data.data
}

export const signupUser = async ({ email, password, role, org_name, org_slug }) => {
    const response = await api.post('/signup', { email, password, role, org_name, org_slug });
    return response.data;
}

export const verifyEmail = async (token) => {
    const response = await api.post('/verify-email', { token });
    return response.data.data;
}

export const googleOAuthCallback = async (code) => {
    const response = await api.post('/auth/google/callback', { code });
    return response.data;
}

export const githubOAuthCallback = async (code) => {
    const response = await api.post('/auth/github/callback', { code });
    return response.data;
}

export const oauthSignup = async (details) => {
    const response = await api.post('/auth/oauth-signup', details);
    return response.data;
}

export const getServices = async () => {
    const response = await api.get('/organizations/services');
    return response.data.data;
}

export const deleteService = async (serviceId) => {
    const response = await api.delete(`/organizations/services/${serviceId}`);
    return response.data;
}

export const getIntegrationByProvider = async (provider) => {
    try {
        const response = await api.get(`/integrations/${provider}`);
        return response.data.data;
    } catch (err) {
        if (err.response?.status === 404) return null;
        throw err;
    }
};

export const createServiceApiKey = async (name, service) => {
    const response = await api.post('/api-keys/create', { name, service });
    return response.data.data;
}

export const sendTestEvent = async (service) => {
    const response = await api.post('/change-events/test', { service });
    return response.data.data;
}

export const updateServiceCriticality = async (serviceId, tier) => {
    const response = await api.put(`/organizations/services/${serviceId}/criticality`, { tier });
    return response.data;
}
