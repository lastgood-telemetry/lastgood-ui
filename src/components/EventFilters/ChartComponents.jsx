import React from 'react';

export const SimpleBarChart = ({ data, title, height = "h-48" }) => {
    if (!data || data.length === 0) {
        return (
            <div className={`${height} flex items-center justify-center bg-[#0b0f0d]/20 border border-white/5 rounded-lg`}>
                <span className="text-text-muted text-sm">No data available</span>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const scale = 100 / (maxValue || 1);

    return (
        <div className="bg-[#0b0f0d]/20 border border-white/5 rounded-lg p-4">
            {title && <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>}
            <div className={`${height} flex flex-col justify-between`}>
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-text-muted min-w-20 truncate">{item.label}</span>
                        <div className="flex-1 h-6 bg-[#0b0f0d]/40 rounded overflow-hidden border border-white/5">
                            <div
                                className="h-full bg-gradient-to-r from-accent to-blue-500 transition-all duration-300 flex items-center justify-end pr-2"
                                style={{ width: `${item.value * scale}%` }}
                            >
                                {item.value * scale > 15 && (
                                    <span className="text-xs font-semibold text-white">{item.value}</span>
                                )}
                            </div>
                        </div>
                        {item.value * scale <= 15 && (
                            <span className="text-xs font-semibold text-accent min-w-8 text-right">{item.value}</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export const SimpleLineChart = ({ data, title, height = "h-48" }) => {
    if (!data || data.length === 0) {
        return (
            <div className={`${height} flex items-center justify-center bg-[#0b0f0d]/20 border border-white/5 rounded-lg`}>
                <span className="text-text-muted text-sm">No data available</span>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((item, index) => ({
        x: (index / (data.length - 1 || 1)) * 100,
        y: ((maxValue - item.value) / (maxValue || 1)) * 100,
        ...item
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div className="bg-[#0b0f0d]/20 border border-white/5 rounded-lg p-4">
            {title && <h3 className="text-sm font-semibold text-white mb-4">{title}</h3>}
            <svg viewBox="0 0 100 100" className={`${height} w-full`} preserveAspectRatio="none">
                {/* Grid */}
                <line x1="0" y1="100" x2="100" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                <line x1="0" y1="0" x2="100" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />

                {/* Line */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                />

                {/* Gradient */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#b6edce" />
                        <stop offset="100%" stopColor="#b6edce" />
                    </linearGradient>
                </defs>

                {/* Points */}
                {points.map((p, i) => (
                    <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="1.5"
                        fill="#b6edce"
                        vectorEffect="non-scaling-stroke"
                    />
                ))}
            </svg>
            
            {/* Legend */}
            <div className="flex gap-2 mt-2 justify-between text-xs text-text-muted">
                <span>{points[0]?.label}</span>
                <span>{points[Math.floor(points.length / 2)]?.label}</span>
                <span>{points[points.length - 1]?.label}</span>
            </div>
        </div>
    );
};

export const StatsCard = ({ label, value, icon: Icon, trend = null, color = "accent" }) => {
    const colorClasses = {
        accent: "text-accent bg-accent/10 border-accent/20",
        success: "text-status-success bg-status-success/10 border-status-success/20",
        warning: "text-status-warning bg-status-warning/10 border-status-warning/20",
        error: "text-status-error bg-status-error/10 border-status-error/20"
    };

    return (
        <div className={`bg-gradient-card border ${colorClasses[color]} rounded-xl p-4`}>
            <div className="flex items-start justify-between mb-2">
                <div>
                    <h3 className="text-text-secondary font-medium text-xs uppercase tracking-wider mb-1">{label}</h3>
                    <p className="text-2xl font-bold text-white">{value}</p>
                </div>
                {Icon && (
                    <div className="p-2 rounded-lg bg-[#0b0f0d]/20">
                        <Icon size={18} className={colorClasses[color].split(' ')[0]} />
                    </div>
                )}
            </div>
            {trend && (
                <span className={`text-xs font-semibold ${trend.positive ? 'text-status-success' : 'text-status-warning'}`}>
                    {trend.positive ? '↑' : '↓'} {trend.value} from yesterday
                </span>
            )}
        </div>
    );
};
