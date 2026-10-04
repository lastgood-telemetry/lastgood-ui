import React, { useState } from 'react';
import { Server, Plus, AlertCircle, Copy, Check, Shield, X, ArrowRight } from 'lucide-react';

const SandboxServices = ({ services, setServices }) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newService, setNewService] = useState({ name: '', keyName: '' });
  const [generatedKey, setGeneratedKey] = useState(null);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  const handleCopy = (text, keyId) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newService.name.trim()) return;

    // Generate mock key
    const newKey = `lg_live_${newService.name.substring(0, 4)}_${Math.random().toString(36).substring(2, 10)}`;
    setGeneratedKey(newKey);
    
    // Add to state
    setServices(prev => [...prev, {
       id: `svc_${Date.now()}`,
       name: newService.name,
       status: 'active',
       eventCount: 0,
       lastActive: null,
       apiKeyId: `key_${Date.now()}`,
       apiKeyValue: newKey,
       apiKeyLastUsed: null
    }]);
  };

  const handleCloseModal = () => {
    setIsCreateOpen(false);
    setGeneratedKey(null);
    setNewService({ name: '', keyName: '' });
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-6 mb-8">
        <div>
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <Server className="text-accent" size={24} />
                Services Catalog
            </h1>
            <p className="text-[10px] text-text-muted mt-1 leading-relaxed">
                Register your backend servers or microservices to isolate incoming change events with dedicated API keys.
            </p>
        </div>
        <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-gradient-accent px-4 py-2.5 rounded-lg text-[10px] font-semibold hover:opacity-90 transition-all text-[#101413] shadow-lg shadow-accent/15"
        >
            <Plus size={14} />
            Connect Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
         {services.map(service => (
            <div key={service.id} className="bg-[#101413]/80 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all relative group flex flex-col justify-between">
               <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                     <span className="w-2.5 h-2.5 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                     </span>
                     <span className="text-xs font-semibold text-white">{service.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-emerald-500/20 bg-emerald-950/20 text-emerald-400">
                     Active Ingest
                  </span>
               </div>
               
               <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                  <div className="space-y-1">
                     <div className="text-[9px] uppercase tracking-wider text-text-muted font-mono">Ingestion Count</div>
                     <div className="text-[10px] text-white font-semibold">{service.eventCount} events</div>
                  </div>
                  <div className="space-y-1">
                     <div className="text-[9px] uppercase tracking-wider text-text-muted font-mono">Last Active</div>
                     <div className="text-[10px] text-white font-semibold">{service.lastActive ? 'Just now' : 'Never'}</div>
                  </div>
               </div>

               <div className="mt-4 pt-2 space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-text-muted">
                     <span className="flex items-center gap-1"><Shield size={10} /> Dedicated API Key:</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#0b0f0d]/40 border border-white/10 rounded-lg px-3 py-2 text-[10px]">
                     <span className="font-mono text-text-secondary select-all">
                        {service.apiKeyValue ? service.apiKeyValue.substring(0, 10) + '••••••••' : '••••••••••••••••'}
                     </span>
                     <button
                        onClick={() => handleCopy(service.apiKeyValue, service.apiKeyId)}
                        className="text-text-muted hover:text-white transition-colors"
                     >
                        {copiedKeyId === service.apiKeyId ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                     </button>
                  </div>
               </div>
            </div>
         ))}
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0b0f0d]/70 backdrop-blur-sm" onClick={handleCloseModal} />
            <div className="bg-[#101413] border border-white/10 rounded-2xl p-6 w-full max-w-[400px] relative z-10 space-y-6 animate-fade-in">
               <div className="flex justify-between items-center">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-2">
                     <Shield className="text-accent" size={16} />
                     Connect New Service
                  </h3>
                  <button onClick={handleCloseModal} className="text-text-muted hover:text-white"><X size={16} /></button>
               </div>

               {generatedKey ? (
                  <div className="space-y-4 animate-fade-in">
                     <div className="bg-amber-500/5 border border-amber-500/10 p-3 rounded-lg flex items-start gap-2.5 text-[11px] text-amber-400 leading-relaxed">
                        <AlertCircle size={15} className="shrink-0 mt-0.5" />
                        <span>This is the <strong>only time</strong> this API key will be displayed. Copy and store it securely now.</span>
                     </div>
                     <div className="space-y-1.5">
                        <label className="text-[10px] text-text-muted font-mono uppercase">API KEY</label>
                        <div className="flex items-center justify-between bg-[#0b0f0d]/50 border border-white/10 rounded-lg p-3 text-[10px]">
                           <span className="font-mono text-white break-all select-all pr-2">{generatedKey}</span>
                           <button onClick={() => handleCopy(generatedKey, 'new')} className="text-text-muted hover:text-white shrink-0">
                              {copiedKeyId === 'new' ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                           </button>
                        </div>
                     </div>
                     <button onClick={handleCloseModal} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-2.5 rounded-lg text-[10px] font-semibold transition-all mt-4">
                        I have saved the API Key
                     </button>
                  </div>
               ) : (
                  <form onSubmit={handleCreateSubmit} className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-[10px] text-text-muted font-mono uppercase">Service Name</label>
                        <div className="flex items-center gap-3 bg-[#0b0f0d]/40 border border-white/10 rounded-lg px-3 py-2.5 focus-within:border-accent/50 transition-all">
                           <Server size={15} className="text-text-muted shrink-0" />
                           <input
                              type="text"
                              value={newService.name}
                              onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                              className="flex-1 bg-transparent outline-none text-xs text-white placeholder-white/20"
                              placeholder="e.g. backend-api"
                              required
                           />
                        </div>
                     </div>
                     <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-accent py-2.5 rounded-lg text-xs font-semibold hover:opacity-95 transition-all text-[#101413] shadow-lg shadow-accent/10 mt-6">
                        Generate Dedicated Key <ArrowRight size={13} />
                     </button>
                  </form>
               )}
            </div>
         </div>
      )}
    </div>
  );
};

export default SandboxServices;
