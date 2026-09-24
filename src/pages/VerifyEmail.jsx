import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle, Activity, ArrowRight } from 'lucide-react';
import { verifyEmail } from '../service/auth';
import { toast } from '../components/ui/Toast';
import Logo from '../components/Logo';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [errorMsg, setErrorMsg] = useState('');

    const { mutate: verify } = useMutation({
        mutationFn: () => verifyEmail(token),
        onSuccess: (data) => {
            setStatus('success');
            toast.success('Email verified successfully! Logging you in...');
            // Save token and redirect after a short delay for visual completion
            localStorage.setItem('authToken', data.token);
            setTimeout(() => {
                navigate('/rewind');
            }, 2000);
        },
        onError: (err) => {
            setStatus('error');
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to verify email';
            setErrorMsg(msg);
            toast.error(msg);
        }
    });

    useEffect(() => {
        if (token) {
            verify();
        } else {
            setStatus('error');
            setErrorMsg('Verification token is missing.');
        }
    }, [token]);

    return (
        <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col justify-center items-center p-6 relative overflow-hidden font-sans">
            {/* Subtle background effects */}
            <div className="absolute inset-0 bg-grid opacity-15 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-[400px] bg-black/40 border border-white/10 rounded-xl p-8 backdrop-blur-xl relative z-10 shadow-2xl text-center space-y-6">
                
                {/* Logo */}
                <div className="flex items-center justify-center mb-2">
                    <Logo size="lg" showText={true} textClassName="text-lg" />
                </div>

                {/* VERIFYING STATE */}
                {status === 'verifying' && (
                    <div className="space-y-6 py-4 animate-fade-in">
                        <div className="flex justify-center">
                            <Loader2 className="animate-spin text-accent" size={36} />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-base font-semibold text-white">Verifying your email</h2>
                            <p className="text-xs text-text-muted">Please wait while we validate your magic link...</p>
                        </div>
                    </div>
                )}

                {/* SUCCESS STATE */}
                {status === 'success' && (
                    <div className="space-y-6 py-4 animate-fade-in">
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-bounce">
                                <CheckCircle2 className="text-emerald-400" size={24} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-base font-semibold text-white font-sans">Email Verified!</h2>
                            <p className="text-xs text-text-muted">Your account is now active. Redirecting you to your dashboard...</p>
                        </div>
                        <div className="flex justify-center">
                            <button
                                onClick={() => navigate('/rewind')}
                                className="flex items-center gap-1.5 text-xs text-accent font-medium hover:text-white transition-colors"
                            >
                                Go to dashboard <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* ERROR STATE */}
                {status === 'error' && (
                    <div className="space-y-6 py-4 animate-fade-in">
                        <div className="flex justify-center">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <XCircle className="text-red-400" size={24} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-base font-semibold text-white font-sans">Verification Failed</h2>
                            <p className="text-xs text-red-400/90 font-light leading-relaxed">{errorMsg}</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-white/5 border border-white/10 hover:border-white/20 py-2.5 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all active:scale-[0.985] text-white font-sans"
                        >
                            Back to Sign In
                        </button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default VerifyEmail;
