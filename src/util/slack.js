export const SEVERITY_OPTIONS = [
  { value: "sev1", label: "SEV1 only" },
  { value: "sev2", label: "SEV2 and above" },
  { value: "sev3", label: "SEV3 and above" },
  { value: "sev4", label: "All severities" },
];

export const severityLabel = (value) => SEVERITY_OPTIONS.find((o) => o.value === value)?.label || value;

// "prod, staging" -> ["prod","staging"]; empty falls back to prod (server default).
export const parseEnvironments = (text) => {
  const list = String(text || "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return list.length ? [...new Set(list)] : ["prod"];
};

// Result of the OAuth round trip: /integrations?slack=connected|denied|error
export const slackReturnState = (value) => {
  if (value === "connected") return { tone: "success", text: "Slack connected. Pick the channel for incident cards below." };
  if (value === "denied") return { tone: "warn", text: "Slack install was cancelled. Nothing was connected." };
  if (value === "error") return { tone: "error", text: "Slack could not finish connecting. Try again, and contact support if it keeps failing." };
  return null;
};
