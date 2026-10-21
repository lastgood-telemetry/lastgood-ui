import React, { useState } from 'react';
import { Loader2, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { requestMagicLink } from '../service/auth';
import { capture } from '../util/posthog';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function MagicLinkForm({ purpose = 'signup' }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle | sending | sent
    const [error, setError] = useState('');

    const submit = async (event) => {
        event.preventDefault();
        if (status === 'sending') return;
        const value = email.trim();
        if (!EMAIL_RE.test(value)) { setError('Enter a valid email address.'); return; }
        setError('');
        setStatus('sending');
        try {
            await requestMagicLink(value);
            capture('magic_link_requested');
            setStatus('sent');
        } catch (err) {
            setStatus('idle');
            setError(err.response?.status === 429
                ? 'Too many attempts. Wait a few minutes and try again.'
                : err.response?.data?.message || 'Could not send the link. Try again.');
        }
    };

    if (status === 'sent') {
        return (
            <div role="status" className="flex items-start gap-3 p-4 border border-accent/30 bg-accent/5 rounded-[4px] text-[14px] leading-relaxed">
                <CheckCircle2 size={18} className="text-accent shrink-0 mt-0.5" />
                <div>
                    <p className="font-medium text-foreground">Check your email</p>
                    <p className="text-muted-foreground">If {email.trim()} can continue, an account access link is on its way. It works once and expires in 15 minutes.</p>
                    <button type="button" onClick={() => setStatus('idle')} className="mt-2 text-accent underline min-h-[44px]">Use a different email</button>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={submit} noValidate className="space-y-3" aria-busy={status === 'sending'}>
            <label htmlFor="magic-email" className="block text-[13px] font-medium text-text-secondary">Work email</label>
            <div className="flex items-center gap-3 bg-bg-primary border border-white/10 rounded-[4px] px-3 py-3 focus-within:border-accent/50 transition-colors">
                <Mail size={15} className="text-muted-foreground shrink-0" />
                <input id="magic-email" type="email" autoComplete="email" value={email} disabled={status === 'sending'}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="min-w-0 flex-1 bg-transparent outline-none text-[16px] text-white placeholder-white/20"
                    placeholder="name@company.com" />
            </div>
            {error && (
                <div role="alert" className="flex items-center gap-2 p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-[14px] rounded-[4px]">
                    <AlertCircle size={14} className="shrink-0" /><span>{error}</span>
                </div>
            )}
            <button type="submit" disabled={status === 'sending'}
                className="w-full min-h-[48px] px-4 py-3 bg-accent hover:bg-accent-hover text-bg-primary rounded-[4px] text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
                {status === 'sending' ? <><Loader2 size={16} className="animate-spin" />Sending link...</> : purpose === 'recovery' ? 'Email me a recovery link' : 'Confirm my email'}
            </button>
            <p className="text-[13px] text-muted-foreground">{purpose === 'recovery' ? 'Use the link to set a password. Daily sign-in uses your email and password.' : 'Works with any email provider. You will set a password during workspace setup.'}</p>
        </form>
    );
}
