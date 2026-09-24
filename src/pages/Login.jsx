import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    KeyRound,
    AlertCircle,
    Activity,
    ArrowRight,
    Clock,
    Building2,
    Globe,
    UserCog
} from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { loginUser, resetPassword, signupUser } from '../service/auth';
import { useOrganizationCount } from '../hooks/useOrganizationCount';
import { trackEvent } from '../util/analytics';
import Logo from '../components/Logo';

const timelineSteps = [
    {
        time: "14:15:32",
        title: "Incident Detected",
        desc: "Stripe API webhook failure. Server returned 500.",
        colorClass: "border-red-500/50 bg-red-950/20 text-red-400"
    },
    {
        time: "14:15:45",
        title: "Root Cause Identified",
        desc: "Regression schema change detected in PR #421.",
        colorClass: "border-amber-500/50 bg-amber-950/20 text-amber-400"
    },
    {
        time: "14:16:01",
        title: "Locating Last Good State",
        desc: "Found target snapshot db_replica_1402.",
        colorClass: "border-sky-500/50 bg-sky-950/20 text-sky-400"
    },
    {
        time: "14:16:30",
        title: "System Restored",
        desc: "State rewound. 200 OK webhook retry success.",
        colorClass: "border-emerald-500/50 bg-emerald-950/20 text-emerald-400"
    }
];

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isTestMode = searchParams.get('testMode') === 'true';
    const { count, maxOrgs, isLimitReached } = useOrganizationCount();

    const [step, setStep] = useState('login');
    const [validationError, setValidationError] = useState('');

    const [creds, setCreds] = useState({
        email: '',
        password: ''
    });

    const [resetPwd, setResetPwd] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const [signupCreds, setSignupCreds] = useState({
        email: '',
        password: '',
        org_name: '',
        org_slug: '',
        role: 'admin'
    });
    const [userEditedSlug, setUserEditedSlug] = useState(false);

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
        setSignupCreds(prev => {
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
        setSignupCreds(prev => ({ ...prev, org_slug: val }));
    };

    // Timeline interactive index state (defaults to completed healthy step)
    const [activeIndex, setActiveIndex] = useState(3);

    const handleChange = (key, value) => {
        setValidationError('');
        setCreds(prev => ({ ...prev, [key]: value }));
    };

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

    const handleResetChange = (key, value) => {
        setValidationError('');
        setResetPwd(prev => ({ ...prev, [key]: value }));
    };

    // ---------------- LOGIN ----------------

    // ---------------- SIGNUP ----------------
    const { mutate: signup, isPending: signupLoading } = useMutation({
        mutationFn: () => signupUser(signupCreds),
        onSuccess: () => {
            setStep('check-email');
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to create account";
            setValidationError(errMsg);
        }
    });

    const { mutate: login, isPending: loginLoading, data } = useMutation({
        mutationFn: () => loginUser(creds.email, creds.password),

        onSuccess: (data) => {
            const tempPassRestted = data?.user?.temp_pwd_reset;

            if (!tempPassRestted) {
                setStep('reset');
                return;
            }

            localStorage.setItem('authToken', data?.token)
            navigate('/rewind');
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Invalid email or password";
            setValidationError(errMsg);
        }
    });

    // ---------------- RESET PASSWORD ----------------

    const { mutate: resetPasswordMutate, isPending: resetLoading } =
        useMutation({
            mutationFn: () => resetPassword(data?.user?.id, resetPwd.newPassword),

            onSuccess: (data) => {
                setStep('login')
            },
            onError: (err) => {
                const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Failed to reset password";
                setValidationError(errMsg);
            }
        });

    const handleLogin = () => {
        setValidationError('');
        if (!creds.email.trim()) {
            setValidationError('Email address is required.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(creds.email)) {
            setValidationError('Please enter a valid email address.');
            return;
        }
        if (!creds.password) {
            setValidationError('Password is required.');
            return;
        }
        if (creds.password.length < 6) {
            setValidationError('Password must be at least 6 characters long.');
            return;
        }
        login();
    };

    const handleSignup = () => {
        setValidationError('');
        if (isLimitReached) {
            setValidationError(`We have reached the signup limit for BETA access (${maxOrgs}/${maxOrgs} organizations registered).`);
            trackEvent('signup_blocked_limit', 'auth', `count_${count}`);
            return;
        }
        if (!signupCreds.org_name.trim()) {
            setValidationError('Organization name is required.');
            return;
        }
        if (!signupCreds.org_slug.trim()) {
            setValidationError('Organization slug is required.');
            return;
        }
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(signupCreds.org_slug)) {
            setValidationError('Organization slug must only contain lowercase letters, numbers, and hyphens.');
            return;
        }
        if (!signupCreds.email.trim()) {
            setValidationError('Email address is required.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(signupCreds.email)) {
            setValidationError('Please enter a valid email address.');
            return;
        }
        if (!signupCreds.password) {
            setValidationError('Password is required.');
            return;
        }
        if (signupCreds.password.length < 6) {
            setValidationError('Password must be at least 6 characters long.');
            return;
        }
        signup();
    };

    const handleResetPassword = () => {
        setValidationError('');
        if (!resetPwd.newPassword) {
            setValidationError('New password is required.');
            return;
        }
        if (resetPwd.newPassword.length < 6) {
            setValidationError('New password must be at least 6 characters long.');
            return;
        }
        if (resetPwd.newPassword !== resetPwd.confirmPassword) {
            setValidationError('Passwords do not match.');
            return;
        }

        resetPasswordMutate();
    };

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex relative overflow-hidden font-sans">

            {/* LEFT PANEL: Minimal timeline observability visualization */}
            <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between p-16 relative overflow-hidden border-r border-white/5 bg-[#030611]">

                {/* Subtle grids & ambient glow */}
                <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

                {/* Left Panel Logo */}
                <div className="relative z-10 flex items-center gap-2.5">
                    <Logo size="md" showText={true} />
                </div>

                {/* Vertical Timeline */}
                <div className="relative z-10 my-auto max-w-sm space-y-12">
                    <div className="space-y-3">
                        <span className="text-xs font-mono uppercase tracking-widest text-accent/80 font-semibold">Incident Rewind</span>
                        <h2 className="text-2xl font-bold tracking-tight text-white leading-tight">
                            Rewind production state. Identify anomalies instantly.
                        </h2>
                    </div>

                    <div className="relative pl-6 space-y-8 border-l border-white/10">
                        {timelineSteps.map((s, idx) => {
                            const isActive = idx <= activeIndex;
                            return (
                                <div
                                    key={idx}
                                    className={`relative transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-30'
                                        }`}
                                >
                                    {/* Timeline Node Dot */}
                                    <div className={`absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all duration-500 bg-[#030611] ${isActive ? s.colorClass.split(' ')[0] : 'border-white/15'
                                        }`} />

                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-mono text-text-muted">{s.time}</span>
                                            <span className="text-xs font-semibold text-white">{s.title}</span>
                                        </div>
                                        <p className="text-xs text-text-secondary font-light leading-relaxed">{s.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Timeline slider control */}
                    <div className="space-y-2 pt-4">
                        <div className="flex justify-between items-center text-[10px] font-mono text-text-muted">
                            <span>Drag to rewind state</span>
                            <span className="text-white flex items-center gap-1">
                                <Clock size={10} className="text-accent" />
                                {timelineSteps[activeIndex].title}
                            </span>
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="3"
                            value={activeIndex}
                            onChange={(e) => setActiveIndex(parseInt(e.target.value))}
                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent focus:outline-none"
                        />
                    </div>
                </div>

                {/* Footer brand note */}
                <div className="relative z-10 text-[11px] text-text-muted font-mono">
                    LastGood Telemetry System &copy; 2026
                </div>
            </div>

            {/* RIGHT PANEL: Minimal Credentials Section */}
            <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 bg-black/5">
                {/* ambient mobile backdrop glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-[90px] pointer-events-none lg:hidden" />

                <div className="w-full max-w-[360px] space-y-8">
                    {/* Header */}
                    <div className="text-center lg:text-left space-y-2">
                        {/* Logo visible only on mobile */}
                        <div className="flex lg:hidden items-center justify-center gap-2 mb-6">
                            <Logo size="md" showText={true} />
                        </div>

                        <h1 className="text-xl font-semibold tracking-tight text-white">
                            {step === 'login' && 'Sign in to LastGood'}
                            {step === 'signup' && 'Create your account'}
                            {step === 'check-email' && 'Verify your email'}
                            {step === 'reset' && 'Reset your password'}
                        </h1>

                        <p className="text-text-muted text-xs leading-relaxed">
                            {step === 'login' && (isTestMode ? 'Access your dashboard with email credentials.' : 'Sign in to access your organization dashboard.')}
                            {step === 'signup' && 'Get started with LastGood self-serve telemetry.'}
                            {step === 'check-email' && `We've sent a magic verification link to your email.`}
                            {step === 'reset' && 'Provide your new security credentials below.'}
                        </p>
                    </div>

                    {/* LOGIN FORM */}
                    {step === 'login' && (
                        <div className="space-y-4.5">
                            {isTestMode ? (
                                <div className="space-y-4">
                                    <div className="p-2.5 bg-indigo-950/60 border border-indigo-500/30 rounded-lg text-indigo-300 text-[11px] font-mono font-semibold flex items-center justify-between">
                                        <span>[TEST MODE ACTIVE]</span>
                                        <span className="text-[10px] text-slate-400">Email/Password Enabled</span>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-medium text-text-secondary">Email</label>
                                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                            <Mail size={15} className="text-text-muted shrink-0" />
                                            <input
                                                type="email"
                                                value={creds.email}
                                                onChange={(e) =>
                                                    handleChange('email', e.target.value)
                                                }
                                                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                                placeholder="name@company.com"
                                                disabled={loginLoading}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[11px] font-medium text-text-secondary">Password</label>
                                        <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                            <Lock size={15} className="text-text-muted shrink-0" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                value={creds.password}
                                                onChange={(e) =>
                                                    handleChange('password', e.target.value)
                                                }
                                                className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                                placeholder="••••••••"
                                                disabled={loginLoading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(v => !v)}
                                                disabled={loginLoading}
                                                className="text-text-muted hover:text-white transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                        </div>
                                    </div>

                                    {validationError && (
                                        <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                                            <AlertCircle size={14} className="shrink-0" />
                                            <span>{validationError}</span>
                                        </div>
                                    )}

                                    <button
                                        onClick={handleLogin}
                                        disabled={loginLoading}
                                        className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.985] text-white shadow-lg shadow-accent/10 cursor-pointer"
                                    >
                                        {loginLoading ? (
                                            <>
                                                <Loader2 className="animate-spin text-white" size={14} />
                                                Authenticating...
                                            </>
                                        ) : (
                                            <>
                                                Sign In with Password
                                                <ArrowRight size={13} className="ml-0.5" />
                                            </>
                                        )}
                                    </button>

                                    <div className="flex items-center my-4">
                                        <div className="flex-1 border-t border-white/5"></div>
                                        <span className="px-3 text-[10px] uppercase tracking-wider text-text-muted font-mono">or continue with</span>
                                        <div className="flex-1 border-t border-white/5"></div>
                                    </div>
                                </div>
                            ) : null}

                            {/* OAuth Login Buttons */}
                            <div className={isTestMode ? "grid grid-cols-2 gap-3" : "space-y-3.5 pt-1"}>
                                <button
                                    type="button"
                                    onClick={handleGithubLogin}
                                    className={isTestMode ? "flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-lg text-xs font-semibold text-white transition-all active:scale-[0.985] cursor-pointer" : "w-full flex items-center justify-center gap-3 bg-[#111827] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-md active:scale-[0.985] cursor-pointer"}
                                >
                                    <svg className="w-5 h-5 shrink-0 fill-current text-white" viewBox="0 0 24 24">
                                        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                    </svg>
                                    <span>{isTestMode ? "GitHub" : "Continue with GitHub"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className={isTestMode ? "flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 py-2.5 rounded-lg text-xs font-semibold text-white transition-all active:scale-[0.985] cursor-pointer" : "w-full flex items-center justify-center gap-3 bg-[#111827] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 py-3 rounded-xl text-sm font-semibold text-white transition-all shadow-md active:scale-[0.985] cursor-pointer"}
                                >
                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                                    </svg>
                                    <span>{isTestMode ? "Google" : "Continue with Google"}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* SIGNUP FORM */}
                    {step === 'signup' && (
                        <div className="space-y-4.5">
                            {/* Capacity Badge */}
                            <div className="flex items-center justify-between pb-1">
                                <span className="text-[11px] font-medium text-text-secondary">Registration Capacity</span>
                                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isLimitReached
                                        ? 'bg-red-500/10 border-red-500/30 text-red-400 font-semibold'
                                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    }`}>
                                    Beta: {count}/{maxOrgs} Orgs
                                </span>
                            </div>

                            {/* BETA Limit Alert Banner */}
                            {isLimitReached && (
                                <div className="bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs p-3.5 rounded-xl flex items-start gap-3 animate-fade-in shadow-inner">
                                    <AlertCircle size={18} className="shrink-0 text-amber-400 mt-0.5" />
                                    <div className="space-y-1">
                                        <div className="font-semibold text-amber-200">Signup Limit Reached for BETA Access</div>
                                        <p className="text-[11px] text-amber-200/80 leading-relaxed font-normal">
                                            We have reached our maximum limit of {maxOrgs} registered organizations for BETA access. New signups are currently blocked.
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Organization Name</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <Building2 size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type="text"
                                        value={signupCreds.org_name}
                                        onChange={handleOrgNameChange}
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="Acme Corp"
                                        disabled={signupLoading || isLimitReached}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Role</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <UserCog size={15} className="text-text-muted shrink-0" />
                                    <select
                                        value={signupCreds.role}
                                        onChange={(e) => setSignupCreds(prev => ({ ...prev, role: e.target.value }))}
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted border-none p-0 cursor-pointer"
                                        disabled={signupLoading || isLimitReached}
                                        style={{ colorScheme: 'dark' }}
                                    >
                                        <option value="admin" className="bg-[#030611] text-white">Admin</option>
                                        <option value="developer" className="bg-[#030611] text-white">Developer</option>
                                        <option value="viewer" className="bg-[#030611] text-white">Viewer</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Email Address</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <Mail size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type="email"
                                        value={signupCreds.email}
                                        onChange={(e) => setSignupCreds(prev => ({ ...prev, email: e.target.value }))}
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="name@company.com"
                                        disabled={signupLoading || isLimitReached}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Password</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <Lock size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={signupCreds.password}
                                        onChange={(e) => setSignupCreds(prev => ({ ...prev, password: e.target.value }))}
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="••••••••"
                                        disabled={signupLoading || isLimitReached}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        disabled={signupLoading || isLimitReached}
                                        className="text-text-muted hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            {validationError && (
                                <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                                    <AlertCircle size={14} className="shrink-0" />
                                    <span>{validationError}</span>
                                </div>
                            )}

                            <button
                                onClick={handleSignup}
                                disabled={signupLoading || isLimitReached}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.985] text-white shadow-lg shadow-accent/10"
                            >
                                {signupLoading ? (
                                    <>
                                        <Loader2 className="animate-spin text-white" size={14} />
                                        Creating Account...
                                    </>
                                ) : isLimitReached ? (
                                    'Signup Blocked (BETA Limit Reached)'
                                ) : (
                                    <>
                                        Sign Up
                                        <ArrowRight size={13} className="ml-0.5" />
                                    </>
                                )}
                            </button>


                            <div className="text-center pt-2">
                                <button
                                    onClick={() => {
                                        setStep('login');
                                        setValidationError('');
                                    }}
                                    className="text-[11px] text-text-muted hover:text-white transition-colors"
                                >
                                    Already have an account? Sign In
                                </button>
                            </div>
                        </div>
                    )}

                    {/* CHECK EMAIL SCREEN */}
                    {step === 'check-email' && (
                        <div className="space-y-6 text-center animate-fade-in">
                            <div className="flex justify-center">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center border border-accent/20">
                                    <Mail size={20} className="text-accent" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-text-secondary leading-relaxed">
                                    We've sent a magic email verification link to <span className="font-semibold text-white">{signupCreds.email}</span>.
                                </p>
                                <p className="text-xs text-text-muted leading-relaxed">
                                    Please click the link in the email to verify your address and log in to your dashboard.
                                </p>
                            </div>

                            <button
                                onClick={() => {
                                    setStep('login');
                                    setValidationError('');
                                }}
                                className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:border-white/20 py-2.5 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all active:scale-[0.985] text-white"
                            >
                                Back to Sign In
                            </button>
                        </div>
                    )}

                    {/* RESET PASSWORD FORM */}
                    {step === 'reset' && (
                        <div className="space-y-4.5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">New Password</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <KeyRound size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type={showNewPassword ? 'text' : 'password'}
                                        value={resetPwd.newPassword}
                                        onChange={(e) =>
                                            handleResetChange('newPassword', e.target.value)
                                        }
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="New password (min 6 characters)"
                                        disabled={resetLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(v => !v)}
                                        disabled={resetLoading}
                                        className="text-text-muted hover:text-white transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-medium text-text-secondary">Confirm Password</label>
                                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 focus-within:ring-1 focus-within:ring-accent/10 transition-all font-sans">
                                    <Lock size={15} className="text-text-muted shrink-0" />
                                    <input
                                        type="password"
                                        value={resetPwd.confirmPassword}
                                        onChange={(e) =>
                                            handleResetChange('confirmPassword', e.target.value)
                                        }
                                        className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20 disabled:text-text-muted"
                                        placeholder="Confirm password"
                                        disabled={resetLoading}
                                    />
                                </div>
                            </div>

                            {validationError && (
                                <div className="bg-red-500/5 border border-red-500/10 text-red-400 text-xs p-3 rounded-lg flex items-center gap-2 animate-fade-in">
                                    <AlertCircle size={14} className="shrink-0" />
                                    <span>{validationError}</span>
                                </div>
                            )}

                            <button
                                onClick={handleResetPassword}
                                disabled={resetLoading}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 disabled:opacity-50 transition-all active:scale-[0.985] text-white shadow-lg shadow-accent/10"
                            >
                                {resetLoading ? (
                                    <>
                                        <Loader2 className="animate-spin text-white" size={14} />
                                        Updating...
                                    </>
                                ) : (
                                    'Update password'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;

