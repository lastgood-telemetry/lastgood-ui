import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock } from 'lucide-react';
import ScoreEvidence from '../Evidence/ScoreEvidence';
import { eventEnvironmentLabel, utcTimestamp, suspectedWording } from '../../util/console';

// Risk scores rank investigation candidates. They are never causal confidence.
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
          <h3 className="text-white font-medium mb-3">Changes in the incident window</h3>
          <ol className="space-y-3">{items.map((item, index) => {
            const change = item.event || item;
            return <li key={change.id || index} className="border border-white/10 rounded p-3 space-y-1 text-xs text-text-secondary">
              <p className="text-white font-medium break-words">{change.summary || change.type || 'Change'}{item === primary && <span className="text-accent"> · Suspected contributor</span>}</p>
              <p className="break-words">{change.service || 'Unspecified'} / {eventEnvironmentLabel(change)} · {utcTimestamp(change.occurred_at)}</p>
              <p className="break-words">{change.meta?.author || 'Author unavailable'}{change.meta?.commit ? ` · ${String(change.meta.commit).slice(0, 7)}` : ''}{change.meta?.version ? ` · ${change.meta.version}` : ''}</p>
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
