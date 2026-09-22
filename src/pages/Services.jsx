import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Activity,
    Plus,
    Copy,
    Check,
    AlertCircle,
    Server,
    Shield,
    Calendar,
    LineChart,
    ArrowRight,
    Loader2,
    RefreshCw,
    X,
    Code,
    Terminal,
    Play,
    Trash2,
    Github,
    Layers,
    Flame,
    Sliders,
    ChevronDown,
    Zap,
    ShieldAlert
} from 'lucide-react';
import { 
    getServices, 
    createServiceApiKey, 
    sendTestEvent, 
    deleteService, 
    getIntegrationByProvider,
    updateServiceCriticality 
} from '../service/auth';
import { toast } from '../components/ui/Toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useOrganization } from '../hooks/useOrganization';
import { API_BASE_URL } from '../constants';
import { PageHeader } from '../components/ui/PageHeader';
import { PageContainer } from '../components/ui/PageContainer';

dayjs.extend(relativeTime);

const TIERS = [
    {
        id: 'tier-1',
        name: 'Tier 1: Mission Critical',
        badgeBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
        headerBorder: 'border-rose-500/30 bg-rose-500/5',
        iconColor: 'text-rose-400',
        desc: 'Auth, Databases, Core APIs, Payment Gateways'
    },
    {
        id: 'tier-2',
        name: 'Tier 2: High Impact',
        badgeBg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
        headerBorder: 'border-amber-500/30 bg-amber-500/5',
        iconColor: 'text-amber-400',
        desc: 'Public APIs, Primary Web Frontends, Core Workflows'
    },
    {
        id: 'tier-3',
        name: 'Tier 3: Standard',
        badgeBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
        headerBorder: 'border-blue-500/30 bg-blue-500/5',
        iconColor: 'text-blue-400',
        desc: 'Background Job Workers, Secondary Microservices'
    },
    {
        id: 'tier-4',
        name: 'Tier 4: Low Impact',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
        headerBorder: 'border-emerald-500/30 bg-emerald-500/5',
        iconColor: 'text-emerald-400',
        desc: 'Internal Admin Tools, Docs, Staging Helpers'
    }
];

const Services = () => {
    const queryClient = useQueryClient();
    const { data: org } = useOrganization();
    const [copiedKeyId, setCopiedKeyId] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [integrationService, setIntegrationService] = useState(null);
    const [sendingTest, setSendingTest] = useState(false);
    const [newService, setNewService] = useState({ name: '', keyName: '' });
    const [generatedKey, setGeneratedKey] = useState(null);
    const [copiedNewKey, setCopiedNewKey] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [activeTab, setActiveTab] = useState('stacker'); // 'stacker' | 'catalog'

    // Fetch GitHub Integration Status
    const { data: githubIntegration } = useQuery({
        queryKey: ['integration', 'github', org?.id],
        queryFn: () => getIntegrationByProvider('github'),
        enabled: !!org?.id,
        refetchOnWindowFocus: false
    });

    // Fetch Services List
    const { data: services = [], isLoading, refetch, isFetching } = useQuery({
        queryKey: ['services'],
        queryFn: getServices,
        refetchOnWindowFocus: false
    });

    // Create Service Dedicated Key Mutation
    const { mutate: createKey, isPending: creating } = useMutation({
        mutationFn: () => createServiceApiKey(
            newService.keyName || `${newService.name} Dedicated Key`,
            newService.name
        ),
        onSuccess: (data) => {
            setGeneratedKey(data.api_key);
            toast.success('Service API Key generated successfully!');
            queryClient.invalidateQueries(['services']);
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to generate key';
            toast.error(errMsg);
        }
    });

    // Update Service Criticality Tier Mutation
    const { mutate: handleUpdateCriticality, isPending: updatingTier } = useMutation({
        mutationFn: ({ serviceId, tier }) => updateServiceCriticality(serviceId, tier),
        onSuccess: () => {
            toast.success('Service criticality tier updated!');
            queryClient.invalidateQueries(['services']);
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update criticality';
            toast.error(errMsg);
        }
    });

    // Delete Service Mutation
    const { mutate: handleDeleteService, isPending: deletingService } = useMutation({
        mutationFn: (serviceId) => deleteService(serviceId),
        onSuccess: () => {
            toast.success('Service and associated events deleted successfully!');
            queryClient.invalidateQueries(['services']);
            setServiceToDelete(null);
        },
        onError: (err) => {
            const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete service';
            toast.error(errMsg);
            setServiceToDelete(null);
        }
    });

    const handleCopy = (text, keyId) => {
        navigator.clipboard.writeText(text);
        setCopiedKeyId(keyId);
        setTimeout(() => setCopiedKeyId(null), 2000);
        toast.success('API Key copied to clipboard!');
    };

    const handleCopyNewKey = (text) => {
        navigator.clipboard.writeText(text);
        setCopiedNewKey(true);
        setTimeout(() => setCopiedNewKey(false), 2000);
        toast.success('Copied dedicated API Key!');
    };

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        if (!newService.name.trim()) {
            toast.error('Service name is required');
            return;
        }
        createKey();
    };

    const handleCloseModal = () => {
        setIsCreateOpen(false);
        setGeneratedKey(null);
        setNewService({ name: '', keyName: '' });
    };

    const handleTestEvent = async () => {
        if (!integrationService) return;
        setSendingTest(true);
        try {
            await sendTestEvent(integrationService.name);
            toast.success('Test event sent successfully!');
            queryClient.invalidateQueries(['services']);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send test event');
        } finally {
            setSendingTest(false);
        }
    };

    const distinctServicesCount = services.filter(s => s.status === 'active').length;
    const isAtLimit = distinctServicesCount >= 2 && org?.plan === 'free';

    const getTierObj = (tierId) => TIERS.find(t => t.id === (tierId || 'tier-3')) || TIERS[2];

    return (
        <PageContainer>
            <PageHeader
                category="INFRASTRUCTURE CATALOG"
                icon={Server}
                title="Services Architecture"
                description="Configure operational criticality tiers for change risk scoring and manage service API credentials."
                actions={
                    <div className="flex items-center gap-2.5">
                        <button
                            onClick={() => refetch()}
                            disabled={isLoading || isFetching}
                            className="p-2 border border-white/10 rounded-lg bg-[#09090b] hover:bg-white/5 text-zinc-300 transition-colors cursor-pointer"
                            title="Refresh"
                        >
                            <RefreshCw size={14} className={isFetching ? 'animate-spin' : ''} />
                        </button>
                        {githubIntegration?.status === 'active' ? (
                            <button
                                onClick={() => {
                                    if (org?.id) {
                                        window.location.href = `${API_BASE_URL}/api/integrations/github-app/install?orgId=${org.id}`;
                                    }
                                }}
                                className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-emerald-400 shadow-sm cursor-pointer"
                                title="GitHub App is connected."
                            >
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <Github size={14} />
                                <span>GitHub Connected</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (org?.id) {
                                        window.location.href = `${API_BASE_URL}/api/integrations/github-app/install?orgId=${org.id}`;
                                    }
                                }}
                                className="flex items-center gap-2 bg-[#18181b] hover:bg-zinc-800 px-3.5 py-2 rounded-lg text-xs font-mono font-semibold transition-all text-white border border-white/10 cursor-pointer"
                            >
                                <Github size={14} />
                                Connect GitHub
                            </button>
                        )}
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all text-white shadow-sm cursor-pointer"
                        >
                            <Plus size={14} />
                            Connect Service
                        </button>
                    </div>
                }
            />

            {/* View Sub-Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/5 pb-1">
                <button
                    onClick={() => setActiveTab('stacker')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all border ${
                        activeTab === 'stacker'
                            ? 'bg-white/10 text-white border-white/15 shadow-sm'
                            : 'border-transparent text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Layers size={14} className={activeTab === 'stacker' ? 'text-accent' : ''} />
                    <span>Criticality Matrix (Stacker)</span>
                    <span className="text-[10px] bg-accent/20 text-accent font-mono px-1.5 py-0.5 rounded">
                        {services.length}
                    </span>
                </button>
                <button
                    onClick={() => setActiveTab('catalog')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg transition-all border ${
                        activeTab === 'catalog'
                            ? 'bg-white/10 text-white border-white/15 shadow-sm'
                            : 'border-transparent text-text-muted hover:text-white hover:bg-white/5'
                    }`}
                >
                    <Shield size={14} className={activeTab === 'catalog' ? 'text-accent' : ''} />
                    <span>API Keys & Credentials</span>
                </button>
            </div>

            {/* Free Plan Billing Limit Warning */}
            {isAtLimit && (
                <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-xl flex items-start gap-3 text-amber-400">
                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-xs font-semibold text-white">Project Ingestion Limit Reached (2/2)</h4>
                        <p className="text-[11px] text-text-muted leading-relaxed">
                            You are on the Free plan which supports up to 2 distinct active services. Ingesting signals from additional services will require upgrading to a paid plan.
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content Area with Min-Height to Prevent Scrollbar Jump */}
            <div className="min-h-[420px]">
                {isLoading ? (
                    <div className="flex flex-col justify-center items-center py-20 gap-3">
                        <Loader2 className="animate-spin text-accent" size={24} />
                        <span className="text-xs text-text-muted">Loading service catalog...</span>
                    </div>
                ) : services.length === 0 ? (
                    <div className="border border-dashed border-white/10 rounded-2xl p-16 text-center space-y-4">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center mx-auto text-text-secondary">
                            <Server size={20} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-semibold text-white">No Connected Services</h3>
                            <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
                                Connect your first backend service or deployment pipeline to begin ingesting change signals.
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCreateOpen(true)}
                            className="bg-white/5 border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg text-xs font-semibold hover:bg-white/10 transition-all text-white"
                        >
                            Create Dedicated API Key
                        </button>
                    </div>
                ) : activeTab === 'stacker' ? (
                    /* ========================================================================= */
                    /* TAB 1: CRITICALITY STACKER MATRIX                                          */
                    /* ========================================================================= */
                    <div className="space-y-6 animate-in fade-in duration-150">
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                    <Flame size={16} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-white">Service Criticality Settings</h3>
                                    <p className="text-[11px] text-text-muted">
                                        Assign operational criticality tiers to your services to tune automated incident correlation during outages.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {TIERS.map(tier => {
                                const tierServices = services.filter(s => (s.criticality_tier || 'tier-3') === tier.id);
                                return (
                                    <div key={tier.id} className="flex flex-col space-y-3">
                                        {/* Column Header */}
                                        <div className={`border rounded-xl p-3.5 ${tier.headerBorder}`}>
                                            <div className="flex justify-between items-center">
                                                <span className={`text-xs font-bold ${tier.iconColor}`}>
                                                    {tier.name}
                                                </span>
                                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white/80">
                                                    {tierServices.length} {tierServices.length === 1 ? 'service' : 'services'}
                                                </span>
                                            </div>
                                            <p className="text-[10px] text-text-muted mt-1 leading-snug">
                                                {tier.desc}
                                            </p>
                                        </div>

                                        {/* Service Cards in Tier */}
                                        <div className="space-y-2 min-h-[160px] bg-black/20 border border-white/5 p-2 rounded-xl">
                                            {tierServices.length === 0 ? (
                                                <div className="h-full flex items-center justify-center py-8 text-[11px] text-text-muted italic border border-dashed border-white/5 rounded-lg">
                                                    No services in tier
                                                </div>
                                            ) : (
                                                tierServices.map(service => (
                                                    <div
                                                        key={service.service_id || service.name}
                                                        className="bg-[#090d16]/80 border border-white/10 hover:border-white/20 p-3 rounded-lg space-y-2.5 transition-all shadow-sm"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <Server size={14} className="text-text-muted" />
                                                                <span className="text-xs font-semibold text-white truncate max-w-[120px]">
                                                                    {service.name}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5">
                                                                <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                                                                    service.status === 'active' 
                                                                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                                }`}>
                                                                    {service.eventCount || 0} ev
                                                                </span>
                                                                <button
                                                                    onClick={() => setServiceToDelete(service)}
                                                                    className="text-slate-400 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                                                                    title="Delete Service"
                                                                >
                                                                    <Trash2 size={13} />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Inline Tier Selector */}
                                                        <div className="pt-1 border-t border-white/5 flex items-center justify-between text-[10px]">
                                                            <span className="text-text-muted">Set Tier:</span>
                                                            <select
                                                                value={service.criticality_tier || 'tier-3'}
                                                                onChange={(e) => handleUpdateCriticality({
                                                                    serviceId: service.service_id || service.name,
                                                                    tier: e.target.value
                                                                })}
                                                                className="bg-black/60 border border-white/10 rounded px-2 py-1 text-[10px] text-white focus:outline-none focus:border-accent"
                                                            >
                                                                {TIERS.map(t => (
                                                                    <option key={t.id} value={t.id}>
                                                                        {t.name.split(':')[0]} ({t.name.split(':')[1]?.trim() || t.name})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* ========================================================================= */
                    /* TAB 2: API KEYS & CREDENTIALS CATALOG                                     */
                    /* ========================================================================= */
                    <div className="space-y-6 animate-in fade-in duration-150">
                        <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                                    <Shield size={16} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-white">API Keys & Ingestion Credentials</h3>
                                    <p className="text-[11px] text-text-muted">
                                        Manage dedicated API keys for custom microservice ingestion and monitor GitHub App webhook connections.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((service, idx) => {
                        const hasKey = !!service.apiKeyId;
                        const tierObj = getTierObj(service.criticality_tier);
                        return (
                            <div
                                key={idx}
                                className="bg-[#090d16]/30 border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all relative group flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    {/* Service Name & Status Badge */}
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="w-2.5 h-2.5 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                                                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                                            </span>
                                            <span className="text-sm font-semibold text-white">{service.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${tierObj.badgeBg}`}>
                                                {tierObj.name.split(':')[0]}
                                            </span>
                                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${service.status === 'active'
                                                ? 'border-emerald-500/20 bg-emerald-950/20 text-emerald-400'
                                                : 'border-amber-500/20 bg-amber-950/20 text-amber-400'
                                                }`}>
                                                {service.status === 'active' ? 'Active' : 'Pending'}
                                            </span>
                                            <button
                                                onClick={() => setServiceToDelete(service)}
                                                className="text-text-muted hover:text-red-400 transition-colors p-1"
                                                title="Delete Service"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-4 border-t border-b border-white/5 py-4 my-2">
                                        <div className="space-y-1">
                                            <div className="text-[9px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1">
                                                <LineChart size={10} />
                                                Ingestion Count
                                            </div>
                                            <div className="text-xs text-white font-semibold">
                                                {service.eventCount || 0} events
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-[9px] uppercase tracking-wider text-text-muted font-mono flex items-center gap-1">
                                                <Calendar size={10} />
                                                Last Active
                                            </div>
                                            <div className="text-xs text-white font-semibold">
                                                {service.lastActive
                                                    ? dayjs(service.lastActive).fromNow()
                                                    : 'Never'}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* API Key Section */}
                                <div className="mt-4 pt-2">
                                    {hasKey ? (
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] text-text-muted">
                                                <span className="flex items-center gap-1">
                                                    <Shield size={10} />
                                                    Dedicated API Key:
                                                </span>
                                                <span>
                                                    {service.apiKeyLastUsed
                                                        ? `Last used ${dayjs(service.apiKeyLastUsed).fromNow()}`
                                                        : 'Never used'}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs">
                                                <span className="font-mono text-text-secondary select-all">
                                                    {service.apiKeyValue ? service.apiKeyValue.substring(0, 10) + '••••••••' : '••••••••••••••••'}
                                                </span>
                                                {service.apiKeyValue && (
                                                    <button
                                                        onClick={() => handleCopy(service.apiKeyValue, service.apiKeyId)}
                                                        className="text-text-muted hover:text-white transition-colors"
                                                        title="Copy API Key"
                                                    >
                                                        {copiedKeyId === service.apiKeyId ? (
                                                            <Check size={14} className="text-emerald-400" />
                                                        ) : (
                                                            <Copy size={14} />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ) : (service.source === 'github' || (!hasKey && githubIntegration?.status === 'active')) ? (
                                        <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-xs text-emerald-400">
                                            <span className="flex items-center gap-1.5 font-medium text-[11px]">
                                                <Github size={13} />
                                                Managed via GitHub App
                                            </span>
                                            <span className="text-[10px] text-emerald-400/70 font-mono">Auto Ingestion</span>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setNewService({ name: service.name, keyName: `${service.name} Key` });
                                                setIsCreateOpen(true);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-2 rounded-lg text-xs font-semibold text-white transition-all"
                                        >
                                            <Plus size={14} />
                                            Generate Dedicated Key
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )}
    </div>

            {/* Create Service Dedicated Key Modal */}
            {isCreateOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#0b0f19] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-text-muted hover:text-white transition-colors p-1"
                        >
                            <X size={16} />
                        </button>

                        <div className="space-y-1">
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Shield className="text-accent" size={18} />
                                {generatedKey ? 'Dedicated API Key Created' : 'Create Dedicated API Key'}
                            </h3>
                            <p className="text-xs text-text-muted leading-relaxed">
                                {generatedKey
                                    ? 'Copy this key now. For security reasons, it will not be displayed again.'
                                    : 'Assign a dedicated ingestion key for isolated change tracking.'}
                            </p>
                        </div>

                        {generatedKey ? (
                            <div className="space-y-4">
                                <div className="bg-black/60 border border-emerald-500/30 rounded-xl p-4 space-y-2">
                                    <span className="text-[10px] text-emerald-400 font-mono font-semibold uppercase tracking-wider block">
                                        Your Dedicated API Key
                                    </span>
                                    <div className="flex items-center justify-between gap-2">
                                        <code className="text-xs font-mono text-white select-all break-all">
                                            {generatedKey}
                                        </code>
                                        <button
                                            onClick={() => handleCopyNewKey(generatedKey)}
                                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors shrink-0"
                                        >
                                            {copiedNewKey ? <Check size={14} /> : <Copy size={14} />}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCloseModal}
                                    className="w-full bg-white/10 hover:bg-white/15 text-white py-2.5 rounded-xl text-xs font-semibold transition-all"
                                >
                                    Done
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleCreateSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-secondary">
                                        Service Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        placeholder="e.g. user-fe or payment-backend"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold text-text-secondary">
                                        Key Label (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={newService.keyName}
                                        onChange={(e) => setNewService({ ...newService, keyName: e.target.value })}
                                        placeholder="e.g. Production Ingest Key"
                                        className="w-full bg-black/40 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-text-muted focus:outline-none focus:border-accent/50"
                                    />
                                </div>
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleCloseModal}
                                        className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creating}
                                            className="flex items-center gap-2 bg-gradient-accent px-5 py-2.5 rounded-xl text-xs font-semibold text-white hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {creating && <Loader2 size={14} className="animate-spin" />}
                                        Generate Key
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* Delete Service Confirmation Modal */}
            {serviceToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
                    <div className="bg-[#0e121b] border border-rose-500/30 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-in zoom-in-95 duration-150">
                        <button
                            onClick={() => setServiceToDelete(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                                <ShieldAlert size={20} />
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-white">
                                    Delete Service "{serviceToDelete.name}"?
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    This action is permanent and cannot be undone.
                                </p>
                            </div>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed bg-black/40 border border-slate-800 p-3.5 rounded-xl font-sans">
                            Deleting this service will permanently remove all associated change event streams, ingestion credentials, and incident risk scoring history for <strong className="text-white font-mono">{serviceToDelete.name}</strong>.
                        </p>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setServiceToDelete(null)}
                                disabled={deletingService}
                                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => handleDeleteService(serviceToDelete.service_id || serviceToDelete.id || serviceToDelete.name)}
                                disabled={deletingService}
                                className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-md shadow-rose-600/20 disabled:opacity-50 cursor-pointer"
                            >
                                {deletingService ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                <span>{deletingService ? 'Deleting...' : 'Delete Service'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PageContainer>
    );
};

export default Services;
