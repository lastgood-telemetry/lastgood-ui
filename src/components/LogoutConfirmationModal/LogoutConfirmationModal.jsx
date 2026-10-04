import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-[#0b0f0d]/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-card border border-white/10 rounded-xl shadow-lg p-8 max-w-md w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-text-muted hover:text-text-primary">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-bold mb-4">Confirm Logout</h2>
                <p className="text-text-secondary mb-8">Are you sure you want to log out?</p>
                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-bg-tertiary hover:bg-bg-primary border border-border rounded-lg text-text-primary text-sm font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="flex items-center gap-2 px-4 py-2 bg-status-error/20 hover:bg-status-error/30 border border-status-error/30 rounded-lg text-status-error text-sm font-medium transition-colors"
                    >
                        <LogOut size={16} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LogoutConfirmationModal;
