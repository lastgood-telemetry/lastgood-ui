// Polling reports the latest delivered stage, not token-level provider progress.
export function diagnosisTerminalState(state, stage, hasSummary = false) {
  const failed = state === 'unavailable' || state === 'failed';
  const pending = state === 'pending';
  const label = state === 'expired' ? 'Expired'
    : failed ? 'Unavailable'
    : pending ? (stage === 'triage' ? 'Deep analysis pending' : 'AI diagnosis pending')
    : state === 'completed' ? 'Complete'
    : hasSummary ? 'Summary available' : 'AI not enabled';
  const message = state === 'expired' ? 'This job has expired. Re-run to request a fresh diagnosis. Rule evidence remains available.'
    : failed ? 'AI diagnosis could not finish. Showing rule triage; investigate the ranked changes on the left.'
    : pending ? (stage === 'triage' ? 'AI triage received. Waiting for deep analysis.' : 'Rule triage ready. Waiting for AI analysis.')
    : state === 'completed' ? (stage === 'deep' ? 'Deep analysis received.' : 'Diagnosis finished with the latest available summary. No deep summary was returned.')
    : hasSummary ? 'Latest available summary.' : 'AI is not enabled for this result. Rule evidence remains available.';
  return { label, message, pending, failed, stageLabel: stage === 'deep' ? 'Deep analysis' : stage === 'triage' ? 'AI triage' : 'Rule triage' };
}
