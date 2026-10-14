import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Check, Clock, Copy } from 'lucide-react';
import { diagnosisTerminalState } from '../../util/diagnosisTerminal';
import DiagnosisTerminal from './DiagnosisTerminal';
import ScoreEvidence from '../Evidence/ScoreEvidence';
import { eventEnvironmentLabel, utcTimestamp, suspectedWording } from '../../util/console';
import { itemScore, leadTime, LEVEL_LABEL, plainReasons, contentFlags, buildCopySummary } from '../../util/rewindBrief';

// Risk scores rank investigation candidates. They are never causal confidence.
const LEVEL_STYLE = {
  critical: 'text-rose-300 border-rose-400/50 bg-rose-500/10',
  high: 'text-amber-300 border-amber-400/50 bg-amber-500/10',
  medium: 'text-yellow-200 border-yellow-300/40 bg-yellow-300/10',
  low: 'text-text-secondary border-white/20 bg-white/5',
};

const SignalRow = ({ item, index, incidentTime, highlighted = false, compact = false }) => {
  const change = item.event || item;
  const score = itemScore(item);
  const lead = leadTime(change, incidentTime);
  const risk = item.risk_assessment || item.riskAssessment || {};
  const ruledOut = !!risk.ruled_out;
  const meta = [change.meta?.author, change.meta?.commit && String(change.meta.commit).slice(0, 7), change.meta?.version].filter(Boolean).join(' · ');
  return <li data-highlighted={highlighted || undefined} className={`grid grid-cols-[auto,1fr,auto] gap-x-3 items-start p-3 md:p-4 ${ruledOut ? 'opacity-60' : ''} ${highlighted ? 'ring-1 ring-inset ring-accent bg-accent/10' : ''}`}>
    <span className="text-sm font-mono text-text-muted pt-0.5">#{index + 1}</span>
    <div className="min-w-0 space-y-1">
      <p className="text-base text-white font-medium break-words">{change.summary || change.type || 'Change'}</p>
      <p className="text-sm text-text-secondary break-words">{highlighted && <span className="mr-2 text-xs font-mono uppercase text-accent border border-accent/40 rounded-[4px] px-1.5 py-0.5">Linked from alert</span>}{ruledOut && <span className="mr-2 text-xs font-mono uppercase text-text-muted border border-white/20 rounded-[4px] px-1.5 py-0.5">Ruled out</span>}{change.service || 'Unspecified'} / {eventEnvironmentLabel(change)}{lead && <> · <span className="text-white">{lead}</span></>}</p>
      {!compact && <p className="text-sm text-text-muted break-words">{utcTimestamp(change.occurred_at)} · {meta || 'Author unavailable'}</p>}
    </div>
    <div className="text-right"><p className="text-base font-mono font-semibold text-white">{score ?? '-'}<span className="text-text-muted text-sm">/100</span></p></div>
  </li>;
};

const CopyButton = ({ getText }) => {
  const [state, setState] = useState('idle');
  const copy = async () => {
    const text = getText();
    try {
      if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
      else {
        const area = document.createElement('textarea');
        area.value = text; area.setAttribute('readonly', ''); area.style.position = 'fixed'; area.style.opacity = '0';
        document.body.appendChild(area); area.select(); document.execCommand('copy'); document.body.removeChild(area);
      }
      setState('copied');
    } catch { setState('failed'); }
    setTimeout(() => setState('idle'), 2500);
  };
  return <button type="button" onClick={copy} className="inline-flex items-center gap-2 text-sm font-medium text-accent border border-accent/40 rounded-[4px] px-3 py-2 hover:bg-accent/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent shrink-0">
    {state === 'copied' ? <Check size={16} /> : <Copy size={16} />}
    <span role="status" aria-live="polite">{state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : 'Copy analysis'}</span>
  </button>;
};

export const RewindIncidentBrief = ({ scoringResult, queryParams, diagnosisState, diagnosisStage, onRerunDiagnosis, rerunning = false, highlightId = '' }) => {
  if (!scoringResult) return null;
  const items = scoringResult.individual_scores || scoringResult.individualScores || [];
  const ai = scoringResult.ai_diagnosis || scoringResult.aiDiagnosis || {};
  const assessment = scoringResult.overall_assessment || scoringResult.overallScore || {};
  const correlations = scoringResult.correlations || [];
  const primary = items.find(item => item.role === 'primary') || items[0];
  if (!primary) return <div className="border border-white/10 rounded p-6 text-center space-y-2">
    <Clock size={20} className="mx-auto text-accent" />
    <h2 className="text-white font-semibold text-lg">No changes in this window</h2>
    <p className="text-base text-text-muted">No events found in the last {queryParams?.windowMinutes || 30} minutes. This does not rule out other causes.</p>
  </div>;
  const others = items.filter(item => item !== primary);
  const event = primary.event || primary;
  const risk = primary.risk_assessment || primary.riskAssessment || {};
  const service = queryParams?.service || event.service || 'Service unspecified';
  const env = queryParams?.environment ? eventEnvironmentLabel({ environment: queryParams.environment }) : eventEnvironmentLabel(event);
  const reportedConfidence = ai.confidence_label || ai.confidence;
  const confidence = typeof reportedConfidence === 'string' && /^(high|medium|low)( confidence)?$/i.test(reportedConfidence.trim())
    ? `${reportedConfidence.replace(/ confidence$/i, '')} confidence (reported by AI)` : null;
  const recommendations = [...new Set([ai.recommended_action, ...(assessment.recommendations || scoringResult.recommendations || []), ...(risk.recommendations || [])].filter(value => typeof value === 'string' && value.trim()))];
  const action = recommendations[0] || `Check ${event.service || 'the affected service'} logs and metrics against this change before choosing a mitigation.`;
  const cause = suspectedWording(event.summary || ai.primary_cause_headline || event.type || 'Change to investigate');
  const reasons = plainReasons(risk);
  const flags = contentFlags(risk);
  const level = risk.level;
  const lead = leadTime(event, queryParams?.incidentTime);
  const score = itemScore(primary);
  const highlightBeyondTop = !!highlightId && items.findIndex(item => (item.event || item).id === highlightId) > 2;
  const getSummary = () => buildCopySummary({ items, queryParams, correlations, envLabel: env, url: typeof window !== 'undefined' ? window.location.href : '' });
  const rowProps = (item, i) => ({ item, index: items.indexOf(item), incidentTime: queryParams?.incidentTime, highlighted: !!highlightId && (item.event || item).id === highlightId });
  return <section className="w-full space-y-6 text-base" aria-label="Incident brief">
    <div className="border border-white/10 rounded bg-surface p-4 md:p-6 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-mono text-text-muted uppercase tracking-wider">Investigating</p>
          <p className="text-lg text-white break-words">{service} <span className="text-text-muted">/ {env}</span>{queryParams?.incidentTime ? <span className="text-text-muted text-sm"> · {utcTimestamp(`${queryParams.incidentTime}Z`)}</span> : null}</p>
        </div>
        <CopyButton getText={getSummary} />
      </div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-mono uppercase text-accent tracking-wider">Prime suspect</span>
          {level && <span className={`text-sm font-mono uppercase border rounded-[4px] px-2 py-0.5 ${LEVEL_STYLE[level] || LEVEL_STYLE.low}`}>{LEVEL_LABEL[level] || level} risk{score != null ? ` · ${score}/100` : ''}</span>}
        </div>
        <h2 className="text-2xl md:text-4xl font-semibold text-white leading-tight break-words">{cause}</h2>
        <p className="text-lg text-text-secondary break-words"><span className="text-white">{event.service || 'Unspecified service'}</span>{lead && <> · <span className="text-white">{lead.endsWith('before') ? `${lead} the incident` : lead}</span></>}{event.meta?.author ? ` · ${event.meta.author}` : ''}</p>
        {flags.length > 0 && <div className="flex flex-wrap gap-2">{flags.map(flag => <span key={flag} className="text-sm font-mono text-amber-200 border border-amber-300/40 bg-amber-300/10 rounded-[4px] px-2 py-0.5">Touches {flag}</span>)}</div>}
      </div>
      {reasons.length > 0 && <div className="space-y-2">
        <p className="text-sm font-mono text-text-muted uppercase tracking-wider">Why</p>
        <ul className="space-y-1.5 list-disc pl-5 text-base md:text-lg text-white leading-relaxed">{reasons.map(reason => <li key={reason} className="break-words">{suspectedWording(reason)}</li>)}</ul>
      </div>}
      <p className="text-sm text-text-muted">{confidence || 'Rule-based ranking'} · Risk ranks investigation order, not causation. Verify against incident evidence.</p>
      {others.length > 0 && <div className="space-y-2">
        <p className="text-sm font-mono text-text-muted uppercase tracking-wider">Also check</p>
        <ol className="border border-white/10 rounded-[4px] divide-y divide-white/10">{others.slice(0, 2).map((item, i) => <SignalRow key={i} {...rowProps(item, i)} compact />)}</ol>
      </div>}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.35fr),minmax(0,1fr)] gap-6 items-start">
      <div className="min-w-0 space-y-6">
        <div className="border-l-2 border-accent pl-4 space-y-2">
          <p className="text-sm font-mono text-accent uppercase tracking-wider">Next step</p>
          <p className="text-lg text-white leading-relaxed break-words">{action}</p>
          <p className="text-sm text-text-muted">Suggested action. Nothing is executed by LastGood.</p>
          {recommendations.length > 1 && <details className="pt-1">
            <summary className="cursor-pointer text-text-secondary hover:text-accent">More options ({recommendations.length - 1})</summary>
            <ul className="mt-3 space-y-2 list-disc pl-4 text-text-secondary">{recommendations.slice(1).map(rec => <li key={rec}>{rec}</li>)}</ul>
          </details>}
        </div>

        {items.length > 3 && <details className="border border-white/10 rounded bg-surface" open={highlightBeyondTop || undefined}>
          <summary className="cursor-pointer p-4 text-accent font-medium focus-visible:outline focus-visible:outline-2">All ranked changes ({items.length})</summary>
          <ol className="border-t border-white/10 divide-y divide-white/10">{items.map((item, i) => <SignalRow key={i} {...rowProps(item, i)} />)}</ol>
        </details>}

        {correlations.length > 0 && <details className="border border-white/10 rounded bg-surface">
          <summary className="cursor-pointer p-4 text-accent font-medium focus-visible:outline focus-visible:outline-2">{correlations.length} related change{correlations.length === 1 ? '' : 's'}</summary>
          <div className="border-t border-white/10 p-4 space-y-3">
            <p className="text-sm text-text-muted">Corroboration only. These patterns can raise the overall score but do not prove a cause.</p>
            {correlations.map((correlation, index) => <p key={index} className="text-base text-text-secondary break-words">{correlation.description || correlation.explanation || correlation.type || 'Correlation reported'}{correlation.confidence != null ? ` · Reported correlation confidence: ${correlation.confidence}%` : ''}</p>)}
          </div>
        </details>}

        <details className="border border-white/10 rounded bg-surface">
          <summary className="cursor-pointer p-4 text-accent font-medium focus-visible:outline focus-visible:outline-2">Full evidence and factors</summary>
          <div className="border-t border-white/10 p-4 space-y-5 min-w-0">
            <p className="text-text-secondary leading-relaxed">{suspectedWording(assessment.explanation || 'Changes are ranked for investigation, not confirmed causes.')}</p>
            <ScoreEvidence assessment={assessment} label="Risk ranking and factors (not causal confidence)" />
            <div>
              <h3 className="text-white font-medium mb-3">Per-change evidence</h3>
              <ol className="space-y-3">{items.map((item, index) => {
                const change = item.event || item;
                return <li key={change.id || index} className="border border-white/10 rounded-[4px] p-3 space-y-2 text-sm text-text-secondary">
                  <p className="text-white font-medium break-words">#{index + 1} {change.summary || change.type || 'Change'}</p>
                  {change.id && <Link to={`/events/${encodeURIComponent(change.id)}`} className="inline-flex items-center gap-1 text-accent underline">Inspect source event <ArrowUpRight size={14} /></Link>}
                  {item.risk_assessment && <ScoreEvidence assessment={item.risk_assessment} label="Change factors" />}
                </li>;
              })}</ol>
            </div>
          </div>
        </details>
      </div>
      <DiagnosisTerminal diagnosis={ai} state={diagnosisState} stage={diagnosisStage} onRerun={onRerunDiagnosis} rerunning={rerunning} />
    </div>
  </section>;
};
export default RewindIncidentBrief;
