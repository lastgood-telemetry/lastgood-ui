import { consumeLoginDestination } from '../util/console';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, Activity } from 'lucide-react';
import Logo from '../components/Logo';
import { googleOAuthCallback, githubOAuthCallback } from '../service/auth';
import { useQueryClient } from '@tanstack/react-query';
import useOrgStore from '../stores/useOrgStore';
import { inviteErrorDestination } from '../util/invites';
import { toast } from '../components/ui/Toast';

const OAuthCallback = () => {
    const { provider } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [callbackError, setCallbackError] = useState('');
    const hasCalled = useRef(false);
    const queryClient = useQueryClient();

    useEffect(() => {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const providerError = searchParams.get('error');
        if (!code && !providerError) {
            if (state) { setCallbackError('Your sign-in session could not be verified. Open your invite link and try again.'); return; }
            toast.error('No authorization code found in callback URL');
            navigate('/login', { replace: true });
            return;
        }

        // Prevent double invocation in React StrictMode
        if (hasCalled.current) return;
        hasCalled.current = true;

        const exchangeCode = async () => {
            try {
                let response;
                if (provider === 'google') {
                    response = await googleOAuthCallback(code, state, providerError);
                } else if (provider === 'github') {
                    response = await githubOAuthCallback(code, state, providerError);
                } else {
                    throw new Error(`Unsupported OAuth provider: ${provider}`);
                }

                if (state && !response.exists) { setCallbackError('We could not finish joining your workspace. Open your invite link and try again.'); return; }
                if (response.exists) {
                    // User already exists, login successful
                    localStorage.setItem('authToken', response.data.token);
                    queryClient.clear();
                    useOrgStore.getState().setOrg(null);
                    toast.success('Logged in successfully!');
                    navigate(consumeLoginDestination(), { replace: true });
                } else {
                    // New user, redirect to complete profile onboarding screen
                    toast.info('Please complete your profile to set up your account.');
                    navigate('/signup/complete-profile', {
                        replace: true,
                        state: {
                            email: response.email,
                            name: response.name,
                            provider: provider
                        }
                    });
                }
            } catch (err) {
                const inviteReturn = inviteErrorDestination(err.response?.data?.redirect_url, window.location.origin);
                if (inviteReturn) { navigate(inviteReturn, { replace: true }); return; }
                if (state) { setCallbackError('Your sign-in session could not be verified. Open your invite link and try again.'); return; }
                const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to authenticate';
                toast.error(errMsg);
                navigate('/login', { replace: true });
            }
        };

        exchangeCode();
    }, [provider, searchParams, navigate, queryClient]);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-center items-center font-sans">
            <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center gap-6 max-w-sm text-center px-6">
                <div className="flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 animate-pulse">
                    <Logo size="lg" />
                </div>
                
                <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-white tracking-tight">{callbackError ? 'Could not complete sign-in' : `Authenticating with ${provider ? provider.charAt(0).toUpperCase() + provider.slice(1) : ''}`}</h2>
                    <p className="text-xs text-text-muted leading-relaxed">
                        {callbackError || 'Finishing your sign-in. Please keep this window open.'}
                    </p>
                </div>

                {callbackError ? <Link to="/login" className="min-h-[44px] content-center text-accent underline">Back to sign in</Link> : <Loader2 className="animate-spin text-accent mt-2" size={20} />}
            </div>
        </div>
    );
};

export default OAuthCallback;
