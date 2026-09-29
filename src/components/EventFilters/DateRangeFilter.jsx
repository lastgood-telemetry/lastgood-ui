import React from 'react';
import { CalendarPicker } from './CalendarPicker';

export const DateRangeFilter = ({ fromDate, toDate, onFromDateChange, onToDateChange, onClear }) => {
    return (
        <CalendarPicker
            fromDate={fromDate}
            toDate={toDate}
            onFromDateChange={onFromDateChange}
            onToDateChange={onToDateChange}
            onClear={onClear}
        />
    );
};
