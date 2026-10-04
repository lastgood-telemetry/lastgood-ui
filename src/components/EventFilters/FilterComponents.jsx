import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ value, onChange, placeholder = "Search by commit, author, service..." }) => {
    return (
        <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#0b0f0d]/60 border border-white/10 hover:border-accent/50 rounded-lg text-white placeholder-text-muted/50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all"
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
};

export const MultiSelectFilter = ({ label, options, selected, onChange, placeholder = "Select..." }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = (option) => {
        if (selected.includes(option)) {
            onChange(selected.filter(s => s !== option));
        } else {
            onChange([...selected, option]);
        }
    };

    const handleClear = () => {
        onChange([]);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-[#0b0f0d]/60 border border-white/10 hover:border-accent/50 rounded-lg text-sm text-text-secondary hover:text-white transition-all min-w-max"
            >
                <span className="truncate">{label}</span>
                {selected.length > 0 && (
                    <span className="bg-accent/20 text-accent px-2 py-0.5 rounded text-xs font-semibold">
                        {selected.length}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full mt-1 left-0 z-50 bg-[#0b0f0d]/90 border border-white/10 rounded-lg shadow-lg min-w-max">
                    <div className="max-h-64 overflow-y-auto">
                        {options.map((option) => (
                            <label
                                key={option}
                                className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 cursor-pointer transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option)}
                                    onChange={() => handleToggle(option)}
                                    className="accent-accent"
                                />
                                <span className="text-sm text-text-secondary">{option}</span>
                            </label>
                        ))}
                    </div>
                    <div className="border-t border-white/5 px-3 py-2 flex gap-2 text-xs">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="flex-1 px-2 py-1 bg-accent/20 hover:bg-accent/30 text-accent rounded transition-colors"
                        >
                            Done
                        </button>
                        {selected.length > 0 && (
                            <button
                                onClick={() => {
                                    handleClear();
                                    setIsOpen(false);
                                }}
                                className="flex-1 px-2 py-1 bg-white/5 hover:bg-white/10 text-text-muted rounded transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export const SimpleSelectFilter = ({ label, options, value, onChange }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="px-3 py-2 bg-[#0b0f0d]/60 border border-white/10 hover:border-accent/50 rounded-lg text-sm text-text-secondary hover:text-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all cursor-pointer"
        >
            <option value="">{label}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};
