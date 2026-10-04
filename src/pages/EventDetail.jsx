import { environmentLabel, eventEnvironmentLabel, utcTimestamp } from '../util/console';
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Code, Activity, Clock, Database, Sparkles, ChevronDown, User, GitCommit, ExternalLink, Server, Box } from 'lucide-react';
import { LoadingState } from '../components/LoadingState/LoadingState';
import api from '../api';
import { eventRewindUrl } from '../util/rewind';
import dayjs from 'dayjs';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/ui/PageContainer';


const fetchEvent = async ({ queryKey }) => {
    const [_, id] = queryKey;
    const response = await api.get(`/change-events/${id}`);
    if (response.data.success) {
        return response.data.data;
    }
    throw new Error('Failed to fetch event');
};

const EventDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showRawJson, setShowRawJson] = useState(false);

    const { data: event, isLoading, error } = useQuery({
        queryKey: ['event', id],
        queryFn: fetchEvent,
    });

    if (isLoading) return <LoadingState message="Retrieving event details..." />;
    if (error) return (
        <PageContainer>
            <div className="p-8 text-center text-rose-400 flex items-center justify-center h-64">
                <div className="bg-rose-950/60 border border-rose-500/30 p-6 rounded-xl font-mono text-xs">
                    Error: {error.message}
                </div>
            </div>
        </PageContainer>
    );
    if (!event) return (
        <PageContainer>
            <div className="p-8 text-center text-slate-400 h-64 flex items-center justify-center font-mono text-xs">
                Event not found
            </div>
        </PageContainer>
    );

    const formattedDate = dayjs(event.occurred_at).utc().format('MMM DD, YYYY • HH:mm:ss UTC');
    const relativeTime = dayjs(event.occurred_at).fromNow();
    const meta = event.meta || {};

    const commitUrl = meta.commit_url || meta.url || (meta.repository && meta.commit ? `https://github.com/${meta.repository}/commit/${meta.commit}` : null);

    const handleRunRewind = () => {
        navigate(eventRewindUrl(event));
    };

    return (
        <PageContainer>
            {/* Navigation & Header */}
            <div className="mb-4">
                <Link to="/events" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-all text-xs font-mono mb-4">
                    <ArrowLeft size={14} />
                    <span>Back to Events Stream</span>
                </Link>
            </div>

            <PageHeader
                category={`TELEMETRY EVENT #${event.id?.toString().substring(0, 8)}`}
                icon={Activity}
                title={event.summary || `${event.type} on ${event.service}`}
                description={`Recorded ${formattedDate} (${relativeTime})`}
                actions={
                    <button
                        onClick={handleRunRewind}
                        className="bg-[#b6edce] hover:bg-[#d5f7e4] text-[#101413] font-mono font-bold px-4 py-2 rounded-lg flex items-center gap-2 transition-all text-xs shadow-sm cursor-pointer"
                    >
                        <Sparkles size={14} />
                        <span>Analyze in Rewind</span>
                    </button>
                }
            />

            {/* Event Hero Details Card */}
            <div className="bg-[#151b18] border border-slate-800 rounded-xl overflow-hidden shadow-sm space-y-6">
                <div className="p-6 border-b border-slate-800/80 bg-[#151b18] space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 rounded text-xs font-mono font-bold uppercase tracking-wider">
                            {event.service}
                        </span>
                        <span className="px-2.5 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded text-xs font-mono uppercase tracking-wider">
                            {eventEnvironmentLabel(event)}
                        </span>
                        <span className="px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded text-xs font-mono uppercase tracking-wider font-semibold">
                            {event.type}
                        </span>
                    </div>
                </div>

                {/* Structured Metadata Breakdown (High-Signal Grid) */}
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                        {/* Author */}
                        <div className="p-4 bg-[#101413] border border-slate-800 rounded-xl space-y-1">
                            <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold flex items-center gap-1">
                                <User size={12} className="text-indigo-400" /> Change Author
                            </span>
                            <span className="text-sm font-bold text-white">
                                {meta.author ? `@${meta.author}` : (event.source || 'CI/CD Automated')}
                            </span>
                        </div>

                        {/* Commit / Hash */}
                        <div className="p-4 bg-[#101413] border border-slate-800 rounded-xl space-y-1">
                            <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold flex items-center gap-1">
                                <GitCommit size={12} className="text-indigo-400" /> Commit Reference
                            </span>
                            {meta.commit ? (
                                commitUrl ? (
                                    <a
                                        href={commitUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm font-mono font-bold text-indigo-400 hover:underline flex items-center gap-1.5"
                                    >
                                        {meta.commit.substring(0, 7)} <ExternalLink size={12} />
                                    </a>
                                ) : (
                                    <span className="text-sm font-mono font-bold text-indigo-400">
                                        {meta.commit.substring(0, 7)}
                                    </span>
                                )
                            ) : (
                                <span className="text-sm text-slate-500">N/A</span>
                            )}
                        </div>

                        {/* Environment & Source */}
                        <div className="p-4 bg-[#101413] border border-slate-800 rounded-xl space-y-1">
                            <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold flex items-center gap-1">
                                <Server size={12} className="text-indigo-400" /> Source & Scope
                            </span>
                            <span className="text-sm font-semibold text-white">
                                {event.source || 'System'} • {eventEnvironmentLabel(event)}
                            </span>
                        </div>

                        {/* Version */}
                        {meta.version && (
                            <div className="p-4 bg-[#101413] border border-slate-800 rounded-xl space-y-1">
                                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold flex items-center gap-1">
                                    <Box size={12} className="text-emerald-400" /> Version Tag
                                </span>
                                <span className="text-sm font-mono font-bold text-white">
                                    {meta.version}
                                </span>
                            </div>
                        )}

                        {/* Branch */}
                        {meta.branch && (
                            <div className="p-4 bg-[#101413] border border-slate-800 rounded-xl space-y-1">
                                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold">
                                    Branch Target
                                </span>
                                <span className="text-sm font-mono text-white font-semibold">
                                    {meta.branch}
                                </span>
                            </div>
                        )}

                        {/* Tables Affected */}
                        {meta.tables_affected && meta.tables_affected.length > 0 && (
                            <div className="p-4 bg-[#101413] border border-slate-800 rounded-xl space-y-1 sm:col-span-2">
                                <span className="text-[10px] uppercase font-mono text-slate-400 block font-semibold flex items-center gap-1">
                                    <Database size={12} className="text-amber-400" /> Database Tables Affected
                                </span>
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {meta.tables_affected.map((table, idx) => (
                                        <span key={idx} className="text-xs font-mono text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
                                            {table}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Collapsible Raw Telemetry JSON Payload */}
                    <div className="pt-4 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={() => setShowRawJson(!showRawJson)}
                            className="flex items-center justify-between w-full py-2.5 px-4 bg-[#101413] hover:bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
                        >
                            <span className="flex items-center gap-2">
                                <Code size={14} className="text-indigo-400" />
                                {showRawJson ? 'Hide Raw Telemetry JSON Payload' : 'View Raw Telemetry JSON Payload'}
                            </span>
                            <ChevronDown size={14} className={`transition-transform duration-200 ${showRawJson ? 'rotate-180 text-indigo-400' : ''}`} />
                        </button>

                        {showRawJson && (
                            <div className="mt-3 bg-[#0b0f0d] rounded-xl border border-slate-800 overflow-hidden shadow-inner animate-in fade-in duration-200">
                                <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-800 bg-slate-900/50">
                                    <Code size={13} className="text-slate-400" />
                                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-semibold">RAW_TELEMETRY.JSON</span>
                                </div>
                                <pre className="p-4 overflow-x-auto text-xs font-mono text-indigo-300 custom-scrollbar max-h-96">
                                    <code>
                                        {JSON.stringify(event, null, 2)}
                                    </code>
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageContainer>
    );
};

export default EventDetail;
