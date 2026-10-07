import React from 'react';
import { mockTimelineEvents } from './MockData';
import { Sparkles, ArrowRight, ShieldAlert, Cpu } from 'lucide-react';
import { RiskScoreRing } from '../RiskScoreRing/RiskScoreRing';

const AiDiagnosisPanel = ({ diagnosis, incident }) => {
  return (
    <div className="flex flex-col min-w-0 break-words bg-[#0b0f0d]/40 border border-white/5 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-white/5 bg-gradient-to-r from-accent/5 to-transparent flex flex-wrap items-start justify-between gap-4">
         <div>
            <div className="flex items-center gap-2 mb-2">
               <span className="px-2 py-1 bg-status-error/20 border border-status-error/30 text-status-error rounded text-xs font-bold uppercase tracking-widest">{incident.severity} SEVERITY</span>
               <span className="text-xs text-text-muted">{incident.id}</span>
            </div>
            <h2 className="text-lg font-bold text-white flex items-start gap-2">
               <ShieldAlert className="text-status-error shrink-0 mt-1" size={20} />
               {incident.title}
            </h2>
            <div className="text-xs text-text-secondary mt-1">Impacted Service: <span className="text-accent">{incident.service}</span></div>
         </div>
         <div className="w-20 shrink-0 flex flex-col items-center">
            <RiskScoreRing score={diagnosis.rootCauseConfidence} level="medium" label="Illustrative confidence" radius={32} stroke={4} />
            <span className="text-xs text-text-muted block text-center">Demo confidence</span>
         </div>
      </div>

      {/* AI Summary */}
      <div className="p-4 sm:p-6 border-b border-white/5">
         <div className="flex items-center gap-2 mb-3 text-xs font-bold text-accent uppercase tracking-wider">
            <Sparkles size={16} className="animate-pulse" />
            Simulated Change Investigation
         </div>
         <p className="text-xs text-text-secondary leading-relaxed">
            {diagnosis.summary}
         </p>
      </div>

      <details className="m-4 sm:m-6 p-3 rounded-lg border border-white/10 text-xs text-text-secondary">
        <summary className="min-h-11 content-center text-accent cursor-pointer">Why 94? View demo evidence</summary>
        <p className="mt-3">94 is an illustrative confidence value, not a measured probability or a calculated live result. Risk ranks each change; severity describes incident impact. This simulated scenario puts the flag change five minutes before the latency alert in the same service.</p>
        <ul className="mt-2 space-y-2">{mockTimelineEvents.map(event => <li key={event.id}><a className="text-accent underline" href={`#demo-event-${event.id}`}>{event.title}</a> · {new Date(event.timestamp).toISOString()}</li>)}</ul>
        <p className="mt-2">Correlation alone does not establish a cause. Review real telemetry before acting.</p>
      </details>
      {/* Correlations */}
      <div className="p-4 sm:p-6 border-b border-white/5 bg-white/[0.01]">
         <h3 className="text-xs font-bold text-white mb-4 flex items-center gap-2">
            <Cpu size={16} className="text-text-muted" />
            Correlated Changes
         </h3>
         <div className="space-y-3">
            {diagnosis.correlations.map(corr => (
               <div key={corr.id} className="p-3 bg-[#0b0f0d]/60 border border-white/5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group hover:border-white/20 transition-colors">
                  <div>
                     <div className="text-xs font-semibold text-white">{corr.factor}</div>
                     <div className="text-xs text-text-muted mt-0.5">{corr.details}</div>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                     <div className={`text-xs font-bold uppercase ${corr.impact === 'Critical' ? 'text-status-error' : 'text-text-muted'}`}>
                        {corr.impact} IMPACT
                     </div>
                     <div className="text-xs text-text-muted mt-0.5">{corr.timeDelta}</div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Recommendations */}
      <div className="p-4 sm:p-6 flex-1 bg-gradient-to-b from-transparent to-black/40">
         <h3 className="text-xs font-bold text-white mb-4">Recommended Actions</h3>
         <div className="space-y-3">
            {diagnosis.recommendations.map(rec => (
               <div key={rec.id} className="p-4 bg-accent/5 border border-accent/20 rounded-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                     <span className="text-sm font-bold text-white">{rec.action}</span>
                     <span className="text-xs text-text-muted">{rec.estimatedResolutionTime}</span>
                  </div>
                  <div className="p-2 bg-[#0b0f0d]/60 rounded border border-white/5 font-mono text-xs text-accent break-all">
                     {rec.command}
                  </div>
                  <button disabled title="Demo only: no action is executed" className="opacity-60 cursor-not-allowed mt-3 w-full min-h-11 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded flex items-center justify-center gap-2 transition-colors">
                     Demo only - no action executed <ArrowRight size={14} />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default AiDiagnosisPanel;
