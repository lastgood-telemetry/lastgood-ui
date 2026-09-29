import React, { useState, useRef, useEffect } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, Clock, Sparkles } from 'lucide-react';
import dayjs from 'dayjs';

export const DateTimePicker = ({
    value,
    onChange,
    label = 'Select Date & Time',
    align = 'auto'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [popoverAlign, setPopoverAlign] = useState('left');
    const popoverRef = useRef(null);

    const currentDate = value ? dayjs(value).toDate() : new Date();
    const timeString = value ? dayjs(value).format('HH:mm') : dayjs().format('HH:mm');

    useEffect(() => {
        if (isOpen && popoverRef.current) {
            const rect = popoverRef.current.getBoundingClientRect();
            if (align === 'right' || rect.left + 320 > window.innerWidth) {
                setPopoverAlign('right');
            } else {
                setPopoverAlign('left');
            }
        }
    }, [isOpen, align]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectDay = (day) => {
        if (!day) return;
        const [hours, minutes] = timeString.split(':').map(Number);
        const newDate = dayjs(day).hour(hours).minute(minutes).format('YYYY-MM-DDTHH:mm');
        onChange(newDate);
    };

    const handleTimeChange = (newTime) => {
        const [hours, minutes] = newTime.split(':').map(Number);
        const baseDate = value ? dayjs(value) : dayjs();
        const newDate = baseDate.hour(hours).minute(minutes).format('YYYY-MM-DDTHH:mm');
        onChange(newDate);
    };

    const setNow = () => {
        const now = dayjs().utc().format('YYYY-MM-DDTHH:mm');
        onChange(now);
    };

    return (
        <div className="relative inline-block w-full text-left" ref={popoverRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#070709] border border-white/10 hover:border-white/20 rounded-lg px-3 py-2 text-xs font-mono text-white flex items-center justify-between transition-all cursor-pointer shadow-sm"
            >
                <div className="flex items-center gap-2">
                    <CalendarIcon size={14} className="text-sky-400" />
                    <span>{value ? dayjs(value).format('MMM D, YYYY - HH:mm [UTC]') : label}</span>
                </div>
                <Clock size={12} className="text-zinc-500" />
            </button>

            {isOpen && (
                <div
                    className={`absolute mt-2 z-50 p-4 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl backdrop-blur-xl text-slate-200 min-w-[310px] ${
                        popoverAlign === 'right' ? 'right-0 left-auto' : 'left-0 right-auto'
                    }`}
                >
                    {/* Header bar with Set to Now */}
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80">
                        <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase">Select Date & Time</span>
                        <button
                            type="button"
                            onClick={setNow}
                            className="text-[11px] font-mono text-sky-400 hover:text-sky-300 font-bold uppercase flex items-center gap-1 cursor-pointer"
                        >
                            <Sparkles size={11} />
                            Set to Now
                        </button>
                    </div>

                    {/* Day Picker */}
                    <div className="custom-calendar flex justify-center">
                        <DayPicker
                            mode="single"
                            selected={currentDate}
                            onSelect={handleSelectDay}
                        />
                    </div>

                    {/* Time Picker Bar */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-slate-400" />
                            <span className="text-xs font-mono text-slate-300">Time (UTC):</span>
                        </div>
                        <input
                            type="time"
                            value={timeString}
                            onChange={(e) => handleTimeChange(e.target.value)}
                            className="bg-[#070709] border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white focus:outline-none focus:border-sky-500"
                        />
                    </div>

                    {/* Footer */}
                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex justify-end">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-1 text-xs font-mono font-medium bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-all cursor-pointer"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
