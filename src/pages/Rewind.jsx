import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Calendar, Clock, AlertCircle, History, Sparkles, SlidersHorizontal, ShieldAlert } from "lucide-react";
import api from "../api";
import RewindTimeline from "../components/Rewind/RewindTimeline";
import RewindAiDiagnosisPanel from "../components/Rewind/RewindAiDiagnosisPanel";
import { RewindIncidentBrief } from "../components/Rewind/RewindIncidentBrief";
import { LoadingState } from "../components/LoadingState/LoadingState";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";

const Rewind = () => {
  // Default to "now" formatted for datetime-local input (YYYY-MM-DDThh:mm)
  const [incidentTime, setIncidentTime] = useState(() => {
    return dayjs().utc().format("YYYY-MM-DDTHH:mm");
  });
  const [windowMinutes, setWindowMinutes] = useState(30);
  const [service, setService] = useState("");
  const [environment, setEnvironment] = useState("");
  const [queryParams, setQueryParams] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [viewMode, setViewMode] = useState('brief'); // 'brief' | 'detailed'

  const handleSearch = (e) => {
    e.preventDefault();
    setQueryParams({
      incidentTime,
      windowMinutes,
      service,
      environment,
    });
  };

  const fetchRewindEvents = async () => {
    if (!queryParams) return null;

    const params = {
      incidentAt: dayjs.utc(queryParams.incidentTime).toISOString(),
      window: `${queryParams.windowMinutes}m`,
    };

    if (queryParams.service) params.service = queryParams.service;
    if (queryParams.environment) params.environment = queryParams.environment;

    const response = await api.get("/scoring/incident", { params });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch scoring data");
  };

  const {
    data: result,
    isLoading,
    error,
    isFetched,
  } = useQuery({
    queryKey: ["rewind", queryParams],
    queryFn: fetchRewindEvents,
    enabled: !!queryParams,
    retry: false,
  });

  // Auto-select primary trigger event or first event when result is fetched
  useEffect(() => {
    if (result) {
      const items = result.individual_scores || result.individualScores || [];
      if (items.length > 0) {
        const primary = items.find(i => i.role === 'primary');
        const target = primary ? (primary.event?.id || primary.id) : (items[0].event?.id || items[0].id);
        setSelectedEventId(target);
      }
    }
  }, [result]);

  return (
    <PageContainer>
      <PageHeader
        category="INCIDENT CORRELATION ENGINE"
        icon={History}
        title="AI Diagnostics Rewind"
        description="Time-travel through infrastructure mutations and telemetry events to isolate root cause triggers during production outages."
      />

      {/* Search Controls Form */}
      <div className="bg-[#0c0c0e] border border-white/10 rounded-xl p-4 shadow-sm mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="min-w-[200px] flex-1">
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-[11px] font-mono font-semibold text-zinc-400 flex items-center gap-1.5 uppercase">
                <Calendar size={12} className="text-zinc-300" /> Incident Time (UTC)
              </label>
              <button
                type="button"
                onClick={() => setIncidentTime(dayjs().utc().format("YYYY-MM-DDTHH:mm"))}
                className="text-[10px] font-mono text-sky-400 hover:text-sky-300 font-semibold uppercase"
              >
                Set to Now
              </button>
            </div>
            <input
              type="datetime-local"
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              onClick={(e) => e.target.showPicker && e.target.showPicker()}
              className="w-full bg-[#070709] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
              required
            />
          </div>

          <div className="w-40">
            <label className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5 uppercase">
              <Clock size={12} className="text-zinc-300" /> Lookback Window
            </label>
            <select
              value={windowMinutes}
              onChange={(e) => setWindowMinutes(Number(e.target.value))}
              className="w-full bg-[#070709] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={120}>2 Hours</option>
              <option value={360}>6 Hours</option>
              <option value={1440}>24 Hours</option>
            </select>
          </div>

          <div className="w-40">
            <label className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 block uppercase">
              Target Service
            </label>
            <input
              type="text"
              value={service}
              onChange={(e) => setService(e.target.value)}
              placeholder="e.g. user-fe"
              className="w-full bg-[#070709] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <div className="w-36">
            <label className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 block uppercase">
              Environment
            </label>
            <input
              type="text"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              placeholder="e.g. prod"
              className="w-full bg-[#070709] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 transition-all placeholder:text-zinc-600"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all h-[36px] text-xs shadow-sm shadow-indigo-600/20 cursor-pointer"
          >
            <Search size={14} />
            Run Rewind Diagnostic
          </button>
        </form>
      </div>

      {/* Main Results Container */}
      <div className="space-y-6">
        {isLoading && <LoadingState message="Running AI Root Cause Diagnostic Pipeline..." />}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-xs font-mono">
            <AlertCircle size={18} />
            <span>{error.message || "Failed to fetch timeline data"}</span>
          </div>
        )}

        {isFetched && result && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* View Mode Segmented Control Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-1.5 p-1 bg-[#09090b] border border-white/10 rounded-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('brief')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                    viewMode === 'brief'
                      ? 'bg-zinc-700 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>Incident Brief</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('detailed')}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
                    viewMode === 'detailed'
                      ? 'bg-zinc-700 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  <Clock size={13} />
                  <span>Timeline & Risk Scoring</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-2">
                <span>Mode:</span>
                <span className="text-zinc-200 font-bold uppercase bg-white/10 border border-white/10 px-2 py-0.5 rounded">
                  {viewMode === 'brief' ? 'Summary Brief' : 'Detailed Timeline'}
                </span>
              </div>
            </div>

            {/* View Mode 1: Incident Brief Mode (Default) */}
            {viewMode === 'brief' && (
              <RewindIncidentBrief
                scoringResult={result}
                queryParams={queryParams}
                onSwitchToDetailed={() => setViewMode('detailed')}
              />
            )}

            {/* View Mode 2: Detailed Split Timeline & Diagnosis Mode */}
            {viewMode === 'detailed' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                {/* Left Column (1/3 Width): Interactive Timeline */}
                <div className="lg:col-span-1 space-y-3">
                  <div className="flex items-center justify-between px-1 mb-2">
                    <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock size={14} className="text-zinc-400" />
                      Change Timeline
                    </h3>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {(result.individual_scores || result.individualScores || []).length} events
                    </span>
                  </div>

                  <div className="max-h-[750px] overflow-y-auto pr-2 custom-scrollbar">
                    <RewindTimeline
                      events={result.individual_scores || result.individualScores || []}
                      selectedEventId={selectedEventId}
                      onSelectEvent={setSelectedEventId}
                      windowMinutes={queryParams?.windowMinutes || windowMinutes}
                    />
                  </div>
                </div>

                {/* Right Column (2/3 Width): Live AI Diagnosis Panel */}
                <div className="lg:col-span-2 space-y-6">
                  <RewindAiDiagnosisPanel
                    scoringResult={result}
                    selectedEventId={selectedEventId}
                    queryParams={queryParams}
                  />
                </div>
              </div>
            )}

          </div>
        )}

        {!queryParams && (
          <div className="border border-dashed border-white/10 rounded-xl p-16 text-center space-y-3 bg-[#08080a]">
            <Sparkles size={24} className="text-zinc-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Ready for Root Cause Analysis</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Select an incident timestamp and window above to analyze correlated changes across your infrastructure.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Rewind;
