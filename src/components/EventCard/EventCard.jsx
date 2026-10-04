import { environmentLabel, eventEnvironmentLabel, utcTimestamp } from '../../util/console';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronDown, GitCommit, User } from 'lucide-react';
import { RiskScoreRing } from '../RiskScoreRing/RiskScoreRing';
import ScoreEvidence from '../Evidence/ScoreEvidence';

const getRiskColor = (level) => {
    switch (level) {
        case 'critical':
            return { border: 'border-red-500/30', text: 'text-red-500' };
        case 'high':
            return { border: 'border-orange-500/30', text: 'text-orange-500' };
        case 'medium':
            return { border: 'border-yellow-500/30', text: 'text-yellow-400' };
        case 'low':
            return { border: 'border-green-500/30', text: 'text-green-400' };
        default:
            return { border: 'border-white/5', text: 'text-text-muted' };
    }
};

// Role badge styles and labels, keyed by the value returned by the API.
const ROLE_BADGE_STYLES = {
    primary: 'bg-red-500/20 border border-red-500/40 text-red-400',
    contributing: 'bg-yellow-500/20 border border-yellow-500/40 text-yellow-400',
};

const ROLE_BADGE_LABELS = {
    primary: 'SUSPECTED CONTRIBUTOR',
    contributing: 'CONTRIBUTING FACTOR',
};

const RoleBadge = ({ variant }) => (
    <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded truncate ${ROLE_BADGE_STYLES[variant]}`}>
        {ROLE_BADGE_LABELS[variant]}
    </span>
);

export const EventCard = ({ event, riskAssessment, isLast, roleBadge = null, causalChainPosition = null }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const { summary, occurred_at, meta, service, environment, id, time_before_incident, source, type } = event;
    const score = riskAssessment?.score;
    const level = riskAssessment?.level;

    const date = dayjs(occurred_at).utc().format('MMM DD, h:mm A [UTC]');
    const riskColor = getRiskColor(level);

    // Build a commit URL when we have enough information.
    // Priority: explicit commit_url → repo_full_name + sha → repo_url + sha → github source + service name.
    const commitSha = meta?.commit;
    const commitUrl = (() => {
        if (!commitSha) return null;
        if (meta?.commit_url) return meta.commit_url;
        if (meta?.repo_full_name) return `https://github.com/${meta.repo_full_name}/commit/${commitSha}`;
        if (meta?.repo_url) return `${meta.repo_url.replace(/\/$/, '')}/commit/${commitSha}`;
        return null;
    })();

    const shortSha = commitSha ? String(commitSha).substring(0, 7) : null;

    return (
        <div className="flex gap-4">
            {/* Timeline Column */}
            <div className="flex flex-col items-center relative">
                {causalChainPosition != null ? (
                    <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-background mt-6 z-10 shadow-[0_0_10px_rgba(45,212,191,0.5)]">
                        {causalChainPosition}
                    </div>
                ) : (
                    <div className="w-3 h-3 rounded-full bg-accent mt-6 shadow-[0_0_10px_rgba(45,212,191,0.5)] z-10"></div>
                )}
                {!isLast && <div className="w-px bg-border flex-1 absolute top-9 bottom-0"></div>}
            </div>

            {/* Content Column */}
            <div className="flex-1 pb-8">
                <div className={`bg-gradient-card border ${riskAssessment ? riskColor.border : 'border-white/5'} rounded-lg transition-all duration-300 hover:border-accent/50 group hover:shadow-[0_0_30px_rgba(45,212,191,0.1)] relative overflow-hidden`}>
                    <div className="p-5">
                        <div className="grid grid-cols-12 gap-4">
                            {/* Left Column: Event Details */}
                            <div className="col-span-8">
                                <div className="flex items-center gap-2 mb-3 text-sm text-text-secondary flex-wrap">
                                    {roleBadge && <RoleBadge variant={roleBadge} />}
                                    <span className="font-semibold uppercase tracking-wide text-accent text-xs">{service}</span>
                                    <span className="bg-black/30 px-2 py-0.5 rounded text-xs border border-white/10">{eventEnvironmentLabel(event)}</span>
                                </div>
                                <Link to={`/events/${id}`} className="block group/link">
                                    <h3 className="m-0 mb-3 text-lg font-medium text-text-primary group-hover/link:text-accent transition-colors">{summary}</h3>
                                </Link>
                                <div className="flex flex-wrap gap-4 text-sm text-text-muted border-t border-border pt-3 mt-1">
                                    {meta?.author && (
                                        <div className="flex items-center gap-1.5 text-xs">
                                            <User size={14} />
                                            {meta.author}
                                        </div>
                                    )}
                                    {shortSha && (
                                        <div className="flex items-center gap-1.5 font-mono text-xs bg-bg-tertiary px-1.5 rounded">
                                            <GitCommit size={14} />
                                            {commitUrl ? (
                                                <a
                                                    href={commitUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="hover:text-accent transition-colors"
                                                    onClick={e => e.stopPropagation()}
                                                >
                                                    {shortSha}
                                                </a>
                                            ) : (
                                                shortSha
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Risk & Time */}
                            <div className="col-span-4 text-right flex flex-col items-end justify-between">
                                <div className="text-text-muted font-mono text-xs">
                                    {time_before_incident && (
                                        <span className="text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20 block mb-1 text-xs">
                                            {time_before_incident}
                                        </span>
                                    )}
                                    {date}
                                </div>
                                {riskAssessment && (
                                    <div className="flex flex-col items-center">
                                        <RiskScoreRing score={score} level={level} />
                                        <span className="text-[10px] text-text-muted">Risk /100</span>
                                        <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-xs text-text-muted hover:text-accent flex items-center gap-1">
                                            Risk rationale
                                            <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {event.lifecycleEvents?.length > 1 && <details className="p-4 border-t border-white/10 text-xs"><summary className="text-accent cursor-pointer">{event.lifecycleEvents.length} deployment lifecycle / associated push events (grouped)</summary><ul className="mt-2 space-y-2">{event.lifecycleEvents.map(child => <li key={child.id}><Link className="text-accent underline" to={`/events/${encodeURIComponent(child.id)}`}>{child.relatedPush ? "Associated push" : child.type}: {child.summary}</Link> · {utcTimestamp(child.occurred_at)}</li>)}</ul></details>}
                    {isExpanded && riskAssessment && (
                        <div className="p-5 border-t border-white/5 bg-black/20">
                            <ScoreEvidence assessment={riskAssessment} eventId={id} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
