import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Copy, Check, FileCode2, RefreshCw, X, Eye, Play } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { STALE, queryKeys } from "../../lib/queryConfig";
import api from "../../api";
import { toast } from "../ui/Toast";
import { summarizePlan, planHasChanges, errorMessage } from "../../util/topologyYaml";

const TONE = {
  add: "text-accent",
  change: "text-text-secondary",
  remove: "text-rose-400",
  note: "text-text-muted",
};

/** Current topology as an editable lastgood.yml. Copy it, or edit, preview (dry run) and apply. */
export default function YamlPanel({ onClose, onApplied }) {
  const [original, setOriginal] = useState("");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [plan, setPlan] = useState(null);
  const [previewedText, setPreviewedText] = useState(null);
  const [error, setError] = useState("");
  const taRef = useRef(null);

  const queryClient = useQueryClient();
  const { data: yamlData, isPending: loading, error: yamlError, refetch } = useQuery({
    queryKey: queryKeys.topologyConfig,
    queryFn: async () => {
      const res = await api.get("/v1/topology/config");
      return res.data?.data?.yaml ?? "";
    },
    staleTime: STALE.reference,
  });
  const loadError = yamlError ? errorMessage(yamlError, "Could not load lastgood.yml") : "";
  const load = () => refetch();

  // Sync the editor from the cache, but never overwrite unsaved edits.
  useEffect(() => {
    if (yamlData === undefined) return;
    setOriginal(yamlData);
    setText((current) => (current === original ? yamlData : current));
    if (text === original) { setPlan(null); setPreviewedText(null); setError(""); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yamlData]);

  const dirty = text !== original;
  const previewFresh = plan !== null && previewedText === text;
  const rows = useMemo(() => summarizePlan(plan), [plan]);

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        taRef.current?.select();
        document.execCommand("copy");
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed. Select the text and copy it manually.");
    }
  };

  const preview = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await api.post("/v1/topology/config", { yaml: text, dry_run: true });
      setPlan(res.data?.data || {});
      setPreviewedText(text);
    } catch (err) {
      setPlan(null);
      setError(errorMessage(err, "Could not preview this config"));
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    setBusy(true);
    setError("");
    try {
      await api.post("/v1/topology/config", { yaml: text });
      toast.success("lastgood.yml applied");
      await queryClient.invalidateQueries({ queryKey: queryKeys.topologyConfig });
      const fresh = queryClient.getQueryData(queryKeys.topologyConfig);
      if (typeof fresh === "string") { setOriginal(fresh); setText(fresh); }
      setPlan(null);
      setPreviewedText(null);
      if (onApplied) onApplied();
    } catch (err) {
      setError(errorMessage(err, "Could not apply this config"));
    } finally {
      setBusy(false);
    }
  };

  const btn = "inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <aside
      aria-label="lastgood.yml"
      className="rounded-2xl border border-white/10 bg-deep/40 flex flex-col overflow-hidden"
      style={{ minHeight: 540 }}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2 min-w-0">
          <FileCode2 size={14} className="text-accent shrink-0" />
          <span className="text-sm font-semibold text-white truncate">lastgood.yml</span>
          {dirty && <span className="text-[10px] px-1.5 py-0.5 rounded-full border border-white/10 text-text-muted">edited</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <button className={btn} onClick={copy} disabled={loading || !!loadError} aria-label="Copy YAML">
            {copied ? <Check size={12} className="text-accent" /> : <Copy size={12} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button className="text-text-muted hover:text-white transition-colors p-1" onClick={onClose} aria-label="Close YAML panel">
            <X size={14} />
          </button>
        </div>
      </div>

      {loading ? (
        <div role="status" className="flex-1 flex items-center justify-center gap-2 text-xs text-text-muted p-6">
          <RefreshCw size={14} className="animate-spin text-accent" /> Rendering current topology...
        </div>
      ) : loadError ? (
        <div role="alert" className="flex-1 flex items-center justify-center text-xs text-text-muted p-6 text-center">
          <span>{loadError}.{" "}<button className="text-accent underline" onClick={load}>Retry</button></span>
        </div>
      ) : (
        <>
          <textarea
            ref={taRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
            aria-label="lastgood.yml contents"
            className="flex-1 w-full resize-none bg-transparent text-xs font-mono leading-relaxed text-text-primary px-4 py-3 focus:outline-none"
            style={{ minHeight: 260, tabSize: 2 }}
          />

          {error && (
            <div role="alert" className="mx-4 mb-3 text-xs rounded-lg px-3 py-2 border border-rose-500/30 bg-rose-500/10 text-rose-400 font-mono break-words">
              {error}
            </div>
          )}

          {plan !== null && (
            <div className="mx-4 mb-3 rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-xs space-y-1.5" aria-label="Preview of changes">
              <div className="font-semibold text-white">
                {previewFresh ? "Preview" : "Preview (out of date, edit again to re-run)"}
                {!planHasChanges(plan) && <span className="font-normal text-text-muted"> - nothing would change</span>}
              </div>
              {rows.map((r) => (
                <div key={r.key}>
                  <div className={`${TONE[r.tone]} font-semibold`}>{r.label} ({r.items.length})</div>
                  <ul className="text-text-muted font-mono pl-3">
                    {r.items.slice(0, 8).map((it) => <li key={it} className="truncate">{it}</li>)}
                    {r.items.length > 8 && <li>+{r.items.length - 8} more</li>}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-white/10">
            <button className={btn} onClick={preview} disabled={busy || !text.trim()}>
              <Eye size={12} /> Preview changes
            </button>
            <button
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-accent text-paper hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={apply}
              disabled={busy || !previewFresh || !planHasChanges(plan)}
              title={previewFresh ? "Apply this config" : "Preview first"}
            >
              <Play size={12} /> Apply
            </button>
            {dirty && (
              <button className="text-xs text-text-muted hover:text-white underline ml-auto" onClick={() => { setText(original); setPlan(null); setError(""); }}>
                Reset
              </button>
            )}
          </div>
          <p className="px-4 pb-3 text-[10px] leading-snug text-text-muted">
            Applying makes everything in this file yaml-managed. Links and criticality set in the console are never overwritten or deleted by it.
          </p>
        </>
      )}
    </aside>
  );
}
