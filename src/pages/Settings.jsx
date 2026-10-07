import { UserCircle } from "lucide-react";
import { LoadingState } from "../components/LoadingState/LoadingState";
import { useOrganization } from "../hooks/useOrganization";
import { PageHeader } from "../components/ui/PageHeader";
import { PageContainer } from "../components/ui/PageContainer";
import TeamSettings from "../components/Team/TeamSettings";

const Settings = () => {

  // Use global store
  const { data: organization, isLoading, error } = useOrganization();

  return (
    <PageContainer>
      <PageHeader
        icon={UserCircle}
        title="Settings"
        description="Manage your workspace and account."
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
              <div className="text-white text-sm font-semibold break-words">
                {organization.name}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Subscription Plan
              </label>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-white/10 text-white border border-white/15">
                {(organization.plan || "Unknown").toUpperCase()}
              </div>
            </div>
            <div>
              <label className="block text-[10px] text-zinc-500 font-mono uppercase tracking-wider mb-1">
                Organization ID
              </label>
              <div className="text-zinc-300 font-mono text-xs break-all max-w-full select-all bg-[#101413] border border-white/10 px-3 py-1.5 rounded-md inline-block">
                {organization.id}
              </div>
            </div>
          </div>
        )}
      </div>
      {organization && <TeamSettings organization={organization} />}
    </PageContainer>
  );
};

export default Settings;
