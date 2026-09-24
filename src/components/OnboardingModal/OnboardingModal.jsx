import React, { useState } from 'react';
import { Rocket, KeyRound, X } from 'lucide-react';
import CreateAPIKey from '../CreateAPIKey/CreateAPIKey';
import Logo from '../Logo';

export const OnboardingModal = ({ onFinished }) => {
    const [isCreatingKey, setIsCreatingKey] = useState(false);

    const handleKeyCreated = () => {
        onFinished();
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-gradient-card border border-white/10 rounded-2xl shadow-2xl w-full max-w-md m-4 relative overflow-hidden shadow-[0_0_50px_rgba(45,212,191,0.15)] animate-slide-up">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-accent via-blue-500 to-purple-500"></div>
                {isCreatingKey ? (
                    <div className="p-8">
                        <div className="flex justify-center mb-4">
                            <Logo size="md" showText={true} />
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2 text-white">Create your first API Key</h2>
                        <p className="text-text-secondary text-center mb-6 text-sm">This key will be used to report events to LastGood.</p>
                        <CreateAPIKey onKeyCreated={handleKeyCreated} />
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <div className="flex justify-center mb-4">
                            <Logo size="md" showText={true} />
                        </div>
                        <div className="mx-auto bg-accent/10 w-16 h-16 rounded-full flex items-center justify-center border-2 border-accent/20 mb-6 shadow-[0_0_20px_rgba(45,212,191,0.2)]">
                            <Rocket size={32} className="text-accent animate-bounce" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 text-white">Let's Get Your Data Flowing</h2>
                        <p className="text-text-secondary mb-8 text-sm leading-relaxed">
                            LastGood works by analyzing change events from your CI/CD pipelines and infrastructure. To start seeing data, you first need to create a secure API key. This key allows your systems to talk to LastGood.
                        </p>
                        <button 
                            onClick={() => setIsCreatingKey(true)} 
                            className="bg-gradient-accent hover:opacity-90 text-white font-bold px-8 py-3.5 rounded-xl flex items-center gap-2 transition-opacity w-full justify-center text-base active:scale-[0.98] transition-transform shadow-lg shadow-accent/20"
                        >
                            <KeyRound size={18} />
                            Create Secure API Key
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
