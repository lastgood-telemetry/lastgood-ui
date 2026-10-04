import React from 'react';
import { GitCommit, Box, ToggleRight, AlertTriangle } from 'lucide-react';

const getIconForType = (type) => {
  switch (type) {
    case 'github_pr': return <GitCommit size={16} />;
    case 'k8s_deploy': return <Box size={16} />;
    case 'feature_flag': return <ToggleRight size={16} />;
    case 'alert': return <AlertTriangle size={16} />;
    default: return <Box size={16} />;
  }
};

const getColorClass = (color) => {
  switch (color) {
    case 'blue': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
    case 'purple': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
    case 'amber': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'red': return 'bg-red-500/20 text-red-400 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
};

const SandboxTimeline = ({ events, selectedEventId, onSelectEvent }) => {
  return (
    <div className="relative border-l border-white/10 ml-4 py-4 space-y-6">
      {events.map((event, index) => {
        const isSelected = event.id === selectedEventId;
        const colorClass = getColorClass(event.color);
        const timeFormatted = new Date(event.timestamp).toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
        
        return (
          <div id={`demo-event-${event.id}`} key={event.id} className="relative pl-6 group cursor-pointer" onClick={() => onSelectEvent(event.id)} role="button" tabIndex={0} aria-pressed={isSelected} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelectEvent(event.id); } }}>
            {/* Timeline Dot */}
            <div className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full border-2 border-black flex items-center justify-center transition-all ${isSelected ? 'scale-125' : 'group-hover:scale-110'} ${colorClass.split(' ')[0]}`}>
               {isSelected && <div className={`w-2 h-2 rounded-full ${colorClass.split(' ')[1].replace('text-', 'bg-')}`}></div>}
            </div>
            
            {/* Event Card */}
            <div className={`p-4 rounded-xl border transition-all duration-300 ${isSelected ? 'bg-white/10 border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]' : 'bg-black/40 border-white/5 hover:bg-white/5'}`}>
               <div className="flex flex-wrap gap-2 justify-between items-start mb-2">
                 <div className="flex items-center gap-2">
                   <div className={`p-1.5 rounded-md border ${colorClass}`}>
                     {getIconForType(event.type)}
                   </div>
                   <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{event.source}</span>
                 </div>
                 <span className="text-[10px] text-text-muted">{timeFormatted}</span>
               </div>
               
               <h4 className="text-xs font-semibold text-white mb-1">{event.title}</h4>
               
               {isSelected && (
                 <div className="mt-3 animate-fade-in">
                   <p className="text-xs text-text-secondary mb-3">{event.description}</p>
                   <div className="flex items-center gap-4 text-xs">
                     <span className="text-text-muted">Author: <span className="text-white">{event.author}</span></span>
                     <span className="text-text-muted">Risk Score: <span className={event.riskScore > 80 ? 'text-status-error font-bold' : 'text-accent font-bold'}>{event.riskScore}/100 (demo)</span></span>
                   </div>
                   <details className="mt-3 text-xs text-text-secondary" onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}><summary className="text-accent cursor-pointer">Why this demo risk score?</summary><p className="mt-2">{event.riskRationale}</p><p className="mt-1">Evidence: {event.description}</p></details>
                 </div>
               )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SandboxTimeline;
