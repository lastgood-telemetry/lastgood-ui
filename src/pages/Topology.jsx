import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getServices } from "../service/auth";
import { Network, Plus, Trash2, Server, ArrowRight, Layers, GitFork, Sparkles, X, Activity, ArrowDownRight, Eye } from "lucide-react";
import { toast } from "../components/ui/Toast";
import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";

export default function Topology() {
  const navigate = useNavigate();
  const [dependencies, setDependencies] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [service, setService] = useState("");
  const [dependsOnService, setDependsOnService] = useState("");
  const [type, setType] = useState("hard");

  useEffect(() => {
    fetchTopology();
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
        const first = list[0].service_name || list[0].name || list[0].service || "";
        const second = list.length > 1 ? list[1].service_name || list[1].name || list[1].service || "" : "";
        setService(first);
        setDependsOnService(second || first);
      } else {
        setService("");
        setDependsOnService("");
      }
    } catch (err) {
      setServicesError(true);
      console.error("Failed to fetch user services:", err);
    } finally {
      setServicesLoading(false);
    }
  };

  const fetchTopology = async () => {
    try {
      setLoading(true);
      const res = await api.get("/v1/topology/dependencies");
      if (res.data?.success) {
        setDependencies(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch topology:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDependency = async (e) => {
    if (e) e.preventDefault();
    if (!service || !dependsOnService) {
      toast.error("Please select both source and target services");
      return;
    }
    if (service.trim() === dependsOnService.trim()) {
      toast.error("A service cannot depend on itself");
      return;
    }

    try {
      setAdding(true);
      const res = await api.post("/v1/topology/dependencies", {
        service: service.trim(),
        dependsOnService: dependsOnService.trim(),
        type
      });

      if (res.data?.success) {
        toast.success(`Added dependency link: ${service} ➔ ${dependsOnService}`);
        fetchTopology();
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error("Add dependency error:", err);
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteDependency = async (svc, depSvc) => {
    try {
      await api.delete("/v1/topology/dependencies", {
        data: { service: svc, dependsOnService: depSvc }
      });
      toast.success(`Removed link: ${svc} ➔ ${depSvc}`);
      fetchTopology();
    } catch (err) {
      console.error("Delete dependency error:", err);
    }
  };

  const openConnectModal = (sourceSvcName) => {
    setService(sourceSvcName);
    const availableTargets = userServices
      .map(s => s.service_name || s.name || s.service)
      .filter(n => n !== sourceSvcName);
    if (availableTargets.length > 0) {
      setDependsOnService(availableTargets[0]);
    }
    setIsModalOpen(true);
  };

  // Derive ONLY real user ingested service names (Strictly NO placeholders!)
  const realServiceNames = Array.from(
    new Set(
      userServices
        .map(s => s.service_name || s.name || s.service)
        .filter(Boolean)
    )
  );

  // Filter dependencies to ONLY include edges between user's real ingested services
  const validDependencies = dependencies.filter(
    d => realServiceNames.includes(d.service) && realServiceNames.includes(d.depends_on_service)
  );

  // Group dependencies by real service
  const serviceMap = {};
  realServiceNames.forEach((svcName) => {
    serviceMap[svcName] = { upstream: [], downstream: [] };
  });

  validDependencies.forEach((d) => {
    if (serviceMap[d.service]) {
      serviceMap[d.service].upstream.push(d);
    }
    if (serviceMap[d.depends_on_service]) {
      serviceMap[d.depends_on_service].downstream.push(d);
    }
  });

  return (
    <PageContainer>
      <PageHeader
        icon={Network}
        title="Topology"
        description="Map service dependencies to put changes in context."
        actions={
          realServiceNames.length > 0 && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-3.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-mono font-bold text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Add Dependency Link</span>
            </button>
          )
        }
      />

      {/* Main Content */}
      {servicesLoading ? <div role="status" className="p-6 text-xs text-text-muted">Loading services...</div> : servicesError ? <div role="alert" className="p-6 text-xs text-text-muted">Services could not be loaded. <button className="text-accent underline" onClick={fetchUserServices}>Retry services</button></div> : realServiceNames.length === 0 ? (
        /* Empty State Blueprint Preview Canvas */
        <div className="space-y-6">
          <div className="bg-[#0b0f0d]/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
              <Eye size={14} />
              <span>No services ingested yet</span>
            </div>

            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-xl font-bold text-white">Map your service dependencies</h2>
              <p className="text-xs text-text-secondary leading-relaxed">
                Connect your ingested services to map dependency chains. During an incident, LastGood traces failure propagation across upstream and downstream nodes.
              </p>
            </div>

            {/* Blueprint Flow Preview Graphic */}
            <div className="p-6 rounded-2xl bg-[#0b0f0d]/60 border border-dashed border-white/15 max-w-3xl mx-auto space-y-4">
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Example dependency map</div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 w-48 text-left">
                  <div className="flex items-center gap-1.5 text-accent text-xs font-bold">
                    <Server size={14} />
                    <span>web-gateway</span>
                  </div>
                  <div className="text-[10px] text-text-muted">Edge Entrypoint</div>
                </div>

                <div className="flex items-center gap-1 text-accent">
                  <ArrowRight size={18} />
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">hard</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 w-48 text-left">
                  <div className="flex items-center gap-1.5 text-accent text-xs font-bold">
                    <Server size={14} />
                    <span>api-backend</span>
                  </div>
                  <div className="text-[10px] text-text-muted">Core API Service</div>
                </div>

                <div className="flex items-center gap-1 text-accent">
                  <ArrowRight size={18} />
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">hard</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 w-48 text-left">
                  <div className="flex items-center gap-1.5 text-accent text-xs font-bold">
                    <Server size={14} />
                    <span>primary-db</span>
                  </div>
                  <div className="text-[10px] text-text-muted">Database Cluster</div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate("/integrations")}
                className="py-3 px-6 rounded-xl bg-accent text-[#101413] font-semibold text-xs inline-flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
              >
                <span>Set Up Integration to Ingest Services</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Quick Add Connector & Summary */}
          <div className="lg:col-span-1 space-y-6">
            {/* Workflow Connector Card */}
            <div className="bg-[#0b0f0d]/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-4">
              <div className="flex items-center gap-2 text-white font-semibold text-sm">
                <GitFork size={16} className="text-accent" />
                <span>Link Ingested Services</span>
              </div>

              <form onSubmit={handleAddDependency} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Source Service (Dependent)</label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent appearance-none cursor-pointer"
                  >
                    {realServiceNames.map((name) => (
                      <option key={name} value={name} className="bg-zinc-900 text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Upstream Service (Dependency)</label>
                  <select
                    value={dependsOnService}
                    onChange={(e) => setDependsOnService(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent appearance-none cursor-pointer"
                  >
                    {realServiceNames.map((name) => (
                      <option key={name} value={name} className="bg-zinc-900 text-white">
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-text-secondary block mb-1.5">Dependency Impact Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                  >
                    <option value="hard" className="bg-zinc-900">Hard Dependency (Outage Cascades)</option>
                    <option value="soft" className="bg-zinc-900">Soft Dependency (Degraded Mode)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={adding}
                  className="w-full py-2.5 px-4 rounded-xl bg-accent text-[#101413] font-semibold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all disabled:opacity-50"
                >
                  <Plus size={14} />
                  <span>Link Dependency Edge</span>
                </button>
              </form>
            </div>

            {/* Stats Summary Box */}
            <div className="bg-[#0b0f0d]/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider">Topology Metrics</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-text-muted block">Ingested Services</span>
                  <span className="text-lg font-bold text-white">{realServiceNames.length}</span>
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-[10px] text-text-muted block">Dependency Links</span>
                  <span className="text-lg font-bold text-accent">{validDependencies.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Node Workflow Canvas */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0b0f0d]/40 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">Service dependencies</h2>
                  <p className="text-xs text-text-muted mt-0.5">Upstream dependencies and downstream services.</p>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-accent/10 border border-accent/20 text-accent">
                  {realServiceNames.length} Active Nodes
                </span>
              </div>

              {loading ? (
                <div className="py-16 text-center text-xs text-text-muted">Loading service topology workflow...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {realServiceNames.map((svcName) => {
                    const data = serviceMap[svcName] || { upstream: [], downstream: [] };

                    return (
                      <div
                        key={svcName}
                        className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-accent/40 transition-all space-y-4 relative group"
                      >
                        {/* Node Header */}
                        <div className="flex flex-wrap gap-3 items-center justify-between border-b border-white/10 pb-3">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            <div className="p-2 shrink-0 rounded-xl bg-accent/10 text-accent border border-accent/20">
                              <Server size={18} />
                            </div>
                            <div className="min-w-0">
                              <h3 title={svcName} className="font-bold text-white text-sm break-all">{svcName}</h3>
                              <span className="text-[10px] text-text-muted font-mono">
                                Ingested Service
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => openConnectModal(svcName)}
                            className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-accent/20 hover:text-accent border border-white/10 text-[11px] text-text-secondary flex items-center gap-1 transition-all"
                            title="Add Upstream Dependency Link"
                          >
                            <Plus size={12} />
                            <span>Link Upstream</span>
                          </button>
                        </div>

                        {/* Upstream Dependencies Workflow Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                            <span>Depends on</span>
                            <span className="font-mono text-accent">{data.upstream.length}</span>
                          </div>

                          {data.upstream.length === 0 ? (
                            <div className="p-2.5 rounded-xl bg-[#0b0f0d]/20 border border-white/5 text-[11px] text-text-muted italic">
                              No upstream dependencies linked
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {data.upstream.map((dep) => (
                                <div
                                  key={dep.id}
                                  className="p-2.5 rounded-xl bg-[#0b0f0d]/40 border border-white/10 flex items-center justify-between text-xs group/item"
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <ArrowRight size={14} className="text-accent" />
                                    <span title={dep.depends_on_service} className="min-w-0 truncate font-mono font-semibold text-white">{dep.depends_on_service}</span>
                                    <span
                                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono uppercase ${
                                        dep.dependency_type === "hard"
                                          ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                                      }`}
                                    >
                                      {dep.dependency_type}
                                    </span>
                                  </div>

                                  <button
                                    onClick={() => handleDeleteDependency(dep.service, dep.depends_on_service)}
                                    className="text-text-muted hover:text-red-400 focus-visible:text-red-400 shrink-0 transition-opacity p-1"
                                    title="Delete Dependency Edge"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Downstream Impact Flow Section */}
                        {data.downstream.length > 0 && (
                          <div className="pt-2 border-t border-white/5 space-y-1.5">
                            <div className="text-[10px] font-semibold text-text-muted uppercase">
                              Used by:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {data.downstream.map((down) => (
                                <span
                                  key={down.id}
                                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-text-secondary flex items-center gap-1"
                                >
                                  <ArrowDownRight size={10} className="text-accent" />
                                  <span className="break-all">{down.service}</span>
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Quick Link Creation */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b0f0d]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <GitFork size={18} className="text-accent" />
                <span>Link Service Dependency Workflow</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDependency} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Dependent Service (Child)</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                >
                  {realServiceNames.map((name) => (
                    <option key={name} value={name} className="bg-zinc-900 text-white">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Upstream Service (Parent Dependency)</label>
                <select
                  value={dependsOnService}
                  onChange={(e) => setDependsOnService(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                >
                  {realServiceNames.map((name) => (
                    <option key={name} value={name} className="bg-zinc-900 text-white">
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-text-secondary block mb-1.5">Dependency Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                >
                  <option value="hard" className="bg-zinc-900">Hard Dependency (Cascading Outage)</option>
                  <option value="soft" className="bg-zinc-900">Soft Dependency (Degraded Mode)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-text-secondary hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adding}
                  className="px-4 py-2 rounded-xl bg-accent text-[#101413] font-semibold text-xs flex items-center gap-1.5 hover:brightness-110"
                >
                  <Plus size={14} />
                  <span>Create Link</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
