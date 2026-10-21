import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import AuthShell from '../components/AuthShell';
import useOrgStore from '../stores/useOrgStore';
import { verifyMagicLink } from '../service/auth';
import { consumeLoginDestination } from '../util/console';
import { trackAuthenticated } from '../util/posthog';
import { readMagicToken } from '../util/magicLink';

// Email scanners and link previewers open links with GET, so the page only consumes the token
// when the person clicks the button (a POST). The token lives in the URL fragment and is removed on load.
export default function MagicLinkVerify() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [token] = useState(() => readMagicToken(window.location.hash));
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(token ? '' : 'This sign-in link is not valid. Request a new one.');

    useEffect(() => { if (window.location.hash) window.history.replaceState(null, '', window.location.pathname); }, []);

    const signIn = async () => {
        if (busy || !token) return;
        setBusy(true); setError('');
        try {
            const res = await verifyMagicLink(token);
            if (res.exists) {
                localStorage.setItem('authToken', res.data.token);
                trackAuthenticated('login_succeeded', { method: 'magic_link' });
                queryClient.clear();
                useOrgStore.getState().setOrg(null);
                navigate(consumeLoginDestination(), { replace: true });
            } else {
                navigate('/signup/complete-profile', { replace: true, state: { email: res.email, name: '', provider: 'magic', signupToken: res.signup_token } });
            }
        } catch (err) {
            setBusy(false);
            setError(err.response?.status === 429 ? 'Too many attempts. Wait a few minutes and try again.' : err.response?.data?.message || 'Could not sign you in. Request a new link.');
        }
    };

    return (
        <AuthShell>
            <div className="w-full space-y-7">
                <div className="space-y-3">
                    <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.035em]">Finish signing in</h1>
                    <p className="text-[14px] leading-relaxed text-muted-foreground">Confirm to sign in to LastGood on this device.</p>
                </div>
                {error && <div role="alert" className="p-3 border border-red-400/30 rounded-[4px] text-[14px] text-red-300">{error}</div>}
                {token && (
                    <button type="button" onClick={signIn} disabled={busy}
                        className="w-full min-h-[48px] px-4 py-3 bg-accent hover:bg-accent-hover text-bg-primary rounded-[4px] text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
                        {busy ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : 'Sign in'}
                    </button>
                )}
                <Link to="/login" className="inline-flex min-h-[44px] items-center text-accent underline">Back to sign in</Link>
            </div>
        </AuthShell>
    );
}
