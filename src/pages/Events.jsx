import { groupDeploymentEvents } from '../util/console';
import React, { useState, useMemo, useEffect } from 'react';
import { useEvents } from '../hooks/useEvents';
import { Timeline } from '../components/Timeline/Timeline';
import { List, Loader2, Info, Activity, Database, ShieldAlert, Sparkles, Filter, Server } from 'lucide-react';
import { DateRangeFilter } from '../components/EventFilters/DateRangeFilter';
import { SearchBar, MultiSelectFilter } from '../components/EventFilters/FilterComponents';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/ui/PageContainer';

const Events = () => {
    const navigate = useNavigate();
    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedServices, setSelectedServices] = useState([]);
    const [selectedEnvironments, setSelectedEnvironments] = useState([]);
    const [presetFilter, setPresetFilter] = useState('all'); // 'all' | 'prod' | 'migrations' | 'deployments'

    // Debounce search query by 300ms to avoid firing requests on every keystroke
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Server-side filter params for query
    const queryFilters = useMemo(() => {
        const filters = {};
        if (debouncedSearch.trim()) filters.search = debouncedSearch.trim();
        if (fromDate) filters.from_date = fromDate;
        if (toDate) filters.to_date = toDate;
        if (selectedServices.length > 0) filters.services = selectedServices;
        if (selectedEnvironments.length > 0) filters.environments = selectedEnvironments;

        if (presetFilter === 'prod') {
            filters.environments = Array.from(new Set([...(filters.environments || []), 'prod', 'production']));
        } else if (presetFilter === 'migrations') {
            filters.type = 'migration';
        } else if (presetFilter === 'deployments') {
            filters.type = 'deployment';
        }
        return filters;
    }, [debouncedSearch, fromDate, toDate, selectedServices, selectedEnvironments, presetFilter]);

    const {
        data,
        isLoading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useEvents(queryFilters);

    // Fetch baseline events without filter for populating filter dropdown options
    const { data: allEventsData } = useEvents({});
    const allEvents = allEventsData ? allEventsData.pages.flatMap(page => page.data) : [];

    const events = data ? data.pages.flatMap(page => page.data) : null;
    const totalEventsCount = data?.pages[0]?.pagination?.total || (events ? events.length : 0);

    // Extract unique services and environments from overall events
    const uniqueServices = useMemo(() => {
        const sourceList = allEvents.length > 0 ? allEvents : (events || []);
        return [...new Set(sourceList.map(e => e.service).filter(Boolean))].sort();
    }, [allEvents, events]);

    const uniqueEnvironments = useMemo(() => {
        const sourceList = allEvents.length > 0 ? allEvents : (events || []);
        return [...new Set(sourceList.map(e => e.environment).filter(Boolean))].sort();
    }, [allEvents, events]);

    // Calculate SRE Quick Metrics
    const metrics = useMemo(() => {
        const sourceList = events || [];
        const prodCount = sourceList.filter(e => e.environment?.toLowerCase() === 'prod' || e.environment?.toLowerCase() === 'production').length;
        const migrationCount = sourceList.filter(e => (e.type || '').toLowerCase().includes('migration')).length;
        const deployCount = sourceList.filter(e => (e.type || '').toLowerCase().includes('deploy') || (e.type || '').toLowerCase().includes('commit')).length;
        const serviceCount = new Set(sourceList.map(e => e.service)).size;
        return { prodCount, migrationCount, deployCount, serviceCount };
    }, [events]);

    const filteredEvents = groupDeploymentEvents(events || []);

    return (
        <PageContainer>
            <PageHeader
                icon={Activity}
                title="Events"
                description="Browse deployments, commits and configuration changes across your services."
                actions={
                    <button
                        onClick={() => navigate('/rewind')}
                        className="bg-[#b6edce] hover:bg-[#d5f7e4] text-[#101413] font-mono font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-xs shadow-sm cursor-pointer"
                    >
                        <Sparkles size={14} />
                        <span>Open Rewind</span>
                    </button>
                }
            />

            {/* SRE Stat Cards Bar */}
            <div className="hidden md:grid grid-cols-4 gap-3 mb-6">
                <div className="p-3.5 bg-[#151b18] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Matching events</span>
                        <span className="text-xl font-bold text-white font-mono">{totalEventsCount}</span>
                    </div>
                    <div className="p-2 text-slate-400">
                        <List size={16} />
                    </div>
                </div>

                <div className="p-3.5 bg-[#151b18] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Production in view</span>
                        <span className="text-xl font-bold text-white font-mono">{metrics.prodCount}</span>
                    </div>
                    <div className="p-2 text-slate-400">
                        <ShieldAlert size={16} />
                    </div>
                </div>

                <div className="p-3.5 bg-[#151b18] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Migrations in view</span>
                        <span className="text-xl font-bold text-white font-mono">{metrics.migrationCount}</span>
                    </div>
                    <div className="p-2 text-slate-400">
                        <Database size={16} />
                    </div>
                </div>

                <div className="p-3.5 bg-[#151b18] border border-slate-800 rounded-xl flex items-center justify-between shadow-sm">
                    <div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Services in view</span>
                        <span className="text-xl font-bold text-white font-mono">{metrics.serviceCount}</span>
                    </div>
                    <div className="p-2 text-slate-400">
                        <Server size={16} />
                    </div>
                </div>
            </div>

            <p className="hidden md:block text-xs text-text-muted mb-4">Matching events counts all results. Other metrics count loaded events only. Related deployment events are grouped; expand a group for the originals.</p>
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3 mb-6 items-stretch md:items-center">
                <div className="flex-1">
                    <SearchBar
                        value={searchQuery}
                        onChange={setSearchQuery}
                        placeholder="Search by commit, service or author..."
                    />
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                    <DateRangeFilter
                        fromDate={fromDate}
                        toDate={toDate}
                        onFromDateChange={setFromDate}
                        onToDateChange={setToDate}
                        onClear={() => {
                            setFromDate('');
                            setToDate('');
                        }}
                    />
                </div>
            </div>

            {/* Scrollable Timeline Section (Only Events Stream Scrolls) */}
            <div className="bg-[#151b18] border border-slate-800 rounded-xl p-3 md:p-6 relative shadow-sm ">
                <Timeline events={filteredEvents} isLoading={isLoading || !data} error={error} />

                {hasNextPage && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => fetchNextPage()}
                            disabled={isFetchingNextPage}
                            className="flex items-center gap-2 px-5 py-2 bg-[#101413] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg text-xs font-mono font-bold text-white transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {isFetchingNextPage ? (
                                <>
                                    <Loader2 size={15} className="animate-spin text-indigo-400" />
                                    <span>Loading...</span>
                                </>
                            ) : (
                                <span>Load more events</span>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </PageContainer>
    );
};

export default Events;
