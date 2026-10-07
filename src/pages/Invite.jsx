import { Link, useParams, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';
import api from '../api';
import { previewInvite } from '../service/invites';
import { inviteMessage, inviteOAuthError, inviteOAuthUrl } from '../util/invites';

export default function Invite() {
    const { token } = useParams();
    const [searchParams] = useSearchParams();
    const oauthError = searchParams.get('error');
    const { data: invite, isPending, error: loadError, refetch } = useQuery({
        queryKey: ['invite', token], queryFn: () => previewInvite(token), retry: false, gcTime: 0,
    });
    const badLink = [400, 404, 410].includes(loadError?.response?.status);
    return (
        <div className="min-h-screen bg-[#0b100e] text-foreground">
            <header className="px-6 sm:px-10 py-5 border-b border-white/10"><Logo size="md" showText /></header>
            <main className="mx-auto max-w-lg px-4 sm:px-6 py-10 sm:py-16">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent mb-4">Workspace invitation</p>
                <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight break-words">{invite && !badLink ? `Join ${invite.org_name}` : 'Join your team'}</h1>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">One shared timeline. The context your team needs when production breaks.</p>
                <section className="mt-7 bg-[#101413] border border-white/10 rounded-xl p-5 sm:p-7">
                    {isPending ? <p role="status" className="flex items-center gap-2 text-muted-foreground"><Loader2 size={18} className="animate-spin" /> Checking your invitation...</p>
                    : loadError ? <div role="alert"><h2 className="text-lg font-semibold mb-2">{badLink ? 'This link is no longer usable' : 'Could not load your invitation'}</h2><p className="text-sm text-muted-foreground leading-relaxed">{inviteMessage(loadError)}</p>{!badLink && <button onClick={() => refetch()} className="mt-4 min-h-[44px] text-accent underline">Try again</button>}<Link to="/login" className="block mt-4 min-h-[44px] content-center text-accent underline">Back to sign in</Link></div>
                    : invite && <div className="space-y-5">
                        <div><p className="text-xs text-muted-foreground mb-2">Invited email</p><p className="min-h-[44px] rounded-md border border-white/15 bg-[#0b100e] px-3 py-2.5 text-sm break-all">{invite.email}</p><p className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground"><ShieldCheck size={14} /> Joining as {invite.role === 'admin' ? 'an admin' : 'a member'}</p></div>
                        {oauthError && <p role="alert" className="text-sm text-amber-200 bg-amber-500/10 border border-amber-500/20 rounded-md p-3 leading-relaxed">{inviteOAuthError(oauthError)}</p>}
                        <div className="space-y-3">
                            {['google', 'github'].map(provider => <a key={provider} href={inviteOAuthUrl(api.defaults.baseURL, token, provider)} className="w-full min-h-[48px] bg-accent text-[#0b100e] rounded-md px-4 py-3 font-semibold flex items-center justify-center gap-3 hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"><span aria-hidden="true" className="font-mono text-base">{provider === 'google' ? 'G' : 'GH'}</span>Continue with {provider === 'google' ? 'Google' : 'GitHub'}</a>)}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">Use the account that matches the invited email. Your name comes from Google or GitHub. No password to create.</p>
                        <p className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed"><Mail size={14} className="shrink-0 mt-0.5" /> Need a different email? Ask your admin for a new invite.</p>
                    </div>}
                </section>
            </main>
        </div>
    );
}
