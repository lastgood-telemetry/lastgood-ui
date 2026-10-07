import Logo from '../components/Logo';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SETUP_PATH, rememberSetupDestination } from '../util/console';
import { List, Clock, Blocks, Server } from 'lucide-react';
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

  // Keep a desktop-only tab from leaving mobile users on a hidden view after resizing.
  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 767px)');
    const syncTab = () => {
      if (mobile.matches) setActiveTab(tab => ['rewind', 'telemetry'].includes(tab) ? tab : 'rewind');
    };
    syncTab();
    mobile.addEventListener('change', syncTab);
    return () => mobile.removeEventListener('change', syncTab);
  }, []);

  const tabs = [
    { id: 'rewind', label: 'Rewind', icon: Clock },
    { id: 'telemetry', label: 'Events', icon: List },
    { id: 'ingestions', label: 'Ingestion Channels', icon: Blocks },
    { id: 'services', label: 'Services', icon: Server },
  ];

  return (
    <div className="flex min-h-screen font-sans selection:bg-white/20 selection:text-white bg-[#101413] text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/[0.08] bg-[#101413] flex-col fixed h-full z-50">
        <div className="p-5 pb-3">
          <div className="flex items-center gap-3 cursor-pointer group">
            <Logo size="md" showText textClassName="text-lg" />
            <span className="text-[9px] font-mono text-[#b6edce] border border-[#3a5546] px-1.5 py-0.5 uppercase tracking-widest leading-none">Sandbox</span>
          </div>
        </div>

        <div className="px-4 py-2 border-b border-white/[0.06] mb-3">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-white/10 bg-white/[0.03]">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-mono text-zinc-300 font-medium">Simulated incident demo</span>
          </div>
        </div>

        <div className="px-4 py-1">
           <span className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-wider mb-2 block">Explore</span>
        </div>

        <nav aria-label="Sandbox navigation" className="flex-1 px-3 space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
               <button
                  key={tab.id}
                  aria-current={isActive ? 'page' : undefined}
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
      <main className="flex-1 w-full md:ml-64 relative min-w-0 bg-transparent">
         <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
         <header className="md:hidden border-b border-white/10 px-4 pt-4 pb-3">
           <div className="flex flex-wrap items-center gap-3 mb-3">
             <Logo size="sm" showText textClassName="text-base" />
             <span className="text-xs font-mono text-accent">Sandbox</span>
           </div>
           <nav aria-label="Mobile sandbox navigation" className="grid grid-cols-2 gap-2">
             {tabs.filter(tab => ['rewind', 'telemetry'].includes(tab.id)).map(tab => {
               const Icon = tab.icon;
               return (
                 <button key={tab.id} type="button" aria-current={activeTab === tab.id ? 'page' : undefined}
                   onClick={() => setActiveTab(tab.id)}
                   className={`min-h-11 flex items-center justify-center gap-2 rounded border text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${activeTab === tab.id ? 'border-accent/30 bg-accent/10 text-accent' : 'border-white/10 text-zinc-400'}`}>
                   <Icon size={18} aria-hidden="true" />{tab.label}
                 </button>
               );
             })}
           </nav>
         </header>
         <div className="p-3 sm:p-4">
           <div className="mb-4 p-4 border border-accent/25 rounded-xl bg-accent/5 flex flex-wrap items-center justify-between gap-3">
             <div><h1 className="text-sm font-semibold">Explore a simulated incident</h1><p className="text-xs text-text-muted mt-1">All events, connectors and scores here are sample data. Demo actions do not change your systems.</p></div>
             <Link to={localStorage.getItem('authToken') ? SETUP_PATH : '/login?setup=github'} onClick={rememberSetupDestination} className="min-h-11 inline-flex items-center justify-center text-sm font-semibold px-4 py-2 rounded-lg bg-accent text-black focus-visible:outline focus-visible:outline-2">Start with your own data</Link>
           </div>
           {activeTab === 'telemetry' && (
            <SandboxTelemetry events={mockTimelineEvents} />
         )}
         
         {activeTab === 'rewind' && (
            <div className="py-4 md:p-6 max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 animate-fade-in">
               {/* Timeline Section */}
               <div className="w-full xl:w-1/3 min-w-0 flex flex-col">
                  <div className="mb-4">
                     <h2 className="text-xl font-bold text-white">Change timeline</h2>
                     <p className="text-sm text-text-muted mt-1">Select a change to inspect the sample analysis.</p>
                  </div>
                  <div className="min-w-0 xl:pr-2">
                     <SandboxTimeline 
                       events={mockTimelineEvents} 
                       selectedEventId={selectedEventId}
                       onSelectEvent={setSelectedEventId} 
                     />
                  </div>
               </div>

               {/* AI Diagnosis Section */}
               <div className="w-full xl:w-2/3 min-w-0 flex flex-col">
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
