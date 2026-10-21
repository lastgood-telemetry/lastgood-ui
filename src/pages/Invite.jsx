import { useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { trackAuthenticated } from '../util/posthog';
import useOrgStore from '../stores/useOrgStore';
import { consumeLoginDestination } from '../util/console';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../api';
import { passwordErrors } from '../util/onboarding';
import { previewInvite, acceptInvite } from '../service/invites';
import { inviteMessage, inviteOAuthError, inviteOAuthUrl } from '../util/invites';

export default function Invite() {
    const { token } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const join = async (event) => {
        event.preventDefault();
        if (busy) return;
        const errors = passwordErrors(password, confirmation);
        if (!name.trim() || Object.keys(errors).length) { setError(!name.trim() ? 'Enter your name.' : Object.values(errors).join(' ')); return; }
        setBusy(true); setError('');
        try { const result = await acceptInvite(token, name.trim(), password); localStorage.setItem('authToken', result.token); trackAuthenticated('signup_completed', { method: 'invite_password' }); queryClient.clear(); useOrgStore.getState().setOrg(null); navigate(consumeLoginDestination(), { replace: true }); }
        catch (err) { setError(inviteMessage(err)); setBusy(false); }
    };
    const [searchParams] = useSearchParams();
    const oauthError = searchParams.get('error');
    const { data: invite, isPending, error: loadError, refetch } = useQuery({
        queryKey: ['invite', token], queryFn: () => previewInvite(token), retry: false, gcTime: 0,
    });
    const badLink = [400, 404, 410].includes(loadError?.response?.status);
    return (
        <div className="min-h-screen bg-deep text-foreground">
            <header className="px-6 sm:px-10 py-5 border-b border-white/10"><Logo size="md" showText /></header>
            <main className="mx-auto max-w-lg px-4 sm:px-6 py-10 sm:py-16">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-4">Workspace invitation</p>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight break-words">{invite && !badLink ? `Join ${invite.org_name}` : 'Join your team'}</h1>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">One shared timeline. The context your team needs when production breaks.</p>
                <section className="mt-7 bg-paper border border-white/10 rounded-xl p-5 sm:p-7">
                    {isPending ? <p role="status" className="flex items-center gap-2 text-muted-foreground"><Loader2 size={18} className="animate-spin" /> Checking your invitation...</p>
                    : loadError ? <div role="alert"><h2 className="text-lg font-semibold mb-2">{badLink ? 'This link is no longer usable' : 'Could not load your invitation'}</h2><p className="text-sm text-muted-foreground leading-relaxed">{inviteMessage(loadError)}</p>{!badLink && <button onClick={() => refetch()} className="mt-4 min-h-[44px] text-accent underline">Try again</button>}<Link to="/login" className="block mt-4 min-h-[44px] content-center text-accent underline">Back to sign in</Link></div>
                    : invite && <div className="space-y-5">
                        <div><p className="text-xs text-muted-foreground mb-2">Invited email</p><p className="min-h-[44px] rounded-md border border-white/15 bg-deep px-3 py-2.5 text-sm break-all">{invite.email}</p><p className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground"><ShieldCheck size={14} /> Joining as {invite.role === 'admin' ? 'an admin' : 'a member'}</p></div>
                        {oauthError && <p role="alert" className="text-sm text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 leading-relaxed">{inviteOAuthError(oauthError)}</p>}
                        <form onSubmit={join} className="space-y-4" aria-busy={busy}>
                            <p className="text-sm text-muted-foreground">Join with your invited email and a password. Works with any email provider.</p>
                            {[['invite-name', 'Your name', 'text', name, setName, 'name'], ['invite-password', 'Password', 'password', password, setPassword, 'new-password'], ['invite-confirm', 'Confirm password', 'password', confirmation, setConfirmation, 'new-password']].map(([id, label, type, value, update, autoComplete]) => <div key={id} className="space-y-2">
                                <label htmlFor={id} className="block text-sm font-medium">{label}</label>
                                <input id={id} type={type} autoComplete={autoComplete} value={value} onChange={e => update(e.target.value)} required disabled={busy} className="w-full min-w-0 bg-bg-primary border border-border rounded-md px-3 py-3 text-[16px] focus:outline-none focus:border-accent" />
                            </div>)}
                            <p className="text-xs text-muted-foreground">Use at least 12 characters, up to 72 UTF-8 bytes. Next time, sign in with email and password.</p>
                            {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                            <button type="submit" disabled={busy} className="w-full min-h-[48px] bg-accent text-bg-primary rounded-md font-semibold disabled:opacity-60">{busy ? 'Joining...' : 'Set password and join'}</button>
                        </form>
                        <p className="text-xs text-muted-foreground text-center">Or join with your existing provider</p>
                        <div className="space-y-3">
                            {['google', 'github'].map(provider => <a key={provider} href={inviteOAuthUrl(api.defaults.baseURL, token, provider)} className="w-full min-h-[48px] bg-accent text-deep rounded-md px-4 py-3 font-semibold flex items-center justify-center gap-3 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"><span aria-hidden="true" className="font-mono text-base">{provider === 'google' ? 'G' : 'GH'}</span>Continue with {provider === 'google' ? 'Google' : 'GitHub'}</a>)}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">Use the account that matches the invited email. Google and GitHub sign-in do not require a password.</p>
                        <p className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"><Mail size={14} className="shrink-0 mt-0.5" /> Need a different email? Ask your admin for a new invite.</p>
                    </div>}
                </section>
            </main>
        </div>
    );
}
