import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import AuthShell from '../components/AuthShell';
import useOrgStore from '../stores/useOrgStore';
import { verifyMagicLink, resetPasswordWithLink } from '../service/auth';
import { consumeLoginDestination } from '../util/console';
import { trackAuthenticated } from '../util/posthog';
import { passwordErrors } from '../util/onboarding';
import { readMagicToken } from '../util/magicLink';

// Email scanners and link previewers open links with GET, so the page only consumes the token
// when the person clicks the button (a POST). The token lives in the URL fragment and is removed on load.
export default function MagicLinkVerify() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [token] = useState(() => readMagicToken(window.location.hash));
    const [recovery, setRecovery] = useState(null);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState(token ? '' : 'This sign-in link is not valid. Request a new one.');

    useEffect(() => { if (window.location.hash) window.history.replaceState(null, '', window.location.pathname); }, []);

    const signIn = async () => {
        if (busy || !token) return;
        setBusy(true); setError('');
        try {
            const res = await verifyMagicLink(token);
            if (res.exists) {
                setRecovery({ token: res.reset_token, email: res.email });
                setBusy(false);
            } else {
                navigate('/signup/complete-profile', { replace: true, state: { email: res.email, name: '', provider: 'magic', signupToken: res.signup_token } });
            }
        } catch (err) {
            setBusy(false);
            setError(err.response?.status === 429 ? 'Too many attempts. Wait a few minutes and try again.' : err.response?.data?.message || 'Could not sign you in. Request a new link.');
        }
    };

    const savePassword = async (event) => {
        event.preventDefault();
        if (busy) return;
        const errors = passwordErrors(password, confirmPassword);
        if (Object.keys(errors).length) { setError(Object.values(errors).join(' ')); return; }
        setBusy(true); setError('');
        try {
            const res = await resetPasswordWithLink(recovery.token, password);
            localStorage.setItem('authToken', res.data.token);
            trackAuthenticated('login_succeeded', { method: 'password_recovery' });
            queryClient.clear();
            useOrgStore.getState().setOrg(null);
            navigate(consumeLoginDestination(), { replace: true });
        } catch (err) {
            setBusy(false);
            setError(err.response?.status === 429 ? 'Too many attempts. Wait a few minutes and request a new link.' : err.response?.data?.message || 'Could not set your password. Request a new link.');
        }
    };

    return (
        <AuthShell>
            <div className="w-full space-y-7">
                <div className="space-y-3">
                    <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.035em]">{recovery ? 'Set your password' : 'Confirm your email'}</h1>
                    <p className="text-[14px] leading-relaxed text-muted-foreground">{recovery ? `Choose a password for ${recovery.email}. Use it to sign in next time.` : 'Continue to create your workspace or recover your account. Existing accounts will set a new password before signing in.'}</p>
                </div>
                {error && <div role="alert" className="p-3 border border-red-400/30 rounded-[4px] text-[14px] text-red-300">{error}</div>}
                {recovery && <form onSubmit={savePassword} className="space-y-4" aria-busy={busy}>
                    <p className="text-sm text-muted-foreground">Use at least 12 characters, up to 72 UTF-8 bytes.</p>
                    {[['new-password', 'New password', password, setPassword], ['confirm-password', 'Confirm password', confirmPassword, setConfirmPassword]].map(([id, label, value, update]) => <div key={id} className="space-y-2">
                        <label htmlFor={id} className="block text-sm font-medium">{label}</label>
                        <input id={id} type="password" autoComplete="new-password" required value={value} onChange={e => update(e.target.value)} disabled={busy} className="w-full bg-bg-primary border border-border rounded-[4px] px-3 py-3 text-[16px] focus:outline-none focus:border-accent" />
                    </div>)}
                    <button type="submit" disabled={busy} className="w-full min-h-[48px] bg-accent hover:bg-accent-hover text-bg-primary rounded-[4px] font-semibold disabled:opacity-60">{busy ? 'Saving...' : 'Set password and sign in'}</button>
                </form>}
                {token && !recovery && (
                    <button type="button" onClick={signIn} disabled={busy}
                        className="w-full min-h-[48px] px-4 py-3 bg-accent hover:bg-accent-hover text-bg-primary rounded-[4px] text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
                        {busy ? <><Loader2 size={16} className="animate-spin" />Confirming...</> : 'Continue'}
                    </button>
                )}
                <Link to="/login" className="inline-flex min-h-[44px] items-center text-accent underline">Back to sign in</Link>
            </div>
        </AuthShell>
    );
}
