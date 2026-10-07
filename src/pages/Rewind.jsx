import { environmentLabel, eventEnvironmentLabel } from '../util/console';
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Calendar, Clock, AlertCircle, History, Sparkles, SlidersHorizontal } from "lucide-react";
import api from "../api";
import useAsyncDiagnosis from "../hooks/useAsyncDiagnosis";
import useOrgStore from '../stores/useOrgStore';
import useRewindSession, { sameRewindScope } from "../hooks/useRewindSession";
import { Link, useLocation } from 'react-router-dom';
import { eventRewindContext, readRewindContext, rewindRequestParams, rewindOptions } from '../util/rewind';
import { RewindIncidentBrief } from "../components/Rewind/RewindIncidentBrief";
import { LoadingState } from "../components/LoadingState/LoadingState";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

import { DateTimePicker } from "../components/EventFilters/DateTimePicker";

import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";

// Phones get a trimmed Rewind: brief view only, filters collapsed.
const useIsMobile = () => {
  const query = "(max-width: 767px)";
  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isMobile;
};

const Rewind = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const orgId = useOrgStore(state => state.org?.id);
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const routeContext = useMemo(() => readRewindContext(location.search), [location.search]);
  const [session, setSession] = useRewindSession({ ...routeContext, windowMinutes: 30 });
  const { incidentTime, windowMinutes, service, environment } = session.selection;
  const setSelection = (field, value) => setSession(current => ({
    ...current, selection: { ...current.selection, [field]: value },
  }));
  const setIncidentTime = value => setSelection('incidentTime', value);
  const setWindowMinutes = value => setSelection('windowMinutes', value);
  const setService = value => setSelection('service', value);
  const setEnvironment = value => setSelection('environment', value);
  const [requested, setRequested] = useState(false);
  const queryParams = session.submitted;
  const setQueryParams = params => {
    setSession(current => ({ ...current, submitted: params }));
    setRequested(true);
    if (sameRewindScope(params, queryParams)) rerunIncident();
  };

  // The list endpoint is organization-scoped and sorted by occurred_at DESC.
  // Keep discovery bounded; manual event links retain values outside this list.
  const { data: discovery, isLoading: discovering, error: discoveryError, refetch: retryDiscovery } = useQuery({
    queryKey: ['rewind-event-discovery', orgId],
    queryFn: async () => {
      const response = await api.get('/change-events', { params: { limit: 1000, offset: 0 } });
      if (!response.data.success) throw new Error('Could not load ingested events');
      return response.data;
    },
  });
  const events = discovery?.data || [];
  const latestEvent = events.find(event => eventRewindContext(event));
  const services = rewindOptions(events, 'service', service);
  const environments = rewindOptions(events, 'environment', environment);

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

    const params = rewindRequestParams(queryParams);

    const response = await api.get("/scoring/incident", { params });

    if (response.data.success) {
      return response.data.data;
    }
    throw new Error("Failed to fetch scoring data");
  };

  const {
    data: result,
    error,
    refetch: rerunIncident,
    isFetching,
  } = useQuery({
    queryKey: ["rewind", orgId, queryParams],
    queryFn: fetchRewindEvents,
    enabled: requested && !!queryParams,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });

  const savedResult = sameRewindScope(queryParams, session.snapshot?.params) ? session.snapshot?.result : null;
  const sameJob = savedResult?.ai_diagnosis?.job_id === result?.ai_diagnosis?.job_id;
  const savedCompleted = savedResult?.ai_diagnosis?.status === 'completed';
  const currentResult = sameJob && savedCompleted && result?.ai_diagnosis?.status === 'pending'
    ? savedResult : result || savedResult;
  const diagnosis = useAsyncDiagnosis(currentResult);
  // Save the rendered diagnosis too: completed polling jobs have gcTime=0.
  // Without this snapshot, returning via the sidebar reverts to pending rules.
  useEffect(() => {
    if (!diagnosis.result) return;
    setSession(current => ({ ...current, snapshot: {
      params: queryParams, result: diagnosis.result,
      state: diagnosis.state, stage: diagnosis.stage,
    } }));
  }, [result, diagnosis.state, diagnosis.stage, diagnosis.result?.ai_diagnosis?.executive_summary, queryParams, setSession]);
  const displayed = currentResult ? { ...diagnosis, params: queryParams } : session.snapshot;
  const selectionChanged = displayed && !sameRewindScope(session.selection, displayed.params);
  const rerunDiagnosis = async () => {
    // Expired jobs must not reuse a cached polling result.
    await queryClient.cancelQueries({ queryKey: ['async-diagnosis'] });
    queryClient.removeQueries({ queryKey: ['async-diagnosis'] });
    await rerunIncident();
  };

  const previousSearch = useRef(null);
  useEffect(() => {
    // An event deep link changes the draft scope, never discards a brief.
    // Plain sidebar navigation restores the saved controls as well.
    if (location.search && previousSearch.current !== location.search) {
      setSession(current => ({ ...current, selection: { ...current.selection, ...routeContext } }));
    }
    previousSearch.current = location.search;
  }, [location.search, routeContext, setSession]);

  const analyzeLatest = () => {
    const context = eventRewindContext(latestEvent);
    if (!context) return;
    setIncidentTime(context.incidentTime);
    setService(context.service);
    setEnvironment(context.environment);
    setQueryParams({ ...context, windowMinutes });
  };
  const displayedResult = displayed?.result;
  const displayedParams = displayed?.params;
  const hasNoResults = displayedResult && !(displayedResult.individual_scores || displayedResult.individualScores || []).length;


  return (
    <PageContainer>
      <PageHeader
        icon={History}
        title="Rewind"
        description="What changed before the incident? Choose a time to rank changes for investigation."
      />

      {/* Search Controls Form */}
      <div className="bg-[#101413] border border-white/10 rounded-xl p-3 md:p-4 shadow-sm mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-white/10">
          <div className="text-xs text-zinc-400 space-y-1 min-w-0">
            {discovering ? <p>Loading ingested events...</p> : discoveryError ? (
              <p>Could not load event suggestions. <button type="button" onClick={() => retryDiscovery()} className="text-indigo-300 underline">Retry</button> or <Link to="/events" className="text-indigo-300 underline">browse events</Link>.</p>
            ) : latestEvent ? (
              <>
                <p>Latest event: <span className="text-zinc-200 font-mono">{dayjs(latestEvent.occurred_at).utc().format('MMM D, YYYY HH:mm:ss [UTC]')}</span></p>
                <p className="hidden md:block">{latestEvent.service} / {eventEnvironmentLabel(latestEvent)} - {latestEvent.summary || latestEvent.type}</p>
                {discovery?.pagination?.total > events.length && <p className="hidden md:block">Selectors show values from the latest {events.length} events. Browse Events for older values.</p>}
              </>
            ) : <p>No events ingested yet. Connect a source, confirm an event in Events, then run your first diagnosis.</p>}
          </div>
          {latestEvent ? (
            <button type="button" onClick={analyzeLatest} disabled={isFetching} className="w-full md:w-auto justify-center bg-[#b6edce] hover:bg-[#d5f7e4] disabled:opacity-50 text-[#101413] px-4 py-2.5 md:py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
              <Sparkles size={14} /> Analyze latest event
            </button>
          ) : !discovering && !discoveryError && <Link to="/integrations" className="text-xs text-indigo-300 underline">Connect a source</Link>}
        </div>
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap items-end gap-4"
        >
          <div className="w-full min-w-0 md:min-w-[240px] md:w-auto flex-1">
            <label className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5 uppercase">
              <Calendar size={12} className="text-zinc-300" /> Incident time (UTC)
            </label>
            <DateTimePicker
              value={incidentTime}
              onChange={setIncidentTime}
              label="Select incident time"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(v => !v)}
            aria-expanded={showFilters}
            className="md:hidden w-full flex items-center justify-between text-xs font-mono text-zinc-300 border border-white/10 rounded-lg px-3 py-2.5 cursor-pointer"
          >
            <span className="flex items-center gap-2"><SlidersHorizontal size={13} /> Window, service, environment</span>
            <span className="text-zinc-500">{showFilters ? "Hide" : "Show"}</span>
          </button>

          <div className={`${showFilters ? 'flex' : 'hidden'} flex-col gap-4 w-full md:contents`}>
          <div className="w-full md:w-40">
            <label className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 flex items-center gap-1.5 uppercase">
              <Clock size={12} className="text-zinc-300" /> Lookback window
            </label>
            <select
              value={windowMinutes}
              onChange={(e) => setWindowMinutes(Number(e.target.value))}
              className="w-full bg-[#101413] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
            >
              <option value={15}>15 Minutes</option>
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={120}>2 Hours</option>
              <option value={360}>6 Hours</option>
              <option value={1440}>24 Hours</option>
            </select>
          </div>

          <div className="w-full md:w-40">
            <label htmlFor="rewind-service" className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 block uppercase">
              Service
            </label>
            <select
              id="rewind-service"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="w-full bg-[#101413] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            >
              <option value="">All services</option>
              {services.map(value => <option key={value} value={value}>{value}</option>)}
            </select>
          </div>

          <div className="w-full md:w-36">
            <label htmlFor="rewind-environment" className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 block uppercase">
              Environment
            </label>
            <select
              id="rewind-environment"
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full bg-[#101413] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
            >
              <option value="">All environments</option>
              {environments.map(value => <option key={value} value={value}>{environmentLabel(value)} ({value})</option>)}
            </select>
          </div>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto justify-center bg-[#b6edce] hover:bg-[#d5f7e4] text-[#101413] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-all h-[40px] md:h-[36px] text-xs shadow-sm shadow-indigo-600/20 cursor-pointer"
          >
            <Search size={14} />
            Analyze changes
          </button>
        </form>
      </div>

      {/* Main Results Container */}
      <div className="space-y-6">
        {selectionChanged && (
          <div role="status" className="border border-amber-300/30 bg-amber-300/5 rounded p-4 text-xs text-amber-200 space-y-1">
            <p className="font-semibold">Showing the previous analysis</p>
            <p className="break-words">{displayedParams.service || 'All services'} / {displayedParams.environment ? environmentLabel(displayedParams.environment) : 'All environments'} · {displayedParams.windowMinutes}-minute window ending {dayjs.utc(displayedParams.incidentTime).format('MMM D, YYYY HH:mm:ss [UTC]')}</p>
            <p>Selection changed. Choose "Analyze changes" to update the summary.</p>
          </div>
        )}
        {isFetching && <LoadingState message="Ranking changes around the incident..." />}

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3 text-xs font-mono">
            <AlertCircle size={18} />
            <span>{error.message || "Failed to fetch timeline data"}</span>
          </div>
        )}

        {hasNoResults && (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center space-y-4 bg-[#101413]">
            <Clock size={24} className="text-zinc-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No changes in this window</h3>
            <p className="text-xs text-zinc-400">No matching events in the {displayedParams.windowMinutes}-minute window ending {dayjs.utc(displayedParams.incidentTime).format('MMM D, YYYY HH:mm:ss [UTC]')}. Try a wider window or another service/environment.</p>
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
              {displayedParams.windowMinutes < 1440 && <button type="button" onClick={() => {
                const widerWindow = [60, 120, 360, 1440].find(value => value > displayedParams.windowMinutes);
                setWindowMinutes(widerWindow);
                setQueryParams({ ...session.selection, windowMinutes: widerWindow });
              }} className="text-indigo-300 underline">Try a wider window</button>}
              {latestEvent && <button type="button" onClick={analyzeLatest} className="text-indigo-300 underline">Analyze latest event</button>}
              <Link to="/events" className="text-indigo-300 underline">Browse Events</Link>
            </div>
          </div>
        )}

        {displayedResult && !hasNoResults && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <RewindIncidentBrief scoringResult={displayedResult} queryParams={displayedParams} diagnosisState={displayed.state} diagnosisStage={displayed.stage} onRerunDiagnosis={rerunDiagnosis} rerunning={isFetching} />

          </div>
        )}

        {!displayedResult && !isFetching && !error && (
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center space-y-3 bg-[#101413]">
            <Sparkles size={24} className="text-zinc-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">Choose where to start</h3>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
              Use "Analyze latest event" for a quick look, or set an incident time above. All times are UTC.
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

// Remount private state when the workspace changes, before rendering its brief.
export default function RewindPage() {
  const orgId = useOrgStore(state => state.org?.id);
  if (!orgId) return <LoadingState message="Loading workspace..." />;
  return <Rewind key={orgId} />;
}
