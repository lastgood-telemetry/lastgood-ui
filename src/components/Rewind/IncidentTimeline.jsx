import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import api from '../../api';
import useOrgStore from '../../stores/useOrgStore';
import { incidentTimeline, declarationUrl } from '../../util/incidents';
import { utcTimestamp } from '../../util/console';

export default function IncidentTimeline({ params, changes = [], linkedId = '' }) {
  const orgId = useOrgStore(s => s.org?.id);
  const incidentAt = dayjs.utc(params.incidentTime);
  const filters = { from_date: incidentAt.subtract(params.windowMinutes, 'minute').toISOString(), to_date: incidentAt.toISOString(), limit: 200,
    ...(params.service ? { service: params.service } : {}), ...(params.environment ? { environment: params.environment } : {}) };
  const { data: incidents = [], isLoading, error } = useQuery({
    queryKey: ['incident-timeline', orgId, filters], staleTime: 30000,
    queryFn: async () => (await api.get('/incidents', { params: filters, skipToast: true })).data.data,
  });
  const { data: linked, error: linkedError } = useQuery({
    queryKey: ['incident-timeline', orgId, linkedId], enabled: !!linkedId,
    queryFn: async () => (await api.get(`/incidents/${encodeURIComponent(linkedId)}`, { skipToast: true })).data.data,
  });
  const rows = incidentTimeline(changes, linked && !incidents.some(i => i.id === linked.id) ? [...incidents, linked] : incidents);
  return <section className="border border-border rounded-[4px] bg-surface p-4 space-y-3" aria-label="Incident and change timeline">
    <h2 className="text-base font-semibold text-text-primary">Incident and change timeline</h2>
    <p className="text-xs text-text-muted">Newest first. Incident markers are declarations, not evidence of a cause.</p>
    {isLoading && <p role="status" className="text-sm">Loading incident markers...</p>}
    {(error || linkedError) && <p role="alert" className="text-sm text-amber-300">Some incident markers could not be loaded. Changes are still shown.</p>}
    {incidents.length === 200 && <p className="text-xs text-amber-300">Showing the newest 200 incidents. Narrow the window for older markers.</p>}
    {!rows.length && !isLoading && <p className="text-sm text-text-muted">No incidents or analyzed changes in this window.</p>}
    <ol className="space-y-2">{rows.map(row => <li key={`${row.kind}-${row.data.id}`} className={`rounded-[4px] border p-3 text-sm ${row.kind === 'incident' ? 'border-rose-400/40 bg-rose-500/5' : 'border-border'}`}>
      <p className="font-mono text-xs text-text-muted">{utcTimestamp(row.time)}</p>
      {row.kind === 'incident' ? <>
        <p className="text-rose-300 font-semibold">{row.data.source === 'manual' ? 'Incident declared here' : 'Alert incident opened here'}{linkedId === row.data.id ? ' · Linked incident' : ''}</p>
        <p className="break-words whitespace-pre-wrap text-text-primary">{row.data.message || row.data.title}</p>
        <p className="text-xs text-text-secondary">{row.data.declared_by_name ? `Declared by ${row.data.declared_by_name} · ` : ''}{row.data.status} · {row.data.service === '*' ? 'Organization-wide' : row.data.service}</p>
        <Link to={declarationUrl(row.data)} className="text-xs text-accent underline">Analyze preceding changes</Link>
      </> : <><p className="text-text-primary break-words">{row.data.summary || row.data.type}</p><p className="text-xs text-text-secondary">{row.data.service} · {row.data.type}</p></>}
    </li>)}</ol>
  </section>;
}
