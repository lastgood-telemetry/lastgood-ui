import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import AuthShell from '../components/AuthShell';
import MagicLinkForm from '../components/MagicLinkForm';
import { loginUser } from '../service/auth';
import { consumeLoginDestination, rememberSetupDestination } from '../util/console';
import { trackAuthenticated } from '../util/posthog';
import useOrgStore from '../stores/useOrgStore';

const inputClass = 'w-full min-w-0 bg-bg-primary border border-border rounded-[4px] px-3 py-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent disabled:opacity-60';
const buttonClass = 'w-full min-h-[48px] px-4 py-3 bg-accent hover:bg-accent-hover text-bg-primary rounded-[4px] text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer';

export default function Login() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    React.useEffect(() => { if (searchParams.get('setup') === 'github') rememberSetupDestination(); }, [searchParams]);
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visible, setVisible] = useState(false);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const handleGoogleLogin = () => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:5173/auth/callback/google';
        const scope = 'openid email profile';

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
            `client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&response_type=code` +
            `&scope=${encodeURIComponent(scope)}`;

        window.location.href = googleAuthUrl;
    };

    const handleGithubLogin = () => {
        const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GITHUB_REDIRECT_URI || 'http://localhost:5173/auth/callback/github';
        const scope = 'user:email';

        const githubAuthUrl = `https://github.com/login/oauth/authorize?` +
            `client_id=${clientId}` +
            `&redirect_uri=${encodeURIComponent(redirectUri)}` +
            `&scope=${encodeURIComponent(scope)}`;

        window.location.href = githubAuthUrl;
    };


    const signIn = async (event) => {
        event.preventDefault();
        if (busy) return;
        setError(''); setBusy(true);
        try {
            const data = await loginUser(email.trim().toLowerCase(), password);
            localStorage.setItem('authToken', data.token);
            trackAuthenticated('login_succeeded', { method: 'password' });
            queryClient.clear();
            useOrgStore.getState().setOrg(null);
            navigate(consumeLoginDestination(), { replace: true });
        } catch (err) {
            setError(err.response?.status === 429 ? 'Too many attempts. Wait a few minutes and try again.' : err.response?.data?.message || 'Could not sign in. Try again.');
            setBusy(false);
        }
    };
    const switchMode = (next) => { setMode(next); setError(''); setPassword(''); };
    return <AuthShell>
        <div className="w-full space-y-6">
            <div className="space-y-3">
                <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.035em]">{mode === 'login' ? 'Sign in to LastGood' : mode === 'signup' ? 'Create your account' : 'Reset your password'}</h1>
                <p className="text-[14px] leading-relaxed text-muted-foreground">{mode === 'login' ? 'Use your email and password, or continue with Google or GitHub.' : mode === 'signup' ? 'Confirm your work email, then set a password and create your workspace.' : 'We will email a one-time link so you can set a new password.'}</p>
            </div>
            {mode === 'login' ? <>
                <form onSubmit={signIn} className="space-y-4" aria-busy={busy}>
                    <div className="space-y-2"><label htmlFor="login-email" className="text-sm font-medium">Email</label>
                        <input id="login-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} disabled={busy} placeholder="name@company.com" className={inputClass} /></div>
                    <div className="space-y-2"><label htmlFor="login-password" className="text-sm font-medium">Password</label>
                        <div className="relative"><input id="login-password" type={visible ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} className={`${inputClass} pr-12`} />
                            <button type="button" onClick={() => setVisible(v => !v)} aria-label={visible ? 'Hide password' : 'Show password'} className="absolute right-0 top-0 min-w-[44px] min-h-[48px] flex items-center justify-center text-muted-foreground">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                    {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
                    <button type="submit" disabled={busy} className={buttonClass}>{busy ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : 'Sign in'}</button>
                </form>
                <button type="button" onClick={() => switchMode('recovery')} className="min-h-[44px] text-accent text-sm underline">Forgot password or need to set one?</button>
                <div className="flex items-center gap-3 text-xs uppercase text-muted-foreground" aria-hidden="true"><span className="h-px flex-1 bg-border" />or continue with<span className="h-px flex-1 bg-border" /></div>
                <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={handleGithubLogin} className="min-h-[48px] border border-border rounded-[4px] hover:bg-accent/10 text-sm font-medium">GitHub</button>
                    <button type="button" onClick={handleGoogleLogin} className="min-h-[48px] border border-border rounded-[4px] hover:bg-accent/10 text-sm font-medium">Google</button>
                </div>
                <p className="text-sm text-muted-foreground">New here? <button type="button" onClick={() => switchMode('signup')} className="min-h-[44px] text-accent underline">Create an account</button></p>
            </> : <>
                <MagicLinkForm key={mode} purpose={mode} />
                <button type="button" onClick={() => switchMode('login')} className="min-h-[44px] text-accent text-sm underline">Back to sign in</button>
            </>}
        </div>
    </AuthShell>;
}
