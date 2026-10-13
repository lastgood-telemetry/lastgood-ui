import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { getServices } from "../service/auth";
import { Network, Server, ArrowRight, Eye } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";
import TopologyGraph from "../components/Topology/TopologyGraph";

export default function Topology() {
  const navigate = useNavigate();
  const [dependencies, setDependencies] = useState([]);
  const [userServices, setUserServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [servicesError, setServicesError] = useState(false);
  const [loading, setLoading] = useState(true);

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

  // Derive ONLY real user ingested service names
  const realServiceNames = Array.from(
    new Set(
      userServices
        .map(s => s.service_name || s.name || s.service)
        .filter(Boolean)
    )
  );

  // Filter dependencies to ONLY include edges between real ingested services
  const validDependencies = dependencies.filter(
    d => realServiceNames.includes(d.service) && realServiceNames.includes(d.depends_on_service)
  );

  return (
    <PageContainer>
      <PageHeader
        icon={Network}
        title="Topology"
        description="Map service dependencies to put changes in context."
      />

      {/* Main Content */}
      {servicesLoading ? (
        <div role="status" className="p-6 text-xs text-text-muted">Loading services...</div>
      ) : servicesError ? (
        <div role="alert" className="p-6 text-xs text-text-muted">
          Services could not be loaded.{" "}
          <button className="text-accent underline" onClick={fetchUserServices}>Retry</button>
        </div>
      ) : realServiceNames.length === 0 ? (
        /* Empty State */
        <div className="space-y-6">
          <div className="bg-deep/40 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-xl text-center space-y-6">
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

            {/* Blueprint preview */}
            <div className="p-6 rounded-2xl bg-deep/60 border border-dashed border-white/15 max-w-3xl mx-auto space-y-4">
              <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Example dependency map</div>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                {[
                  { name: "web-gateway", label: "Edge Entrypoint" },
                  { name: "api-backend", label: "Core API Service" },
                  { name: "primary-db", label: "Database Cluster" },
                ].map((svc, i) => (
                  <React.Fragment key={svc.name}>
                    {i > 0 && (
                      <div className="flex items-center gap-1 text-accent">
                        <ArrowRight size={18} />
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400">hard</span>
                      </div>
                    )}
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-1 w-48 text-left">
                      <div className="flex items-center gap-1.5 text-accent text-xs font-bold">
                        <Server size={14} />
                        <span>{svc.name}</span>
                      </div>
                      <div className="text-[10px] text-text-muted">{svc.label}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate("/integrations")}
                className="py-3 px-6 rounded-xl bg-accent text-paper font-semibold text-xs inline-flex items-center gap-2 hover:brightness-110 transition-all shadow-lg"
              >
                <span>Set Up Integration to Ingest Services</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Interactive React Flow graph */}
          <TopologyGraph onChanged={fetchTopology} />

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Ingested Services", value: realServiceNames.length, color: "text-white" },
              { label: "Dependency Links", value: validDependencies.length, color: "text-accent" },
              { label: "Hard Links", value: validDependencies.filter(d => d.dependency_type === "hard").length, color: "text-rose-400" },
              { label: "Soft Links", value: validDependencies.filter(d => d.dependency_type === "soft").length, color: "text-amber-400" },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="p-4 rounded-xl bg-deep/40 border border-white/8 backdrop-blur-sm"
              >
                <span className="text-[10px] text-text-muted block mb-1">{label}</span>
                <span className={`text-2xl font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
