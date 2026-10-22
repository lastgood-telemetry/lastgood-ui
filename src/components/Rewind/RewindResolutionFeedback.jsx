import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Check, MessageSquarePlus } from 'lucide-react';
import api from '../../api';
import { capture } from '../../util/posthog';
import { buildSuspectSignature, culpritOptions } from '../../util/rewindResolution';

dayjs.extend(utc);

// Saves "what worked" after a Rewind session. Saved notes stay inside the org and
// later power similar-incident suggestions for teammates.
const RewindResolutionFeedback = ({ scoringResult, queryParams, incidentId = '' }) => {
  const items = scoringResult?.individual_scores || scoringResult?.individualScores || [];
  const [text, setText] = useState('');
  const [culprit, setCulprit] = useState('');
  const [tag, setTag] = useState('');
  const [state, setState] = useState('idle'); // idle | saving | saved | failed
  const [savedBy, setSavedBy] = useState('');
  if (!queryParams) return null;
  const options = culpritOptions(items);
  const canSave = text.trim().length > 0 && state !== 'saving';

  const submit = async (event) => {
    event.preventDefault();
    if (!canSave) return;
    setState('saving');
    const body = {
      incident_at: dayjs.utc(queryParams.incidentTime).toISOString(),
      window_minutes: queryParams.windowMinutes,
      resolution_text: text.trim(),
      suspect_signature: buildSuspectSignature(items),
      ...(queryParams.service ? { service: queryParams.service } : {}),
      ...(queryParams.environment ? { environment: queryParams.environment } : {}),
      ...(incidentId ? { incident_id: incidentId } : {}),
      ...(culprit ? { culprit_event_id: culprit } : {}),
      ...(tag.trim() ? { resolution_tag: tag.trim() } : {}),
    };
    try {
      const response = await api.post('/rewind/feedback', body);
      if (!response.data?.success) throw new Error(response.data?.message || 'Could not save feedback');
      setSavedBy(response.data.data?.created_by_name || '');
      setState('saved');
      capture('rewind_resolution_saved', {
        service: queryParams.service || 'all',
        environment: queryParams.environment || 'all',
        has_culprit: !!culprit,
        has_tag: !!tag.trim(),
        linked_incident: !!incidentId,
      });
    } catch {
      // The shared API layer already toasts the server's message.
      setState('failed');
    }
  };

  if (state === 'saved') {
    return <div role="status" className="border border-accent/40 bg-accent/5 rounded-[4px] p-4 flex items-center gap-3">
      <Check size={18} className="text-accent shrink-0" />
      <p className="text-sm text-text-secondary">Saved{savedBy ? ` as ${savedBy}` : ''}. The next time someone on your team investigates a similar change, this note is what they will see.</p>
    </div>;
  }

  return <form onSubmit={submit} aria-label="Resolution feedback" className="border border-white/10 rounded-[4px] bg-surface p-4 md:p-6 space-y-4">
    <div className="space-y-1">
      <p className="text-sm font-mono text-text-muted uppercase tracking-wider flex items-center gap-2"><MessageSquarePlus size={14} className="text-accent" /> Did this fix it?</p>
      <p className="text-base text-text-secondary">Add what worked. Your team sees this note the next time a similar change ranks high.</p>
    </div>
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={3}
      maxLength={2000}
      required
      placeholder="e.g. Rolled back migration 048 and the errors stopped."
      className="w-full bg-paper border border-white/10 hover:border-white/20 rounded-[4px] px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-accent transition-all"
    />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.length > 0 && <div>
        <label htmlFor="rewind-culprit" className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 block uppercase">Which change caused it? (optional)</label>
        <select
          id="rewind-culprit"
          value={culprit}
          onChange={(e) => setCulprit(e.target.value)}
          className="w-full bg-paper border border-white/10 hover:border-white/20 rounded-[4px] px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-accent cursor-pointer"
        >
          <option value="">Not sure yet</option>
          {options.map(option => <option key={option.id} value={option.id}>{option.label}</option>)}
        </select>
      </div>}
      <div>
        <label htmlFor="rewind-resolution-tag" className="text-[11px] font-mono font-semibold text-zinc-400 mb-1.5 block uppercase">Tag (optional)</label>
        <input
          id="rewind-resolution-tag"
          type="text"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          maxLength={100}
          placeholder="db-timeout, bad-config..."
          className="w-full bg-paper border border-white/10 hover:border-white/20 rounded-[4px] px-3 py-2 text-xs font-mono text-white placeholder:text-text-muted focus:outline-none focus:border-accent"
        />
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="submit"
        disabled={!canSave}
        className="w-full md:w-auto justify-center bg-mint hover:bg-mint-soft disabled:opacity-50 disabled:cursor-not-allowed text-paper font-semibold px-4 py-2 rounded-[4px] text-xs transition-all cursor-pointer"
      >
        {state === 'saving' ? 'Saving...' : 'Save what worked'}
      </button>
      {state === 'failed' && <p role="alert" className="text-sm text-rose-300">Not saved. Check the error and try again.</p>}
    </div>
  </form>;
};

export default RewindResolutionFeedback;
