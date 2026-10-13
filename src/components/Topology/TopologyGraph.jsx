import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Panel,
  Handle,
  Position,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Server,
  Link2,
  Trash2,
  Check,
  X,
  RefreshCw,
  Plus,
  Lock,
  ChevronDown,
  Activity,
  AlertTriangle,
  Shield,
  Zap,
} from "lucide-react";
import api from "../../api";
import { toast } from "../ui/Toast";

/* ─── Constants ────────────────────────────────────────────────── */
const CRITICALITY_CONFIG = {
  critical: {
    color: "var(--tg-crit-critical)",
    hex: "#f43f5e",
    bg: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.4)",
    icon: AlertTriangle,
    label: "Critical",
  },
  high: {
    color: "var(--tg-crit-high)",
    hex: "#fb923c",
    bg: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.4)",
    icon: Zap,
    label: "High",
  },
  medium: {
    color: "var(--tg-crit-medium)",
    hex: "#94a3b8",
    bg: "rgb(var(--ink) / 0.12)",
    border: "rgb(var(--ink) / 0.3)",
    icon: Activity,
    label: "Medium",
  },
  low: {
    color: "var(--tg-crit-low)",
    hex: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: Shield,
    label: "Low",
  },
};

/* ─── Custom Service Node ───────────────────────────────────────── */
function ServiceNode({ data, selected }) {
  const cfg = CRITICALITY_CONFIG[data.criticality] || CRITICALITY_CONFIG.medium;
  const CritIcon = cfg.icon;

  return (
    <div
      className="relative group"
      style={{
        width: 220,
        background: selected
          ? "rgb(var(--deep) / 0.98)"
          : "rgb(var(--deep) / 0.92)",
        border: `1.5px solid ${selected ? "hsl(var(--accent))" : cfg.border}`,
        borderRadius: 14,
        boxShadow: selected
          ? `0 0 0 3px hsl(var(--accent)/0.2), 0 8px 32px var(--tg-shadow)`
          : "0 4px 20px var(--tg-shadow)",
        backdropFilter: "blur(12px)",
        overflow: "hidden",
        transition: "border-color 0.15s, box-shadow 0.15s",
        cursor: "pointer",
      }}
    >
      {/* criticality accent bar */}
      <div
        style={{
          height: 3,
          background: `linear-gradient(90deg, ${cfg.color}, transparent)`,
          opacity: 0.9,
        }}
      />

      <div style={{ padding: "12px 14px 14px" }}>
        {/* header row */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <div
              style={{
                background: cfg.bg,
                border: `1px solid ${cfg.border}`,
                borderRadius: 8,
                padding: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Server size={13} color={cfg.color} />
            </div>
            <div className="min-w-0">
              <div
                className="font-mono font-bold text-white text-[12px] leading-tight truncate"
                title={data.label}
                style={{ maxWidth: 130 }}
              >
                {data.label}
              </div>
            </div>
          </div>
          {data.source === "yaml" && (
            <Lock size={10} color="hsl(var(--accent))" />
          )}
        </div>

        {/* criticality + event stats */}
        <div className="flex items-center justify-between gap-2">
          <div
            className="flex items-center gap-1"
            style={{
              background: cfg.bg,
              border: `1px solid ${cfg.border}`,
              borderRadius: 6,
              padding: "3px 7px",
            }}
          >
            <CritIcon size={9} color={cfg.color} />
            <span
              className="text-[10px] font-semibold font-mono"
              style={{ color: cfg.color }}
            >
              {cfg.label}
            </span>
          </div>
          {data.event_count > 0 && (
            <span
              className="text-[10px] font-mono"
              style={{ color: "rgb(var(--t-muted))" }}
            >
              {data.event_count} event{data.event_count !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>

      {/* connection handles */}
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: "hsl(var(--accent))",
          border: "2px solid rgb(var(--deep) / 0.9)",
          width: 10,
          height: 10,
          left: -5,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: "hsl(var(--accent))",
          border: "2px solid rgb(var(--deep) / 0.9)",
          width: 10,
          height: 10,
          right: -5,
        }}
      />
    </div>
  );
}

/* ─── Custom Edge with delete button ───────────────────────────── */
function DependencyEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isSoft = data?.dependency_type === "soft";
  const isYaml = data?.source === "yaml";
  const isSuggested = data?.kind === "suggested";

  const edgeColor = isSuggested
    ? "rgb(var(--t-muted))"
    : selected
    ? "hsl(var(--accent))"
    : isSoft
    ? "var(--tg-amber)"
    : "rgb(var(--t-muted))";

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: edgeColor,
          strokeWidth: selected ? 2 : 1.5,
          strokeDasharray: isSuggested ? "6 4" : isSoft ? "2 3" : undefined,
          filter: selected
            ? `drop-shadow(0 0 4px hsl(var(--accent)/0.5))`
            : undefined,
          transition: "stroke 0.15s, stroke-width 0.15s",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          {/* type badge always visible */}
          <div
            className="flex items-center gap-1"
            style={{
              background: "rgb(var(--deep) / 0.92)",
              border: `1px solid ${
                isSuggested
                  ? "rgb(var(--ink) / 0.3)"
                  : isSoft
                  ? "rgba(251,191,36,0.3)"
                  : "rgb(var(--ink) / 0.3)"
              }`,
              borderRadius: 20,
              padding: "2px 7px",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            {isYaml && <Lock size={8} color="hsl(var(--accent))" />}
            <span
              className="text-[9px] font-mono font-semibold"
              style={{
                color: isSuggested
                  ? "rgb(var(--t-muted))"
                  : isSoft
                  ? "var(--tg-amber)"
                  : "rgb(var(--t-muted))",
              }}
            >
              {isSuggested ? "suggested" : isSoft ? "soft" : "hard"}
            </span>
            {/* delete button on selected non-readonly edges */}
            {selected && !isYaml && !isSuggested && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  data?.onDelete?.();
                }}
                className="ml-1 rounded-full bg-red-500/20 hover:bg-red-500/40 text-red-400 transition-colors"
                style={{ padding: "1px 4px", lineHeight: 1 }}
                title="Remove this dependency"
              >
                <Trash2 size={9} />
              </button>
            )}
            {/* confirm/dismiss for suggested */}
            {selected && isSuggested && (
              <div className="flex gap-1 ml-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    data?.onConfirm?.();
                  }}
                  className="rounded-full bg-mint/20 hover:bg-mint/40 text-mint transition-colors"
                  style={{ padding: "1px 4px", lineHeight: 1 }}
                  title="Confirm suggestion"
                >
                  <Check size={9} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    data?.onDismiss?.();
                  }}
                  className="rounded-full bg-white/10 hover:bg-white/20 text-text-muted transition-colors"
                  style={{ padding: "1px 4px", lineHeight: 1 }}
                  title="Dismiss suggestion"
                >
                  <X size={9} />
                </button>
              </div>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

/* ─── Node types / Edge types registry ─────────────────────────── */
const nodeTypes = { service: ServiceNode };
const edgeTypes = { dependency: DependencyEdge };

/* ─── Layout helper: hierarchical left-to-right ────────────────── */
function computeLayout(nodes, edges) {
  if (!nodes.length) return {};
  const names = nodes.map((n) => n.service);
  const level = {};
  names.forEach((n) => (level[n] = 0));
  const valid = edges.filter(
    (e) => names.includes(e.service) && names.includes(e.depends_on_service) && e.service !== e.depends_on_service
  );
  const connected = new Set();
  valid.forEach((e) => {
    connected.add(e.service);
    connected.add(e.depends_on_service);
  });
  for (let i = 0; i < names.length; i++) {
    let changed = false;
    for (const e of valid) {
      const next = level[e.service] + 1;
      if (level[e.depends_on_service] < next && next < names.length) {
        level[e.depends_on_service] = next;
        changed = true;
      }
    }
    if (!changed) break;
  }
  const NODE_W = 240;
  const NODE_H = 90;
  const COL_GAP = 100;
  const ROW_GAP = 28;
  const PAD_X = 60;
  const PAD_Y = 60;

  const cols = {};
  const maxLevel = Math.max(0, ...names.filter((n) => connected.has(n)).map((n) => level[n]));
  names.filter((n) => connected.has(n)).forEach((n) => {
    const col = level[n];
    if (!cols[col]) cols[col] = [];
    cols[col].push(n);
  });
  const loose = names.filter((n) => !connected.has(n));
  if (loose.length) {
    const col = connected.size ? maxLevel + 1 : 0;
    cols[col] = loose;
  }
  const positions = {};
  Object.entries(cols).forEach(([ci, col]) => {
    const colArr = [...col].sort((a, b) => a.localeCompare(b));
    colArr.forEach((name, ri) => {
      positions[name] = {
        x: PAD_X + Number(ci) * (NODE_W + COL_GAP),
        y: PAD_Y + ri * (NODE_H + ROW_GAP),
      };
    });
  });
  return positions;
}

/* ─── Add Dependency Panel ──────────────────────────────────────── */
function AddDependencyPanel({ services, onAdd, onClose }) {
  const [from, setFrom] = useState(services[0] || "");
  const [to, setTo] = useState(services[1] || services[0] || "");
  const [type, setType] = useState("hard");
  const [adding, setAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!from || !to) return toast.error("Select both services");
    if (from === to) return toast.error("A service cannot depend on itself");
    setAdding(true);
    try {
      await api.post("/v1/topology/dependencies", {
        service: from,
        dependsOnService: to,
        type,
      });
      toast.success(`${from} → ${to} dependency added`);
      onAdd();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      style={{
        background: "rgb(var(--deep) / 0.97)",
        border: "1.5px solid rgb(var(--ink) / 0.22)",
        borderRadius: 16,
        padding: 20,
        width: 280,
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 60px var(--tg-shadow)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Plus size={14} color="hsl(var(--accent))" />
          <span className="text-sm font-semibold text-white">Add dependency</span>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
            Dependent service
          </label>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="w-full text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-accent appearance-none"
            style={{
              background: "rgb(var(--ink) / 0.05)",
              border: "1px solid rgb(var(--ink) / 0.22)",
            }}
          >
            {services.map((s) => (
              <option key={s} value={s} className="bg-zinc-950">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-center">
          <div
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono"
            style={{ background: "rgb(var(--ink) / 0.04)", color: "rgb(var(--t-muted))" }}
          >
            <span>depends on</span>
            <ChevronDown size={10} />
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
            Upstream service
          </label>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="w-full text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-accent appearance-none"
            style={{
              background: "rgb(var(--ink) / 0.05)",
              border: "1px solid rgb(var(--ink) / 0.22)",
            }}
          >
            {services.map((s) => (
              <option key={s} value={s} className="bg-zinc-950">
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-1.5">
            Type
          </label>
          <div className="flex gap-2">
            {["hard", "soft"].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className="flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all"
                style={{
                  background:
                    type === t
                      ? t === "hard"
                        ? "rgba(244,63,94,0.2)"
                        : "rgba(251,191,36,0.2)"
                      : "rgb(var(--ink) / 0.04)",
                  border: `1px solid ${
                    type === t
                      ? t === "hard"
                        ? "rgba(244,63,94,0.4)"
                        : "rgba(251,191,36,0.4)"
                      : "rgb(var(--ink) / 0.15)"
                  }`,
                  color:
                    type === t
                      ? t === "hard"
                        ? "var(--tg-red)"
                        : "var(--tg-amber)"
                      : "rgb(var(--t-muted))",
                }}
              >
                {t === "hard" ? "Hard" : "Soft"}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-text-muted mt-1.5">
            {type === "hard"
              ? "Outage cascades to dependents"
              : "Service degrades but stays up"}
          </p>
        </div>

        <button
          type="submit"
          disabled={adding || from === to}
          className="w-full py-2 rounded-lg text-xs font-bold text-paper transition-all disabled:opacity-50"
          style={{ background: "hsl(var(--accent))" }}
        >
          {adding ? "Adding…" : "Link services"}
        </button>
      </form>
    </div>
  );
}

/* ─── Node inspector panel ──────────────────────────────────────── */
function NodeInspector({ node, onClose, onSetCriticality, onStartConnect, busy }) {
  const cfg = CRITICALITY_CONFIG[node.data.criticality] || CRITICALITY_CONFIG.medium;
  const CRITICALITY_KEYS = ["critical", "high", "medium", "low"];

  return (
    <div
      style={{
        background: "rgb(var(--deep) / 0.97)",
        border: "1.5px solid rgb(var(--ink) / 0.22)",
        borderRadius: 16,
        padding: 20,
        width: 280,
        backdropFilter: "blur(20px)",
        boxShadow: "0 20px 60px var(--tg-shadow)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: cfg.color }}
          />
          <span
            className="text-sm font-bold text-white font-mono truncate"
            title={node.data.label}
          >
            {node.data.label}
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-white transition-colors shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-semibold text-text-muted uppercase tracking-wider block mb-2">
            Criticality
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {CRITICALITY_KEYS.map((c) => {
              const cc = CRITICALITY_CONFIG[c];
              const active = node.data.criticality === c;
              return (
                <button
                  key={c}
                  onClick={() => onSetCriticality(node, c)}
                  disabled={busy || node.data.criticality_source === "yaml"}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-50"
                  style={{
                    background: active ? cc.bg : "rgb(var(--ink) / 0.03)",
                    border: `1px solid ${active ? cc.border : "rgb(var(--ink) / 0.15)"}`,
                    color: active ? cc.color : "rgb(var(--t-muted))",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: cc.color }}
                  />
                  {cc.label}
                </button>
              );
            })}
          </div>
          {node.data.criticality_source === "yaml" && (
            <p className="text-[10px] text-text-muted mt-1.5 flex items-center gap-1">
              <Lock size={9} /> Set in lastgood.yml — change it there
            </p>
          )}
        </div>

        <div className="pt-1 border-t border-white/10">
          <button
            onClick={() => { onStartConnect(node.id); onClose(); }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold text-white transition-all"
            style={{
              background: "rgb(var(--ink) / 0.06)",
              border: "1px solid rgb(var(--ink) / 0.22)",
            }}
          >
            <Link2 size={13} color="hsl(var(--accent))" />
            Add dependency from this service
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Inner flow component (needs ReactFlowProvider context) ────── */
function TopologyFlow({ rawData, onChanged, services }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [dismissed, setDismissed] = useState(new Set());
  const [busy, setBusy] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAddPanel, setShowAddPanel] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState(null);
  const { fitView } = useReactFlow();
  // Keep fitView in a ref so it never appears in effect deps
  const fitViewRef = useRef(fitView);
  useEffect(() => { fitViewRef.current = fitView; });

  // ── Stable callbacks: accept data as args, NOT from `edges` closure ──
  // This is critical to prevent the infinite update loop.
  // If these depended on `edges`, the useEffect below would re-run every
  // time edges changed (which it triggers), creating an infinite cycle.

  const removeEdge = useCallback(async (service, dependsOn) => {
    setBusy(true);
    try {
      await api.delete("/v1/topology/dependencies", {
        data: { service, dependsOnService: dependsOn },
      });
      toast.success(`Removed ${service} → ${dependsOn}`);
      onChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }, [onChanged]); // ✓ stable — no `edges` dep

  const confirmSuggested = useCallback(async (service, dependsOn) => {
    setBusy(true);
    try {
      await api.post("/v1/topology/dependencies", {
        service,
        dependsOnService: dependsOn,
        type: "hard",
      });
      toast.success(`Confirmed: ${service} → ${dependsOn}`);
      onChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }, [onChanged]); // ✓ stable — no `edges` dep

  const dismissSuggested = useCallback((edgeId) => {
    setDismissed((prev) => new Set([...prev, edgeId]));
  }, []); // ✓ stable — uses functional setState, no deps

  const setCriticality = useCallback(async (node, criticality) => {
    setBusy(true);
    try {
      await api.put(`/v1/topology/services/${encodeURIComponent(node.data.service)}/criticality`, { criticality });
      toast.success(`${node.data.service} → ${criticality}`);
      onChanged();
    } catch (err) {
      console.error(err);
    } finally {
      setBusy(false);
    }
  }, [onChanged]);

  // Rebuild nodes/edges whenever rawData or dismissed changes.
  // Callbacks are intentionally NOT in deps — they are stable and
  // were previously causing the infinite update loop.
  useEffect(() => {
    if (!rawData) return;

    const { nodes: rawNodes, edges: rawEdges, suggested_edges } = rawData;
    const allEdges = [
      ...rawEdges.map((e) => ({ ...e, kind: "confirmed" })),
      ...suggested_edges
        .filter((s) => !dismissed.has(`${s.service}>${s.depends_on_service}`))
        .map((s) => ({ ...s, kind: "suggested", dependency_type: "hard", source: "suggested" })),
    ];

    const positions = computeLayout(rawNodes, allEdges);

    const newNodes = rawNodes.map((n) => ({
      id: n.service,
      type: "service",
      position: positions[n.service] || { x: 0, y: 0 },
      data: {
        label: n.service,
        service: n.service,
        criticality: n.criticality || "medium",
        criticality_source: n.criticality_source || "default",
        event_count: n.event_count || 0,
        source: n.criticality_source,
      },
    }));

    const newEdges = allEdges.map((e) => {
      const eid = `${e.service}>${e.depends_on_service}`;
      const svc = e.service;
      const dep = e.depends_on_service;
      return {
        id: eid,
        source: svc,
        target: dep,
        type: "dependency",
        animated: e.kind === "suggested",
        markerEnd: {
          type: "arrowclosed",
          color:
            e.kind === "suggested"
              ? "rgb(var(--t-muted))"
              : e.dependency_type === "soft"
              ? "var(--tg-amber)"
              : "rgb(var(--t-muted))",
          width: 16,
          height: 16,
        },
        data: {
          service: svc,
          depends_on_service: dep,
          dependency_type: e.dependency_type,
          source: e.source,
          kind: e.kind,
          // Pass plain values; the edge component calls these with no extra lookup
          onDelete: () => removeEdge(svc, dep),
          onConfirm: () => confirmSuggested(svc, dep),
          onDismiss: () => dismissSuggested(eid),
        },
      };
    });

    setNodes(newNodes);
    setEdges(newEdges);

    // Fit view after a tick so the new layout is painted first
    setTimeout(() => fitViewRef.current?.({ padding: 0.15, duration: 400 }), 80);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawData, dismissed]); // ← callbacks intentionally omitted: they are stable

  // Handle drag-to-connect (connecting from handle)
  const onConnect = useCallback(
    async (connection) => {
      if (!connection.source || !connection.target || connection.source === connection.target) return;
      setBusy(true);
      try {
        await api.post("/v1/topology/dependencies", {
          service: connection.source,
          dependsOnService: connection.target,
          type: "hard",
        });
        toast.success(`${connection.source} → ${connection.target} linked`);
        onChanged();
      } catch (err) {
        console.error(err);
      } finally {
        setBusy(false);
      }
    },
    [onChanged]
  );

  const onNodeClick = useCallback((_, node) => {
    if (connectingFrom) {
      if (connectingFrom !== node.id) {
        onConnect({ source: connectingFrom, target: node.id });
      }
      setConnectingFrom(null);
      return;
    }
    setSelectedNode((prev) => (prev?.id === node.id ? null : node));
  }, [connectingFrom, onConnect]);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setConnectingFrom(null);
  }, []);

  const suggestedCount = edges.filter((e) => e.data?.kind === "suggested").length;

  return (
    <div className="relative" style={{ height: 540, borderRadius: 16, overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.2}
        maxZoom={3}
        proOptions={{ hideAttribution: true }}
        style={{
          background: "rgb(var(--deep))",
        }}
      >
        {/* Dot grid background */}
        <Background
          variant="dots"
          gap={24}
          size={1}
          color="rgb(var(--ink) / 0.12)"
        />

        {/* Minimap */}
        <MiniMap
          nodeColor={(node) => {
            const cfg = CRITICALITY_CONFIG[node.data?.criticality];
            return cfg ? cfg.hex + "88" : "#94a3b8";
          }}
          style={{
            background: "rgb(var(--deep) / 0.9)",
            border: "1px solid rgb(var(--ink) / 0.15)",
            borderRadius: 10,
          }}
          maskColor="rgb(var(--deep) / 0.6)"
        />

        {/* Built-in zoom controls */}
        <Controls
          position="top-left"
          style={{
            background: "rgb(var(--deep) / 0.9)",
            border: "1px solid rgb(var(--ink) / 0.18)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        />

        {/* Top-right panel: Add button + badges */}
        <Panel position="top-right">
          <div className="flex items-center gap-2">
            {suggestedCount > 0 && (
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold font-mono"
                style={{
                  background: "rgba(251,191,36,0.1)",
                  border: "1px solid rgba(251,191,36,0.25)",
                  color: "var(--tg-amber)",
                }}
              >
                <Activity size={11} />
                {suggestedCount} suggested
              </div>
            )}
            {connectingFrom && (
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-mono font-semibold"
                style={{
                  background: "rgba(182,237,206,0.1)",
                  border: "1px solid rgba(182,237,206,0.2)",
                  color: "hsl(var(--accent))",
                }}
              >
                <Link2 size={11} />
                Click target for <strong>{connectingFrom}</strong>
                <button onClick={() => setConnectingFrom(null)} className="ml-1 opacity-60 hover:opacity-100">
                  <X size={11} />
                </button>
              </div>
            )}
            <button
              onClick={() => { setShowAddPanel((v) => !v); setSelectedNode(null); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-paper transition-all"
              style={{ background: "hsl(var(--accent))" }}
            >
              <Plus size={13} />
              Add link
            </button>
          </div>
        </Panel>

        {/* Add dependency panel */}
        {showAddPanel && services.length >= 1 && (
          <Panel position="top-right" style={{ marginTop: 48 }}>
            <AddDependencyPanel
              services={services}
              onAdd={onChanged}
              onClose={() => setShowAddPanel(false)}
            />
          </Panel>
        )}

        {/* Node inspector panel */}
        {selectedNode && !showAddPanel && (
          <Panel position="top-right" style={{ marginTop: 48 }}>
            <NodeInspector
              node={selectedNode}
              onClose={() => setSelectedNode(null)}
              onSetCriticality={setCriticality}
              onStartConnect={(id) => setConnectingFrom(id)}
              busy={busy}
            />
          </Panel>
        )}

        {/* Bottom legend */}
        <Panel position="bottom-left">
          <div
            className="flex items-center gap-4 px-3 py-2 text-[10px] text-text-muted"
            style={{
              background: "rgb(var(--deep) / 0.85)",
              border: "1px solid rgb(var(--ink) / 0.15)",
              borderRadius: 10,
              backdropFilter: "blur(8px)",
            }}
          >
            {Object.entries(CRITICALITY_CONFIG).map(([k, v]) => (
              <span key={k} className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                {v.label}
              </span>
            ))}
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1 text-text-muted">
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1.5,
                  background: "rgb(var(--t-muted))",
                  verticalAlign: "middle",
                }}
              />
              Hard
            </span>
            <span className="flex items-center gap-1 text-text-muted">
              <span
                style={{
                  display: "inline-block",
                  width: 18,
                  height: 1.5,
                  background: "var(--tg-amber)",
                  verticalAlign: "middle",
                }}
              />
              Soft
            </span>
            <span className="text-text-muted italic">Drag handles to connect · Click edge to remove</span>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

/* ─── Main exported wrapper ──────────────────────────────────────── */
export default function TopologyGraph({ onChanged }) {
  const [rawData, setRawData] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const [graphRes, depsRes] = await Promise.all([
        api.get("/v1/topology/graph", { skipToast: true }),
        api.get("/v1/topology/dependencies", { skipToast: true }).catch(() => ({ data: { data: [] } })),
      ]);
      setRawData(graphRes.data?.data || { nodes: [], edges: [], suggested_edges: [] });

      // derive service names from graph nodes
      const nodeNames = (graphRes.data?.data?.nodes || []).map((n) => n.service).filter(Boolean);
      setServices([...new Set(nodeNames)].sort());
    } catch (err) {
      console.error("Failed to load topology graph:", err);
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChanged = useCallback(async () => {
    await load();
    if (onChanged) onChanged();
  }, [load, onChanged]);

  if (loading && !rawData) {
    return (
      <div
        className="flex items-center justify-center gap-3 text-xs text-text-muted"
        style={{
          height: 540,
          background: "rgb(var(--deep))",
          borderRadius: 16,
          border: "1px solid rgb(var(--ink) / 0.15)",
        }}
      >
        <RefreshCw size={15} className="animate-spin text-accent" />
        Loading topology graph…
      </div>
    );
  }

  if (failed && !rawData) {
    return (
      <div
        className="flex items-center justify-center gap-2 text-xs text-text-muted"
        style={{
          height: 540,
          background: "rgb(var(--deep))",
          borderRadius: 16,
          border: "1px solid rgb(var(--ink) / 0.15)",
        }}
      >
        Could not load graph.{" "}
        <button className="text-accent underline" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  if (!rawData?.nodes?.length) {
    return (
      <div
        className="flex items-center justify-center text-xs text-text-muted"
        style={{
          height: 300,
          background: "rgb(var(--deep))",
          borderRadius: 16,
          border: "1px solid rgb(var(--ink) / 0.15)",
        }}
      >
        No services yet — they appear as change events arrive or from lastgood.yml.
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      <ReactFlowProvider>
        <TopologyFlow rawData={rawData} onChanged={handleChanged} services={services} />
      </ReactFlowProvider>
    </div>
  );
              }
