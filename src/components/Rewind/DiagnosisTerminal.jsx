import React, { useEffect, useState } from 'react';
import { Check, Loader2, Terminal } from 'lucide-react';
import { diagnosisTerminalState } from '../../util/diagnosisTerminal';
import { suspectedWording } from '../../util/console';

// Animate only text already delivered by polling. Never invent provider logs.
function DeliveredSummary({ text }) {
  const [visible, setVisible] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches ? text.length : 0);
  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let timer;
    const showAll = () => {
      if (motion.matches) {
        clearInterval(timer);
        setVisible(text.length);
      }
    };
    if (!motion.matches) {
      let count = 0;
      const step = Math.max(12, Math.ceil(text.length / 18));
      timer = setInterval(() => {
        count = Math.min(text.length, count + step);
        setVisible(count);
        if (count === text.length) clearInterval(timer);
      }, 35);
    }
    motion.addEventListener('change', showAll);
    return () => {
      clearInterval(timer);
      motion.removeEventListener('change', showAll);
    };
  }, [text]);
  return <>
    <p className="sr-only">{text}</p>
    <p aria-hidden="true" className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] text-[13px] leading-[1.85] text-slate-200">{text.slice(0, visible)}{visible < text.length && <span className="inline-block w-1.5 h-3 ml-1 bg-accent align-middle" />}</p>
  </>;
}

export default function DiagnosisTerminal({ diagnosis = {}, state, stage, onRerun, rerunning = false }) {
  const summary = typeof diagnosis.executive_summary === 'string' && diagnosis.executive_summary.trim()
    ? suspectedWording(diagnosis.executive_summary) : '';
  const progress = diagnosisTerminalState(state, stage, !!summary);
  const delivered = stage === 'deep' ? 2 : stage === 'triage' ? 1 : 0;
  return <aside aria-label="Diagnosis terminal" className="min-w-0 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#101413] flex flex-col lg:min-h-0 lg:overflow-y-auto overscroll-y-contain lg:items-stretch">
    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 md:px-5">
      <h3 className="flex items-center gap-2 text-[12px] font-mono text-slate-300"><Terminal size={15} className="text-accent" />diagnosis / summary</h3>
      <span className="text-[10px] font-mono text-slate-400">{diagnosis.cached ? 'CACHED' : progress.pending ? 'POLLING' : 'SNAPSHOT'}</span>
    </div>
    <div className="p-4 md:p-5 space-y-6">
      <div className="space-y-3">
        <div role="status" aria-live="polite" aria-atomic="true" className={`flex gap-2 items-center text-xs font-mono ${progress.failed || state === 'expired' ? 'text-amber-200' : 'text-accent'}`}>
          {progress.pending ? <Loader2 size={14} className="motion-safe:animate-spin shrink-0" /> : state === 'completed' ? <Check size={14} className="shrink-0" /> : <span aria-hidden="true">&gt;</span>}
          <span>{progress.label}</span>
        </div>
        <ol aria-label="Delivered diagnosis stages" className="grid grid-cols-3 gap-2 text-[11px] font-mono">
          {['Rules', 'AI triage', 'Deep'].map((label, index) => <li key={label} className={`border-t-2 pt-2 ${index <= delivered ? 'border-accent text-slate-200' : 'border-white/10 text-slate-400'}`}>
            {label}<span className="block mt-1 text-[10px] text-slate-400">{index === 0 ? 'Ready' : index === delivered ? 'Received' : index < delivered ? 'Superseded' : progress.pending ? 'Pending' : 'Not received'}</span>
          </li>)}
        </ol>
      </div>
      <div className="text-xs text-slate-400 leading-relaxed">{progress.message}</div>
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h4 className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">Executive summary</h4>
          <span className="text-[10px] font-mono text-accent">{progress.stageLabel}</span>
        </div>
        {summary ? <DeliveredSummary key={`${diagnosis.job_id || 'result'}:${stage}:${summary}`} text={summary} />
          : <p className="text-sm text-slate-400 leading-relaxed">No executive summary returned. Ranked changes and rule evidence are available on the left.</p>}
      </div>
      {(state === 'expired' || progress.failed) && onRerun && <button type="button" onClick={onRerun} disabled={rerunning} className="text-xs text-accent border border-accent/30 rounded-[4px] px-3 py-2 hover:bg-accent/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-50">{rerunning ? 'Re-running...' : 'Re-run diagnosis'}</button>}
    </div>
    <p className="mt-auto border-t border-white/10 px-4 py-3 md:px-5 text-[11px] leading-relaxed text-slate-400">Updates arrive as stages finish, not a live token stream. AI findings are hypotheses; verify against incident evidence.</p>
  </aside>;
}
