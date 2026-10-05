import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Terminal,
  Github,
  Webhook,
  ChevronRight,
  Copy,
  CheckCircle2,
  Blocks,
  ArrowRight,
  Eye,
  EyeOff,
  ArrowLeft,
  HelpCircle,
  Cloud,
  Layers
} from "lucide-react";
import useOrgStore from "../stores/useOrgStore";
import { getAPIKeyByOrg } from "../service/api-key";
import { getIntegrationByProvider } from "../service/auth";
import { contactCS } from "../util";
import PageContainer from "../components/ui/PageContainer";
import { PageHeader } from "../components/ui/PageHeader";

const Integrations = () => {
  const { org } = useOrgStore();
  const [searchParams] = useSearchParams();
  const [selectedChannel, setSelectedChannel] = useState(() => ["github", "api"].includes(searchParams.get("channel")) ? searchParams.get("channel") : null);
  const [copiedStates, setCopiedStates] = useState({});
  const [showSecret, setShowSecret] = useState(false);

  const { data: githubIntegration } = useQuery({
    queryKey: ["integration", "github", org?.id],
    queryFn: () => getIntegrationByProvider("github"),
    enabled: !!org?.id,
  });

  const { data: apiKeys = [] } = useQuery({
    queryKey: ["apiKeys", org?.id],
    queryFn: () => getAPIKeyByOrg(org.id),
    enabled: !!org?.id,
  });

  const apiSecret = apiKeys?.key_hash || "Generate key in Settings";

  const webhookUrl = org?.id
    ? `https://api.lastgood.space/webhooks/github/${org.id}`
    : "Loading organization details...";

  const handleCopy = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedStates((prev) => ({ ...prev, [id]: true }));
      setTimeout(() => {
        setCopiedStates((prev) => ({ ...prev, [id]: false }));
      }, 2000);
    });
  };

  const isGithubActive = githubIntegration?.status === "active";

  const channels = [
    {
      id: "github",
      title: "GitHub Webhooks",
      description: "Ingest code changes, pull requests, releases, and workflow pipeline runs automatically.",
      icon: Github,
      status: isGithubActive ? "Connected" : "Recommended",
      active: true,
      category: "Code Repositories",
    },
    {
      id: "api",
      title: "Custom REST API",
      description: "Trigger change events from custom CI/CD setups, Ansible playbooks, Jenkins, or scripts.",
      icon: Terminal,
      status: "Active",
      active: true,
      category: "Developer Tools",
    },
    {
      id: "datadog",
      title: "Datadog Monitors",
      description: "Correlate infrastructure health metrics, alerts, and monitor state changes directly.",
      icon: Webhook,
      status: "Soon",
      active: false,
      category: "Monitoring & Telemetry",
    },
    {
      id: "gitlab",
      title: "GitLab Pipelines",
      description: "Track pipeline updates, deployment events, and project changes inside GitLab CI.",
      icon: Layers,
      status: "Soon",
      active: false,
      category: "Code Repositories",
    },
    {
      id: "k8s",
      title: "Kubernetes Operator",
      description: "Track deployments, pod rollout histories, config map changes, and state events.",
      icon: Blocks,
      status: "Soon",
      active: false,
      category: "Infrastructure",
    },
    {
      id: "aws",
      title: "AWS CloudTrail",
      description: "Ingest cloud audit logs and state revisions inside AWS EventBridge automatically.",
      icon: Cloud,
      status: "Soon",
      active: false,
      category: "Infrastructure",
    },
  ];

  if (selectedChannel === "github") {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in">
        <button
          onClick={() => setSelectedChannel(null)}
          className="mb-6 inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors cursor-pointer group text-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Ingestion Channels
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Github className="text-black h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-2">GitHub Webhooks</h1>
              <p className="text-text-muted text-sm">Follow these steps to connect your repository to LastGood.</p>
            </div>
          </div>
        </div>

        <section className="surface border border-accent/20 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
          <div className="p-6 bg-[#0b0f0d]/20 space-y-8 relative before:absolute before:inset-0 before:ml-10 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-white/10 before:via-white/10 before:to-transparent">

            {/* Step 1 */}
            <div className="relative flex items-start gap-6 group">
              <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 border-accent bg-background text-accent font-bold z-10 shadow-[0_0_10px_rgba(45,212,191,0.5)]">
                1
              </div>
              <div className="flex-1 p-5 rounded-xl bg-[#0b0f0d]/40 border border-white/10 shadow-lg min-w-0">
                <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">Configure Webhook</h3>
                <p className="text-text-muted text-xs mb-3 leading-relaxed">
                  Go to your GitHub repository <ArrowRight size={10} className="inline mx-1" /> Settings <ArrowRight size={10} className="inline mx-1" /> Webhooks and click <strong className="text-white">"Add webhook"</strong>.
                  Paste your unique ingestion URL and set the <strong className="text-white">Content type</strong> to <code className="bg-[#0b0f0d]/50 px-1.5 py-0.5 rounded text-xs">application/json</code>.
                </p>

                <div className="flex items-center justify-between gap-2 bg-[#0b0f0d]/60 border border-white/5 rounded-md p-1 focus-within:border-accent/50 transition-colors min-w-0">
                  <code className="px-2 text-xs text-accent font-mono truncate min-w-0 flex-1">{webhookUrl}</code>
                  <button
                    onClick={() => handleCopy('github-url', webhookUrl)}
                    className="p-1.5 hover:bg-white/10 rounded transition-colors text-text-muted hover:text-white shrink-0"
                    title="Copy URL"
                  >
                    {copiedStates['github-url'] ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative flex items-start gap-6 group">
              <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 border-white/20 bg-background text-white/50 font-bold z-10">
                2
              </div>
              <div className="flex-1 p-5 rounded-xl bg-[#0b0f0d]/40 border border-white/10 shadow-lg min-w-0">
                <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">Webhook Secret</h3>
                <p className="text-text-muted text-xs mb-3 leading-relaxed">
                  We cryptographically verify all payloads coming from GitHub using your API Key to prevent spoofing.
                </p>
                <div className="bg-status-warning/10 border border-status-warning/20 rounded-md px-3 py-2 text-xs text-status-warning mb-3 leading-relaxed">
                  Paste your <strong className="font-bold">LastGood API Key</strong> into GitHub's <strong className="font-bold">"Secret"</strong> field.
                </div>

                <div className="flex items-center justify-between gap-2 bg-[#0b0f0d]/60 border border-white/5 rounded-md p-1 focus-within:border-accent/50 transition-colors min-w-0">
                  <code className="px-2 text-xs text-accent font-mono truncate min-w-0 flex-1">
                    {showSecret ? apiSecret : "••••••••••••••••••••••••••••••••"}
                  </code>
                  <div className="flex items-center shrink-0">
                    <button
                      onClick={() => setShowSecret(!showSecret)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors text-text-muted hover:text-white"
                      title={showSecret ? "Hide Secret" : "Show Secret"}
                    >
                      {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      onClick={() => handleCopy('github-secret', apiSecret)}
                      className="p-1.5 hover:bg-white/10 rounded transition-colors text-text-muted hover:text-white"
                      title="Copy Secret"
                    >
                      {copiedStates['github-secret'] ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative flex items-start gap-6 group">
              <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-full border-2 border-white/20 bg-background text-white/50 font-bold z-10">
                3
              </div>
              <div className="flex-1 p-5 rounded-xl bg-[#0b0f0d]/40 border border-white/10 shadow-lg min-w-0">
                <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">Event Triggers</h3>
                <p className="text-text-muted text-xs mb-3 leading-relaxed">
                  Under "Which events would you like to trigger this webhook?", explicitly select <strong className="text-white">"Let me select individual events"</strong> and enable:
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/15 px-2.5 py-0.5 rounded text-[10px] text-white">Pushes</span>
                  <span className="bg-white/15 px-2.5 py-0.5 rounded text-[10px] text-white">Workflow runs</span>
                  <span className="bg-white/15 px-2.5 py-0.5 rounded text-[10px] text-white">Page builds</span>
                  <span className="bg-white/15 px-2.5 py-0.5 rounded text-[10px] text-white">Deployments</span>
                </div>
              </div>
            </div>

          </div>
        </section>
      </div>
    );
  }

  if (selectedChannel === "api") {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto animate-fade-in">
        <button
          onClick={() => setSelectedChannel(null)}
          className="mb-6 inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors cursor-pointer group text-sm"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Ingestion Channels
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shadow-lg text-white">
              <Terminal className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2">Custom REST API</h1>
              <p className="text-text-muted text-sm">Send POST payloads to report change events from custom systems.</p>
            </div>
          </div>
        </div>

        <section className="bg-[#0b0f0d]/30 border border-white/5 rounded-3xl overflow-hidden shadow-xl min-w-0">
          <div className="px-6 py-4 border-b border-white/5 bg-[#0b0f0d]/40">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              REST API Integration Payload
            </h2>
          </div>
          <div className="p-6">
            <div className="prose prose-invert max-w-none text-text-secondary text-sm mb-4 leading-relaxed">
              <p>
                To push deployment notifications or feature-flag changes from other tools, send a POST request to our Changes ingestion API.
              </p>
            </div>

            <div className="bg-[#101413] border border-white/10 rounded-xl overflow-hidden shadow-inner">
              <div className="bg-[#0b0f0d]/40 px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5 mr-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                    <div className="w-2.5 h-2.5 rounded-full bg-white/20"></div>
                  </div>
                  <span className="text-xs font-mono text-text-muted">cURL Template</span>
                </div>
                <button
                  onClick={() => handleCopy('curl', `curl -X POST https://api.lastgood.space/api/change-events \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "summary": "Deployed payment-service v2.1 for testing",
    "service": "payments",
    "environment": "prod",
    "source":"Jenkins",
    "occurred_at":"2026-04-09T10:25:26.374Z",
    "type":"deployment",
    "meta": {
      "author": "jane@example.com",
      "commit": "a1b2c3d"
    }
  }'`)}
                  className="text-text-muted hover:text-white transition-colors"
                >
                  {copiedStates['curl'] ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
                </button>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-text-secondary">
                <code className="text-blue-300">curl</code> -X POST https://api.lastgood.space/v1/change-events \<br />
                {"  "}-H <span className="text-green-300">"Authorization: Bearer YOUR_API_KEY"</span> \<br />
                {"  "}-H <span className="text-green-300">"Content-Type: application/json"</span> \<br />
                {"  "}-d <span className="text-green-300">{`'{
  "summary": "Deployed payment-service v2.1 for testing",
  "service": "payments",
  "environment": "prod",
  "source": "Jenkins",
  "occurred_at": "2026-04-09T10:25:26.374Z",
  "type": "deployment",
  "meta": {
    "author": "jane@example.com",
    "commit": "a1b2c3d"
  }
}'`}</span>
              </pre>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        icon={Blocks}
        title="Ingestion Channels"
        description="Connect sources to collect deployments and configuration changes."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <div
              key={channel.id}
              className={`bg-[#101413] border rounded-xl p-5 transition-all duration-200 flex flex-col justify-between ${channel.active
                ? "border-white/10 hover:border-white/20 cursor-pointer hover:bg-[#101413]"
                : "border-white/5 opacity-50 grayscale cursor-not-allowed"
                }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2.5 rounded-lg border ${channel.active ? "bg-white/5 border-white/10 text-white" : "bg-white/5 border-white/5 text-zinc-500"}`}>
                    <Icon size={18} />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${channel.status === "Recommended" || channel.status === "Connected"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : channel.status === "Active"
                      ? "bg-sky-500/10 border-sky-500/20 text-sky-400"
                      : "bg-white/5 border-white/5 text-zinc-500"
                    }`}>
                    {channel.status}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-semibold">{channel.category}</span>
                <h3 className="font-bold text-white text-base mt-0.5 mb-1">{channel.title}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed mb-4">{channel.description}</p>
              </div>

              {channel.active ? (
                <button type="button" onClick={() => setSelectedChannel(channel.id)} className="flex items-center gap-1.5 text-xs font-mono font-semibold text-white hover:text-sky-400 pt-2 border-t border-white/5 focus-visible:outline focus-visible:outline-2">
                  <span>Configure {channel.title}</span>
                  <ChevronRight size={14} className="text-zinc-500" />
                </button>
              ) : (
                <span className="text-[11px] font-mono text-zinc-600 pt-2 border-t border-white/5">Integration in Development</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Support Info Footer Banner */}
      <div className="mt-12 surface border border-white/5 rounded-2xl p-6 bg-gradient-to-r from-accent/5 to-transparent flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-white mb-1 text-sm flex items-center gap-1.5">
            <HelpCircle size={16} className="text-accent" />
            Need help integrating your systems?
          </h3>
          <p className="text-xs text-text-muted leading-relaxed">Reach out to our engineering team for custom connectors or onboarding configurations.</p>
        </div>
        <button onClick={contactCS} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white transition-colors shrink-0">
          Contact Engineering Support
        </button>
      </div>
    </PageContainer>
  );
};

export default Integrations;
