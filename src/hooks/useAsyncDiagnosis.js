import { useQuery } from '@tanstack/react-query';
import api from '../api';

const statuses = ['pending', 'completed', 'failed', 'disabled'];
const stages = ['rules', 'triage', 'deep'];
const fields = ['executive_summary', 'primary_cause_headline', 'recommended_action'];

// Only display the validated public diagnosis fields, never raw model output.
export const readDiagnosis = (value) => {
  if (!value || !statuses.includes(value.status) || !stages.includes(value.stage)) return null;
  if (fields.some(field => typeof value[field] !== 'string')) return null;
  if (value.status === 'pending' && (typeof value.job_id !== 'string' || !value.job_id)) return null;
  return Object.fromEntries([...fields, 'cached', 'source', 'status', 'job_id', 'stage'].map(field => [field, value[field]]));
};

export const diagnosisFailure = (error) => error?.response?.status === 404 ? 'expired' : 'unavailable';

// Transient poll failures (network blip, 503 while Redis reconnects) get bounded retries so
// one dropped response cannot strand the brief in "unavailable" until a manual second run.
// A 404 is definitive: the job expired or never existed, so retrying would only delay honesty.
export const pollRetry = (failureCount, error) => error?.response?.status !== 404 && failureCount < 3;
export const POLL_RETRY_DELAY_MS = 2000;

export const diagnosisPresentation = (initial, update, failure) => {
  const current = update || initial;
  if (current?.status === 'disabled') return { ai: {}, state: null };
  if (failure || current?.status === 'failed') {
    // Keep deterministic rules, not a partially generated triage answer.
    return { ai: initial?.stage === 'rules' ? initial : {}, state: failure || 'unavailable' };
  }
  if (current?.status === 'pending' && !current.job_id) {
    return { ai: current.stage === 'rules' ? current : {}, state: 'unavailable' };
  }
  return { ai: current || {}, state: current?.status || null };
};

export default function useAsyncDiagnosis(result) {
  const initial = result?.ai_diagnosis || result?.aiDiagnosis;
  const jobId = typeof initial?.job_id === 'string' ? initial.job_id : null;
  const query = useQuery({
    queryKey: ['async-diagnosis', jobId],
    enabled: initial?.status === 'pending' && !!jobId,
    queryFn: async ({ signal }) => {
      const response = await api.get(`/scoring/diagnosis/${encodeURIComponent(jobId)}`, {
        signal, skipToast: true, timeout: 10000,
      });
      const diagnosis = response.data?.success && readDiagnosis(response.data?.data?.ai_diagnosis);
      if (!diagnosis || (diagnosis.job_id && diagnosis.job_id !== jobId)) throw new Error('Invalid diagnosis response');
      return diagnosis;
    },
    retry: pollRetry,
    retryDelay: POLL_RETRY_DELAY_MS,
    refetchInterval: query => !query.state.error && (query.state.data?.status || initial?.status) === 'pending' ? 2500 : false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
    gcTime: 0,
  });
  const presentation = diagnosisPresentation(initial, jobId ? query.data : null, query.error ? diagnosisFailure(query.error) : null);
  return {
    result: result ? { ...result, ai_diagnosis: presentation.ai } : result,
    state: presentation.state,
    stage: presentation.ai.stage,
  };
}
