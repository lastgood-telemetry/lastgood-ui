import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Clock,
  List,
  Server,
  Network,
  FileText,
  Blocks,
  UserCircle,
  LogOut,
  Search,
  ShieldAlert,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { useOrganization } from "../hooks/useOrganization";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal/LogoutConfirmationModal";
import CommandPaletteModal from "../components/CommandPaletteModal";
import { useOnCallStore } from "../stores/useOnCallStore";
import Logo from "../components/Logo";

const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: org } = useOrganization();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const {
    isIncidentMode,
    toggleIncidentMode,
    setCommandPaletteOpen,
    activeIncident
  } = useOnCallStore();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  const navItems = [
    { path: "/rewind", label: "Rewind AI", icon: Clock },
    { path: "/events", label: "Events Stream", icon: List },
    { path: "/services", label: "Services Catalog", icon: Server },
    { path: "/topology", label: "Topology Map", icon: Network },
    { path: "/postmortems", label: "Postmortems", icon: FileText },
    { path: "/integrations", label: "Integrations", icon: Blocks },
    { path: "/settings", label: "Project Profile", icon: UserCircle },
  ];

  const currentNav = navItems.find((n) => location.pathname.startsWith(n.path)) || navItems[0];

  return (
    <div className="flex min-h-screen font-sans bg-[#101413] text-slate-100">
      {/* Sidebar - Navigation */}
      <aside className="w-56 border-r border-slate-800/60 bg-[#101413] flex flex-col fixed h-full z-50">
        {/* Brand Logo Header */}
        <div className="h-14 px-4 border-b border-slate-800/60 flex items-center justify-between">
          <div
            onClick={() => navigate("/rewind")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <Logo size="md" showText={true} textClassName="text-lg" />
          </div>
          <span className="text-[9px] font-mono tracking-[0.1em] text-[#b6edce] border border-[#3a5546] px-1.5 py-0.5">
            BETA
          </span>
        </div>

        {/* Clean Navigation List */}
        <div className="px-3 pt-4 pb-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.1em] px-2">
            Platform
          </span>
        </div>

        <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#b6edce]/10 text-[#b6edce] font-semibold border border-[#b6edce]/25"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/50"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={15}
                      className={isActive ? "text-indigo-400" : "text-slate-400"}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* User Profile & Org Footer */}
        <div className="p-3 border-t border-slate-800/60 bg-[#101413]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#101413] border border-slate-800/70">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-6 h-6 rounded-md bg-[#17241d] border border-[#b6edce]/30 flex items-center justify-center font-mono font-bold text-[#b6edce] text-[11px] shrink-0">
                {org?.name?.charAt(0) || "O"}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-medium text-slate-200 truncate leading-tight">
                  {org?.name || "Organization"}
                </span>
                <span className="text-[10px] text-slate-500 font-mono leading-tight">
                  Beta
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Logout"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-56 relative min-w-0 bg-[#101413] min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="h-14 sticky top-0 z-40 bg-[#101413]/80 backdrop-blur-md border-b border-slate-800/60 px-6 flex items-center justify-between gap-4">
          {/* Breadcrumb / Page Title */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <Logo size="xs" />
            <span>LastGood</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200 font-semibold">{currentNav.label}</span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* System Operational Status Pill */}
            <button
              onClick={toggleIncidentMode}
              className={`flex items-center gap-2 px-2.5 py-1 rounded-full border text-[11px] font-mono transition-all cursor-pointer ${
                isIncidentMode
                  ? "bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-900/60"
                  : "bg-[#17241d] border-[#b6edce]/30 text-[#b6edce] hover:bg-[#1d2e25]"
              }`}
              title="Click to toggle Incident Mode"
            >
              <span className="relative flex h-2 w-2">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isIncidentMode ? "bg-rose-400" : "bg-[#b6edce]"
                  }`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    isIncidentMode ? "bg-rose-500" : "bg-[#b6edce]"
                  }`}
                ></span>
              </span>
              <span>{isIncidentMode ? "P1 Incident Active" : "Systems Healthy"}</span>
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151b18] border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
            >
              <Search size={13} className="text-slate-500" />
              <span>Search...</span>
              <kbd className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 ml-1">
                ⌘K
              </kbd>
            </button>
          </div>
        </header>

        {/* Incident Alert Bar (Compact & Sleek) */}
        {isIncidentMode && (
          <div className="bg-rose-950/80 border-b border-rose-500/30 px-6 py-2.5 flex items-center justify-between gap-4 text-xs font-mono text-rose-300">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-rose-400" />
              <span><strong>{activeIncident.severity}:</strong> {activeIncident.title}</span>
            </div>
            <button
              onClick={() => navigate('/rewind')}
              className="text-[11px] bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Launch Diagnostic</span>
              <ChevronRight size={12} />
            </button>
          </div>
        )}

        {/* Content Outlet */}
        <div className="flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>

      <CommandPaletteModal />
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default MainLayout;
