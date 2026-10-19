import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { STALE } from '../../lib/queryConfig';
import { Users, Send, Loader2, UserMinus } from 'lucide-react';
import { createInvite, listInvites, resendInvite, revokeInvite } from '../../service/invites';
import { listMembers, removeMember } from '../../service/members';
import { inviteMessage, sessionClaims } from '../../util/invites';

const field = 'w-full min-h-[44px] bg-deep border border-white/15 rounded-md px-3 py-2 text-sm outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50';
export default function TeamSettings({ organization }) {
    const isAdmin = sessionClaims(localStorage.getItem('authToken') || '').role === 'admin';
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [busy, setBusy] = useState('');
    const [error, setError] = useState('');
    const [notice, setNotice] = useState('');
    const [seatBlocked, setSeatBlocked] = useState(false);
    const [confirmRevoke, setConfirmRevoke] = useState(null);
    const [confirmRemove, setConfirmRemove] = useState(null);
    const { data: result, isPending, error: loadError, refetch } = useQuery({
        queryKey: ['team-invites', organization.id], queryFn: listInvites, enabled: isAdmin, retry: false, staleTime: STALE.moderate,
    });
    const { data: members, isPending: membersPending, error: membersError, refetch: refetchMembers } = useQuery({
        queryKey: ['team-members', organization.id], queryFn: listMembers, enabled: isAdmin, retry: false, staleTime: STALE.moderate,
    });
    if (!isAdmin) return null;
    const invites = result?.data || [];
    const seats = result?.seats;
    const full = seatBlocked || !!(seats && seats.seat_limit !== null && seats.occupied + seats.pending >= seats.seat_limit);
    const act = async (key, operation, success) => {
        setBusy(key); setError(''); setNotice('');
        try { await operation(); setNotice(success); if (key === 'create') { setEmail(''); setRole('member'); } if (key.startsWith('revoke')) { setSeatBlocked(false); setConfirmRevoke(null); } if (key.startsWith('remove')) setConfirmRemove(null); }
        catch (err) { setError(inviteMessage(err)); if (err.response?.data?.code === 'seat_limit') setSeatBlocked(true); }
        finally { await refetch(); await refetchMembers(); setBusy(''); }
    };
    const submit = event => {
        event.preventDefault();
        if (!full && !busy) act('create', () => createInvite(email.trim().toLowerCase(), role), `Invitation sent to ${email.trim()}.`);
    };
    return (
        <section className="mt-6 bg-paper border border-white/10 rounded-xl p-5 sm:p-6" aria-labelledby="team-heading">
            <div className="flex items-start justify-between gap-3 mb-5"><div><h2 id="team-heading" className="flex items-center gap-2 text-lg font-semibold"><Users size={19} className="text-accent" /> Team</h2><p className="text-sm text-zinc-400 mt-1">Invite teammates to your workspace.</p></div><span className="shrink-0 px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono uppercase text-zinc-400">Admin only</span></div>
            {seats && <p className="text-xs text-zinc-300 mb-2">{seats.occupied} {seats.occupied === 1 ? 'member' : 'members'} · {seats.pending} pending · {seats.seat_limit === null ? 'unlimited seats' : `${seats.seat_limit} seats total`}</p>}
            {organization.plan === 'free' && <p className="text-xs text-zinc-400 mb-4">Free plan: 2 seats, including you. Pending invites reserve a seat.</p>}
            {full && <p role="status" className="mb-4 p-3 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-200 text-sm">No available seats. Revoke a pending invite to free its reserved seat. If both seats are already members, your workspace is full.</p>}
            {loadError ? <div role="alert" className="text-sm text-rose-300 mb-4">{inviteMessage(loadError)} <button onClick={() => refetch()} className="underline min-h-[44px] ml-2">Try again</button></div> : <form onSubmit={submit} className="grid sm:grid-cols-[minmax(0,1fr)_130px_auto] gap-3 items-end">
                <div><label htmlFor="team-email" className="block text-xs text-zinc-400 mb-2">Email address</label><input id="team-email" type="email" autoComplete="email" placeholder="teammate@company.com" value={email} onChange={e => setEmail(e.target.value)} maxLength={320} required disabled={full || !!busy || isPending || !seats} className={field} /></div>
                <div><label htmlFor="team-role" className="block text-xs text-zinc-400 mb-2">Role</label><select id="team-role" value={role} onChange={e => setRole(e.target.value)} disabled={full || !!busy || isPending || !seats} className={field}><option value="member">Member</option><option value="admin">Admin</option></select></div>
                <button type="submit" disabled={full || !!busy || isPending || !seats} className="min-h-[44px] bg-accent text-deep rounded-md px-4 py-2 font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">{busy === 'create' ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />} Send invite</button>
            </form>}
            {!isPending && !loadError && !seats && <p role="status" className="mt-3 text-sm text-amber-200">Seat availability is not available yet. Refresh after the team API is deployed.</p>}
            {role === 'admin' && !full && <p className="mt-3 text-xs text-amber-200">Admins can manage invites and workspace settings. Only choose this for someone who needs that access.</p>}
            {error && <p role="alert" className="mt-4 text-rose-300 text-sm bg-rose-500/10 p-3 rounded-md">{error}</p>}
            {notice && <p role="status" className="mt-4 text-accent text-sm">{notice}</p>}
            <div className="mt-6 border-t border-white/10 pt-5"><h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-3">Members {!membersPending && !membersError && `(${members?.length || 0})`}</h3>
                {membersPending ? <p role="status" className="text-sm text-zinc-400">Loading members...</p> : membersError ? <div role="alert" className="text-sm text-rose-300">{inviteMessage(membersError)} <button onClick={() => refetchMembers()} className="underline min-h-[44px] ml-2">Try again</button></div> : <ul className="divide-y divide-white/10">{members.map(member => <li key={member.id} className="py-4 first:pt-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between"><div className="flex items-center gap-3 min-w-0">
                        <span aria-hidden="true" className="shrink-0 w-9 h-9 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center text-sm font-semibold">{(member.name || member.email).trim().charAt(0).toUpperCase()}</span>
                        <div className="min-w-0"><p className="text-sm text-zinc-100 break-all">{member.name || member.email} {member.you && <span className="ml-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono uppercase text-zinc-400 align-middle">You</span>}</p>
                            <p className="mt-1 text-xs text-zinc-400">{member.name && <span className="break-all">{member.email} · </span>}<span className={`capitalize ${member.role === 'admin' ? 'text-accent' : ''}`}>{member.role || 'member'}</span>{member.joined_at && <span className="normal-case"> · Joined {new Date(member.joined_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>}</p></div></div>
                        {!member.you && <button disabled={!!busy} onClick={() => setConfirmRemove(member.id)} className="shrink-0 min-h-[44px] px-3 border border-white/15 rounded-md text-sm text-zinc-400 hover:text-rose-300 disabled:opacity-40 flex items-center gap-2"><UserMinus size={14} /> Remove</button>}</div>
                    {confirmRemove === member.id && <div className="mt-3 bg-rose-500/5 border border-rose-500/20 p-3 rounded-md"><p className="text-sm text-zinc-300">Remove <span className="break-all">{member.name || member.email}</span> from the workspace? They lose access immediately and need a new invite to return.</p><div className="flex flex-wrap gap-3 mt-2"><button disabled={!!busy} onClick={() => act(`remove-${member.id}`, () => removeMember(member.id), `${member.name || member.email} was removed from the workspace.`)} className="min-h-[44px] text-sm text-rose-300 disabled:opacity-40">{busy === `remove-${member.id}` ? 'Removing...' : 'Yes, remove member'}</button><button disabled={!!busy} onClick={() => setConfirmRemove(null)} className="min-h-[44px] text-sm text-zinc-400">Cancel</button></div></div>}
                </li>)}</ul>}
            </div>
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
