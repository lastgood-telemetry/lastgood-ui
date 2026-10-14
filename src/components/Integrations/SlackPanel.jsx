import { capture, captureOnce } from '../../util/posthog';
import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { STALE } from "../../lib/queryConfig";
import { ArrowRight, Hash, Plug, Lock, Trash2, Loader2 } from "lucide-react";
import PageContainer from "../ui/PageContainer";
import { PageHeader } from "../ui/PageHeader";
import { toast } from "../ui/Toast";
import { getSlackStatus, getSlackInstallUrl, getSlackChannels, saveSlackChannel, removeSlackChannel } from "../../service/slack";
import { SEVERITY_OPTIONS, severityLabel, parseEnvironments, slackReturnState } from "../../util/slack";

const fieldClass = "w-full bg-paper border border-white/10 rounded px-3 py-2 text-sm text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent";
const bannerTone = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warn: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  error: "border-red-500/30 bg-red-500/10 text-red-300",
};

const SlackPanel = ({ orgId, returnState }) => {
  const queryClient = useQueryClient();
  const banner = slackReturnState(returnState);
  const [channelId, setChannelId] = useState("");
  const [minSeverity, setMinSeverity] = useState("sev2");
  const [envText, setEnvText] = useState("prod");

  const { data: status, isLoading, error, refetch } = useQuery({
    queryKey: ["slack", "status", orgId],
    queryFn: getSlackStatus,
    staleTime: STALE.reference,
    enabled: !!orgId,
  });
  const connected = !!status?.connected;
  useEffect(() => { if (connected) captureOnce('slack_connected'); }, [connected]);

  const { data: slackChannels, isLoading: loadingChannels, error: channelsError } = useQuery({
    queryKey: ["slack", "channels", orgId],
    queryFn: getSlackChannels,
    staleTime: STALE.reference,
    enabled: !!orgId && connected,
    retry: false,
  });

  const install = useMutation({
    mutationFn: getSlackInstallUrl,
    onSuccess: (url) => { capture('slack_connect_clicked'); window.location.href = url; },
  });
  const save = useMutation({
    mutationFn: saveSlackChannel,
    onSuccess: () => { capture('slack_channel_saved');
      toast.success("Channel saved. Incident cards will post there.");
      setChannelId("");
      queryClient.invalidateQueries({ queryKey: ["slack", "status"] });
    },
  });
  const remove = useMutation({
    mutationFn: removeSlackChannel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["slack", "status"] }),
  });

  const configured = status?.channels || [];
  const available = (slackChannels || []).filter((c) => !configured.some((x) => x.channel_id === c.id));

  const onSave = (e) => {
    e.preventDefault();
    const picked = (slackChannels || []).find((c) => c.id === channelId);
    if (!picked) return;
    save.mutate({ channel_id: picked.id, channel_name: picked.name, min_severity: minSeverity, environments: parseEnvironments(envText) });
  };

  const pill = isLoading ? "Checking" : error ? "Unavailable" : connected ? "Connected" : "Not connected";

  return (
    <PageContainer>
      <PageHeader icon={Plug} title="Notifications" description="Send incident alerts to where your team already works." />

      {banner && <div role="status" className={`max-w-2xl mb-4 border rounded px-4 py-3 text-sm ${bannerTone[banner.tone]}`}>{banner.text}</div>}

      <section className="border border-white/10 rounded bg-surface p-6 max-w-2xl space-y-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-semibold text-white inline-flex items-center gap-2"><Hash size={16} className="text-accent" />Slack incident notifications</h2>
          <span role="status" className={`text-xs shrink-0 ${connected ? "text-accent" : "text-text-muted"}`}>{pill}</span>
        </div>

        {error ? (
          <button onClick={() => refetch()} className="text-accent text-sm underline">Retry connection status</button>
        ) : isLoading ? (
          <p className="text-sm text-text-muted inline-flex items-center gap-2"><Loader2 size={14} className="animate-spin" />Checking Slack connection</p>
        ) : !connected ? (
          <>
            <p className="text-sm text-text-secondary leading-relaxed">One card per incident, with the top suspected change and a link into Rewind. Install the LastGood app in your Slack workspace. It only posts incident cards to channels you choose. An organization admin must connect it.</p>
            <button onClick={() => install.mutate()} disabled={install.isPending} className="inline-flex items-center gap-2 bg-accent text-paper px-4 py-2 rounded text-sm font-semibold disabled:opacity-60">
              {install.isPending ? <Loader2 size={16} className="animate-spin" /> : <Hash size={16} />}Connect Slack<ArrowRight size={14} />
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-text-secondary leading-relaxed">Connected to <span className="text-white font-medium">{status.team_name || "your workspace"}</span>.</p>

            <div className="border-t border-white/10 pt-4 space-y-3">
              <h3 className="text-sm font-semibold text-white">Channels receiving incident cards</h3>
              {configured.length === 0 ? (
                <p className="text-sm text-text-muted">No channel yet. Add one below to start receiving cards.</p>
              ) : (
                <ul className="divide-y divide-white/5 border border-white/10 rounded">
                  {configured.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-sm text-white truncate">#{c.channel_name || c.channel_id}</p>
                        <p className="text-xs text-text-muted">{severityLabel(c.min_severity)} · {(c.environments || []).join(", ")}{c.enabled === false ? " · paused" : ""}</p>
                        {c.last_error && <p className="text-xs text-amber-300 mt-0.5">Last error: {c.last_error}</p>}
                      </div>
                      <button onClick={() => remove.mutate(c.id)} disabled={remove.isPending} aria-label={`Stop posting to ${c.channel_name || c.channel_id}`} className="p-2 text-text-muted hover:text-red-300 shrink-0"><Trash2 size={16} /></button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <form onSubmit={onSave} className="border-t border-white/10 pt-4 space-y-4">
              <h3 className="text-sm font-semibold text-white">Add a channel</h3>
              <label className="block text-xs text-text-muted space-y-1.5">Channel
                <select value={channelId} onChange={(e) => setChannelId(e.target.value)} disabled={loadingChannels || !!channelsError} className={fieldClass}>
                  <option value="">{loadingChannels ? "Loading channels..." : channelsError ? "Could not load channels (admin only)" : "Select a channel"}</option>
                  {available.map((c) => <option key={c.id} value={c.id}>{c.is_private ? "🔒 " : "#"}{c.name}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs text-text-muted space-y-1.5">Notify for
                  <select value={minSeverity} onChange={(e) => setMinSeverity(e.target.value)} className={fieldClass}>
                    {SEVERITY_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
                <label className="block text-xs text-text-muted space-y-1.5">Environments
                  <input value={envText} onChange={(e) => setEnvText(e.target.value)} placeholder="prod, staging" className={fieldClass} />
                </label>
              </div>
              <p className="text-xs text-text-muted flex items-start gap-1.5"><Lock size={12} className="mt-0.5 shrink-0" />For a private channel, run /invite @LastGood in Slack first, then reload this page.</p>
              <button type="submit" disabled={!channelId || save.isPending} className="inline-flex items-center gap-2 bg-accent text-paper px-4 py-2 rounded text-sm font-semibold disabled:opacity-50">
                {save.isPending && <Loader2 size={16} className="animate-spin" />}Save channel
              </button>
            </form>
          </>
        )}
        <p className="text-xs text-text-muted border-t border-white/10 pt-4">To disconnect the whole workspace, remove the LastGood app in Slack (Apps settings). Removing a channel here stops cards to that channel.</p>
      </section>
    </PageContainer>
  );
};

export default SlackPanel;
