import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SETUP_PATH, rememberSetupDestination } from '../../util/console';
import { Blocks, Github, Terminal, ChevronRight, Copy, CheckCircle2, ArrowLeft } from 'lucide-react';

const SandboxIntegrations = () => {
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [copiedStates, setCopiedStates] = useState({});

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedStates(prev => ({ ...prev, [id]: true }));
    setTimeout(() => setCopiedStates(prev => ({ ...prev, [id]: false })), 2000);
  };

  const channels = [
    {
      id: "github",
      title: "GitHub App",
      description: "Ingest code changes, pull requests, releases, and workflow pipeline runs automatically.",
      icon: Github,
      status: "Recommended",
      active: true,
    },
    {
      id: "api",
      title: "Custom REST API",
      description: "Trigger change events from custom CI/CD setups, Ansible playbooks, Jenkins, or scripts.",
      icon: Terminal,
      status: "Active",
      active: true,
    }
  ];

  if (selectedChannel === 'github') return (
    <section className="p-8 max-w-3xl mx-auto space-y-4">
      <button onClick={() => setSelectedChannel(null)} className="text-accent text-xs underline">Back to demo ingestion channels</button>
      <h2 className="text-xl font-bold">GitHub setup is available in your workspace</h2>
      <p className="text-sm text-text-secondary">This sandbox uses simulated change events. Sign in or create an account to connect the GitHub App and choose repositories for your workspace.</p>
      <Link onClick={rememberSetupDestination} to={localStorage.getItem('authToken') ? SETUP_PATH : '/login?setup=github'} className="inline-block px-4 py-2 rounded-lg bg-accent text-black text-sm font-semibold">Open real GitHub setup</Link>
    </section>
  );

  if (selectedChannel === 'api') {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto animate-fade-in">
        <button onClick={() => setSelectedChannel(null)} className="mb-6 inline-flex items-center gap-2 text-text-muted hover:text-white transition-colors cursor-pointer group text-xs">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> Back
        </button>
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><Terminal className="text-accent" /> Custom REST API (demo only)</h1>
          <p className="text-text-muted text-xs mt-1">Send POST payloads to report change events from custom systems.</p>
        </div>
        <div className="bg-[#0b0f0d]/40 border border-white/5 rounded-2xl p-6">
           <h4 className="text-[10px] font-semibold text-white mb-2">cURL Example</h4>
           <div className="bg-[#0b0f0d]/60 border border-white/10 rounded-xl p-4 relative">
             <button onClick={() => handleCopy('curl', 'Demo only. Generate a real API key in your workspace.')} className="absolute top-2 right-2 text-text-muted hover:text-white">
                {copiedStates['curl'] ? <CheckCircle2 size={16} className="text-status-success" /> : <Copy size={16} />}
             </button>
             <pre className="text-[11px] text-emerald-400/90 font-mono leading-relaxed overflow-x-auto">
{`curl -X POST https://api.lastgood.space/api/change-events \\
  -H "Authorization: Bearer lg_live_mock_apikey_123" \\
  -H "Content-Type: application/json" \\
  -d '{
    "summary": "Deployed checkout-service v1.4.2",
    "service": "checkout-service",
    "environment": "production",
    "type": "deployment"
  }'`}
             </pre>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-xl font-bold mb-2 flex items-center gap-3 text-white">
          <div className="p-2 bg-accent/10 rounded-xl border border-accent/20">
            <Blocks className="text-accent h-5 w-5" />
          </div>
          Ingestion Channels
        </h1>
        <p className="text-text-muted text-xs max-w-2xl leading-relaxed">
          Connect your engineering ecosystem to LastGood. We'll automatically ingest, correlate, and analyze changes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => {
          const Icon = channel.icon;
          return (
            <button
              type="button"
              key={channel.id}
              onClick={() => channel.active && setSelectedChannel(channel.id)}
              className="text-left focus-visible:outline focus-visible:outline-2 surface border border-white/5 rounded-2xl p-6 hover:border-accent/40 cursor-pointer hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2.5 rounded-xl border bg-accent/10 border-accent/20 text-accent">
                    <Icon size={20} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider bg-status-success/15 border-status-success/20 text-status-success">
                    {channel.status}
                  </span>
                </div>
                <h3 className="text-white font-bold text-sm mb-2">{channel.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed mb-6">{channel.description}</p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-accent font-bold group-hover:text-accent-hover mt-auto">
                Configure Integration <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SandboxIntegrations;
