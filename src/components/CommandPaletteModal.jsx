import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Clock,
  List,
  Server,
  Network,
  FileText,
  Blocks,
  ShieldAlert,
  Zap,
  Sliders,
  X,
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { useOnCallStore } from '../stores/useOnCallStore';
import Logo from './Logo';

const CommandPaletteModal = () => {
  const navigate = useNavigate();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    isIncidentMode,
    toggleIncidentMode,
    densityMode,
    setDensityMode
  } = useOnCallStore();

  const [query, setQuery] = useState('');

  // Handle Cmd+K / Ctrl+K keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: 'rewind-now',
      title: 'Open Rewind',
      subtitle: 'Choose an incident time and review nearby changes',
      icon: Clock,
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
      action: () => {
        navigate('/rewind');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'toggle-incident',
      title: isIncidentMode ? 'Exit demo incident mode' : 'Enter demo incident mode',
      subtitle: isIncidentMode ? 'Return to the standard view' : 'Show a simulated incident banner, not a real alert',
      icon: ShieldAlert,
      color: isIncidentMode ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      action: () => {
        toggleIncidentMode();
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'services-tier1',
      title: 'Open services',
      subtitle: 'Manage service tiers and API keys',
      icon: Server,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
      action: () => {
        navigate('/services');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'topology-map',
      title: 'Open topology',
      subtitle: 'Review service dependencies',
      icon: Network,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      action: () => {
        navigate('/topology');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'events-stream',
      title: 'Open events',
      subtitle: 'Browse deployments, commits and configuration changes',
      icon: List,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
      action: () => {
        navigate('/events');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'postmortems-archive',
      title: 'Open postmortems',
      subtitle: 'Review incident drafts, evidence and action owners',
      icon: FileText,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
      action: () => {
        navigate('/postmortems');
        setCommandPaletteOpen(false);
      },
    },
    {
      id: 'toggle-density',
      title: `View density: ${densityMode.toUpperCase()}`,
      subtitle: densityMode === 'comfortable' ? 'Use compact spacing' : 'Use comfortable spacing',
      icon: Sliders,
      color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/30',
      action: () => {
        setDensityMode(densityMode === 'comfortable' ? 'compact' : 'comfortable');
        setCommandPaletteOpen(false);
      },
    },
  ];

  const filteredActions = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-[#0b0f0d]/70 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-[#151b18] border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-800 bg-[#101413]">
          <Search size={18} className="text-slate-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Find a page or command..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800 border border-slate-700 rounded">
            ESC
          </kbd>
        </div>

        {/* Action List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filteredActions.length === 0 ? (
            <div className="py-8 text-center text-xs font-mono text-slate-500">
              No command matching "{query}"
            </div>
          ) : (
            filteredActions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-slate-800/60 transition-all text-left group border border-transparent hover:border-slate-700/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${item.color} shrink-0`}>
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-200 group-hover:text-white flex items-center gap-2">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all opacity-0 group-hover:opacity-100" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-[#101413] border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Logo size="xs" />
            <span>LastGood commands</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Select a command to open it</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
