import api from "../api";

// Slack incident notifications. All calls need an org admin except status.
export const getSlackStatus = async () => {
    const response = await api.get('/integrations/slack/status');
    return response.data.data;
};

export const getSlackInstallUrl = async () => {
    const response = await api.get('/integrations/slack/install');
    return response.data.data.url;
};

export const getSlackChannels = async () => {
    const response = await api.get('/integrations/slack/channels');
    return response.data.data;
};

export const saveSlackChannel = async ({ channel_id, channel_name, min_severity, environments }) => {
    const response = await api.put('/integrations/slack/channel', { channel_id, channel_name, min_severity, environments });
    return response.data.data;
};

export const removeSlackChannel = async (id) => {
    const response = await api.delete(`/integrations/slack/channel/${id}`);
    return response.data.data;
};
