import { Link, useLocation } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner@2.0.3";
import {
  CheckCircle,
  Grid3x3,
  TrendingUp,
  Calendar,
  Inbox,
  User,
  Settings,
  Briefcase,
  HelpCircle,
  Share2,
  Video,
  Bell,
  Puzzle,
  Clock,
  Layers,
  Save,
  Zap,
  BarChart3,
  Search,
  Menu,
  X,
  Command,
  LogOut,
} from "lucide-react";

export function KaalNavbar() {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Close mobile nav on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  // Close on escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const openCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "k",
        metaKey: true,
        bubbles: true,
      })
    );
  };

  const navContent = (
    <>
      {/* Logo Section */}
      <div className="h-24 flex items-center px-8 border-b border-white/40 shrink-0">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-8 h-8 bg-[#111827] text-white rounded-lg flex items-center justify-center font-serif font-bold text-lg shadow-[0_0_20px_rgba(17,24,39,0.15)]">
            K
          </div>
          <span
            className="text-xl font-bold tracking-tight text-[#111827]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            KAAL
          </span>
        </div>
        {/* Mobile close button */}
        <button
          className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-black/5 transition-colors"
          onClick={() => setIsMobileOpen(false)}
        >
          <X className="w-5 h-5" style={{ color: "#6B7280" }} />
        </button>
      </div>

      {/* Quick Search Trigger */}
      <div className="px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={openCommandPalette}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-all duration-200 hover:shadow-sm group"
          style={{
            backgroundColor: "rgba(249, 250, 251, 0.6)",
            borderColor: "rgba(229, 231, 235, 0.6)",
          }}
        >
          <Search
            className="w-4 h-4"
            style={{ color: "#9CA3AF" }}
          />
          <span className="text-sm flex-1 text-left" style={{ color: "#9CA3AF" }}>
            Search...
          </span>
          <kbd
            className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium border"
            style={{
              color: "#9CA3AF",
              backgroundColor: "rgba(255,255,255,0.8)",
              borderColor: "#E5E7EB",
            }}
          >
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-1">
        {/* Workspace Section */}
        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.15em] px-4 mb-3 opacity-70">
          Workspace
        </div>

        <Link
          to="/dashboard"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/dashboard") || isActive("/")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Grid3x3
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/dashboard") || isActive("/") ? 2.5 : 1.5}
          />
          Home
        </Link>

        <Link
          to="/tasks"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/tasks")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <CheckCircle
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/tasks") ? 2.5 : 1.5}
            fill={isActive("/tasks") ? "currentColor" : "none"}
          />
          Tasks
        </Link>

        <Link
          to="/backlog"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/backlog")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Layers
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/backlog") ? 2.5 : 1.5}
          />
          Backlog
        </Link>

        <Link
          to="/reminders"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/reminders")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Bell
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/reminders") ? 2.5 : 1.5}
            fill={isActive("/reminders") ? "currentColor" : "none"}
          />
          Reminders
        </Link>

        <Link
          to="/energy"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/energy")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Zap
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/energy") ? 2.5 : 1.5}
            fill={isActive("/energy") ? "currentColor" : "none"}
          />
          Energy Hub
        </Link>

        <Link
          to="/analytics"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/analytics")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <TrendingUp
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/analytics") ? 2.5 : 1.5}
          />
          Analytics
        </Link>

        <Link
          to="/calendar"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/calendar")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Calendar
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/calendar") ? 2.5 : 1.5}
          />
          Calendar
        </Link>

        <Link
          to="/meetings"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/meetings")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Video
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/meetings") ? 2.5 : 1.5}
          />
          Meetings
        </Link>

        <Link
          to="/timeline"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/timeline")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Clock
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/timeline") ? 2.5 : 1.5}
          />
          Timeline
        </Link>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4 mx-4" />

        {/* Tools Section */}
        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.15em] px-4 mb-3 opacity-70">
          Tools
        </div>

        <Link
          to="/insights"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/insights")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <BarChart3
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/insights") ? 2.5 : 1.5}
          />
          Weekly Insights
        </Link>

        <Link
          to="/integrations"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/integrations")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Puzzle
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/integrations") ? 2.5 : 1.5}
            fill={isActive("/integrations") ? "currentColor" : "none"}
          />
          Integrations
        </Link>

        <Link
          to="/workspace"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/workspace")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Briefcase
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/workspace") ? 2.5 : 1.5}
          />
          Workspace
        </Link>

        <Link
          to="/save-states"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/save-states")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Save
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/save-states") ? 2.5 : 1.5}
            fill={isActive("/save-states") ? "currentColor" : "none"}
          />
          Save States
        </Link>

        <Link
          to="/share"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/share")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <Share2
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/share") ? 2.5 : 1.5}
          />
          Share & Invite
        </Link>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-4 mx-4" />

        {/* Personal Section */}
        <div className="text-[10px] font-bold text-[#6B7280] uppercase tracking-[0.15em] px-4 mb-3 opacity-70">
          Personal
        </div>

        <Link
          to="/inbox"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 justify-between ${
            isActive("/inbox")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-3">
            <Inbox
              className="w-[22px] h-[22px]"
              strokeWidth={isActive("/inbox") ? 2.5 : 1.5}
            />
            Inbox
          </div>
          <span className="bg-white/80 text-[#111827] text-[10px] font-bold px-2 py-0.5 rounded-full border border-gray-100 shadow-sm">
            3
          </span>
        </Link>

        <Link
          to="/profile"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/profile")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <User
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/profile") ? 2.5 : 1.5}
          />
          Profile
        </Link>

        <Link
          to="/help"
          className={`group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/help")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40 hover:shadow-sm"
          }`}
        >
          <HelpCircle
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/help") ? 2.5 : 1.5}
          />
          Help
        </Link>
      </nav>

      {/* Settings Footer */}
      <div className="p-4 border-t border-white/40 bg-white/20 backdrop-blur-sm shrink-0 space-y-2">
        <Link
          to="/settings"
          className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
            isActive("/settings")
              ? "bg-white/50 text-[#111827] border border-white/60 shadow-sm"
              : "text-[#6B7280] hover:text-[#111827] hover:bg-white/40"
          }`}
        >
          <Settings
            className="w-[22px] h-[22px]"
            strokeWidth={isActive("/settings") ? 2.5 : 1.5}
          />
          Settings
        </Link>
        <button
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 text-[#6B7280] hover:text-red-600 hover:bg-red-50/40"
          onClick={async () => {
            const result = await signOut();
            if (result.success) {
              toast.success("Logged out successfully!");
            } else {
              toast.error("Failed to log out");
            }
          }}
        >
          <LogOut
            className="w-[22px] h-[22px]"
            strokeWidth={1.5}
          />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="lg:hidden fixed top-6 left-4 z-50 p-2.5 rounded-xl transition-all duration-300"
        style={{
          background: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        }}
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="w-5 h-5" style={{ color: "#111827" }} />
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 flex flex-col transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.6)",
          boxShadow: isMobileOpen
            ? "8px 0 30px rgba(0,0,0,0.1)"
            : "none",
        }}
      >
        {navContent}
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex w-72 flex-col h-full flex-shrink-0 z-30 shadow-subtle relative"
        style={{
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderRight: "1px solid rgba(255, 255, 255, 0.6)",
        }}
      >
        {navContent}
      </aside>
    </>
  );
}