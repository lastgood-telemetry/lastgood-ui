import { suspectedWording, utcTimestamp, evidenceEventId, isSuggestedOwner, postmortemDraft, resolveReportEvidence } from '../util/console';
import { Link } from 'react-router-dom';
import { toast } from '../components/ui/Toast';
import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { STALE, queryKeys } from "../lib/queryConfig";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getServices } from "../service/auth";
import { FileText, Plus, Sparkles, Copy, Check, Trash2, Server, ArrowRight, ChevronDown, ExternalLink } from "lucide-react";
import { DateTimePicker } from "../components/EventFilters/DateTimePicker";
import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";

export default function Postmortems() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: postmortemsData, isLoading: loading } = useQuery({
    queryKey: queryKeys.postmortems,
    queryFn: async () => {
      const res = await api.get("/v1/postmortem");
      if (!res.data?.success) throw new Error("Failed to load postmortems");
      return res.data.data || [];
    },
    staleTime: STALE.moderate,
  });
  const postmortems = postmortemsData || [];
  const { data: servicesData, isLoading: servicesLoading, isError: servicesError, refetch: fetchUserServices } = useQuery({
    queryKey: queryKeys.services,
    queryFn: getServices,
    staleTime: STALE.reference,
  });
  const userServices = Array.isArray(servicesData) ? servicesData : [];
  const [generating, setGenerating] = useState(false);
  const [selectedPostmortem, setSelectedPostmortem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [evidenceEvents, setEvidenceEvents] = useState([]);
  const [evidenceStatus, setEvidenceStatus] = useState("idle");
  const [ownerDrafts, setOwnerDrafts] = useState({});
  const [ownersReviewed, setOwnersReviewed] = useState(false);
  useEffect(() => {
    setOwnerDrafts({});
    const items = selectedPostmortem?.action_items_json || [];
    setOwnersReviewed(items.length > 0 && items.every(i => i.owner_reviewed === true && !isSuggestedOwner(i.owner)));
  }, [selectedPostmortem?.id]);
  const [savingOwners, setSavingOwners] = useState(false);
  const ownerDirty = Object.keys(ownerDrafts).length > 0 || ownersReviewed !== ((selectedPostmortem?.action_items_json || []).length > 0 && (selectedPostmortem?.action_items_json || []).every(i => i.owner_reviewed === true && !isSuggestedOwner(i.owner)));
  const selectReport = (p) => {
    if (p.id !== selectedPostmortem?.id && ownerDirty && !window.confirm("You have unsaved owner changes on this report. Discard them?")) return;
    setSelectedPostmortem(p);
  };
  const saveOwners = async () => {
    if (!selectedPostmortem) return;
    const items = selectedPostmortem.action_items_json || [];
    const owners = items.map((item, idx) => (ownerDrafts[idx] ?? (isSuggestedOwner(item.owner) ? '' : item.owner)).trim());
    try {
      setSavingOwners(true);
      const res = await api.patch(`/v1/postmortem/${selectedPostmortem.id}/owners`, { owners, reviewed: ownersReviewed });
      if (res.data?.success) {
        const saved = res.data.data;
        setOwnerDrafts({});
        setSelectedPostmortem(saved);
        queryClient.setQueryData(queryKeys.postmortems, (old) => (old || []).map((p) => (p.id === saved.id ? saved : p)));
        toast.success("Action owners saved to the report");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Could not save owners. Your edits are still here.");
    } finally {
      setSavingOwners(false);
    }
  };
  useEffect(() => {
    let active = true;
    setEvidenceEvents([]);
    const timeline = selectedPostmortem?.timeline_json || [];
    // New reports store event ids on the timeline; only older reports need the lookup.
    const unlinked = timeline.filter(row => !evidenceEventId(row));
    const times = unlinked.map(row => new Date(row.timestamp).getTime()).filter(Number.isFinite);
    if (!times.length) { setEvidenceStatus('idle'); return; }
    setEvidenceStatus('loading');
    api.get('/change-events', { params: { limit: 500, offset: 0, from_date: new Date(Math.min(...times)).toISOString(), to_date: new Date(Math.max(...times)).toISOString() } }).then(res => {
      if (!active) return;
      if (!res.data.success) throw new Error('Evidence unavailable');
      setEvidenceEvents(res.data.data || []);
      setEvidenceStatus(res.data.pagination?.total > 500 ? 'partial' : 'ready');
    }).catch(() => { if (active) setEvidenceStatus('error'); });
    return () => { active = false; };
  }, [selectedPostmortem?.id]);
  const resolvedTimeline = useMemo(() => resolveReportEvidence(selectedPostmortem?.timeline_json || [], evidenceEvents), [selectedPostmortem, evidenceEvents]);
  const reviewedMarkdown = useMemo(() => postmortemDraft(selectedPostmortem ? { ...selectedPostmortem, timeline_json: resolvedTimeline } : null, ownerDrafts, ownersReviewed), [selectedPostmortem, resolvedTimeline, ownerDrafts, ownersReviewed]);
  const actionItems = selectedPostmortem?.action_items_json || [];
  const allOwnersAssigned = actionItems.every((item, idx) => (ownerDrafts[idx] ?? (isSuggestedOwner(item.owner) ? '' : item.owner)).trim());

  // Form State for generating new postmortem
  const [service, setService] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  // Once the user types their own title, changing the service must not overwrite it.
  const [titleEdited, setTitleEdited] = useState(false);
  const [severity, setSeverity] = useState("CRITICAL");
  const [timeWindow, setTimeWindow] = useState("30m");
  const [incidentTimestamp, setIncidentTimestamp] = useState(
    new Date(Date.now() - 30 * 60 * 1000).toISOString().substring(0, 16)
  );

  const fetchPostmortems = () => queryClient.invalidateQueries({ queryKey: queryKeys.postmortems });

  // Select the newest postmortem once the list is available.
  useEffect(() => {
    if (!selectedPostmortem && postmortems.length > 0) setSelectedPostmortem(postmortems[0]);
  }, [postmortems, selectedPostmortem]);

  // Default the generate form to the first service once the list is available.
  useEffect(() => {
    if (service || userServices.length === 0) return;
    const firstSvc = userServices[0].service_name || userServices[0].name || userServices[0].service || "";
    setService(firstSvc);
    setIncidentTitle(`Production Outage: ${firstSvc}`);
  }, [userServices, service]);

  const handleServiceChange = (e) => {
    const selectedSvc = e.target.value;
    setService(selectedSvc);
    if (!titleEdited) setIncidentTitle(`Production Outage: ${selectedSvc}`);
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!service) {
      toast.error("Please select a target service from your ingested services");
      return;
    }

    try {
      setGenerating(true);
      const res = await api.post("/v1/postmortem/generate", {
        service,
        incidentTitle: incidentTitle || `Production Outage: ${service}`,
        severity,
        // The picker value is a UTC wall-clock string ("YYYY-MM-DDTHH:mm", labelled UTC). Parse it as UTC;
        // new Date(value) would read it as local time and shift the incident by the user's UTC offset.
        incidentTimestamp: new Date(`${incidentTimestamp}:00Z`).toISOString(),
        window: timeWindow,
      });

      if (res.data?.success) {
        toast.success("Automated SRE Postmortem generated successfully!");
        fetchPostmortems();
        setSelectedPostmortem(res.data.data);
      }
    } catch (err) {
      console.error("Postmortem generation error:", err);
      // The global interceptor hides 404s, and "no events in window" comes back as a 404.
      if (err.response?.status === 404) toast.error(err.response?.data?.error || "No events found in that window. Widen the window or move the incident time.");
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this postmortem?")) return;
    try {
      await api.delete(`/v1/postmortem/${id}`);
      toast.success("Postmortem deleted");
      // Drop it from the cache right away so the default-selection effect can't re-pick it.
      queryClient.setQueryData(queryKeys.postmortems, (old) => (old || []).filter((p) => p.id !== id));
      fetchPostmortems();
      if (selectedPostmortem?.id === id) {
        setSelectedPostmortem(null);
      }
    } catch (err) {
      console.error("Delete postmortem error:", err);
    }
  };

  const handleCopyMarkdown = () => {
    if (!reviewedMarkdown) return;
    navigator.clipboard.writeText(reviewedMarkdown).then(() => {
      setCopied(true);
      toast.success("Reviewed draft copied. The stored report is unchanged.");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => toast.error("Could not copy. Select the draft text below to copy it manually."));
  };

  const SEVERITIES = ["CRITICAL", "HIGH", "MEDIUM"];
  const WINDOWS = [["15m", "15m"], ["30m", "30m"], ["1h", "1h"], ["2h", "2h"], ["6h", "6h"], ["1d", "24h"]];
  const sevColor = (s) => `var(--tg-crit-${String(s || "medium").toLowerCase()}, var(--tg-crit-medium))`;
  const SeverityTag = ({ value }) => (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-semibold tracking-wide" style={{ color: sevColor(value) }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: sevColor(value) }} />{value}
    </span>
  );
  const [formOpen, setFormOpen] = useState(() => typeof window === "undefined" || window.innerWidth >= 1024);
  const savedOwnerValue = (item) => (isSuggestedOwner(item.owner) ? "" : item.owner);
  const evidenceNote = evidenceStatus === "loading" ? "Resolving source evidence..." : evidenceStatus === "error" ? "Source lookup failed. Unlinked rows remain unverified." : evidenceStatus === "partial" ? "Source lookup was capped. Some rows may be unlinked." : "";

  return (
    <PageContainer>
      <PageHeader
        icon={FileText}
        title="Postmortems"
        description="Draft incident summaries. Review suspected contributors, evidence and action owners before sharing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[340px_minmax(0,1fr)] gap-6 items-start">
        {/* Left: generator + history */}
        <div className="space-y-4 lg:sticky lg:top-4">
          <section className="bg-paper border border-white/10 rounded-xl">
            <button type="button" onClick={() => setFormOpen(o => !o)} aria-expanded={formOpen} className="w-full flex items-center justify-between px-4 py-3 text-left">
              <span className="flex items-center gap-2 text-sm font-semibold text-white"><Sparkles size={14} className="text-accent" />New postmortem</span>
              <ChevronDown size={16} className={`text-text-muted transition-transform ${formOpen ? "rotate-180" : ""}`} />
            </button>
            {formOpen && (
              <div className="px-4 pb-4 border-t border-white/10 pt-4">
                {servicesLoading ? <div role="status" className="py-4 text-xs text-text-muted">Loading services...</div> : servicesError ? <div role="alert" className="py-4 text-xs text-text-muted">Services could not be loaded. <button className="text-accent underline" onClick={() => fetchUserServices()}>Retry</button></div> : userServices.length === 0 ? (
                  <div className="py-2 text-center space-y-3">
                    <Server size={26} className="mx-auto text-text-muted opacity-60" />
                    <p className="text-xs text-text-muted leading-relaxed">No services ingested yet. Ingest change events via GitHub or the REST API to generate postmortems.</p>
                    <button onClick={() => navigate("/integrations")} className="py-2 px-3 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 text-xs font-semibold flex items-center justify-center gap-1.5 w-full">
                      <span>Set up first integration</span><ArrowRight size={13} />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleGenerate} className="space-y-4">
                    <label className="block text-[11px] font-medium text-text-secondary">Service
                      <div className="relative mt-1.5">
                        <select value={service} onChange={handleServiceChange} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent appearance-none cursor-pointer">
                          {userServices.map((svc, idx) => {
                            const name = svc.service_name || svc.name || svc.service || `service-${idx}`;
                            return <option key={svc.id || name} value={name} className="bg-zinc-900 text-white">{name} {svc.criticality_tier ? `(${svc.criticality_tier})` : ""}</option>;
                          })}
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-2.5 text-text-muted pointer-events-none" />
                      </div>
                    </label>
                    <label className="block text-[11px] font-medium text-text-secondary">Incident title
                      <input type="text" value={incidentTitle} onChange={(e) => { setIncidentTitle(e.target.value); setTitleEdited(true); }} required placeholder="What broke, in one line" className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent" />
                      <span className="block mt-1 text-[10px] text-text-muted">{titleEdited ? "Custom title. Changing the service will not overwrite it." : "Follows the selected service until you edit it."}</span>
                    </label>
                    <fieldset>
                      <legend className="text-[11px] font-medium text-text-secondary mb-1.5">Severity</legend>
                      <div className="grid grid-cols-3 gap-1.5" role="radiogroup" aria-label="Severity">
                        {SEVERITIES.map(s => (
                          <button key={s} type="button" role="radio" aria-checked={severity === s} onClick={() => setSeverity(s)}
                            className={`py-1.5 rounded-lg border text-[10px] font-mono font-semibold transition-colors ${severity === s ? "bg-white/10 border-white/30 text-white" : "border-white/10 text-text-muted hover:text-white"}`}>
                            <span className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle" style={{ background: sevColor(s) }} />{s}
                          </button>
                        ))}
                      </div>
                    </fieldset>
                    <div>
                      <div className="text-[11px] font-medium text-text-secondary mb-1.5">Incident time (UTC)</div>
                      <DateTimePicker value={incidentTimestamp} onChange={setIncidentTimestamp} label="Select Incident Time" />
                    </div>
                    <fieldset>
                      <legend className="text-[11px] font-medium text-text-secondary mb-1.5">Look back</legend>
                      <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Look-back window">
                        {WINDOWS.map(([v, label]) => (
                          <button key={v} type="button" role="radio" aria-checked={timeWindow === v} onClick={() => setTimeWindow(v)}
                            className={`px-2.5 py-1 rounded-full border text-[11px] transition-colors ${timeWindow === v ? "bg-accent/15 border-accent/50 text-accent" : "border-white/10 text-text-muted hover:text-white"}`}>{label}</button>
                        ))}
                      </div>
                    </fieldset>
                    <button type="submit" disabled={generating} className="w-full py-2.5 rounded-lg bg-accent text-paper font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition disabled:opacity-60">
                      {generating ? <><Sparkles size={14} className="animate-spin" /><span>Analyzing changes...</span></> : <><Plus size={14} /><span>Generate postmortem</span></>}
                    </button>
                  </form>
                )}
              </div>
            )}
          </section>

          <section className="bg-paper border border-white/10 rounded-xl p-2">
            <h3 className="px-2 pt-2 pb-1 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Past postmortems</h3>
            {loading ? (
              <div className="py-6 text-center text-xs text-text-muted">Loading postmortems...</div>
            ) : postmortems.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-muted">No postmortems yet.</div>
            ) : (
              <ul className="max-h-80 overflow-y-auto custom-scrollbar">
                {postmortems.map((p) => {
                  const isSelected = selectedPostmortem?.id === p.id;
                  return (
                    <li key={p.id} className={`group flex items-center gap-1 rounded-lg border-l-2 ${isSelected ? "bg-white/5" : "hover:bg-white/5"}`} style={{ borderColor: isSelected ? sevColor(p.severity) : "transparent" }}>
                      <button type="button" onClick={() => selectReport(p)} aria-current={isSelected ? "true" : undefined} className="flex-1 min-w-0 text-left px-3 py-2">
                        <div className={`text-xs font-medium truncate ${isSelected ? "text-white" : "text-text-secondary"}`}>{p.title}</div>
                        <div className="mt-1 flex items-center gap-2 text-[10px] text-text-muted">
                          <SeverityTag value={p.severity} />
                          {p.service && <span className="font-mono truncate">{p.service}</span>}
                          <span>{new Date(p.incident_at).toLocaleDateString()}</span>
                        </div>
                      </button>
                      <button type="button" onClick={() => handleDelete(p.id)} className="p-2 mr-1 text-text-muted hover:text-red-400 opacity-60 group-hover:opacity-100 focus:opacity-100" title="Delete postmortem" aria-label={`Delete ${p.title}`}><Trash2 size={13} /></button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </div>

        {/* Right: report */}
        <div className="min-w-0">
          {selectedPostmortem ? (
            <article className="bg-paper border border-white/10 rounded-xl overflow-hidden">
              <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 p-5 border-b border-white/10">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-white leading-snug break-words">{suspectedWording(selectedPostmortem.title)}</h2>
                  <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-muted">
                    {selectedPostmortem.service && <span>Service <span className="font-mono text-white">{selectedPostmortem.service}</span></span>}
                    {selectedPostmortem.severity && <SeverityTag value={selectedPostmortem.severity} />}
                    <span>{utcTimestamp(selectedPostmortem.incident_at)}</span>
                  </div>
                </div>
                <button onClick={handleCopyMarkdown} className="shrink-0 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white flex items-center gap-2">
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "Copied" : "Copy Markdown"}</span>
                </button>
              </header>

              <div className="p-5 space-y-7">
                <section>
                  <div className="rounded-lg bg-white/[0.03] border border-white/10 border-l-2 p-4 space-y-2" style={{ borderLeftColor: sevColor(selectedPostmortem.severity) }}>
                    <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">Summary</h3>
                    <p className="text-sm text-white leading-relaxed">{suspectedWording(selectedPostmortem.executive_summary)}</p>
                    <p className="text-xs text-text-secondary">Suspected contributor: <span className="font-mono text-white">{suspectedWording(selectedPostmortem.primary_cause_headline)}</span></p>
                  </div>
                  <p className="mt-2 text-[11px] text-text-muted">
                    AI-generated draft. Correlation is not proof of causation; verify against source events before sharing. {evidenceNote && <span>{evidenceNote} </span>}
                    <Link to="/events" className="text-accent hover:underline inline-flex items-center gap-1">Browse change events <ExternalLink size={10} /></Link>
                  </p>
                </section>

                <section>
                  <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Preventive action items</h3>
                  <ul className="divide-y divide-white/10 border border-white/10 rounded-lg">
                    {actionItems.map((item, idx) => {
                      const value = ownerDrafts[idx] ?? savedOwnerValue(item);
                      const changed = ownerDrafts[idx] !== undefined && ownerDrafts[idx] !== savedOwnerValue(item);
                      return (
                        <li key={idx} className="p-3 grid gap-2 md:grid-cols-[auto_minmax(0,1fr)_220px] md:items-center">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/15 text-accent font-mono justify-self-start">{item.priority}</span>
                          <p className="text-xs text-white leading-relaxed">{item.title}</p>
                          <label className="block text-[10px] text-text-muted">
                            <span className="flex items-center justify-between mb-1">Owner{changed ? <span className="text-amber-400">unsaved</span> : value ? <span className="text-emerald-400">saved</span> : <span>unassigned</span>}</span>
                            <input aria-label={`Action owner ${idx + 1}`} className="w-full rounded-md bg-deep/40 border border-white/15 px-2 py-1.5 text-white text-xs focus:outline-none focus:border-accent" placeholder="Assign a person" value={value} onChange={e => { setOwnerDrafts(prev => ({ ...prev, [idx]: e.target.value })); setOwnersReviewed(false); }} />
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-xs text-text-secondary">
                      <input type="checkbox" checked={ownersReviewed} disabled={!allOwnersAssigned} onChange={e => setOwnersReviewed(e.target.checked)} />
                      I have reviewed these owners{!allOwnersAssigned && " (assign every owner first)"}
                    </label>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-text-muted">{ownerDirty ? "Unsaved changes" : "All changes saved"}</span>
                      <button type="button" onClick={saveOwners} disabled={!ownerDirty || savingOwners} className="px-3 py-1.5 rounded-lg bg-accent text-paper text-xs font-semibold disabled:opacity-40">{savingOwners ? "Saving..." : "Save owners"}</button>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">Timeline</h3>
                  <ol className="relative border-l border-white/15 ml-1.5 space-y-4">
                    {resolvedTimeline.map((t, idx) => {
                      const suspect = t.impact_level === "PRIMARY_CULPRIT";
                      return (
                        <li key={idx} className="pl-4 relative">
                          <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full" style={{ background: suspect ? sevColor("CRITICAL") : "var(--tg-crit-medium)" }} />
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="font-mono text-[10px] text-text-muted">{utcTimestamp(t.timestamp)}</span>
                            {suspect && <span className="text-[10px] font-semibold" style={{ color: sevColor("CRITICAL") }}>Suspected contributor</span>}
                          </div>
                          <p className="text-xs text-white mt-0.5 break-words">{suspectedWording(t.summary)}</p>
                          {evidenceEventId(t) ? <Link className="text-[11px] text-accent hover:underline" to={`/events/${encodeURIComponent(evidenceEventId(t))}`}>Inspect source event</Link> : <span className="text-[10px] text-text-muted">Source event not linked by the report</span>}
                        </li>
                      );
                    })}
                  </ol>
                </section>

                <details className="group">
                  <summary className="cursor-pointer text-[11px] font-semibold text-text-muted uppercase tracking-wider select-none">Markdown draft (with your owners)</summary>
                  <pre className="mt-2 p-4 rounded-lg bg-deep/60 border border-white/10 text-text-secondary text-[11px] font-mono whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">{reviewedMarkdown}</pre>
                </details>
              </div>
            </article>
          ) : (
            <div className="bg-paper border border-white/10 rounded-xl p-12 text-center text-text-muted space-y-3">
              <FileText size={32} className="mx-auto" />
              <p className="text-sm">Select a postmortem or generate a new one.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
