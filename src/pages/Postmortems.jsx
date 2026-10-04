import { suspectedWording, utcTimestamp, evidenceEventId, isSuggestedOwner, postmortemDraft, resolveReportEvidence } from '../util/console';
import { Link } from 'react-router-dom';
import { toast } from '../components/ui/Toast';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getServices } from "../service/auth";
import { FileText, Plus, Sparkles, Copy, Check, Trash2, ShieldAlert, Server, ArrowRight, Layers } from "lucide-react";
import { DateTimePicker } from "../components/EventFilters/DateTimePicker";
import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";

export default function Postmortems() {
  const navigate = useNavigate();
  const [postmortems, setPostmortems] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selectedPostmortem, setSelectedPostmortem] = useState(null);
  const [copied, setCopied] = useState(false);
  const [evidenceEvents, setEvidenceEvents] = useState([]);
  const [evidenceStatus, setEvidenceStatus] = useState("idle");
  const [ownerDrafts, setOwnerDrafts] = useState({});
  const [ownersReviewed, setOwnersReviewed] = useState(false);
  useEffect(() => { setOwnerDrafts({}); setOwnersReviewed(false); }, [selectedPostmortem?.id]);
  useEffect(() => {
    let active = true;
    setEvidenceEvents([]);
    const timeline = selectedPostmortem?.timeline_json || [];
    const times = timeline.map(row => new Date(row.timestamp).getTime()).filter(Number.isFinite);
    if (!times.length) { setEvidenceStatus('idle'); return; }
    setEvidenceStatus('loading');
    api.get('/change-events', { params: { limit: 1000, offset: 0, from_date: new Date(Math.min(...times)).toISOString(), to_date: new Date(Math.max(...times)).toISOString() } }).then(res => {
      if (!active) return;
      if (!res.data.success) throw new Error('Evidence unavailable');
      setEvidenceEvents(res.data.data || []);
      setEvidenceStatus(res.data.pagination?.total > 1000 ? 'partial' : 'ready');
    }).catch(() => { if (active) setEvidenceStatus('error'); });
    return () => { active = false; };
  }, [selectedPostmortem?.id]);
  const resolvedTimeline = resolveReportEvidence(selectedPostmortem?.timeline_json || [], evidenceEvents);
  const reviewedMarkdown = postmortemDraft(selectedPostmortem ? { ...selectedPostmortem, timeline_json: resolvedTimeline } : null, ownerDrafts, ownersReviewed);
  const actionItems = selectedPostmortem?.action_items_json || [];
  const allOwnersAssigned = actionItems.every((item, idx) => (ownerDrafts[idx] ?? (isSuggestedOwner(item.owner) ? '' : item.owner)).trim());

  // Form State for generating new postmortem
  const [service, setService] = useState("");
  const [incidentTitle, setIncidentTitle] = useState("");
  const [severity, setSeverity] = useState("CRITICAL");
  const [timeWindow, setTimeWindow] = useState("30m");
  const [incidentTimestamp, setIncidentTimestamp] = useState(
    new Date(Date.now() - 30 * 60 * 1000).toISOString().substring(0, 16)
  );

  useEffect(() => {
    fetchPostmortems();
    fetchUserServices();
  }, []);

  const fetchUserServices = async () => {
    setServicesLoading(true);
    setServicesError(false);
    try {
      const servicesData = await getServices();
      const list = Array.isArray(servicesData) ? servicesData : [];
      setUserServices(list);

      if (list.length > 0) {
        const firstSvc = list[0].service_name || list[0].name || list[0].service || "";
        setService(firstSvc);
        setIncidentTitle(`Production Outage: ${firstSvc}`);
      } else {
        setService("");
        setIncidentTitle("");
      }
    } catch (err) {
      setServicesError(true);
      console.error("Failed to fetch services:", err);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchPostmortems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v1/postmortem");
      if (res.data?.success) {
        setPostmortems(res.data.data || []);
        if (res.data.data.length > 0 && !selectedPostmortem) {
          setSelectedPostmortem(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to fetch postmortems:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleServiceChange = (e) => {
    const selectedSvc = e.target.value;
    setService(selectedSvc);
    setIncidentTitle(`Production Outage: ${selectedSvc}`);
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
        incidentTimestamp: new Date(incidentTimestamp).toISOString(),
        window: timeWindow,
      });

      if (res.data?.success) {
        toast.success("Automated SRE Postmortem generated successfully!");
        fetchPostmortems();
        setSelectedPostmortem(res.data.data);
      }
    } catch (err) {
      console.error("Postmortem generation error:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this postmortem?")) return;
    try {
      await api.delete(`/v1/postmortem/${id}`);
      toast.success("Postmortem deleted");
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

  return (
    <PageContainer>
      <PageHeader
        category="RELIABILITY & COMPLIANCE"
        icon={FileText}
        title="SRE Incident Postmortems"
        description="Draft incident summaries from change events. Review suspected contributors, supporting evidence and action owners before sharing."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Generator Form & History */}
        <div className="space-y-6 lg:col-span-1">
          {/* Generator Form */}
          <div className="bg-[#0c0c0e] border border-white/10 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-white font-mono font-semibold text-xs uppercase tracking-wider">
              <Sparkles size={15} className="text-zinc-300" />
              <span>Generate New SRE Postmortem</span>
            </div>

            {servicesLoading ? <div role="status" className="p-6 text-xs text-text-muted">Loading services...</div> : servicesError ? <div role="alert" className="p-6 text-xs text-text-muted">Services could not be loaded. <button className="text-accent underline" onClick={fetchUserServices}>Retry services</button></div> : userServices.length === 0 ? (
              /* Empty State for Generator */
              <div className="p-5 rounded-xl bg-white/5 border border-white/10 text-center space-y-3">
                <Server size={28} className="mx-auto text-text-muted opacity-60" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white">No Services Ingested Yet</h4>
                  <p className="text-[11px] text-text-muted leading-relaxed">
                    Ingest your change events via GitHub or the custom REST API to select a target service and generate 1-click postmortems.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/integrations")}
                  className="py-2 px-3 rounded-lg bg-accent/10 hover:bg-accent/20 text-accent border border-accent/30 text-xs font-semibold flex items-center justify-center gap-1.5 w-full transition-all"
                >
                  <span>Set Up First Integration</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerate} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary flex items-center justify-between mb-1.5">
                    <span>Target Ingested Service</span>
                    <span className="text-[10px] text-accent font-mono">
                      {userServices.length} Active
                    </span>
                  </label>
                  <div className="relative">
                    <select
                      value={service}
                      onChange={handleServiceChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent appearance-none cursor-pointer"
                    >
                      {userServices.map((svc, idx) => {
                        const name = svc.service_name || svc.name || svc.service || `service-${idx}`;
                        return (
                          <option key={svc.id || name} value={name} className="bg-zinc-900 text-white">
                            {name} {svc.criticality_tier ? `(${svc.criticality_tier})` : ''}
                          </option>
                        );
                      })}
                    </select>
                    <Server size={14} className="absolute right-3 top-2.5 text-text-muted pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Incident Title</label>
                  <input
                    type="text"
                    value={incidentTitle}
                    onChange={(e) => setIncidentTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                    placeholder="e.g. Production Outage: Service Migration Failure"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">Severity</label>
                    <select
                      value={severity}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                    >
                      <option value="CRITICAL" className="bg-zinc-900">CRITICAL</option>
                      <option value="HIGH" className="bg-zinc-900">HIGH</option>
                      <option value="MEDIUM" className="bg-zinc-900">MEDIUM</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-text-secondary block mb-1.5">Incident Time</label>
                    <DateTimePicker
                      value={incidentTimestamp}
                      onChange={setIncidentTimestamp}
                      label="Select Incident Time"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Incident Window</label>
                  <select
                    value={timeWindow}
                    onChange={(e) => setTimeWindow(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                  >
                    <option value="15m" className="bg-zinc-900">15 Minutes</option>
                    <option value="30m" className="bg-zinc-900">30 Minutes</option>
                    <option value="1h" className="bg-zinc-900">1 Hour</option>
                    <option value="2h" className="bg-zinc-900">2 Hours</option>
                    <option value="6h" className="bg-zinc-900">6 Hours</option>
                    <option value="1d" className="bg-zinc-900">24 Hours</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={generating}
                  className="w-full py-2.5 px-4 rounded-xl bg-accent text-white font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <Sparkles size={14} className="animate-spin" />
                      <span>Analyzing Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={14} />
                      <span>Generate Postmortem Report</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* History List */}
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
            <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Past Postmortems</h3>

            {loading ? (
              <div className="py-6 text-center text-xs text-text-muted">Loading postmortems...</div>
            ) : postmortems.length === 0 ? (
              <div className="py-6 text-center text-xs text-text-muted">No postmortems generated yet.</div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
                {postmortems.map((p) => {
                  const isSelected = selectedPostmortem?.id === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPostmortem(p)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${isSelected
                          ? "bg-accent/10 border-accent/40 text-white"
                          : "bg-white/5 border-white/5 text-text-secondary hover:border-white/20 hover:text-white"
                        }`}
                    >
                      <div className="space-y-1 min-w-0 pr-2">
                        <div className="text-xs font-semibold truncate">{p.title}</div>
                        <div className="flex items-center gap-2 text-[10px] text-text-muted">
                          <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono">{p.severity}</span>
                          <span>{new Date(p.incident_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(p.id);
                        }}
                        className="text-text-muted hover:text-red-400 transition-colors p-1"
                        title="Delete Postmortem"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Postmortem Viewer */}
        <div className="lg:col-span-2 space-y-6">
          {selectedPostmortem ? (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
              {/* Report Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">{suspectedWording(selectedPostmortem.title)}</h2>
                  <p className="text-xs text-text-muted">
                    Incident Date: {new Date(selectedPostmortem.incident_at).toUTCString()}
                  </p>
                </div>
                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-xs font-medium text-white flex items-center gap-2 transition-all"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? "Copied Markdown" : "Copy Markdown"}</span>
                </button>
              </div>

              {/* Executive Summary Card */}
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-semibold text-red-400">
                  <ShieldAlert size={16} />
                  <span>Executive Summary</span>
                </div>
                <p>{suspectedWording(selectedPostmortem.executive_summary)}</p>
                <div className="pt-1 text-[11px] font-mono text-red-300">
                  Suspected contributor: "{suspectedWording(selectedPostmortem.primary_cause_headline)}"
                </div>
              </div>

              <div className="p-4 border border-amber-500/25 rounded-xl text-xs text-text-secondary space-y-2">
                <p>AI-generated draft. Correlation is not proof of causation. Inspect source events and verify the suspected contributor before sharing.</p>
                <p>{evidenceStatus === 'loading' ? 'Resolving source evidence...' : evidenceStatus === 'error' ? 'Source lookup failed. Unlinked rows remain unverified.' : evidenceStatus === 'partial' ? 'Only the first 1,000 events in this report window were checked.' : 'Links use explicit IDs or a unique exact timestamp, service, event type and summary match.'}</p>
                <Link to="/events" className="text-accent underline">Browse supporting change events</Link>
              </div>
              {/* Action Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Preventative SRE Action Items</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {(selectedPostmortem.action_items_json || []).map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-accent/20 text-accent font-mono">
                          {item.priority}
                        </span>
                        <span className="text-[10px] text-text-muted">{ownersReviewed ? "Owner reviewed" : "Review required"}</span>
                      </div>
                      <p className="text-xs text-white font-medium">{item.title}</p>
                      <label className="block text-[11px] text-text-muted pt-2">Action owner
                        <input aria-label={`Action owner ${idx + 1}`} className="mt-1 w-full rounded-lg bg-black/40 border border-white/15 p-2 text-white text-xs" placeholder="Assign a real person" value={ownerDrafts[idx] ?? (isSuggestedOwner(item.owner) ? '' : item.owner)} onChange={e => { setOwnerDrafts(prev => ({ ...prev, [idx]: e.target.value })); setOwnersReviewed(false); }} />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-xs text-text-secondary space-y-2">
                <p>Owner edits apply to this local draft and its Markdown export only. They are not saved to the stored report and reset when you switch reports or reload.</p>
                <label className="flex items-center gap-2"><input type="checkbox" checked={ownersReviewed} disabled={!allOwnersAssigned} onChange={e => setOwnersReviewed(e.target.checked)} /> I have reviewed these action owners{!allOwnersAssigned && ' (assign every owner first)'}</label>
              </div>
              {/* Timeline List */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Chronological Incident Timeline</h3>
                <div className="border border-white/10 rounded-xl overflow-hidden divide-y divide-white/5">
                  {resolvedTimeline.map((t, idx) => (
                    <div key={idx} className="p-3 bg-black/20 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[10px] text-text-muted">
                          {utcTimestamp(t.timestamp)}
                        </span>
                        <div className="space-y-1"><span className="font-semibold text-white">{suspectedWording(t.summary)}</span>
                        {evidenceEventId(t) ? <Link className="text-accent underline block" to={`/events/${encodeURIComponent(evidenceEventId(t))}`}>Inspect source event</Link> : <span className="text-text-muted block text-[10px]">Source event not linked by the report</span>}</div>
                      </div>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${t.impact_level === "PRIMARY_CULPRIT"
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : "bg-white/10 text-text-secondary"
                          }`}
                      >
                        {suspectedWording(t.impact_level)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Markdown Raw Preview Box */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Reviewed Markdown Draft</h3>
                <pre className="p-4 rounded-xl bg-black/60 border border-white/10 text-text-secondary text-[11px] font-mono whitespace-pre-wrap max-h-64 overflow-y-auto custom-scrollbar">
                  {reviewedMarkdown}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-12 text-center text-text-muted space-y-3">
              <FileText size={32} className="mx-auto text-text-muted" />
              <p className="text-sm">Select a postmortem from the left or generate a new report.</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
