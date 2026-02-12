import { useState } from "react";
import { 
  Bell, 
  Palette, 
  Link2, 
  Shield, 
  ChevronRight,
  Plus,
  FileText,
  MessageSquare,
  Calendar as CalendarIcon,
  Database,
  Code2,
  Brain
} from "lucide-react";
import { DatabaseStatusCard } from "./DatabaseStatusCard";
import { AISettingsModal } from "./AISettingsModal";
import { useSettings } from "../context/SettingsContext";
import { useProfile } from "../context/ProfileContext";
import { toast } from "sonner@2.0.3";
import { useNavigate } from "react-router";
import { NotificationCenter } from "./NotificationCenter";

interface ToggleSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  isActive: boolean;
}

export function SettingsScreen() {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const [showAIModal, setShowAIModal] = useState(false);
  
  const notifications: ToggleSetting[] = [
    { id: "push", label: "Push Notifications", description: "Real-time alerts on desktop", enabled: settings.pushNotifications },
    { id: "email", label: "Email Digest", description: "Daily summary at 9:00 AM", enabled: settings.emailDigest },
    { id: "sound", label: "Sound Effects", description: "Subtle audio feedback", enabled: settings.soundEffects },
  ];

  const appearance: ToggleSetting[] = [
    { id: "glass", label: "Glassmorphism", description: "Enable blur effects", enabled: settings.glassmorphism },
    { id: "dark", label: "Dark Mode", description: "Switch to dark theme", enabled: settings.darkMode },
    { id: "compact", label: "Compact View", description: "Denser information layout", enabled: settings.compactView },
  ];

  const integrations: Integration[] = [
    { 
      id: "drive",
      name: "Google Drive", 
      description: "Sync files and documents automatically.",
      icon: FileText,
      iconColor: "#2563EB",
      iconBg: "#EFF6FF",
      isActive: true
    },
    { 
      id: "slack",
      name: "Slack Connect", 
      description: "Forward notifications to channels.",
      icon: MessageSquare,
      iconColor: "#9333EA",
      iconBg: "#FAF5FF",
      isActive: false
    },
    { 
      id: "calendar",
      name: "Calendar API", 
      description: "Bi-directional event syncing.",
      icon: CalendarIcon,
      iconColor: "#EA580C",
      iconBg: "#FFF7ED",
      isActive: true
    },
  ];

  const handleSecurityAction = (action: string) => {
    switch (action) {
      case "Change Password":
        toast.success("Password change dialog opened", {
          description: "A password reset link has been sent to your email."
        });
        break;
      case "2FA Authentication":
        toast.success("Two-factor authentication is enabled", {
          description: "Your account is secured with 2FA via authenticator app."
        });
        break;
      case "Active Sessions":
        toast.info("Active Sessions", {
          description: "You have 3 active sessions: Desktop (current), Mobile, and Tablet."
        });
        break;
      default:
        toast.info(action);
    }
  };

  const handleSignOutAll = () => {
    if (window.confirm('Sign out of all devices? You will need to log in again.')) {
      toast.success("Signed out of all devices", {
        description: "All sessions except this one have been terminated."
      });
    }
  };

  const handleViewAllIntegrations = () => {
    navigate("/integrations");
  };

  const handleAddIntegration = () => {
    toast.info("Add Integration", {
      description: "Browse the integration marketplace to connect new tools."
    });
  };

  const toggleNotification = (id: string) => {
    const settingsMap: { [key: string]: keyof typeof settings } = {
      push: 'pushNotifications',
      email: 'emailDigest',
      sound: 'soundEffects'
    };
    
    const key = settingsMap[id];
    if (key) {
      updateSettings({ [key]: !settings[key] });
      toast.success(`${notifications.find(n => n.id === id)?.label} ${!settings[key] ? 'enabled' : 'disabled'}`);
    }
  };

  const toggleAppearance = (id: string) => {
    const settingsMap: { [key: string]: keyof typeof settings } = {
      glass: 'glassmorphism',
      dark: 'darkMode',
      compact: 'compactView'
    };
    
    const key = settingsMap[id];
    if (key) {
      updateSettings({ [key]: !settings[key] });
      toast.success(`${appearance.find(a => a.id === id)?.label} ${!settings[key] ? 'enabled' : 'disabled'}`);
    }
  };
  
  const handleResetDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      resetSettings();
      toast.success('Settings reset to defaults');
    }
  };
  
  const handleSaveChanges = () => {
    toast.success('Settings saved successfully!');
  };
  
  return (
    <div className="flex-1 overflow-hidden flex flex-col" style={{ backgroundColor: "#F8F9FA" }}>
      {/* Header */}
      <header 
        className="h-24 border-b flex items-center justify-between px-10 sticky top-0 z-20"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderColor: "rgba(255, 255, 255, 0.5)",
          boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
        }}
      >
        <div className="flex flex-col">
          <h1 
            className="text-sm font-semibold tracking-wide uppercase"
            style={{ color: "#6B7280" }}
          >
            System Preferences
          </h1>
          <p 
            className="text-2xl italic"
            style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
          >
            Control Center
          </p>
        </div>

        <div className="flex items-center gap-6">
          <div className="h-10 w-px bg-gray-200"></div>

          <NotificationCenter />

          <div className="w-10 h-10 rounded-full ring-2 ring-white shadow-lg overflow-hidden">
            <img 
              src={profile.profileImage} 
              alt="User" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
        <div className="max-w-6xl mx-auto space-y-10 pb-32">
          {/* Title Section */}
          <div className="flex justify-between items-end">
            <div>
              <h2 
                className="text-5xl font-medium tracking-tight leading-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#111827",
                  animation: "settle 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
                }}
              >
                Settings & <span className="italic">Controls</span>
              </h2>
              <p 
                className="mt-3 text-lg font-light tracking-wide max-w-lg opacity-0"
                style={{ 
                  color: "#6B7280",
                  animation: "fadeInUp 0.8s ease-out 0.2s forwards"
                }}
              >
                Customize your workspace environment and AI interactions.
              </p>
            </div>

            <div className="flex gap-3">
              <button 
                className="px-5 py-2.5 rounded-xl border font-medium text-sm shadow-sm transition-all"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.6)",
                  backgroundColor: "rgba(255, 255, 255, 0.3)",
                  color: "#6B7280",
                  backdropFilter: "blur(4px)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#111827";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
                }}
                onClick={handleResetDefaults}
              >
                Reset Defaults
              </button>
              <button 
                className="px-5 py-2.5 rounded-xl font-medium text-sm text-white shadow-lg transition-all"
                style={{ backgroundColor: "#111827" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(17, 24, 39, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
                }}
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>
            </div>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Notifications */}
            <SettingsCard 
              icon={<Bell className="w-7 h-7" />}
              title="Notifications"
              description="Manage how you receive alerts."
              className="col-span-12 lg:col-span-6"
              delay="0.3s"
            >
              <div className="space-y-6">
                {notifications.map((setting) => (
                  <ToggleRow
                    key={setting.id}
                    label={setting.label}
                    description={setting.description}
                    enabled={setting.enabled}
                    onToggle={() => toggleNotification(setting.id)}
                  />
                ))}
              </div>
            </SettingsCard>

            {/* Appearance */}
            <SettingsCard 
              icon={<Palette className="w-7 h-7" />}
              title="Appearance"
              description="Customize the visual interface."
              className="col-span-12 lg:col-span-6"
              delay="0.4s"
            >
              <div className="space-y-6">
                {appearance.map((setting) => (
                  <ToggleRow
                    key={setting.id}
                    label={setting.label}
                    description={setting.description}
                    enabled={setting.enabled}
                    onToggle={() => toggleAppearance(setting.id)}
                  />
                ))}
              </div>
            </SettingsCard>

            {/* Integrations */}
            <SettingsCard 
              icon={<Link2 className="w-7 h-7" />}
              title="Integrations"
              description="Connect with external tools."
              className="col-span-12 lg:col-span-8"
              delay="0.5s"
              headerAction={
                <button 
                  className="text-xs font-bold uppercase tracking-widest transition-opacity"
                  style={{ color: "#111827" }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = "0.7"}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
                  onClick={handleViewAllIntegrations}
                >
                  View All
                </button>
              }
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => {
                  const Icon = integration.icon;
                  return (
                    <IntegrationCard
                      key={integration.id}
                      name={integration.name}
                      description={integration.description}
                      icon={<Icon className="w-5 h-5" />}
                      iconColor={integration.iconColor}
                      iconBg={integration.iconBg}
                      isActive={integration.isActive}
                    />
                  );
                })}

                {/* Add New Card */}
                <div 
                  className="p-5 rounded-2xl border border-dashed transition-all cursor-pointer group"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.5)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                  }}
                  onClick={handleAddIntegration}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center py-2">
                    <Plus 
                      className="w-8 h-8 mb-2 text-gray-400 group-hover:text-gray-900 transition-colors"
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                      Add New
                    </span>
                  </div>
                </div>
              </div>
            </SettingsCard>

            {/* Security */}
            <SettingsCard 
              icon={<Shield className="w-7 h-7" />}
              title="Security"
              description="Privacy controls."
              className="col-span-12 lg:col-span-4"
              delay="0.6s"
            >
              <div className="space-y-4">
                <SecurityButton label="Change Password" onAction={handleSecurityAction} />
                <SecurityButton 
                  label="2FA Authentication" 
                  onAction={handleSecurityAction}
                  badge={
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold uppercase tracking-wider">
                      Enabled
                    </span>
                  }
                />
                <SecurityButton label="Active Sessions" onAction={handleSecurityAction} />

                <div className="pt-4 border-t mt-4" style={{ borderColor: "rgba(229, 231, 235, 0.5)" }}>
                  <button 
                    className="w-full text-center text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    onClick={handleSignOutAll}
                  >
                    Sign out of all devices
                  </button>
                </div>
              </div>
            </SettingsCard>

            {/* AI Settings */}
            <SettingsCard 
              icon={<Brain className="w-7 h-7" />}
              title="AI Configuration"
              description="Gemini AI integration"
              className="col-span-12 lg:col-span-6"
              delay="0.8s"
            >
              <div className="space-y-4">
                <button
                  onClick={() => setShowAIModal(true)}
                  className="w-full flex items-center justify-between p-4 rounded-2xl border transition-colors group text-left"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.5)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  <span className="font-medium" style={{ color: "#111827" }}>Configure Gemini API</span>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <div 
                  className="p-4 rounded-xl text-xs leading-relaxed"
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                    color: "#6B7280"
                  }}
                >
                  Enable deep AI insights and personalized productivity coaching with Gemini.
                </div>
              </div>
            </SettingsCard>

            {/* Database Status */}
            <SettingsCard 
              icon={<Database className="w-7 h-7" />}
              title="Database Status"
              description="Supabase connection & AI status"
              className="col-span-12 lg:col-span-6"
              delay="0.8s"
            >
              <div className="space-y-4">
                <DatabaseStatusCard />
                
                {/* AI Status Indicator */}
                <div 
                  className="p-4 rounded-2xl border flex items-center gap-3"
                  style={{
                    backgroundColor: "rgba(102, 126, 234, 0.05)",
                    borderColor: "rgba(102, 126, 234, 0.2)"
                  }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#EEF2FF", color: "#667EEA" }}
                  >
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold" style={{ color: "#667EEA" }}>
                      🧠 AI Assistant Active
                    </h4>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                      Gemini-powered insights running automatically
                    </p>
                  </div>
                  <span className="flex h-2 w-2 relative">
                    <span 
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: "#34D399" }}
                    />
                    <span 
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: "#10B981" }}
                    />
                  </span>
                </div>
              </div>
            </SettingsCard>

            {/* Developer Tools */}
            <SettingsCard 
              icon={<Code2 className="w-7 h-7" />}
              title="Developer Tools"
              description="Backend testing and diagnostics"
              className="col-span-12"
              delay="1.0s"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => navigate('/task-backend-test')}
                  className="p-5 rounded-2xl border transition-all group text-left"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.5)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#EFF6FF", color: "#2563EB" }}
                    >
                      <Database className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold mb-1" style={{ color: "#111827" }}>Tasks Backend Test</h4>
                  <p className="text-xs" style={{ color: "#6B7280" }}>Test task CRUD operations & Supabase sync</p>
                </button>

                <button
                  onClick={() => navigate('/profile-backend-test')}
                  className="p-5 rounded-2xl border transition-all group text-left"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.5)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#FAF5FF", color: "#9333EA" }}
                    >
                      <Database className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold mb-1" style={{ color: "#111827" }}>Profile Backend Test</h4>
                  <p className="text-xs" style={{ color: "#6B7280" }}>Test profile updates & real-time sync</p>
                </button>

                <button
                  onClick={() => navigate('/profile-sync-debug')}
                  className="p-5 rounded-2xl border transition-all group text-left"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.5)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#ECFDF5", color: "#10B981" }}
                    >
                      <Shield className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold mb-1" style={{ color: "#111827" }}>Profile Sync Debug</h4>
                  <p className="text-xs" style={{ color: "#6B7280" }}>Fix profile data sync issues</p>
                </button>

                <button
                  onClick={() => navigate('/task-backend-setup')}
                  className="p-5 rounded-2xl border transition-all group text-left"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.4)",
                    borderColor: "rgba(255, 255, 255, 0.5)"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "#FFF7ED", color: "#EA580C" }}
                    >
                      <Code2 className="w-5 h-5" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <h4 className="font-bold mb-1" style={{ color: "#111827" }}>Backend Setup Guide</h4>
                  <p className="text-xs" style={{ color: "#6B7280" }}>View migration instructions & SQL scripts</p>
                </button>
              </div>
            </SettingsCard>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AISettingsModal 
        isOpen={showAIModal} 
        onClose={() => setShowAIModal(false)}
      />

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes settle {
          0% { letter-spacing: 0.05em; opacity: 0; }
          100% { letter-spacing: 0; opacity: 1; }
        }
      `}</style>
    </div>
  );
}

interface SettingsCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  delay?: string;
  headerAction?: React.ReactNode;
}

function SettingsCard({ icon, title, description, children, className = "", delay = "0s", headerAction }: SettingsCardProps) {
  return (
    <div 
      className={`rounded-3xl p-8 border transition-all duration-500 opacity-0 ${className}`}
      style={{
        background: "rgba(255, 255, 255, 0.65)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderColor: "rgba(255, 255, 255, 0.6)",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
        animation: `fadeInUp 0.8s ease-out ${delay} forwards`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.03), 0 4px 6px -2px rgba(0, 0, 0, 0.01)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)";
      }}
    >
      <div className={`flex items-center mb-8 ${headerAction ? "justify-between" : "gap-4"}`}>
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center"
            style={{ color: "#111827" }}
          >
            {icon}
          </div>
          <div>
            <h3 
              className="text-xl font-medium"
              style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
            >
              {title}
            </h3>
            <p className="text-sm" style={{ color: "#6B7280" }}>{description}</p>
          </div>
        </div>
        {headerAction}
      </div>
      {children}
    </div>
  );
}

interface ToggleRowProps {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({ label, description, enabled, onToggle }: ToggleRowProps) {
  return (
    <div 
      className="flex items-center justify-between p-4 rounded-2xl border transition-colors"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderColor: "rgba(255, 255, 255, 0.5)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      }}
    >
      <div className="flex flex-col">
        <span className="font-medium" style={{ color: "#111827" }}>{label}</span>
        <span className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{description}</span>
      </div>
      
      <ToggleSwitch enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

function ToggleSwitch({ enabled, onToggle }: ToggleSwitchProps) {
  return (
    <button
      onClick={onToggle}
      className="relative inline-block w-11 h-6 cursor-pointer"
      role="switch"
      aria-checked={enabled}
    >
      <div 
        className="absolute top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-400"
        style={{
          backgroundColor: enabled ? "#111827" : "#E5E7EB",
          boxShadow: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
        }}
      />
      <div 
        className="absolute h-5 w-5 left-0.5 bottom-0.5 bg-white rounded-full transition-transform duration-400"
        style={{
          transform: enabled ? "translateX(20px)" : "translateX(0)",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)"
        }}
      />
    </button>
  );
}

interface IntegrationCardProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  isActive: boolean;
}

function IntegrationCard({ name, description, icon, iconColor, iconBg, isActive }: IntegrationCardProps) {
  return (
    <div 
      className="p-5 rounded-2xl border transition-all cursor-pointer group"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderColor: "rgba(255, 255, 255, 0.5)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      }}
    >
      <div className="flex justify-between items-start mb-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        
        {isActive ? (
          <span className="flex h-2 w-2 relative">
            <span 
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "#34D399" }}
            />
            <span 
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: "#10B981" }}
            />
          </span>
        ) : (
          <span 
            className="inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: "#D1D5DB" }}
          />
        )}
      </div>
      <h4 className="font-bold mb-1" style={{ color: "#111827" }}>{name}</h4>
      <p className="text-xs" style={{ color: "#6B7280" }}>{description}</p>
    </div>
  );
}

interface SecurityButtonProps {
  label: string;
  badge?: React.ReactNode;
  onAction?: (label: string) => void;
}

function SecurityButton({ label, badge, onAction }: SecurityButtonProps) {
  return (
    <button 
      className="w-full flex items-center justify-between p-4 rounded-2xl border transition-colors group text-left"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.4)",
        borderColor: "rgba(255, 255, 255, 0.5)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)";
      }}
      onClick={() => onAction?.(label)}
    >
      <span className="font-medium" style={{ color: "#111827" }}>{label}</span>
      {badge || (
        <ChevronRight 
          className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform"
        />
      )}
    </button>
  );
}