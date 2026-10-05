import React, { useEffect, useState } from "react";
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
  Menu,
  X,
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
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Close the mobile drawer on navigation and on Escape.
  useEffect(() => {
    setIsNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isNavOpen) return undefined;
    const onKey = (e) => e.key === "Escape" && setIsNavOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isNavOpen]);

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
    { path: "/rewind", label: "Rewind", group: "Investigate", icon: Clock, mobile: true },
    { path: "/events", label: "Events", group: "Investigate", icon: List, mobile: true },
    { path: "/postmortems", label: "Postmortems", group: "Investigate", icon: FileText },
    { path: "/services", label: "Services", group: "Context", icon: Server },
    { path: "/topology", label: "Topology", group: "Context", icon: Network },
    { path: "/integrations", label: "Ingestion Channels", group: "Workspace", icon: Blocks },
    { path: "/settings", label: "Settings", group: "Workspace", icon: UserCircle },
  ];

  // Phones get the investigate flow only (Events + Rewind); everything else is desktop.
  const isMobilePath = navItems.some((n) => n.mobile && location.pathname.startsWith(n.path));
  useEffect(() => {
    if (!isMobilePath && window.matchMedia("(max-width: 767px)").matches) {
      navigate("/rewind", { replace: true });
    }
  }, [isMobilePath, navigate]);

  const currentNav = navItems.find((n) => location.pathname.startsWith(n.path)) || navItems[0];

  return (
    <div className="flex min-h-screen font-sans bg-[#101413] text-slate-100">
      {/* Mobile drawer backdrop */}
      {isNavOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-[#0b0f0d]/70"
          onClick={() => setIsNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar - Navigation (off-canvas drawer below md, fixed rail from md up) */}
      <aside
        id="main-sidebar"
        className={`w-56 max-w-[85vw] border-r border-slate-800/60 bg-[#101413] flex flex-col fixed h-full z-50 transition-transform duration-200 md:translate-x-0 ${
          isNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-14 px-4 border-b border-slate-800/60 flex items-center justify-between">
          <div
            onClick={() => navigate("/rewind")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <Logo size="md" showText={true} textClassName="text-lg" />
          </div>
          <span className="hidden md:inline text-[9px] font-mono tracking-[0.1em] text-[#b6edce] border border-[#3a5546] px-1.5 py-0.5">
            BETA
          </span>
          <button
            type="button"
            onClick={() => setIsNavOpen(false)}
            className="md:hidden p-2 -mr-2 text-slate-400 hover:text-slate-200 cursor-pointer"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>

        <nav aria-label="Main navigation" className="flex-1 px-2 py-4 overflow-y-auto custom-scrollbar">
          {['Investigate', 'Context', 'Workspace'].map(group => (
            <div key={group} className={`mb-5 last:mb-0 ${navItems.some(i => i.group === group && i.mobile) ? '' : 'hidden md:block'}`}>
              <h2 className="px-2.5 mb-2 text-[11px] font-medium text-slate-500">{group}</h2>
              <div className="space-y-0.5">
                {navItems.filter(item => item.group === group).map(item => {
                  const Icon = item.icon;
                  return (
                    <NavLink key={item.path} to={item.path} className={({ isActive }) =>
                      `${item.mobile ? 'flex' : 'hidden md:flex'} items-center gap-2.5 px-2.5 py-2 rounded text-sm transition-colors border ${isActive
                        ? 'bg-[#b6edce]/10 text-[#b6edce] font-semibold border-[#b6edce]/25'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'}`
                    }>
                      <Icon size={15} className="shrink-0" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
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
                  Workspace
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="text-slate-500 hover:text-rose-400 p-1.5 rounded-md hover:bg-rose-950/40 transition-colors cursor-pointer"
              title="Log out" aria-label="Log out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-56 relative min-w-0 bg-[#101413] min-h-screen flex flex-col">
        {/* Top Header Bar */}
        <header className="h-14 sticky top-0 z-30 bg-[#101413]/80 backdrop-blur-md border-b border-slate-800/60 px-3 md:px-6 flex items-center justify-between gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => setIsNavOpen(true)}
            className="md:hidden p-2 -ml-1 text-slate-300 hover:text-white cursor-pointer"
            aria-label="Open navigation"
            aria-controls="main-sidebar"
            aria-expanded={isNavOpen}
          >
            <Menu size={20} />
          </button>
          {/* Breadcrumb / Page Title */}
          <div className="flex-1 md:flex-none min-w-0 flex items-center gap-2 text-xs font-medium text-slate-400">
            <span className="hidden md:flex items-center gap-2">
              <Logo size="xs" />
              <span>LastGood</span>
              <span className="text-slate-600">/</span>
            </span>
            <span className="text-slate-200 font-semibold truncate">{currentNav.label}</span>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Demo-mode toggle is secondary: hidden on phones */}
            <button
              onClick={toggleIncidentMode}
              className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded border text-xs transition-all cursor-pointer ${
                isIncidentMode
                  ? "bg-rose-950/60 border-rose-500/40 text-rose-400 hover:bg-rose-900/60"
                  : "bg-[#151b18] border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
              title="Toggle a simulated incident. This is not live system health." aria-pressed={isIncidentMode}
            >
              <span>{isIncidentMode ? "Demo incident mode on" : "Demo incident mode"}</span>
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => setCommandPaletteOpen(true)}
              className="flex items-center gap-2 px-2.5 md:px-3 py-1.5 rounded-lg bg-[#151b18] border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
              aria-label="Open commands"
            >
              <Search size={13} className="text-slate-500" />
              <span className="hidden md:inline">Commands</span>
              <kbd className="hidden md:inline text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 ml-1">
                ⌘K
              </kbd>
            </button>
          </div>
        </header>

        {/* Incident Alert Bar (Compact & Sleek) */}
        {isIncidentMode && (
          <div className="bg-rose-950/80 border-b border-rose-500/30 px-3 md:px-6 py-2.5 flex items-center justify-between gap-3 md:gap-4 text-xs font-mono text-rose-300">
            <div className="flex items-center gap-2">
              <ShieldAlert size={15} className="text-rose-400" />
              <span><strong>Simulated incident · {activeIncident.severity}:</strong> {activeIncident.title}</span>
            </div>
            <button
              onClick={() => navigate('/rewind')}
              className="text-[11px] bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Open Rewind</span>
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
