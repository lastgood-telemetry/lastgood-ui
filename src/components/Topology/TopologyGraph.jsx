import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Lock, Link2, Trash2, Check, X, RefreshCw } from "lucide-react";
import api from "../../api";
import { toast } from "../ui/Toast";
import {
  NODE_W, NODE_H, CRITICALITY, CRITICALITY_COLOR,
  buildViewModel, layoutGraph, edgePath, isEditable, sourceLabel,
} from "../../util/topologyGraph";

const edgeId = (e) => `${e.service}>${e.depends_on_service}`;

function SourceBadge({ source }) {
  const yaml = source === "yaml";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
        yaml ? "border-accent/40 text-accent bg-accent/10" : "border-white/10 text-text-muted"
      }`}
    >
      {yaml && <Lock size={9} />}
      {sourceLabel(source)}
    </span>
  );
}

/**
 * Topology graph builder. Nodes are services seen in change events; edges mean "A depends on B".
 * Dashed edges are suggestions (changes to B shortly before A alerted) until you confirm them.
 * Anything declared in lastgood.yml is read-only here.
 */
export default function TopologyGraph({ onChanged }) {
  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState(null); // { type: 'node'|'edge'|'suggested', id }
  const [connectFrom, setConnectFrom] = useState(null);
  const [dismissed, setDismissed] = useState([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const res = await api.get("/v1/topology/graph", { skipToast: true });
      setRaw(res.data?.data || { nodes: [], edges: [], suggested_edges: [] });
    } catch (err) {
      console.error("Failed to load topology graph:", err);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const vm = useMemo(() => buildViewModel(raw), [raw]);
  const suggested = vm.suggested.filter(s => !dismissed.includes(edgeId(s)));
  const layout = useMemo(() => layoutGraph(vm.nodes, [...vm.edges, ...suggested]), [vm, suggested]);
  const nodeByName = useMemo(() => Object.fromEntries(vm.nodes.map(n => [n.service, n])), [vm]);

  const changed = async () => { await load(); if (onChanged) onChanged(); };

  const addEdge = async (service, dependsOn, type = "hard") => {
    setBusy(true);
    try {
      await api.post("/v1/topology/dependencies", { service, dependsOnService: dependsOn, type });
      toast.success(`${service} now depends on ${dependsOn}`);
      setSelected(null);
      await changed();
    } catch (err) {
      console.error("Add edge failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const removeEdge = async (e) => {
    setBusy(true);
    try {
      await api.delete("/v1/topology/dependencies", { data: { service: e.service, dependsOnService: e.depends_on_service } });
      toast.success(`Removed ${e.service} -> ${e.depends_on_service}`);
      setSelected(null);
      await changed();
    } catch (err) {
      console.error("Remove edge failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const setCriticality = async (node, value) => {
    setBusy(true);
    try {
      await api.put(`/v1/topology/services/${encodeURIComponent(node.service)}/criticality`, { criticality: value });
      toast.success(`${node.service} criticality set to ${value}`);
      await changed();
    } catch (err) {
      console.error("Set criticality failed:", err);
    } finally {
      setBusy(false);
    }
  };

  const onNodeClick = (name) => {
    if (connectFrom && connectFrom !== name) {
      const from = connectFrom;
      setConnectFrom(null);
      addEdge(from, name);
      return;
    }
    setConnectFrom(null);
    setSelected({ type: "node", id: name });
  };

  if (loading && !raw) return <div role="status" className="p-6 text-xs text-text-muted">Loading topology graph...</div>;
  if (failed && !raw) {
    return (
      <div role="alert" className="p-6 text-xs text-text-muted">
        The topology graph could not be loaded.{" "}
        <button className="text-accent underline" onClick={load}>Retry</button>
      </div>
    );
  }
  if (!vm.nodes.length) {
    return (
      <div className="rounded-xl border border-white/10 p-6 text-xs text-text-muted">
        No services seen yet. Services appear here as soon as change events arrive, or when declared in lastgood.yml.
      </div>
    );
  }

  const selNode = selected?.type === "node" ? nodeByName[selected.id] : null;
  const selEdge = selected?.type === "edge" ? vm.edges.find(e => edgeId(e) === selected.id) : null;
  const selSug = selected?.type === "suggested" ? suggested.find(e => edgeId(e) === selected.id) : null;
  const drawEdge = (e) => {
    const p = edgePath(layout.positions, e.service, e.depends_on_service);
    return p ? { ...p, e } : null;
  };

  return (
    <section aria-label="Topology graph" className="rounded-xl border border-white/10 bg-deep/40">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b border-white/10">
        <div className="text-xs text-text-secondary">
          <span className="font-semibold text-text-primary">Dependency graph</span>
          <span className="ml-2 text-text-muted">An arrow from A to B means A depends on B. Dashed arrows are suggestions.</span>
        </div>
        <div className="flex items-center gap-2">
          {connectFrom && (
            <span className="text-[11px] text-accent font-mono">
              Click the service that {connectFrom} depends on
              <button className="ml-2 underline" onClick={() => setConnectFrom(null)}>cancel</button>
            </span>
          )}
          <button onClick={load} className="p-1.5 rounded-md text-text-muted hover:text-text-primary cursor-pointer" aria-label="Refresh graph" title="Refresh">
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      <div className="overflow-auto">
        <svg
          width="100%"
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          role="img"
          aria-label={`Service dependency graph with ${vm.nodes.length} services`}
          style={{ minWidth: Math.min(layout.width, 760), maxWidth: layout.width, height: "auto", aspectRatio: `${layout.width} / ${layout.height}` }}
        >
          <defs>
            <marker id="tg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>

          {[...vm.edges, ...suggested].map(edge => {
            const g = drawEdge(edge);
            if (!g) return null;
            const id = edgeId(edge);
            const isSug = edge.kind === "suggested";
            const isSel = selected && selected.id === id && selected.type !== "node";
            const soft = edge.dependency_type === "soft";
            return (
              <g key={`${edge.kind}-${id}`} className={isSel ? "text-accent" : isSug ? "text-text-muted" : "text-text-secondary"} style={{ cursor: "pointer" }}
                onClick={() => setSelected({ type: isSug ? "suggested" : "edge", id })}>
                <path d={g.d} fill="none" stroke="transparent" strokeWidth="14" />
                <path
                  d={g.d}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={isSel ? 2.25 : 1.5}
                  strokeDasharray={isSug ? "6 5" : soft ? "2 4" : undefined}
                  markerEnd="url(#tg-arrow)"
                  opacity={isSug ? 0.75 : 1}
                />
                {edge.source === "yaml" && (
                  <g transform={`translate(${g.mid.x - 7}, ${g.mid.y - 7})`}>
                    <circle cx="7" cy="7" r="8" className="fill-current text-deep" />
                    <Lock x="2" y="2" size={10} className="text-accent" />
                  </g>
                )}
              </g>
            );
          })}

          {vm.nodes.map(n => {
            const pos = layout.positions[n.service];
            if (!pos) return null;
            const color = CRITICALITY_COLOR[n.criticality] || CRITICALITY_COLOR.medium;
            const isSel = selected?.type === "node" && selected.id === n.service;
            const isFrom = connectFrom === n.service;
            return (
              <g key={n.service} transform={`translate(${pos.x}, ${pos.y})`} style={{ cursor: "pointer" }}
                onClick={() => onNodeClick(n.service)} role="button" aria-label={`${n.service}, criticality ${n.criticality}`}>
                <rect width={NODE_W} height={NODE_H} rx="10" className="fill-current text-deep"
                  stroke={isSel || isFrom ? "hsl(var(--accent))" : "rgba(148,163,184,0.35)"} strokeWidth={isSel || isFrom ? 2 : 1} />
                <rect width="5" height={NODE_H} rx="2.5" fill={color} />
                <text x="16" y="23" fontSize="12.5" fontWeight="600" className="fill-current text-text-primary">
                  {n.service.length > 21 ? n.service.slice(0, 20) + "…" : n.service}
                </text>
                <text x="16" y="41" fontSize="10.5" className="fill-current text-text-muted">
                  {n.criticality}{n.criticality_source === "yaml" ? " (yaml)" : ""} · {n.event_count} event{n.event_count === 1 ? "" : "s"}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="border-t border-white/10 px-4 py-3 text-xs min-h-[64px]">
        {!selected && (
          <div className="text-text-muted">
            Select a service to set its criticality or connect it. Select an edge to inspect or remove it.
            {suggested.length > 0 && ` ${suggested.length} suggested edge${suggested.length === 1 ? "" : "s"} based on changes that landed shortly before alerts.`}
          </div>
        )}

        {selNode && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-text-primary font-mono">{selNode.service}</span>
            <SourceBadge source={selNode.criticality_source || "default"} />
            <label className="flex items-center gap-2 text-text-secondary">
              Criticality
              <select
                value={selNode.criticality}
                disabled={busy || !isEditable(selNode)}
                onChange={(ev) => setCriticality(selNode, ev.target.value)}
                className="bg-transparent border border-white/15 rounded-md px-2 py-1 text-text-primary disabled:opacity-60"
                aria-label={`Criticality for ${selNode.service}`}
              >
                {CRITICALITY.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
              </select>
            </label>
            {!isEditable(selNode) && <span className="text-text-muted">Set in lastgood.yml. Change it there.</span>}
            {selNode.criticality_source === "default" && <span className="text-text-muted">Not set yet: scored as medium.</span>}
            <button
              onClick={() => setConnectFrom(selNode.service)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/15 text-text-primary hover:bg-white/5 cursor-pointer"
            >
              <Link2 size={12} /> Add dependency
            </button>
          </div>
        )}

        {selEdge && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-text-primary">{selEdge.service} → {selEdge.depends_on_service}</span>
            <span className="text-text-muted">{selEdge.dependency_type}</span>
            <SourceBadge source={selEdge.source} />
            {selEdge.readOnly ? (
              <span className="text-text-muted">Declared in lastgood.yml. Remove it there.</span>
            ) : (
              <button disabled={busy} onClick={() => removeEdge(selEdge)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/15 text-text-primary hover:bg-white/5 cursor-pointer disabled:opacity-60">
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>
        )}

        {selSug && (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-text-primary">{selSug.service} → {selSug.depends_on_service}</span>
            <SourceBadge source="suggested" />
            <span className="text-text-muted">
              {selSug.reason || `${selSug.depends_on_service} changed shortly before ${selSug.service} alerted`}
              {" "}({Math.round((selSug.confidence || 0) * 100)}% of {selSug.incidents_considered} incidents)
            </span>
            <button disabled={busy} onClick={() => addEdge(selSug.service, selSug.depends_on_service)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-mint text-paper font-semibold cursor-pointer disabled:opacity-60">
              <Check size={12} /> Confirm
            </button>
            <button onClick={() => { setDismissed(d => [...d, edgeId(selSug)]); setSelected(null); }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/15 text-text-primary hover:bg-white/5 cursor-pointer">
              <X size={12} /> Hide for now
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
