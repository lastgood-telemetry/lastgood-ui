import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import dayjs from 'dayjs';

export const CalendarPicker = ({
    fromDate,
    toDate,
    onFromDateChange,
    onToDateChange,
    onClear,
    align = 'auto'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [popoverAlign, setPopoverAlign] = useState('left');
    const popoverRef = useRef(null);

    // Convert string YYYY-MM-DD dates to Date objects for DayPicker
    const selectedRange = {
        from: fromDate ? dayjs(fromDate).toDate() : undefined,
        to: toDate ? dayjs(toDate).toDate() : undefined
    };

    // Calculate alignment to prevent popover from overflowing screen edges
    useEffect(() => {
        if (isOpen && popoverRef.current) {
            if (align === 'right') {
                setPopoverAlign('right');
            } else if (align === 'left') {
                setPopoverAlign('left');
            } else {
                const rect = popoverRef.current.getBoundingClientRect();
                const windowWidth = window.innerWidth;
                // If popover of ~320px width would exceed window right edge, align right
                if (rect.left + 330 > windowWidth) {
                    setPopoverAlign('right');
                } else {
                    setPopoverAlign('left');
                }
            }
        }
    }, [isOpen, align]);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectRange = (range) => {
        if (!range) {
            onFromDateChange('');
            onToDateChange('');
            return;
        }

        if (range.from) {
            onFromDateChange(dayjs(range.from).format('YYYY-MM-DD'));
        } else {
            onFromDateChange('');
        }

        if (range.to) {
            onToDateChange(dayjs(range.to).format('YYYY-MM-DD'));
        } else {
            onToDateChange('');
        }
    };

    const handlePreset = (preset) => {
        const now = dayjs();
        let from;
        if (preset === '24h') from = now.subtract(24, 'hours');
        else if (preset === '7d') from = now.subtract(7, 'days');
        else if (preset === '30d') from = now.subtract(30, 'days');
        else if (preset === 'this_month') from = now.startOf('month');

        onFromDateChange(from ? from.format('YYYY-MM-DD') : '');
        onToDateChange(now.format('YYYY-MM-DD'));
    };

    const formatLabel = () => {
        if (fromDate && toDate) {
            return `${dayjs(fromDate).format('MMM D')} - ${dayjs(toDate).format('MMM D, YYYY')}`;
        }
        if (fromDate) {
            return `From ${dayjs(fromDate).format('MMM D, YYYY')}`;
        }
        if (toDate) {
            return `Until ${dayjs(toDate).format('MMM D, YYYY')}`;
        }
        return 'Select date range...';
    };

    const hasFilter = Boolean(fromDate || toDate);

    const handleClear = (e) => {
        if (e) e.stopPropagation();
        onFromDateChange('');
        onToDateChange('');
        if (onClear) onClear();
    };

    return (
        <div className="relative inline-block text-left" ref={popoverRef}>
            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={`px-3 py-1.5 text-xs font-mono font-medium rounded-lg border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                        hasFilter
                            ? 'bg-indigo-950/60 text-indigo-300 border-indigo-500/40 hover:bg-indigo-900/60'
                            : 'bg-[#151b18] text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                    }`}
                >
                    <CalendarIcon size={14} className={hasFilter ? 'text-indigo-400' : 'text-slate-400'} />
                    <span>{formatLabel()}</span>
                </button>

                {hasFilter && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700 transition-all cursor-pointer"
                        title="Clear Date Range"
                    >
                        <X size={12} />
                    </button>
                )}
            </div>

            {isOpen && (
                <div
                    className={`absolute mt-2 z-50 p-4 bg-[#151b18] border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl text-slate-200 min-w-[310px] ${
                        popoverAlign === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'
                    }`}
                >
                    {/* Quick Presets */}
                    <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-slate-800/80 overflow-x-auto">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1">Presets:</span>
                        <button
                            type="button"
                            onClick={() => handlePreset('24h')}
                            className="px-2 py-1 text-[11px] font-mono bg-slate-800/60 hover:bg-indigo-600/30 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 rounded-md transition-all cursor-pointer"
                        >
                            24h
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset('7d')}
                            className="px-2 py-1 text-[11px] font-mono bg-slate-800/60 hover:bg-indigo-600/30 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 rounded-md transition-all cursor-pointer"
                        >
                            7d
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset('30d')}
                            className="px-2 py-1 text-[11px] font-mono bg-slate-800/60 hover:bg-indigo-600/30 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 rounded-md transition-all cursor-pointer"
                        >
                            30d
                        </button>
                        <button
                            type="button"
                            onClick={() => handlePreset('this_month')}
                            className="px-2 py-1 text-[11px] font-mono bg-slate-800/60 hover:bg-indigo-600/30 hover:text-indigo-300 border border-slate-700/60 hover:border-indigo-500/40 rounded-md transition-all cursor-pointer"
                        >
                            This Month
                        </button>
                    </div>

                    {/* Day Picker */}
                    <div className="custom-calendar flex justify-center">
                        <DayPicker
                            mode="range"
                            selected={selectedRange}
                            onSelect={handleSelectRange}
                            numberOfMonths={1}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80">
                        <button
                            type="button"
                            onClick={() => {
                                onClear();
                            }}
                            className="text-xs font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                            Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 text-xs font-mono font-medium bg-[#b6edce] hover:bg-[#d5f7e4] text-[#101413] rounded-md transition-all cursor-pointer"
                        >
                            Done
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
