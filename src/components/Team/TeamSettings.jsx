import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Send, Loader2 } from 'lucide-react';
import { createInvite, listInvites, resendInvite, revokeInvite } from '../../service/invites';
import { inviteMessage, sessionClaims } from '../../util/invites';

const field = 'w-full min-h-[44px] bg-[#0b100e] border border-white/15 rounded-md px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50';
export default function TeamSettings({ organization }) {
    const isAdmin = sessionClaims(localStorage.getItem('authToken') || '').role === 'admin';
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [busy, setBusy] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [seatBlocked, setSeatBlocked] = useState(false);
    const [confirmRevoke, setConfirmRevoke] = useState(null);
    const { data: result, isPending, error: loadError, refetch } = useQuery({
        queryKey: ['team-invites', organization.id], queryFn: listInvites, enabled: isAdmin, retry: false, staleTime: 0,
    });
    if (!isAdmin) return null;
    const invites = result?.data || [];
    const seats = result?.seats;
    const full = seatBlocked || !!(seats && seats.occupied + seats.pending >= seats.seat_limit);
    const act = async (key, operation, success) => {
        setBusy(key); setError(''); setNotice('');
        try { await operation(); setNotice(success); if (key === 'create') { setEmail(''); setRole('member'); } if (key.startsWith('revoke')) { setSeatBlocked(false); setConfirmRevoke(null); } }
        catch (err) { setError(inviteMessage(err)); if (err.response?.data?.code === 'seat_limit') setSeatBlocked(true); }
        finally { await refetch(); setBusy(''); }
    };
    const submit = event => {
        event.preventDefault();
        if (!full && !busy) act('create', () => createInvite(email.trim().toLowerCase(), role), `Invitation sent to ${email.trim()}.`);
    };
    return (
        <section className="mt-6 bg-[#101413] border border-white/10 rounded-xl p-5 sm:p-6" aria-labelledby="team-heading">
            <div className="flex items-start justify-between gap-3 mb-5"><div><h2 id="team-heading" className="flex items-center gap-2 text-lg font-semibold"><Users size={19} className="text-accent" /> Team</h2><p className="text-sm text-zinc-400 mt-1">Invite teammates to your workspace.</p></div><span className="shrink-0 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono uppercase text-zinc-400">Admin only</span></div>
            {seats && <p className="text-xs text-zinc-300 mb-2">{seats.occupied} {seats.occupied === 1 ? 'member' : 'members'} · {seats.pending} pending · {seats.seat_limit} seats total</p>}
            {organization.plan === 'free' && <p className="text-xs text-zinc-400 mb-4">Free plan: 2 seats, including you. Pending invites reserve a seat.</p>}
            {full && <p role="status" className="mb-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">No available seats. Revoke a pending invite to free its reserved seat. If both seats are already members, your workspace is full.</p>}
            {loadError ? <div role="alert" className="text-sm text-rose-300 mb-4">{inviteMessage(loadError)} <button onClick={() => refetch()} className="underline min-h-[44px] ml-2">Try again</button></div> : <form onSubmit={submit} className="grid sm:grid-cols-[minmax(0,1fr)_130px_auto] gap-3 items-end">
                <div><label htmlFor="team-email" className="block text-xs text-zinc-400 mb-2">Email address</label><input id="team-email" type="email" autoComplete="email" placeholder="teammate@company.com" value={email} onChange={e => setEmail(e.target.value)} maxLength={320} required disabled={full || !!busy || isPending || !seats} className={field} /></div>
                <div><label htmlFor="team-role" className="block text-xs text-zinc-400 mb-2">Role</label><select id="team-role" value={role} onChange={e => setRole(e.target.value)} disabled={full || !!busy || isPending || !seats} className={field}><option value="member">Member</option><option value="admin">Admin</option></select></div>
                <button type="submit" disabled={full || !!busy || isPending || !seats} className="min-h-[44px] bg-accent text-[#0b100e] rounded-md px-4 py-2 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">{busy === 'create' ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />} Send invite</button>
            </form>}
            {!isPending && !loadError && !seats && <p role="status" className="mt-3 text-sm text-amber-200">Seat availability is not available yet. Refresh after the team API is deployed.</p>}
            {role === 'admin' && !full && <p className="mt-3 text-xs text-amber-200">Admins can manage invites and workspace settings. Only choose this for someone who needs that access.</p>}
            {error && <p role="alert" className="mt-4 text-rose-300 text-sm bg-rose-500/10 p-3 rounded-md">{error}</p>}
            {notice && <p role="status" className="mt-4 text-accent text-sm">{notice}</p>}
            <div className="mt-6 border-t border-white/10 pt-5"><h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">Pending invites {!isPending && !loadError && `(${invites.length})`}</h3>
                {isPending ? <p role="status" className="text-sm text-zinc-400">Loading invites...</p> : !loadError && (invites.length === 0 ? <p className="text-sm text-zinc-500">No pending invites. Sent invitations will appear here.</p> : <ul className="divide-y divide-white/10">{invites.map(invite => <li key={invite.id} className="py-4 first:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"><div className="min-w-0"><p className="text-sm text-zinc-100 break-all">{invite.email}</p><p className="mt-1 text-xs text-zinc-400 capitalize">{invite.role} <span className="normal-case">· Expires {new Date(invite.expires_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span></p></div><div className="flex gap-2 shrink-0"><button disabled={!!busy} onClick={() => act(`resend-${invite.id}`, () => resendInvite(invite.id), `New invitation sent to ${invite.email}. The previous link no longer works.`)} className="min-h-[44px] px-3 border border-white/15 rounded-md text-sm text-accent disabled:opacity-40">{busy === `resend-${invite.id}` ? 'Sending...' : 'Resend'}</button><button disabled={!!busy} onClick={() => setConfirmRevoke(invite.id)} className="min-h-[44px] px-3 border border-white/15 rounded-md text-sm text-zinc-400 hover:text-rose-300 disabled:opacity-40">Revoke</button></div></div>
                    {confirmRevoke === invite.id && <div className="mt-3 bg-rose-500/5 border border-rose-500/20 p-3 rounded-md"><p className="text-sm text-zinc-300">Revoke the invite for <span className="break-all">{invite.email}</span>? Their link will stop working.</p><div className="flex flex-wrap gap-3 mt-2"><button disabled={!!busy} onClick={() => act(`revoke-${invite.id}`, () => revokeInvite(invite.id), `Invitation for ${invite.email} revoked.`)} className="min-h-[44px] text-sm text-rose-300 disabled:opacity-40">{busy === `revoke-${invite.id}` ? 'Revoking...' : 'Yes, revoke invite'}</button><button disabled={!!busy} onClick={() => setConfirmRevoke(null)} className="min-h-[44px] text-sm text-zinc-400">Cancel</button></div></div>}
                </li>)}</ul>)}
                <p className="mt-4 text-xs text-zinc-500">Invites expire after 7 days. Resending creates a new link and disables the old one.</p>
            </div>
        </section>
    );
}
