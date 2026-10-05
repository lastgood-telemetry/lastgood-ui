import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import ScoreEvidence from '../Evidence/ScoreEvidence';
import { eventEnvironmentLabel, utcTimestamp, suspectedWording } from '../../util/console';

const itemScore = item => {
  const r = item.risk_assessment || item.riskAssessment || item.score || {};
  return typeof r.score === 'number' ? r.score : (typeof item.score === 'number' ? item.score : null);
};
const leadTime = (change, incidentTime) => {
  const at = new Date(change.occurred_at).getTime();
  const inc = incidentTime ? new Date(`${incidentTime}Z`).getTime() : NaN;
  if (Number.isNaN(at) || Number.isNaN(inc)) return null;
  const m = Math.round((inc - at) / 60000);
  if (m < 0) return `${Math.abs(m)} min after incident time`;
  if (m < 1) return 'at incident time';
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m before` : `${m} min before`;
};

// Risk scores rank investigation candidates. They are never causal confidence.
const SignalRow = ({ item, index, primary, incidentTime }) => {
  const change = item.event || item;
  const score = itemScore(item);
  const lead = leadTime(change, incidentTime);
  const meta = [change.meta?.author, change.meta?.commit && String(change.meta.commit).slice(0, 7), change.meta?.version].filter(Boolean).join(' · ');
  return <li className={`grid grid-cols-[auto,1fr,auto] gap-x-3 gap-y-1 items-start p-3 ${item === primary ? 'bg-accent/5' : ''}`}>
    <span className="text-xs font-mono text-text-muted pt-0.5">#{index + 1}</span>
    <div className="min-w-0 space-y-1">
      <p className="text-sm text-white font-medium break-words">{change.summary || change.type || 'Change'}{item === primary && <span className="ml-2 text-[11px] font-mono uppercase text-accent border border-accent/40 rounded-[4px] px-1.5 py-0.5 align-middle">Suspected contributor</span>}</p>
      <p className="text-xs text-text-secondary break-words">{change.service || 'Unspecified'} / {eventEnvironmentLabel(change)}{lead && <> · <span className="text-white">{lead}</span></>}</p>
      <p className="text-xs text-text-muted break-words">{utcTimestamp(change.occurred_at)} · {meta || 'Author unavailable'}</p>
    </div>
    <div className="text-right"><p className="text-sm font-mono font-semibold text-white">{score ?? '-'}<span className="text-text-muted text-xs">/100</span></p><p className="text-[10px] uppercase tracking-wider text-text-muted">risk</p></div>
  </li>;
};

export const RewindIncidentBrief = ({ scoringResult, queryParams }) => {
  if (!scoringResult) return null;
  const items = scoringResult.individual_scores || scoringResult.individualScores || [];
  const ai = scoringResult.ai_diagnosis || scoringResult.aiDiagnosis || {};
  const assessment = scoringResult.overall_assessment || scoringResult.overallScore || {};
  const primary = items.find(item => item.role === 'primary') || items[0];
  if (!primary) return <div className="border border-white/10 rounded p-6 text-center space-y-2">
    <Clock size={20} className="mx-auto text-accent" />
    <h2 className="text-white font-semibold">No changes in this window</h2>
    <p className="text-sm text-text-muted">No events found in the last {queryParams?.windowMinutes || 30} minutes. This does not rule out other causes.</p>
  </div>;
  const event = primary.event || primary;
  const risk = primary.risk_assessment || primary.riskAssessment || {};
  const service = queryParams?.service || event.service || 'Service unspecified';
  const env = queryParams?.environment ? eventEnvironmentLabel({ environment: queryParams.environment }) : eventEnvironmentLabel(event);
  const reportedConfidence = ai.confidence_label || ai.confidence;
  const confidence = typeof reportedConfidence === 'string' && /^(high|medium|low)( confidence)?$/i.test(reportedConfidence.trim())
    ? `${reportedConfidence.replace(/ confidence$/i, '')} confidence (reported by AI)` : 'Confidence not reported';
  const recommendations = [...new Set([ai.recommended_action, ...(assessment.recommendations || scoringResult.recommendations || []), ...(risk.recommendations || [])].filter(value => typeof value === 'string' && value.trim()))];
  const action = recommendations[0] || `Check ${event.service || 'the affected service'} logs and metrics against this change before choosing a mitigation.`;
  const cause = suspectedWording(ai.primary_cause_headline || event.summary || event.type || 'Change to investigate');
  return <section className="max-w-5xl mx-auto border border-white/10 rounded bg-[#151b18] overflow-hidden" aria-label="Incident brief">
    <div className="p-4 md:p-6 space-y-6">
      <div className="space-y-1">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Investigating</p>
        <h2 className="text-xl md:text-2xl font-semibold text-white break-words">{service} <span className="text-text-muted font-normal">/ {env}</span></h2>
        <p className="text-xs text-text-muted">Incident scope, not a verified outage{queryParams?.incidentTime ? ` · ${utcTimestamp(`${queryParams.incidentTime}Z`)}` : ''}</p>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Suspected cause</p>
        <p className="text-base md:text-lg text-white font-medium break-words">{cause}</p>
        <p className="text-xs text-text-secondary">{confidence} · Verify against incident evidence.</p>
      </div>
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-mono text-text-muted uppercase tracking-wider">Ranked changes in window ({items.length})</p>
          <p className="text-[11px] text-text-muted">Risk ranks investigation order, not causation</p>
        </div>
        <ol className="border border-white/10 rounded-[4px] divide-y divide-white/10">{items.slice(0, 3).map((item, i) => <SignalRow key={(item.event || item).id || i} item={item} index={i} primary={primary} incidentTime={queryParams?.incidentTime} />)}</ol>
        {items.length > 3 && <details className="text-sm">
          <summary className="cursor-pointer text-text-secondary hover:text-accent">Show {items.length - 3} more</summary>
          <ol className="mt-2 border border-white/10 rounded-[4px] divide-y divide-white/10">{items.slice(3).map((item, i) => <SignalRow key={(item.event || item).id || i + 3} item={item} index={i + 3} primary={primary} incidentTime={queryParams?.incidentTime} />)}</ol>
        </details>}
      </div>
      <div className="border-l-2 border-accent pl-4 space-y-2">
        <p className="text-xs font-mono text-accent uppercase tracking-wider">Next step</p>
        <p className="text-sm md:text-base text-white leading-relaxed break-words">{action}</p>
        <p className="text-xs text-text-muted">Suggested action. Nothing is executed by LastGood.</p>
        {recommendations.length > 1 && <details className="text-sm pt-1">
          <summary className="cursor-pointer text-text-secondary hover:text-accent">More options ({recommendations.length - 1})</summary>
          <ul className="mt-3 space-y-2 list-disc pl-4 text-text-secondary">{recommendations.slice(1).map(rec => <li key={rec}>{rec}</li>)}</ul>
        </details>}
      </div>
    </div>
    <details className="border-t border-white/10 p-4 md:px-6 text-sm">
      <summary className="cursor-pointer text-accent font-medium focus-visible:outline focus-visible:outline-2">Why we think this</summary>
      <div className="mt-5 space-y-5 min-w-0">
        <p className="text-text-secondary leading-relaxed">{suspectedWording(ai.executive_summary || assessment.explanation || 'Changes are ranked for investigation, not confirmed causes.')}</p>
        <ScoreEvidence assessment={assessment} label="Risk ranking and factors (not causal confidence)" />
        <div>
          <h3 className="text-white font-medium mb-3">Per-change evidence</h3>
          <ol className="space-y-3">{items.map((item, index) => {
            const change = item.event || item;
            return <li key={change.id || index} className="border border-white/10 rounded-[4px] p-3 space-y-2 text-xs text-text-secondary">
              <p className="text-white font-medium break-words">#{index + 1} {change.summary || change.type || 'Change'}</p>
              {change.id && <Link to={`/events/${encodeURIComponent(change.id)}`} className="inline-flex items-center gap-1 text-accent underline">Inspect source event <ArrowUpRight size={12} /></Link>}
              {item.risk_assessment && <ScoreEvidence assessment={item.risk_assessment} label="Change factors" />}
            </li>;
          })}</ol>
        </div>
        {(scoringResult.correlations || []).length > 0 && <div className="space-y-2">
          <h3 className="text-white font-medium">Reported correlations</h3>
          {scoringResult.correlations.map((correlation, index) => <p key={index} className="text-xs text-text-secondary break-words">{correlation.description || correlation.explanation || correlation.type || 'Correlation reported'}{correlation.confidence != null ? ` · Reported correlation confidence: ${correlation.confidence}%` : ''}</p>)}
        </div>}
      </div>
    </details>
  </section>;
};
export default RewindIncidentBrief;
