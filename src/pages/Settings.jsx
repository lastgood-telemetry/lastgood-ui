import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Copy, CheckCircle2 } from "lucide-react";
import useOrgStore from "../stores/useOrgStore";
import { LoadingState } from "../components/LoadingState/LoadingState";
import { getAPIKeyByOrg } from "../service/api-key";
import { useOrganization } from "../hooks/useOrganization";
import CreateAPIKey from "../components/CreateAPIKey/CreateAPIKey";
import { toast } from "../components/ui/Toast";

import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";
import { UserCircle } from "lucide-react";

const Settings = () => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Use global store
  const { data: organization, isLoading, error } = useOrganization();

  const { data: apiKeys = [], refetch: fetchApiKeys } = useQuery({
    queryKey: ["apiKeys", organization?.id],
    queryFn: () => getAPIKeyByOrg(organization.id),
    enabled: !!organization?.id,
  });

  const handleCopy = () => {
    if (!apiKeys?.key_hash) return;
    navigator.clipboard.writeText(apiKeys.key_hash).then(() => {
      setCopied(true);
      toast.success("API key copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <PageContainer>
      <PageHeader
        category="ACCOUNT & ORGANIZATION"
        icon={UserCircle}
        title="Project Profile & Settings"
        description="Manage organization details, team access, and subscription preferences."
      />

      <div className="bg-[#101413] border border-white/10 rounded-xl p-6 shadow-sm relative overflow-hidden space-y-6">
        <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-white border-b border-white/[0.08] pb-3">
          Organization Configuration
        </h3>

        {isLoading && <LoadingState message="Fetching organization details..." />}

        {error && (
          <div className="text-rose-400 font-mono text-xs p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg">
            Failed to load organization details.
          </div>
        )}

        {organization && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Organization Name
              </label>
              <div className="text-white text-sm font-semibold">
                {organization.name}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Subscription Plan
              </label>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                {organization.plan.toUpperCase()}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Organization ID
              </label>
              <div className="text-zinc-300 font-mono text-xs select-all bg-[#101413] border border-white/10 px-3 py-1.5 rounded-md inline-block">
                {organization.id}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Team Size
              </label>
              <div className="text-zinc-300 font-mono text-xs">
                1 Member (Owner)
              </div>
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default Settings;
