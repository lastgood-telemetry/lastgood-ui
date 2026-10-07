import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Loader2, Mail, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import { acceptInvite, previewInvite } from '../service/invites';
import { inviteMessage, joinErrors } from '../util/invites';
import useOrgStore from '../stores/useOrgStore';

const field = 'w-full min-h-[44px] rounded-md border border-white/15 bg-[#0b100e] px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-60';

export default function Invite() {
    const { token } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [unavailable, setUnavailable] = useState(false);
    const { data: invite, isPending, error: loadError, refetch } = useQuery({
        queryKey: ['invite', token], queryFn: () => previewInvite(token), retry: false, gcTime: 0,
    });
    const join = async event => {
        event.preventDefault();
        const validation = joinErrors(name, password);
        if (validation) { setError(validation); return; }
        setError(''); setSubmitting(true);
        try {
            const result = await acceptInvite(token, name.trim(), password);
            if (!result?.token) throw new Error('missing_token');
            // Match login's storage key; clear data belonging to a previously signed-in workspace.
            localStorage.setItem('authToken', result.token);
            queryClient.clear(); useOrgStore.getState().setOrg(null);
            navigate('/rewind', { replace: true });
        } catch (err) {
            setError(inviteMessage(err));
            if ([404, 410].includes(err.response?.status)) setUnavailable(true);
        } finally { setSubmitting(false); }
    };
    const badLink = unavailable || [400, 404, 410].includes(loadError?.response?.status);
    return (
        <div className="min-h-screen bg-[#0b100e] text-foreground">
            <header className="px-6 sm:px-10 py-5 border-b border-white/10"><Logo size="md" showText /></header>
            <main className="mx-auto max-w-lg px-4 sm:px-6 py-10 sm:py-16">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-4">Workspace invitation</p>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight break-words">{invite && !badLink ? `Join ${invite.org_name}` : 'Join your team'}</h1>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">One shared timeline. The context your team needs when production breaks.</p>
                <section className="mt-7 bg-[#101413] border border-white/10 rounded-xl p-5 sm:p-7">
                    {isPending ? <p role="status" className="flex items-center gap-2 text-muted-foreground"><Loader2 size={18} className="animate-spin" /> Checking your invitation...</p>
                    : loadError || unavailable ? <div role="alert"><h2 className="text-lg font-semibold mb-2">{badLink ? 'This link is no longer usable' : 'Could not load your invitation'}</h2><p className="text-sm text-muted-foreground leading-relaxed">{error || inviteMessage(loadError)}</p>{!badLink && <button onClick={() => refetch()} className="mt-4 min-h-[44px] text-accent underline">Try again</button>}<Link to="/login" className="block mt-4 min-h-[44px] content-center text-accent underline">Back to sign in</Link></div>
                    : invite && <form onSubmit={join} className="space-y-5">
                        <div><label htmlFor="invite-email" className="block text-xs text-muted-foreground mb-2">Invited email</label><input id="invite-email" value={invite.email} readOnly autoComplete="username" className={`${field} text-zinc-400`} /><p className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground"><ShieldCheck size={14} /> Joining as {invite.role === 'admin' ? 'an admin' : 'a member'}</p></div>
                        <div><label htmlFor="invite-name" className="block text-sm mb-2">Your name</label><input id="invite-name" value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={255} required disabled={submitting} className={field} /></div>
                        <div><label htmlFor="invite-password" className="block text-sm mb-2">Create a password</label><input id="invite-password" type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password" minLength={8} required disabled={submitting} className={field} aria-describedby="password-help" /><p id="password-help" className="mt-2 text-xs text-muted-foreground">At least 8 characters. Use a unique password.</p></div>
                        {error && <p role="alert" className="text-sm text-rose-300 bg-rose-500/10 rounded-md p-3">{error}</p>}
                        <button disabled={submitting} className="w-full min-h-[44px] bg-accent text-[#0b100e] rounded-md px-4 py-3 font-semibold flex items-center justify-center gap-2 disabled:opacity-60">{submitting ? <><Loader2 size={16} className="animate-spin" /> Joining...</> : <>Join workspace <ArrowRight size={16} /></>}</button>
                        <p className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"><Mail size={14} className="shrink-0 mt-0.5" /> This invitation is tied to the email above. Need a different email? Ask your admin for a new invite.</p>
                    </form>}
                </section>
            </main>
        </div>
    );
                                    }
