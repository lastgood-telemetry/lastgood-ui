import { environmentLabel, eventEnvironmentLabel, utcTimestamp } from '../../util/console';
import React from 'react';
import { GitCommit, Box, ToggleRight, AlertTriangle, Database, ShieldAlert, ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';

const getIconForType = (type) => {
  const t = (type || '').toLowerCase();
  if (t.includes('migration') || t.includes('db')) return <Database size={16} />;
  if (t.includes('commit') || t.includes('push') || t.includes('github') || t.includes('deploy')) return <GitCommit size={16} />;
  if (t.includes('flag')) return <ToggleRight size={16} />;
  if (t.includes('alert') || t.includes('error')) return <AlertTriangle size={16} />;
  return <Box size={16} />;
};

const getRoleBadge = (role, level, causalPos) => {
  const posText = causalPos != null ? ` #${causalPos}` : '';
  if (role === 'primary') {
    return (
      <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-400 font-bold text-[9px] uppercase tracking-wider flex items-center gap-1 shadow-sm">
        <ShieldAlert size={10} /> Suspected contributor{posText}
      </span>
    );
  }
  if (role === 'contributing') {
    return (
      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-400 font-semibold text-[9px] uppercase tracking-wider flex items-center gap-1">
        <AlertTriangle size={10} /> Contributing{posText}
      </span>
    );
  }
  return null;
};

const RewindTimeline = ({ events, selectedEventId, onSelectEvent, windowMinutes }) => {
  if (!events || events.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-text-muted text-xs">
        No events in past <span className="text-accent font-mono font-bold">{windowMinutes || 30} minutes</span>.
      </div>
    );
  }

  return (
    <div className="relative border-l border-white/10 ml-3 py-2 space-y-4">
      {events.map((item) => {
        const event = item.event || item;
        const scoreObj = item.risk_assessment || item.riskAssessment || item.score || {};
        const score = typeof scoreObj.score === 'number' ? scoreObj.score : (typeof item.score === 'number' ? item.score : null);
        const level = scoreObj.level || (typeof item.score === 'object' ? item.score?.level : 'low');
        const role = item.role;
        const causalPos = item.causal_position ?? item.causalPosition;
        const eventId = event.id || item.id;
        const isSelected = eventId === selectedEventId;

        const timeFormatted = event.occurred_at
          ? utcTimestamp(event.occurred_at)
          : 'Unknown';

        const isHighRisk = score >= 50 || level === 'critical' || level === 'high';

        return (
          <div
            key={eventId}
            className="relative pl-6 group cursor-pointer"
            onClick={() => onSelectEvent(eventId)}
          >
            {/* Timeline Dot */}
            <div
              className={`absolute -left-2.5 top-2.5 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center transition-all ${
                isSelected ? 'scale-125 ring-2 ring-accent/50' : 'group-hover:scale-110'
              } ${
                role === 'primary' || score >= 70 || level === 'critical'
                  ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                  : isHighRisk
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-blue-500/20 border-blue-500 text-blue-400'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  role === 'primary' || score >= 70 || level === 'critical'
                    ? 'bg-rose-500'
                    : isHighRisk
                    ? 'bg-amber-500'
                    : 'bg-blue-400'
                }`}
              />
            </div>

            {/* Event Card */}
            <div
              className={`p-4 rounded-xl border transition-all duration-200 ${
                isSelected
                  ? 'bg-white/10 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.08)]'
                  : 'bg-[#0b0f0d]/40 border-white/5 hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-2 gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="p-1.5 rounded-md border border-white/10 bg-white/5 text-accent">
                    {getIconForType(event.type)}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                    {event.service}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                    {eventEnvironmentLabel(event)}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-text-muted shrink-0">{timeFormatted}</span>
              </div>

              {/* Title / Summary */}
              <h4 className="text-xs font-semibold text-white mb-2 line-clamp-2">
                {event.summary || `${event.type} to ${event.service}`}
              </h4>

              {/* Role Badges & Risk Tag */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
                <div className="flex items-center gap-2 flex-wrap">
                  {getRoleBadge(role, level, causalPos)}
                  <span className="text-text-muted text-[10px]">
                    By: <span className="text-white font-medium">{event.meta?.author || event.source || 'CI/CD'}</span>
                  </span>
                </div>

                <span
                  className={`font-mono font-bold text-[11px] px-1.5 py-0.5 rounded ${
                    score >= 70 || level === 'critical'
                      ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20'
                      : score >= 45 || level === 'medium' || level === 'high'
                      ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
                      : 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20'
                  }`}
                >
                  Risk: {score ?? "Not supplied"}/100
                </span>
              </div>

              {/* Expanded details when selected */}
              {isSelected && event.meta && (
                <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-text-muted space-y-1.5 animate-in fade-in duration-200">
                  {event.meta.commit && (() => {
                    const commitUrl = event.meta.commit_url || event.meta.url || (event.meta.repository ? `https://github.com/${event.meta.repository}/commit/${event.meta.commit}` : null);
                    return (
                      <div className="flex items-center justify-between">
                        <span>Commit Hash:</span>
                        {commitUrl ? (
                          <a
                            href={commitUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="font-mono text-accent text-[10px] bg-accent/10 hover:bg-accent/20 border border-accent/20 px-1.5 py-0.5 rounded inline-flex items-center gap-1 font-bold"
                            title="View Commit on GitHub"
                          >
                            {event.meta.commit.substring(0, 7)} <ExternalLink size={10} />
                          </a>
                        ) : (
                          <code className="font-mono text-accent text-[10px] bg-accent/10 px-1.5 py-0.5 rounded">
                            {event.meta.commit.substring(0, 7)}
                          </code>
                        )}
                      </div>
                    );
                  })()}
                  {event.meta.branch && (
                    <div className="flex items-center justify-between">
                      <span>Branch:</span>
                      <span className="font-mono text-white text-[10px]">{event.meta.branch}</span>
                    </div>
                  )}
                  {event.meta.version && (
                    <div className="flex items-center justify-between">
                      <span>Version:</span>
                      <span className="font-mono text-white text-[10px]">{event.meta.version}</span>
                    </div>
                  )}
                  {event.meta.tables_affected && (
                    <div className="flex items-center justify-between">
                      <span>Tables Affected:</span>
                      <span className="font-mono text-white text-[10px]">
                        {event.meta.tables_affected.join(', ')}
                      </span>
                    </div>
                  )}
                  {event.meta.diff_stats?.files_changed_count > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Files Changed:</span>
                      <span className="font-mono text-white text-[10px]">
                        {event.meta.diff_stats.files_changed_count} files
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RewindTimeline;
