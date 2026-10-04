import React from 'react';

export const RiskScoreRing = ({ score, level, radius = 30, stroke = 4, label = "Risk" }) => {
    const validScore = typeof score === "number" && Number.isFinite(score);
    const displayScore = validScore ? Math.max(0, Math.min(100, score)) : null;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - ((displayScore ?? 0) / 100) * circumference;

    const getRiskColor = (level) => {
        switch (level) {
            case 'critical': return '#EF4444';
            case 'high': return '#F97316';
            case 'medium': return '#FBBF24';
            case 'low': return '#10B981';
            default: return '#6B7280';
        }
    };

    const color = getRiskColor(level);

    return (
        <div role="img" aria-label={`${label}: ${displayScore ?? "not supplied"}${validScore ? " out of 100" : ""}`} title={`${label}, not proof of causation`} className="relative" style={{ width: radius * 2, height: radius * 2 }}>
            <svg
                height={radius * 2}
                width={radius * 2}
            >
                <circle
                    stroke="#292e2c"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                />
                <circle
                    stroke={color}
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{ strokeDashoffset, strokeLinecap: 'round' }}
                    r={normalizedRadius}
                    cx={radius}
                    cy={radius}
                    transform={`rotate(-90 ${radius} ${radius})`}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold" style={{ color }}>{displayScore ?? "—"}</span>
            </div>
        </div>
    );
};
