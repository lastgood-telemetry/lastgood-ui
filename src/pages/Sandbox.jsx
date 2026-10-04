import Logo from '../components/Logo';
import React, { useState } from 'react';
import { History, Sparkles, List, Clock, Blocks, Server } from 'lucide-react';
import SandboxTimeline from '../components/sandbox/SandboxTimeline';
import AiDiagnosisPanel from '../components/sandbox/AiDiagnosisPanel';
import SandboxServices from '../components/sandbox/SandboxServices';
import SandboxIntegrations from '../components/sandbox/SandboxIntegrations';
import SandboxTelemetry from '../components/sandbox/SandboxTelemetry';
import { mockIncident, mockTimelineEvents, mockAiDiagnosis, initialMockServices } from '../components/sandbox/MockData';

const Sandbox = () => {
  const [activeTab, setActiveTab] = useState('rewind');
  const [selectedEventId, setSelectedEventId] = useState(mockTimelineEvents[2].id);
  const [mockServices, setMockServices] = useState(initialMockServices);

  const tabs = [
    { id: 'rewind', label: 'AI Incident Rewind', icon: Clock },
    { id: 'telemetry', label: 'Telemetry Feed', icon: List },
    { id: 'ingestions', label: 'Ingestion Channels', icon: Blocks },
    { id: 'services', label: 'Services & Keys', icon: Server },
  ];

  return (
    <div className="flex min-h-screen font-sans selection:bg-white/20 selection:text-white bg-[#101413] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/[0.08] bg-[#101413] flex flex-col fixed h-full z-50">
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Logo size="md" showText textClassName="text-lg" />
            <span className="text-[9px] font-mono text-[#b6edce] border border-[#3a5546] px-1.5 py-0.5 uppercase tracking-widest leading-none">Sandbox</span>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-white/10 bg-white/[0.03]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-zinc-300 font-medium">Diagnostic AI Ready</span>
          </div>
        </div>

        <div className="px-4 py-1">
           <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Interactive Suite</span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all group relative overflow-hidden ${
                     isActive
                        ? "bg-white/10 text-white font-semibold shadow-sm"
                        : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                  }`}
               >
                  {isActive && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-white"></span>
                  )}
                  <Icon size={16} className={isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"} />
                  <span className="relative z-10">{tab.label}</span>
               </button>
            );
          })}
        </nav>

        {/* Footer Organization & Info */}
        <div className="p-3 border-t border-white/[0.08] bg-[#101413]">
          <div className="p-2.5 rounded-lg flex items-center gap-3 border border-white/10 bg-white/[0.02]" title="Sandbox Environment">
            <div className="w-7 h-7 rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center font-mono font-bold text-white text-xs">
              S
            </div>
            <div className="flex flex-col flex-1 overflow-hidden">
              <span className="text-xs font-bold text-white truncate leading-tight">
                Demo Workspace
              </span>
              <span className="text-[10px] text-zinc-400 font-mono leading-tight">Sandbox Mode</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 relative min-w-0 bg-transparent">
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
         <div className="p-4">
           {activeTab === 'telemetry' && (
            <SandboxTelemetry events={mockTimelineEvents} />
         )}
         
         {activeTab === 'rewind' && (
            <div className="p-4 md:p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6 h-full animate-fade-in">
               {/* Timeline Section */}
               <div className="w-full md:w-1/3 flex flex-col h-full">
                  <div className="mb-4">
                     <h2 className="text-xl font-bold text-white">Event Timeline</h2>
                     <p className="text-sm text-text-muted mt-1">Select an event to view AI analysis.</p>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                     <SandboxTimeline 
                       events={mockTimelineEvents} 
                       selectedEventId={selectedEventId}
                       onSelectEvent={setSelectedEventId} 
                     />
                  </div>
               </div>

               {/* AI Diagnosis Section */}
               <div className="w-full md:w-2/3 flex flex-col h-[600px] md:h-auto md:min-h-[700px]">
                  <AiDiagnosisPanel 
                     incident={mockIncident} 
                     diagnosis={mockAiDiagnosis} 
                  />
               </div>
            </div>
         )}

         {activeTab === 'ingestions' && (
            <SandboxIntegrations />
         )}

         {activeTab === 'services' && (
            <SandboxServices 
               services={mockServices} 
               setServices={setMockServices} 
            />
         )}
         </div>
      </main>
    </div>
  );
};

export default Sandbox;
