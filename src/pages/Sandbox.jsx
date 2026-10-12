import Logo from '../components/Logo';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { SETUP_PATH, rememberSetupDestination } from '../util/console';
import { List, Clock, Blocks, Server, Menu, X, ArrowRight } from 'lucide-react';
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
  const [isNavOpen, setIsNavOpen] = useState(false);

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
    { id: 'rewind', label: 'Rewind', group: 'Investigate', icon: Clock, mobile: true },
    { id: 'telemetry', label: 'Events', group: 'Investigate', icon: List, mobile: true },
    { id: 'services', label: 'Services', group: 'Context', icon: Server },
    { id: 'ingestions', label: 'Ingestion Channels', group: 'Workspace', icon: Blocks },
  ];
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0];
  const ctaTo = localStorage.getItem('authToken') ? SETUP_PATH : '/login?setup=github';

  const selectTab = (id) => { setActiveTab(id); setIsNavOpen(false); };

  useEffect(() => {
    if (!isNavOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setIsNavOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isNavOpen]);

  return (
    <div className="flex min-h-screen font-sans bg-[#101413] text-slate-100">
      {isNavOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-[#0b0f0d]/70" onClick={() => setIsNavOpen(false)} aria-hidden="true" />
      )}

      <aside
        id="sandbox-sidebar"
        className={`w-56 max-w-[85vw] border-r border-slate-800/60 bg-[#101413] flex flex-col fixed h-full z-50 transition-transform duration-200 md:translate-x-0 ${isNavOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-14 px-4 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size="md" showText textClassName="text-lg" />
          </div>
          <span className="hidden md:inline text-[9px] font-mono tracking-[0.1em] text-[#b6edce] border border-[#3a5546] px-1.5 py-0.5">SANDBOX</span>
          <button type="button" onClick={() => setIsNavOpen(false)} className="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-200 cursor-pointer" aria-label="Close navigation">
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Sandbox navigation" className="flex-1 px-2 py-4 overflow-y-auto custom-scrollbar">
          {['Investigate', 'Context', 'Workspace'].map(group => (
            <div key={group} className={`mb-5 last:mb-0 ${tabs.some(t => t.group === group && t.mobile) ? '' : 'hidden md:block'}`}>
              <h2 className="px-2.5 mb-2 text-[11px] font-medium text-slate-500">{group}</h2>
              <div className="space-y-0.5">
                {tabs.filter(t => t.group === group).map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => selectTab(tab.id)}
                      className={`${tab.mobile ? 'flex' : 'hidden md:flex'} w-full text-left items-center gap-2.5 px-2.5 py-2 rounded text-sm transition-colors border cursor-pointer ${isActive
                        ? 'bg-[#b6edce]/10 text-[#b6edce] font-semibold border-[#b6edce]/25'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`}
                    >
                      <Icon size={15} className="shrink-0" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800/60 bg-[#101413]">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-[#101413] border border-slate-800/70">
            <div className="w-6 h-6 rounded-md bg-[#17241d] border border-[#b6edce]/30 flex items-center justify-center font-mono font-bold text-[#b6edce] text-[11px] shrink-0">D</div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-xs font-medium text-slate-200 truncate leading-tight">Demo Workspace</span>
              <span className="text-[10px] text-slate-500 font-mono leading-tight">Sample data</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-56 relative min-w-0 bg-[#101413] min-h-screen flex flex-col">
        <header className="h-14 sticky top-0 z-30 bg-[#101413]/80 backdrop-blur-md border-b border-slate-800/60 px-3 md:px-6 flex items-center justify-between gap-3 md:gap-4">
          <button type="button" onClick={() => setIsNavOpen(true)} className="md:hidden p-2 -ml-1 text-slate-300 hover:text-white cursor-pointer" aria-label="Open navigation" aria-controls="sandbox-sidebar" aria-expanded={isNavOpen}>
            <Menu size={20} />
          </button>
          <div className="flex-1 md:flex-none min-w-0 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hidden md:flex items-center gap-2">
              <Logo size="xs" />
              <span>LastGood</span>
              <span className="text-slate-600">/</span>
            </span>
            <span className="text-slate-200 font-semibold truncate">{currentTab.label}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center px-2.5 py-1 rounded border border-slate-800 bg-[#151b18] text-xs text-slate-400" title="Everything here is sample data.">Sample incident data</span>
            <Link to={ctaTo} onClick={rememberSetupDestination} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#b6edce] text-[#101413] text-xs font-semibold hover:bg-[#c8f2da] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#b6edce]">
              <span className="hidden sm:inline">Start with your own data</span>
              <span className="sm:hidden">Use your data</span>
              <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </header>

        <div className="border-b border-slate-800/60 bg-[#b6edce]/[0.04] px-3 md:px-6 py-2.5 text-xs text-slate-400">
          <span className="text-[#b6edce] font-medium">Simulated incident.</span> Events, connectors and scores are sample data. Nothing here touches your systems.
        </div>

        <div className="flex-1 p-3 sm:p-4">
          {activeTab === 'telemetry' && (
            <SandboxTelemetry events={mockTimelineEvents} />
          )}

          {activeTab === 'rewind' && (
            <div className="py-4 md:p-6 max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 animate-fade-in">
              <div className="w-full xl:w-1/3 min-w-0 flex flex-col">
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white">Change timeline</h2>
                  <p className="text-sm text-slate-400 mt-1">Select a change to inspect the sample analysis.</p>
                </div>
                <div className="min-w-0 xl:pr-2">
                  <SandboxTimeline events={mockTimelineEvents} selectedEventId={selectedEventId} onSelectEvent={setSelectedEventId} />
                </div>
              </div>
              <div className="w-full xl:w-2/3 min-w-0 flex flex-col">
                <AiDiagnosisPanel incident={mockIncident} diagnosis={mockAiDiagnosis} />
              </div>
            </div>
          )}

          {activeTab === 'ingestions' && <SandboxIntegrations />}

          {activeTab === 'services' && (
            <SandboxServices services={mockServices} setServices={setMockServices} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Sandbox;
