import React from 'react';
import { List, Activity, Box, GitCommit, ToggleRight, AlertTriangle } from 'lucide-react';

const getIconForType = (type) => {
  switch (type) {
    case 'github_pr': return <GitCommit size={16} />;
    case 'k8s_deploy': return <Box size={16} />;
    case 'feature_flag': return <ToggleRight size={16} />;
    case 'alert': return <AlertTriangle size={16} />;
    default: return <Activity size={16} />;
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

const SandboxTelemetry = ({ events }) => {
  return (
    <div className="py-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <List className="text-accent" size={24} />
            Telemetry Feed
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Simulated change events. These are not live integrations or data from your workspace.
          </p>
        </div>
        <div className="bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-lg text-accent text-xs font-bold flex items-center gap-2">
           <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
           Simulated Sandbox Stream
        </div>
      </div>

      <div className="bg-[#0b0f0d]/40 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
         {events.map((event) => {
           const colorClass = getColorClass(event.color);
           return (
             <div key={event.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors flex flex-col gap-3 group">
               <div className="flex items-center gap-4 w-full shrink-0">
                 <div className={`p-2 rounded-lg border ${colorClass}`}>
                   {getIconForType(event.type)}
                 </div>
                 <div>
                   <div className="text-xs font-bold uppercase tracking-wider text-text-muted">{event.source}</div>
                   <div className="text-xs text-text-secondary">{new Date(event.timestamp).toLocaleTimeString()}</div>
                 </div>
               </div>
               
               <div className="flex-1 min-w-0 break-words">
                 <h4 className="text-xs font-semibold text-white ">{event.title}</h4>
                 <p className="text-xs text-text-muted mt-1 ">{event.description}</p>
               </div>

               <div className="flex flex-wrap items-start gap-3 w-full min-w-0">
                 <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded text-xs text-text-secondary">
                   Author: <span className="text-white font-medium">{event.author}</span>
                 </div>
                 <div className={`px-2 py-1 rounded text-xs font-bold border ${event.riskScore > 80 ? 'bg-status-error/20 border-status-error/30 text-status-error' : 'bg-white/5 border-white/10 text-white'}`}>
                   Demo risk: {event.riskScore}
                 </div>
                 <details className="text-xs w-full min-w-0" ><summary className="min-h-11 content-center text-accent cursor-pointer">Score rationale</summary><p className="mt-2 text-text-secondary">{event.riskRationale}</p></details>
               </div>
             </div>
           );
         })}
      </div>
    </div>
  );
};

export default SandboxTelemetry;
