import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Building2,
    Mail,
    User,
    UserCog,
    Loader2,
    Activity,
    ArrowRight,
    AlertCircle
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { oauthSignup } from '../service/auth';
import { toast } from '../components/ui/Toast';
import { useOrganizationCount } from '../hooks/useOrganizationCount';
import { trackEvent } from '../util/analytics';
import Logo from '../components/Logo';


const CompleteProfile = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { count, maxOrgs, isLimitReached } = useOrganizationCount();

    // Retrieve state passed from OAuthCallback
    const state = location.state || {};
    const { email: oauthEmail = '', name: oauthName = '', provider = '' } = state;

    const [form, setForm] = useState({
        email: oauthEmail,
        name: oauthName,
        org_name: '',
        org_slug: '',
        role: 'admin',
        provider: provider
    });

    const [userEditedSlug, setUserEditedSlug] = useState(false);
    const [validationError, setValidationError] = useState('');

    useEffect(() => {
        // Guard: if no email or provider state exists, redirect to login
        if (!oauthEmail || !provider) {
            toast.error('Onboarding session invalid or expired. Please sign in again.');
            navigate('/login', { replace: true });
        }
    }, [oauthEmail, provider, navigate]);

    const slugify = (text) => {
        return text
            .toString()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const handleOrgNameChange = (e) => {
        const val = e.target.value;
        setForm(prev => {
            const next = { ...prev, org_name: val };
            if (!userEditedSlug) {
                next.org_slug = slugify(val);
            }
            return next;
        });
    };

    const handleOrgSlugChange = (e) => {
        const val = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
        setUserEditedSlug(true);
        setForm(prev => ({ ...prev, org_slug: val }));
    };

    const { mutate: completeSignUp, isPending: loading } = useMutation({
        mutationFn: () => oauthSignup(form),
        onSuccess: (res) => {
            localStorage.setItem('authToken', res.data.token);
            toast.success('Registration completed successfully!');
            navigate('/rewind', { replace: true });
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to complete registration';
            setValidationError(errMsg);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setValidationError('');

        if (isLimitReached) {
            setValidationError(`We have reached the signup limit for BETA access (${maxOrgs}/${maxOrgs} organizations registered).`);
            trackEvent('oauth_signup_blocked_limit', 'auth', `count_${count}`);
            return;
        }

        if (!form.name.trim()) {

            setValidationError('Your name is required.');
            return;
        }
        if (!form.org_name.trim()) {
            setValidationError('Organization name is required.');
            return;
        }
        if (!form.org_slug.trim()) {
            setValidationError('Organization slug is required.');
            return;
        }
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(form.org_slug)) {
            setValidationError('Organization slug must only contain lowercase letters, numbers, and hyphens.');
            return;
        }

        completeSignUp();
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-center items-center p-6 sm:p-12 relative overflow-hidden font-sans">
            {/* Subtle background grids & ambient glow */}
            <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="w-full max-w-[400px] space-y-8 relative z-10 bg-black/30 border border-white/5 p-8 rounded-2xl backdrop-blur-xl">
                {/* Logo */}
                <div className="flex items-center justify-center">
                    <Logo size="md" showText={true} />
                </div>

                <div className="text-center space-y-2">
                    <h1 className="text-xl font-semibold tracking-tight text-white">
                        Complete your profile
                    </h1>
                    <p className="text-text-muted text-xs leading-relaxed">
                        Almost there! Create your workspace and define your role to finish your {provider === 'google' ? 'Google' : 'GitHub'} registration.
                    </p>

                    {/* Capacity Badge */}
                    <div className="flex items-center justify-between pt-2 pb-1">
                        <span className="text-[11px] font-medium text-text-secondary">Registration Capacity</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isLimitReached 
                                ? 'bg-red-500/10 border-red-500/30 text-red-400 font-semibold' 
                                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        }`}>
                            Beta: {count}/{maxOrgs} Orgs
                        </span>
                    </div>

                    {/* BETA Limit Alert Banner */}
                    {isLimitReached && (
                        <div className="bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs p-3.5 rounded-xl flex items-start gap-3 text-left animate-fade-in shadow-inner my-2">
                            <AlertCircle size={18} className="shrink-0 text-amber-400 mt-0.5" />
                            <div className="space-y-1">
                                <div className="font-semibold text-amber-200">Signup Limit Reached for BETA Access</div>
                                <p className="text-[11px] text-amber-200/80 leading-relaxed font-normal">
                                    We have reached our maximum limit of {maxOrgs} registered organizations for BETA access. Profile setup is temporarily blocked.
                                </p>
                            </div>
                        </div>
                    )}
                </div>


                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email (readonly) */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-text-secondary">Email Address</label>
                        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-lg px-3 py-2.5 opacity-60">
                            <Mail size={15} className="text-text-muted shrink-0" />
                            <input
                                type="email"
                                value={form.email}
                                disabled
                                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20"
                            />
                        </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-text-secondary">Your Name</label>
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all">
                            <User size={15} className="text-text-muted shrink-0" />
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20"
                                placeholder="Jane Doe"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Organization Name */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-text-secondary">Organization Name</label>
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all">
                            <Building2 size={15} className="text-text-muted shrink-0" />
                            <input
                                type="text"
                                value={form.org_name}
                                onChange={handleOrgNameChange}
                                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20"
                                placeholder="Acme Corp"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Organization Slug */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-text-secondary">Organization Slug</label>
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all">
                            <Building2 size={15} className="text-text-muted shrink-0" />
                            <input
                                type="text"
                                value={form.org_slug}
                                onChange={handleOrgSlugChange}
                                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20"
                                placeholder="acme-corp"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Role */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-medium text-text-secondary">Role</label>
                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all">
                            <UserCog size={15} className="text-text-muted shrink-0" />
                            <select
                                value={form.role}
                                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 border-none p-0 cursor-pointer"
                                disabled={loading}
                                style={{ colorScheme: 'dark' }}
                            >
                                <option value="admin" className="bg-[#030611] text-white">Admin</option>
                                <option value="developer" className="bg-[#030611] text-white">Developer</option>
                                <option value="viewer" className="bg-[#030611] text-white">Viewer</option>
                            </select>
                        </div>
                    </div>

                    {validationError && (
                        <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{validationError}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || isLimitReached}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.985] text-white shadow-lg shadow-accent/10 mt-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin text-white" size={14} />
                                Creating Workspace...
                            </>
                        ) : isLimitReached ? (
                            'Registration Blocked (BETA Limit Reached)'
                        ) : (
                            <>
                                Complete Registration
                                <ArrowRight size={13} className="ml-0.5" />
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
