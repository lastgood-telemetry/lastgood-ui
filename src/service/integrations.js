import api from "../api";

export const getGithubRepos = async () => {
  const response = await api.get("/integrations/github/repos");
  return response.data.data;
};

export const saveGithubRepos = async (repos) => {
  const response = await api.post("/integrations/github/repos", { repos });
  return response.data.data;
};
