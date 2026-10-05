import { consumeLoginDestination } from '../util/console';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, AlertCircle } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { oauthSignup } from '../service/auth';
import { toast } from '../components/ui/Toast';
import { useOrganizationCount } from '../hooks/useOrganizationCount';
import { trackEvent } from '../util/analytics';
import AuthShell from '../components/AuthShell';
import { profileErrors, workspaceSlug } from '../util/onboarding';

const inputClass = 'w-full min-w-0 bg-bg-primary border rounded-[4px] px-3 py-3 text-[16px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-60';

export default function CompleteProfile() {
    const location = useLocation();
    const navigate = useNavigate();
    const { count, maxOrgs, isLimitReached } = useOrganizationCount();
    const { email: oauthEmail = '', name: oauthName = '', provider = '' } = location.state || {};
    const [form, setForm] = useState({ email: oauthEmail, name: oauthName, org_name: '', org_slug: '', role: 'admin', provider });
    const [userEditedSlug, setUserEditedSlug] = useState(false);
    const [errors, setErrors] = useState({});
    const [validationError, setValidationError] = useState('');
    const formRef = useRef(null);
    const focusError = useRef(false);
    useEffect(() => {
        if (focusError.current) {
            const key = Object.keys(errors).find(key => errors[key]);
            if (key) formRef.current?.querySelector(`#${key}`)?.focus();
            focusError.current = false;
        }
    }, [errors]);

    useEffect(() => {
        if (!oauthEmail || !provider) {
            toast.error('Onboarding session invalid or expired. Please sign in again.');
            navigate('/login', { replace: true });
        }
    }, [oauthEmail, provider, navigate]);

    const update = (key, value) => {
        setValidationError('');
        setErrors(previous => ({ ...previous, [key]: undefined, ...(key === 'org_name' && !userEditedSlug ? { org_slug: undefined } : {}) }));
        setForm(previous => ({ ...previous, [key]: value, ...(key === 'org_name' && !userEditedSlug ? { org_slug: workspaceSlug(value) } : {}) }));
    };

    const { mutate: completeSignUp, isPending: loading } = useMutation({
        mutationFn: () => oauthSignup({ ...form, name: form.name.trim(), org_name: form.org_name.trim() }),
        onSuccess: (res) => {
            localStorage.setItem('authToken', res.data.token);
            toast.success('Registration completed successfully!');
            navigate(consumeLoginDestination(), { replace: true });
        },
        onError: (err) => {
            const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to complete registration. Please try again.';
            // Only label a slug conflict when the server explicitly identifies it.
            if (/slug/i.test(message)) {
                focusError.current = true;
                setErrors(previous => ({ ...previous, org_slug: message }));
            } else {
                setValidationError(message);
            }
        }
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        setValidationError('');
        if (loading) return;
        if (isLimitReached) {
            setValidationError(`Beta signup is full (${maxOrgs} organizations). Please try again when registration reopens.`);
            trackEvent('oauth_signup_blocked_limit', 'auth', `count_${count}`);
            return;
        }
        const next = profileErrors(form);
        focusError.current = true;
        setErrors(next);
        if (Object.keys(next).length) {
            return;
        }
        completeSignUp();
    };

    const field = (key, label, placeholder, help) => (
        <div className="space-y-2">
            <label htmlFor={key} className="block text-[14px] font-medium">{label}</label>
            <input id={key} name={key} value={form[key]} placeholder={placeholder} disabled={loading || isLimitReached}
                autoComplete={key === 'name' ? 'name' : key === 'org_name' ? 'organization' : 'off'}
                spellCheck={key !== 'org_slug'} required aria-invalid={!!errors[key]} aria-describedby={`${key}-hint${errors[key] ? ` ${key}-error` : ''}`}
                onChange={event => {
                    if (key === 'org_slug') setUserEditedSlug(true);
                    update(key, key === 'org_slug' ? event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') : event.target.value);
                }}
                onBlur={() => setErrors(previous => ({ ...previous, [key]: profileErrors(form)[key] }))}
                className={`${inputClass} ${errors[key] ? 'border-red-400' : 'border-border'}`} />
            <p id={`${key}-hint`} className="text-[13px] leading-relaxed text-muted-foreground">{help}</p>
            {errors[key] && <p id={`${key}-error`} role="alert" className="text-[13px] text-red-300">{errors[key]}</p>}
        </div>
    );

    return (
        <AuthShell stage="profile">
            <div className="mb-7">
                <h1 className="text-[30px] leading-tight tracking-[-0.035em] font-semibold">Make it your workspace.</h1>
                <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">Signed in with {provider === 'google' ? 'Google' : 'GitHub'}. Add your details to finish setup.</p>
            </div>
            {isLimitReached && <div role="alert" className="mb-6 border border-amber-500/30 bg-amber-500/10 rounded-[4px] p-4 text-[14px] text-amber-200">Beta signup is full. Workspace creation is temporarily paused at {maxOrgs} organizations.</div>}
            <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5" aria-busy={loading}>
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-[14px] font-medium">Account email</label>
                    <input id="email" type="email" value={form.email} readOnly className={`${inputClass} border-border text-muted-foreground`} aria-describedby="email-hint" />
                    <p id="email-hint" className="text-[13px] text-muted-foreground">From your {provider === 'google' ? 'Google' : 'GitHub'} account. Not editable here.</p>
                </div>
                {field('name', 'Your name', 'Jane Doe', 'How your team will recognize you.')}
                {field('org_name', 'Workspace name', 'Acme', 'Use your team or organization name.')}
                {field('org_slug', 'Workspace slug', 'acme', 'Lowercase letters, numbers and single hyphens. Availability is checked when you create the workspace.')}
                <div className="space-y-2">
                    <label htmlFor="role" className="block text-[14px] font-medium">Your role</label>
                    <select id="role" value={form.role} onChange={event => update('role', event.target.value)} disabled={loading || isLimitReached} className={`${inputClass} border-border`} style={{ colorScheme: 'dark' }}>
                        <option value="admin">Admin</option><option value="developer">Developer</option><option value="viewer">Viewer</option>
                    </select>
                </div>
                {validationError && <div role="alert" className="flex items-start gap-2 p-3 border border-red-400/30 rounded-[4px] text-[14px] text-red-300"><AlertCircle size={18} className="shrink-0 mt-0.5" /><span>{validationError}</span></div>}
                <button type="submit" disabled={loading || isLimitReached} className="w-full min-h-[48px] px-4 py-3 bg-accent hover:bg-accent-hover text-bg-primary rounded-[4px] font-semibold text-[14px] flex items-center justify-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? <><Loader2 size={18} className="animate-spin" />Creating workspace...</> : isLimitReached ? 'Beta signup paused' : <>Create workspace<ArrowRight size={18} /></>}
                </button>
            </form>
        </AuthShell>
    );
}
