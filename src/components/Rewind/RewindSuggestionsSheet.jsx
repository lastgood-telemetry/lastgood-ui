import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { X, Lightbulb, User } from 'lucide-react';
import api from '../../api';
import useOrgStore from '../../stores/useOrgStore';
import { capture } from '../../util/posthog';
import { suggestionQueryParams } from '../../util/rewindResolution';
import { environmentLabel } from '../../util/console';

// Pure presentational panel: one card per matched past resolution. Exported so it can
// be rendered and screenshot-tested without the query layer.
export const SuggestionsPanel = ({ suggestions, onDismiss }) => (
  <>
    <div className="fixed inset-0 bg-deep/70 backdrop-blur-sm z-40" onClick={onDismiss} aria-hidden="true" />
    <aside
      role="dialog"
      aria-label="Similar issues solved before"
      className="fixed z-50 bg-surface border border-border shadow-2xl flex flex-col inset-x-0 bottom-0 max-h-[80vh] rounded-t-xl md:inset-y-0 md:left-auto md:right-0 md:bottom-0 md:max-h-none md:w-[26rem] md:rounded-none md:border-y-0 md:border-r-0"
    >
      <div className="flex items-start justify-between gap-3 p-4 md:p-5 border-b border-border">
        <div className="space-y-1">
          <p className="text-sm font-mono text-text-muted uppercase tracking-wider flex items-center gap-2"><Lightbulb size={14} className="text-accent" /> Solved here before</p>
          <p className="text-sm text-text-secondary">What worked last time something similar ranked high. Check it fits before repeating it.</p>
        </div>
        <button type="button" onClick={onDismiss} aria-label="Dismiss suggestions" className="text-text-muted hover:text-white p-1 cursor-pointer shrink-0">
          <X size={18} />
        </button>
      </div>
      <div className="overflow-y-auto p-4 md:p-5 space-y-4">
        {suggestions.map(suggestion => (
          <article key={suggestion.id} className="border border-border rounded-[4px] bg-paper p-4 space-y-3">
            <p className="text-sm text-text-primary">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <User size={13} className="text-accent" />
                {suggestion.is_own ? 'You' : suggestion.created_by_name || 'A teammate'}
              </span>
              <span className="text-text-secondary"> solved a similar issue {dayjs(suggestion.created_at).fromNow()}:</span>
            </p>
            <p className="text-sm text-white whitespace-pre-wrap break-words">{suggestion.resolution_text}</p>
            <p className="text-xs text-text-muted font-mono">
              {suggestion.service === '*' ? 'All services' : suggestion.service}
              {' \u00b7 '}{suggestion.environment === 'all' ? 'all environments' : environmentLabel(suggestion.environment)}
              {suggestion.alert_title ? ` \u00b7 Alert: ${suggestion.alert_title}` : ''}
            </p>
            {suggestion.resolution_tag && (
              <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-accent border border-accent/40 rounded-[4px] px-1.5 py-0.5">{suggestion.resolution_tag}</span>
            )}
            {Array.isArray(suggestion.match_reasons) && suggestion.match_reasons.length > 0 && (
              <div className="border-t border-border pt-2 space-y-1">
                <p className="text-[11px] font-mono font-semibold text-zinc-400 uppercase">Why this matched</p>
                <ul className="text-xs text-text-secondary list-disc list-inside space-y-0.5">
                  {suggestion.match_reasons.map(reason => <li key={reason}>{reason}</li>)}
                </ul>
              </div>
            )}
          </article>
        ))}
      </div>
    </aside>
  </>
);

// "A teammate solved a similar issue before." Deterministic matches from the org's
// saved Rewind resolutions - fingerprint, suspect type/content overlap, then service
// and environment as bonuses. Renders nothing when there is nothing to show.
const RewindSuggestionsSheet = ({ scoringResult, queryParams, incidentId = '' }) => {
  const orgId = useOrgStore(state => state.org?.id);
  const items = scoringResult?.individual_scores || scoringResult?.individualScores || [];
  const scopeKey = queryParams
    ? `${queryParams.incidentTime}|${queryParams.windowMinutes}|${queryParams.service}|${queryParams.environment}|${incidentId}`
    : '';
  const [open, setOpen] = useState(false);
  const [dismissedKey, setDismissedKey] = useState('');

  const { data } = useQuery({
    queryKey: ['rewind-suggestions', orgId, scopeKey],
    enabled: !!orgId && !!queryParams,
    staleTime: 30 * 1000,
    queryFn: async () => {
      const params = suggestionQueryParams(queryParams, items, incidentId);
      const response = await api.get('/rewind/suggestions', { params, skipToast: true });
      if (!response.data?.success) throw new Error('Could not load suggestions');
      return response.data.data?.suggestions || [];
    },
  });
  const suggestions = Array.isArray(data) ? data : [];

  // Auto-open once per rewind scope when a match arrives; a dismissal sticks for that scope.
  useEffect(() => {
    if (suggestions.length && dismissedKey !== scopeKey) {
      setOpen(true);
      capture('rewind_suggestions_shown', { count: suggestions.length, own: suggestions.some(s => s.is_own) });
    }
  }, [suggestions.length, scopeKey, dismissedKey]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  if (!queryParams || !suggestions.length) return null;

  const dismiss = () => { setOpen(false); setDismissedKey(scopeKey); };

  return <>
    {!open && (
      <div className="border border-accent/30 bg-accent/5 rounded-[4px] p-3 md:p-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-text-secondary flex items-center gap-2 min-w-0">
          <Lightbulb size={16} className="text-accent shrink-0" />
          <span className="truncate">
            {suggestions[0].is_own ? 'You solved' : `${suggestions[0].created_by_name || 'A teammate'} solved`} a similar issue before
            {suggestions.length > 1 ? ` (+${suggestions.length - 1} more)` : ''}.
          </span>
        </p>
        <button type="button" onClick={() => setOpen(true)} className="w-full md:w-auto justify-center border border-accent/40 hover:bg-accent/10 text-accent font-semibold px-4 py-2 rounded-[4px] text-xs cursor-pointer">
          See what worked
        </button>
      </div>
    )}

    {open && <SuggestionsPanel suggestions={suggestions} onDismiss={dismiss} />}
  </>;
};

export default RewindSuggestionsSheet;
