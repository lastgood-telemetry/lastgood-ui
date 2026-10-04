import React from 'react';
import { Link } from 'react-router-dom';

export function EvidenceValue({ value }) {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const url = typeof value === 'object' ? value?.url : text;
  const id = typeof value === 'object' ? value?.event_id || value?.eventId : null;
  if (id) return <Link className="text-accent underline" to={`/events/${encodeURIComponent(id)}`}>{value?.label || 'Source event'}</Link>;
  if (typeof url === 'string' && /^https?:\/\//i.test(url)) return <a className="text-accent underline break-all" href={url} target="_blank" rel="noopener noreferrer">{value?.label || url}</a>;
  return <span className="break-words">{text}</span>;
}

export default function ScoreEvidence({ assessment = {}, eventId, label = 'Risk score rationale' }) {
  const factors = Array.isArray(assessment.factors) ? assessment.factors : [];
  return <details className="p-3 rounded-lg border border-white/10 bg-white/[0.02] text-xs text-text-secondary">
    <summary className="cursor-pointer text-accent font-semibold focus-visible:outline focus-visible:outline-2">{label}</summary>
    <div className="mt-3 space-y-3">
      <p>Risk ranks changes for investigation on a 0-100 scale. It is not incident severity or a probability that a change caused the incident. Confidence describes the strength of a correlation, not proof.</p>
      {assessment.explanation && <p>{assessment.explanation}</p>}
      {factors.length ? factors.map((factor, index) => <div key={index} className="border-t border-white/10 pt-2 space-y-1">
        <p className="font-semibold text-white">{factor.name}: {factor.score ?? 'Not supplied'}/100{factor.weight != null && ` · API weight ${factor.weight}`}</p>
        <p>{factor.description}</p>
        {Array.isArray(factor.evidence) && <ul className="list-disc pl-4 space-y-1">{factor.evidence.map((value, i) => <li key={i}><EvidenceValue value={value} /></li>)}</ul>}
      </div>) : <p>The API did not supply a factor breakdown. No calculation or evidence has been inferred.</p>}
      {eventId && <Link className="text-accent underline block" to={`/events/${encodeURIComponent(eventId)}`}>Inspect source event and raw payload</Link>}
      <Link className="text-accent underline block" to="/events">Browse supporting change events</Link>
    </div>
  </details>;
}
