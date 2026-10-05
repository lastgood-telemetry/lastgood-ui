import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, Loader2, ArrowUpRight } from 'lucide-react';
import { useEvents } from '../hooks/useEvents';
import { groupDeploymentEvents, eventEnvironmentLabel, utcTimestamp } from '../util/console';
import { eventRewindContext } from '../util/rewind';
import { DateRangeFilter } from '../components/EventFilters/DateRangeFilter';
import { SearchBar } from '../components/EventFilters/FilterComponents';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/ui/PageContainer';

const Events = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [scope, setScope] = useState('all');
  const [service, setService] = useState('');
  useEffect(() => { const timer = setTimeout(() => setDebouncedSearch(search), 300); return () => clearTimeout(timer); }, [search]);
  const filters = useMemo(() => ({ ...(debouncedSearch.trim() && { search: debouncedSearch.trim() }), ...(fromDate && { from_date: fromDate }), ...(toDate && { to_date: toDate }), ...(service && { services: [service] }) }), [debouncedSearch, fromDate, toDate, service]);
  const { data, isLoading, error, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useEvents(filters);
  const { data: baseline } = useEvents({});
  const loaded = data?.pages.flatMap(page => page.data) || [];
  const services = [...new Set((baseline?.pages.flatMap(page => page.data) || loaded).map(event => event.service).filter(Boolean))].sort();
  // Production is a display-only filter over loaded rows: provider env wins over
  // historical defaults. Never claim this count covers unloaded pages.
  const events = groupDeploymentEvents(loaded).filter(event => scope !== 'production' || eventEnvironmentLabel(event) === 'Production').sort((a, b) => new Date(b.occurred_at) - new Date(a.occurred_at));
  const active = search || fromDate || toDate || service || scope !== 'all';
  return <PageContainer>
    <PageHeader icon={Activity} title="Change log" description="What changed before the incident? Newest first. Times in UTC." actions={<Link to="/rewind" className="bg-accent text-[#101413] px-3 py-2 rounded text-xs font-semibold">Open Rewind</Link>} />
    <div className="space-y-3 mb-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex border border-white/10 rounded p-1 gap-1" aria-label="Environment scope">
          {[['all', 'All environments'], ['production', 'Production only']].map(([value, label]) => <button key={value} aria-pressed={scope === value} onClick={() => setScope(value)} className={`px-3 py-1.5 rounded text-xs ${scope === value ? 'bg-accent text-[#101413] font-semibold' : 'text-text-secondary hover:text-white'}`}>{label}</button>)}
        </div>
        <label className="text-xs text-text-muted flex items-center gap-2">Service
          <select aria-label="Filter service" value={service} onChange={e => setService(e.target.value)} className="bg-[#151b18] border border-white/10 rounded px-2 py-2 text-white max-w-[190px]">
            <option value="">All services</option>{services.map(value => <option key={value}>{value}</option>)}
          </select>
        </label>
        {active && <button onClick={() => { setSearch(''); setFromDate(''); setToDate(''); setService(''); setScope('all'); }} className="text-xs text-accent underline">Clear filters</button>}
      </div>
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="flex-1 min-w-0"><SearchBar value={search} onChange={setSearch} placeholder="Search change, service, commit or author" /></div>
        <DateRangeFilter fromDate={fromDate} toDate={toDate} onFromDateChange={setFromDate} onToDateChange={setToDate} onClear={() => { setFromDate(''); setToDate(''); }} />
      </div>
    </div>
    <div className="border border-white/10 rounded bg-[#151b18] overflow-hidden">
      <div className="px-4 py-3 border-b border-white/10 text-xs text-text-muted">{events.length} changes shown from {loaded.length} loaded events{scope === 'production' ? ' · Production only' : ''}. Related deployment events are grouped.</div>
      <div className="hidden lg:grid grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_90px] gap-4 px-4 py-2 border-b border-white/10 text-[10px] uppercase font-mono text-text-muted"><span>What changed</span><span>Service / env</span><span>When (UTC)</span><span>Who</span><span>Investigate</span></div>
      {isLoading ? <p role="status" className="p-6 text-sm text-text-muted">Loading changes...</p> : error ? <div role="alert" className="p-6 text-sm text-rose-300">Could not load changes. {error.message} <button onClick={() => refetch()} className="text-accent underline">Retry</button></div> : events.length === 0 ? <p className="p-6 text-sm text-text-muted">No changes in the loaded events match these filters.{hasNextPage ? ' Load older events to search further.' : ' Try a wider window or clear filters.'}</p> : events.map(event => {
        const context = eventRewindContext(event);
        return <article key={event.id} className="border-b last:border-b-0 border-white/10 px-4 py-4 hover:bg-white/[0.02]">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,0.9fr)_90px] gap-2 lg:gap-4 lg:items-start">
            <div className="min-w-0"><Link to={`/events/${encodeURIComponent(event.id)}`} className="text-sm font-medium text-white hover:text-accent break-words">{event.summary || event.type || 'Change'}</Link><p className="text-[10px] mt-1 text-text-muted font-mono uppercase">{event.type || 'Unknown type'}</p></div>
            <div className="text-xs min-w-0 break-words"><p className="text-text-secondary font-medium">{event.service || 'Service unspecified'}</p><span className={eventEnvironmentLabel(event) === 'Production' ? 'text-accent' : 'text-text-muted'}>{eventEnvironmentLabel(event)}</span></div>
            <time dateTime={event.occurred_at} className="text-xs text-text-secondary font-mono break-words" title={utcTimestamp(event.occurred_at)}>{utcTimestamp(event.occurred_at)}</time>
            <p className="text-xs text-text-muted break-words">{event.meta?.author || 'Author unavailable'}</p>
            {context ? <button className="inline-flex items-center gap-1 text-xs text-accent hover:underline justify-self-start" onClick={() => navigate(`/rewind?${new URLSearchParams(context).toString()}`)}>Rewind <ArrowUpRight size={12} /></button> : <span className="text-xs text-text-muted">Time unavailable</span>}
          </div>
          {event.lifecycleEvents?.length > 1 && <details className="mt-3 text-xs"><summary className="text-text-muted cursor-pointer">{event.lifecycleEvents.length} related events</summary><ul className="mt-2 space-y-2">{event.lifecycleEvents.map(child => <li key={child.id}><Link to={`/events/${encodeURIComponent(child.id)}`} className="text-accent underline break-words">{child.type}: {child.summary}</Link><p className="text-text-muted">{utcTimestamp(child.occurred_at)}</p></li>)}</ul></details>}
        </article>;
      })}
    </div>
    {hasNextPage && <button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} className="mt-4 border border-white/10 rounded px-4 py-2 text-sm text-text-secondary inline-flex gap-2 items-center disabled:opacity-50">{isFetchingNextPage && <Loader2 size={14} className="animate-spin" />}{isFetchingNextPage ? 'Loading...' : 'Load older events'}</button>}
  </PageContainer>;
};
export default Events;
