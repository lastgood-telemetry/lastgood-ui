import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Github, Terminal, ArrowRight, ArrowLeft, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { API_BASE_URL } from "../constants";
import { getOrganization } from "../service/organization";
import { getAPIKeyByOrg, createAPIKey } from "../service/api-key";
import { getGithubRepos, saveGithubRepos } from "../service/integrations";
import { toast } from "../components/ui/Toast";

const FREE_SERVICE_LIMIT = 2;

const cardClass = "w-full text-left bg-bg-surface border border-border rounded-[4px] p-5 hover:border-accent transition-colors disabled:opacity-60";
const primaryBtn = "inline-flex items-center justify-center gap-2 bg-accent text-paper px-4 py-2.5 rounded-[4px] text-sm font-semibold disabled:opacity-60";
const ghostBtn = "inline-flex items-center justify-center gap-2 border border-border px-4 py-2.5 rounded-[4px] text-sm text-text-secondary hover:text-foreground";

function ingestCurl(key) {
  return `curl -X POST ${API_BASE_URL}/api/change-events \\
  -H "Authorization: Bearer ${key || "YOUR_API_KEY"}" \\
  -H "Content-Type: application/json" \\
  -d '{"summary": "Deployed payments v2.1", "service": "payments", "environment": "prod", "type": "deployment"}'`;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(searchParams.get("github_connected") === "true" ? "repos" : "source");
  const [selected, setSelected] = useState(null); // null until repos load
  const [copied, setCopied] = useState(false);
  const [newKey, setNewKey] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem("authToken")) navigate("/login", { replace: true });
  }, [navigate]);

  const { data: org } = useQuery({ queryKey: ["organization"], queryFn: getOrganization });

  const reposQuery = useQuery({
    queryKey: ["github-repos", org?.id],
    queryFn: getGithubRepos,
    enabled: step === "repos" && !!org?.id,
    retry: 1,
  });

  const repos = reposQuery.data?.repos || [];
  const plan = reposQuery.data?.plan || org?.plan || "free";
  const maxSelectable = plan === "free" ? FREE_SERVICE_LIMIT : Infinity;

  useEffect(() => {
    if (!reposQuery.data || selected !== null) return;
    const saved = reposQuery.data.selected;
    if (Array.isArray(saved) && saved.length) setSelected(new Set(saved));
    else if (repos.length <= maxSelectable) setSelected(new Set(repos.map((r) => r.full_name)));
    else setSelected(new Set());
  }, [reposQuery.data, repos, maxSelectable, selected]);

  const saveMutation = useMutation({
    mutationFn: () => saveGithubRepos([...selected]),
    onSuccess: () => setStep("done"),
    onError: (err) => toast.error(err.response?.data?.message || "Could not save the selection"),
  });

  const keyQuery = useQuery({
    queryKey: ["api-key", org?.id],
    queryFn: () => getAPIKeyByOrg(org.id),
    enabled: step === "rest" && !!org?.id,
    retry: false,
  });

  const keyMutation = useMutation({
    mutationFn: () => createAPIKey("Onboarding ingest key"),
    onSuccess: (data) => setNewKey(data?.api_key || null),
    onError: (err) => toast.error(err.response?.data?.message || "Could not create an API key"),
  });

  const installUrl = org?.id
    ? `${API_BASE_URL}/api/integrations/github-app/install?orgId=${encodeURIComponent(org.id)}&flow=onboarding`
    : null;

  const toggleRepo = (fullName) => {
    setSelected((prev) => {
      const next = new Set(prev || []);
      if (next.has(fullName)) next.delete(fullName);
      else if (next.size < maxSelectable) next.add(fullName);
      return next;
    });
  };

  const allSelected = repos.length > 0 && selected && repos.filter((r) => selected.has(r.full_name)).length >= Math.min(repos.length, maxSelectable);
  const toggleAll = () => {
    if (!repos.length) return;
    if (selected && [...selected].length >= Math.min(repos.length, maxSelectable)) setSelected(new Set());
    else setSelected(new Set(repos.slice(0, maxSelectable).map((r) => r.full_name)));
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-bg-primary text-foreground flex items-start justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-xl">
        <p className="font-mono uppercase tracking-[0.12em] text-[12px] text-accent mb-3">03 / Connect a source</p>
        <h1 className="text-[28px] leading-tight tracking-[-0.03em] font-semibold">Workspace ready. Now send it some changes.</h1>

        {step === "source" && (
          <div className="mt-8 space-y-4">
            <p className="text-[14px] text-muted-foreground">LastGood learns what changed from your tools. Connect the first source - you can add more later.</p>
            <a href={installUrl || "#"} className={`${cardClass} flex items-center gap-4`} aria-disabled={!installUrl}>
              <Github size={28} className="shrink-0" />
              <span className="min-w-0">
                <span className="block font-semibold text-[15px]">GitHub App <span className="ml-2 text-[11px] font-mono uppercase tracking-wide text-accent">Recommended</span></span>
                <span className="block text-[13px] text-muted-foreground mt-1">Deploys, pushes and workflow runs stream in automatically. Pick the repos to watch next.</span>
              </span>
              <ArrowRight size={16} className="ml-auto shrink-0 text-text-muted" />
            </a>
            <button onClick={() => setStep("rest")} className={`${cardClass} flex items-center gap-4`}>
              <Terminal size={28} className="shrink-0" />
              <span className="min-w-0">
                <span className="block font-semibold text-[15px]">REST API</span>
                <span className="block text-[13px] text-muted-foreground mt-1">One POST from any CI job, Jenkins, or script. Works with everything else.</span>
              </span>
              <ArrowRight size={16} className="ml-auto shrink-0 text-text-muted" />
            </button>
            <button onClick={() => navigate("/rewind")} className="text-[13px] text-text-muted hover:text-foreground underline underline-offset-4">Skip for now</button>
          </div>
        )}

        {step === "repos" && (
          <div className="mt-8 space-y-4">
            <p className="text-[14px] text-muted-foreground">GitHub App connected. Pick the repositories to ingest - we will pull their last 30 days of history and stream new changes.</p>
            {plan === "free" && (
              <p className="text-[13px] border border-amber-500/30 bg-amber-500/10 rounded-[4px] p-3 text-amber-200">Free plan includes up to {FREE_SERVICE_LIMIT} services, so you can pick {FREE_SERVICE_LIMIT} repositories for now.</p>
            )}
            {reposQuery.isLoading && <div className="flex items-center gap-2 text-text-muted text-sm py-8 justify-center"><Loader2 size={16} className="animate-spin" /> Loading repositories from GitHub...</div>}
            {reposQuery.isError && (
              <div className="space-y-3">
                <p className="text-[13px] text-red-300">{reposQuery.error?.response?.data?.message || "Could not load repositories from GitHub."}</p>
                <button onClick={() => reposQuery.refetch()} className={ghostBtn}>Retry</button>
              </div>
            )}
            {reposQuery.isSuccess && selected !== null && (
              <div className="bg-bg-surface border border-border rounded-[4px]">
                <label className="flex items-center gap-3 px-4 py-3 border-b border-border cursor-pointer">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-[#7EF0C4] h-4 w-4" />
                  <span className="text-[14px] font-medium">Select all ({Math.min(repos.length, maxSelectable)} of {repos.length})</span>
                </label>
                <div className="max-h-72 overflow-y-auto">
                  {repos.map((r) => {
                    const checked = selected.has(r.full_name);
                    const disabled = !checked && selected.size >= maxSelectable;
                    return (
                      <label key={r.full_name} className={`flex items-center gap-3 px-4 py-2.5 border-b border-border/50 last:border-0 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                        <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggleRepo(r.full_name)} className="accent-[#7EF0C4] h-4 w-4" />
                        <span className="font-mono text-[13px] truncate">{r.full_name}</span>
                        {r.private && <span className="ml-auto text-[11px] font-mono uppercase text-text-muted border border-border rounded px-1.5 py-0.5">Private</span>}
                      </label>
                    );
                  })}
                  {repos.length === 0 && <p className="px-4 py-6 text-[13px] text-text-muted">No repositories on this installation. Grant the app access to at least one repo on GitHub, then retry.</p>}
                </div>
              </div>
            )}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setStep("source")} className={ghostBtn}><ArrowLeft size={14} /> Back</button>
              <button onClick={() => saveMutation.mutate()} disabled={!selected || selected.size === 0 || saveMutation.isPending} className={primaryBtn}>
                {saveMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null}
                Ingest {selected ? selected.size : 0} {selected && selected.size === 1 ? "repository" : "repositories"} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        )}

        {step === "rest" && (
          <div className="mt-8 space-y-4">
            <p className="text-[14px] text-muted-foreground">Send change events from anywhere with one POST. Create an ingest key, then add the call to your CI job.</p>
            {keyQuery.isLoading && <div className="flex items-center gap-2 text-text-muted text-sm py-4"><Loader2 size={16} className="animate-spin" /> Checking for an existing key...</div>}
            {keyQuery.isSuccess && !keyQuery.data && !newKey && (
              <button onClick={() => keyMutation.mutate()} disabled={keyMutation.isPending} className={primaryBtn}>
                {keyMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : null} Generate ingest key
              </button>
            )}
            {(newKey || keyQuery.data) && (
              <div className="bg-bg-surface border border-border rounded-[4px]">
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
                  <span className="text-xs font-mono text-text-muted">cURL</span>
                  <button onClick={() => copy(ingestCurl(newKey))} className="text-text-muted hover:text-white transition-colors">
                    {copied ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
                  </button>
                </div>
                <pre className="p-4 overflow-x-auto text-xs font-mono text-text-secondary whitespace-pre">{ingestCurl(newKey)}</pre>
              </div>
            )}
            {newKey && <p className="text-[13px] text-amber-200">This key is shown once. Store it somewhere safe.</p>}
            {!newKey && keyQuery.data && <p className="text-[13px] text-muted-foreground">You already have an ingest key - use it in place of YOUR_API_KEY (manage keys under Integrations).</p>}
            <div className="flex items-center gap-3 pt-2">
              <button onClick={() => setStep("source")} className={ghostBtn}><ArrowLeft size={14} /> Back</button>
              <button onClick={() => navigate("/rewind")} className={primaryBtn}>Go to console <ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="mt-8 space-y-4">
            <p className="text-[14px] text-muted-foreground">Ingestion started. We are pulling the last 30 days of history for {selected ? selected.size : 0} {selected && selected.size === 1 ? "repository" : "repositories"} - events start appearing within a few minutes, and every new deploy, push and workflow run streams in from now on.</p>
            <button onClick={() => navigate("/rewind")} className={primaryBtn}>Open Rewind <ArrowRight size={14} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
