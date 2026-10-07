import { environmentLabel, eventEnvironmentLabel } from '../util/console';
import React, { useState, useEffect, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Calendar, Clock, AlertCircle, History, Sparkles, SlidersHorizontal } from "lucide-react";
import api from "../api";
import useAsyncDiagnosis from "../hooks/useAsyncDiagnosis";
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
  const [showFilters, setShowFilters] = useState(false);
  const location = useLocation();
  const routeContext = useMemo(() => readRewindContext(location.search), [location.search]);
  const [incidentTime, setIncidentTime] = useState(routeContext.incidentTime);
  const [windowMinutes, setWindowMinutes] = useState(30);
  const [service, setService] = useState(routeContext.service);
  const [environment, setEnvironment] = useState(routeContext.environment);

  // The list endpoint is organization-scoped and sorted by occurred_at DESC.
  // Keep discovery bounded; manual event links retain values outside this list.
  const { data: discovery, isLoading: discovering, error: discoveryError, refetch: retryDiscovery } = useQuery({
    queryKey: ['rewind-event-discovery'],
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
  const [queryParams, setQueryParams] = useState(null);

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
    isLoading,
    error,
    isFetched,
    refetch: rerunIncident,
    isFetching,
  } = useQuery({
    queryKey: ["rewind", queryParams],
    queryFn: fetchRewindEvents,
    enabled: !!queryParams,
    retry: false,
  });

  const diagnosis = useAsyncDiagnosis(result);
  const rerunDiagnosis = async () => {
    // Expired jobs must not reuse a cached polling result.
    await queryClient.cancelQueries({ queryKey: ['async-diagnosis'] });
    queryClient.removeQueries({ queryKey: ['async-diagnosis'] });
    await rerunIncident();
  };

  useEffect(() => {
    setIncidentTime(routeContext.incidentTime);
    setService(routeContext.service);
    setEnvironment(routeContext.environment);
    setQueryParams(null);
  }, [routeContext]);

  const analyzeLatest = () => {
    const context = eventRewindContext(latestEvent);
    if (!context) return;
    setIncidentTime(context.incidentTime);
    setService(context.service);
    setEnvironment(context.environment);
    setQueryParams({ ...context, windowMinutes });
  };
  const hasNoResults = result && !(result.individual_scores || result.individualScores || []).length;


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
            <button type="button" onClick={analyzeLatest} disabled={isLoading} className="w-full md:w-auto justify-center bg-[#b6edce] hover:bg-[#d5f7e4] disabled:opacity-50 text-[#101413] px-4 py-2.5 md:py-2 rounded-lg text-xs font-semibold flex items-center gap-2">
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
        {isLoading && <LoadingState message="Ranking changes around the incident..." />}

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
            <p className="text-xs text-zinc-400">No matching events in the {queryParams.windowMinutes}-minute window ending {dayjs.utc(queryParams.incidentTime).format('MMM D, YYYY HH:mm:ss [UTC]')}. Try a wider window or another service/environment.</p>
            <div className="flex flex-wrap justify-center items-center gap-4 text-xs">
              {queryParams.windowMinutes < 1440 && <button type="button" onClick={() => {
                const widerWindow = [60, 120, 360, 1440].find(value => value > queryParams.windowMinutes);
                setWindowMinutes(widerWindow);
                setQueryParams({ ...queryParams, windowMinutes: widerWindow });
              }} className="text-indigo-300 underline">Try a wider window</button>}
              {latestEvent && <button type="button" onClick={analyzeLatest} className="text-indigo-300 underline">Analyze latest event</button>}
              <Link to="/events" className="text-indigo-300 underline">Browse Events</Link>
            </div>
          </div>
        )}

        {isFetched && result && !hasNoResults && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <RewindIncidentBrief scoringResult={diagnosis.result} queryParams={queryParams} diagnosisState={diagnosis.state} diagnosisStage={diagnosis.stage} onRerunDiagnosis={rerunDiagnosis} rerunning={isFetching} />

          </div>
        )}

        {!queryParams && (
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

export default Rewind;
