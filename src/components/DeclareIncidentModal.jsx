import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api';
import useOrgStore from '../stores/useOrgStore';
import { declarationUrl } from '../util/incidents';

export default function DeclareIncidentModal({ onClose }) {
  const orgId = useOrgStore(s => s.org?.id);
  const [message, setMessage] = useState('');
  const [channel, setChannel] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(null);
  const requestId = useRef(crypto.randomUUID());
  const ambiguous = useRef(false);
  const dialog = useRef(null);
  const sending = useRef(false);
  const submittedPayload = useRef(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: slack, isLoading, error: loadError } = useQuery({
    queryKey: ['declaration-slack', orgId], staleTime: 0,
    queryFn: async () => (await api.get('/integrations/slack/status', { skipToast: true })).data.data,
  });
  const channels = slack?.connected ? (slack.channels || []).filter(c => c.enabled) : [];
  const selected = channels.length === 1 ? channels[0].id : channel;
  useEffect(() => {
    const el = dialog.current;
    const previous = document.activeElement;
    el.showModal();
    return () => { el.close(); previous?.focus(); };
  }, []);
  const send = async e => {
    e.preventDefault(); if (sending.current || (saved && saved.notification !== 'not_queued')) return;
    sending.current = true;
    setPending(true); setError('');
    try {
      submittedPayload.current ||= { message, request_id: requestId.current, ...(selected ? { channel_id: selected } : {}) };
      const { data } = await api.post('/incidents/declare', submittedPayload.current, { skipToast: true });
      setSaved(data);
      await queryClient.invalidateQueries({ queryKey: ['incident-timeline', orgId] });
    } catch (err) {
      // Keep the exact payload/request ID after an uncertain network failure.
      ambiguous.current = !err.response || err.response.status >= 500;
      if (!ambiguous.current && !saved) submittedPayload.current = null;
      setError(err.response?.data?.message || 'No confirmation received. Retry the same declaration to check it safely.');
    } finally { sending.current = false; setPending(false); }
  };
  return <dialog aria-labelledby="declare-incident-title" ref={dialog} onCancel={e => { if (pending) e.preventDefault(); else onClose(); }} className="w-[calc(100%-2rem)] max-w-lg rounded-[4px] border border-border bg-surface text-text-primary p-0 backdrop:bg-black/70">
    <form onSubmit={send} className="p-6 space-y-4">
      <h2 id="declare-incident-title" className="text-xl font-semibold">Declare incident</h2>
      {saved ? <>
        <p role="status">Incident saved. {saved.notification === 'queued' ? 'Slack delivery queued, not yet confirmed.' : saved.notification === 'not_queued' ? 'Slack delivery could not be queued. The incident is still saved.' : 'No Slack message was requested.'}</p>
        {saved.notification === 'not_queued' && <button type="submit" disabled={pending} className="text-accent underline">{pending ? 'Retrying...' : 'Retry Slack delivery'}</button>}
        {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" disabled={pending} onClick={onClose}>Close</button><button type="button" className="px-3 py-2 border border-accent rounded text-accent" onClick={() => { navigate(declarationUrl(saved.data)); onClose(); }}>View change timeline</button></div>
      </> : <>
        <p className="text-sm text-text-secondary">Record an organization-wide incident in production. Your member name will be included in the Slack message.</p>
        <label className="block text-sm">Incident message<textarea autoFocus required maxLength={2000} disabled={pending || ambiguous.current} value={message} onChange={e => setMessage(e.target.value)} rows={4} className="mt-2 w-full rounded border border-border bg-paper p-3 text-text-primary" placeholder="What is happening, and what should the team know?" /></label>
        {isLoading ? <p role="status">Checking Slack destinations...</p> : loadError ? <p role="alert" className="text-rose-400">Could not verify Slack destinations. Close and try again.</p> : channels.length ? <>
          <label className="block text-sm">Slack destination<select value={selected} disabled={pending || ambiguous.current || channels.length === 1} onChange={e => setChannel(e.target.value)} required className="mt-2 w-full rounded border border-border bg-paper p-2"><option value="">Choose a channel</option>{channels.map(c => <option key={c.id} value={c.id}>#{c.channel_name || c.channel_id}</option>)}</select></label>
          <p className="text-xs text-text-muted">This posts your message and name to the selected channel. The channel's 5-per-10-minute safety cap still applies.</p>
        </> : <p className="text-sm text-amber-300">No enabled Slack destination. This will save the incident only. <Link to="/notifications" onClick={onClose} className="underline">Set up Notifications</Link></p>}
        {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
        <div className="flex justify-end gap-3"><button type="button" disabled={pending} onClick={onClose} className="px-3 py-2">Cancel</button><button type="submit" disabled={pending || isLoading || !!loadError || !message.trim() || (channels.length > 0 && !selected)} className="px-3 py-2 rounded border border-rose-400/40 bg-rose-500/10 text-rose-300 disabled:opacity-50">{pending ? 'Saving...' : ambiguous.current ? 'Retry same declaration' : channels.length ? 'Declare and send' : 'Declare incident'}</button></div>
      </>}
    </form>
  </dialog>;
}
