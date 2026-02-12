import { useState, useEffect } from "react";
import { Database, CheckCircle2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { supabaseService, DatabaseStatus } from "../services/supabase-service";
import { toast } from "sonner@2.0.3";

export function DatabaseStatusCard() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSettingUp, setIsSettingUp] = useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const dbStatus = await supabaseService.checkDatabaseStatus();
      setStatus(dbStatus);
    } catch (error) {
      console.error("Failed to check database status:", error);
      // Set a default error state instead of showing toast
      setStatus({
        configured: false,
        ready: false,
        tables: {},
        error: error instanceof Error ? error.message : "Unable to connect to database"
      });
    } finally {
      setIsChecking(false);
    }
  };

  const setupDatabase = async () => {
    setIsSettingUp(true);
    try {
      const result = await supabaseService.setupDatabase();
      if (result.success) {
        toast.success("Database tables created successfully!");
        await checkStatus(); // Refresh status
      } else {
        toast.error(`Setup failed: ${result.error}`);
      }
    } catch (error) {
      console.error("Database setup error:", error);
      toast.error("Failed to setup database");
    } finally {
      setIsSettingUp(false);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const getStatusIcon = () => {
    if (!status || !status.configured) {
      return <XCircle className="w-5 h-5 text-red-500" />;
    }
    if (status.ready) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    return <AlertCircle className="w-5 h-5 text-orange-500" />;
  };

  const getStatusText = () => {
    if (!status || !status.configured) {
      return "Not Configured";
    }
    if (status.ready) {
      return "All Tables Ready";
    }
    return `Missing Tables: ${status.missingTables?.length || 0}`;
  };

  const getStatusColor = () => {
    if (!status || !status.configured) return "#EF4444";
    if (status.ready) return "#10B981";
    return "#F59E0B";
  };

  return (
    <div className="space-y-4">
      {/* Status Header */}
      <div 
        className="p-4 rounded-2xl border transition-all"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.4)",
          borderColor: "rgba(255, 255, 255, 0.5)"
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <div className="font-medium" style={{ color: "#111827" }}>
                {getStatusText()}
              </div>
              <div className="text-xs" style={{ color: "#6B7280" }}>
                {status?.ready ? "Cloud sync operational" : "Setup required"}
              </div>
            </div>
          </div>
          <button
            onClick={checkStatus}
            disabled={isChecking}
            className="p-2 rounded-lg transition-colors"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5)",
              color: "#6B7280"
            }}
            onMouseEnter={(e) => {
              if (!isChecking) {
                e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                e.currentTarget.style.color = "#111827";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
              e.currentTarget.style.color = "#6B7280";
            }}
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Progress Bar */}
        {status && status.configured && (
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500"
              style={{
                width: status.ready ? "100%" : `${(Object.values(status.tables).filter(Boolean).length / Object.keys(status.tables).length) * 100}%`,
                backgroundColor: getStatusColor()
              }}
            />
          </div>
        )}
      </div>

      {/* Table Details */}
      {status && status.configured && !status.ready && (
        <div 
          className="p-4 rounded-xl space-y-2"
          style={{
            backgroundColor: "rgba(255, 243, 205, 0.3)",
            border: "1px solid rgba(251, 191, 36, 0.3)"
          }}
        >
          <div className="text-sm font-medium" style={{ color: "#92400E" }}>
            Missing Tables:
          </div>
          <div className="flex flex-wrap gap-2">
            {status.missingTables?.map((table) => (
              <span
                key={table}
                className="px-2 py-1 rounded-lg text-xs font-mono"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  color: "#DC2626"
                }}
              >
                {table}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Success Message */}
      {status && status.ready && (
        <div 
          className="p-4 rounded-xl"
          style={{
            backgroundColor: "rgba(209, 250, 229, 0.3)",
            border: "1px solid rgba(34, 197, 94, 0.3)"
          }}
        >
          <div className="flex items-center gap-2 text-sm" style={{ color: "#065F46" }}>
            <CheckCircle2 className="w-4 h-4" />
            <span>All database tables exist. Cloud sync is active.</span>
          </div>
        </div>
      )}

      {/* Schema Outdated Warning */}
      {status && status.ready && (
        <div 
          className="p-4 rounded-xl"
          style={{
            backgroundColor: "rgba(254, 243, 199, 0.5)",
            border: "1px solid rgba(251, 191, 36, 0.3)"
          }}
        >
          <div className="text-sm font-medium mb-2" style={{ color: "#92400E" }}>
            ⚠️ Schema Update Available
          </div>
          <div className="text-xs mb-3" style={{ color: "#78350F" }}>
            If you're seeing "column does not exist" errors in the console, your database schema may be outdated. Click the button below to recreate all tables with the latest schema.
          </div>
          <button
            onClick={setupDatabase}
            disabled={isSettingUp}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border font-medium transition-all text-sm"
            style={{
              backgroundColor: isSettingUp ? "rgba(255, 255, 255, 0.4)" : "#F59E0B",
              borderColor: isSettingUp ? "rgba(255, 255, 255, 0.5)" : "#F59E0B",
              color: "white"
            }}
            onMouseEnter={(e) => {
              if (!isSettingUp) {
                e.currentTarget.style.backgroundColor = "#D97706";
                e.currentTarget.style.boxShadow = "0 0 15px rgba(245, 158, 11, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isSettingUp) {
                e.currentTarget.style.backgroundColor = "#F59E0B";
                e.currentTarget.style.boxShadow = "none";
              }
            }}
          >
            <RefreshCw className={`w-4 h-4 ${isSettingUp ? "animate-spin" : ""}`} />
            {isSettingUp ? "Updating Schema..." : "Update Database Schema"}
          </button>
        </div>
      )}

      {/* Setup Button */}
      {status && status.configured && !status.ready && (
        <button
          onClick={setupDatabase}
          disabled={isSettingUp}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border font-medium transition-all"
          style={{
            backgroundColor: isSettingUp ? "rgba(255, 255, 255, 0.4)" : "#111827",
            borderColor: isSettingUp ? "rgba(255, 255, 255, 0.5)" : "#111827",
            color: isSettingUp ? "#6B7280" : "white"
          }}
          onMouseEnter={(e) => {
            if (!isSettingUp) {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(17, 24, 39, 0.25)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <Database className={`w-5 h-5 ${isSettingUp ? "animate-pulse" : ""}`} />
          {isSettingUp ? "Setting up..." : "Setup Database Tables"}
        </button>
      )}

      {/* Error State */}
      {status && !status.configured && (
        <div 
          className="p-4 rounded-xl"
          style={{
            backgroundColor: "rgba(254, 226, 226, 0.5)",
            border: "1px solid rgba(239, 68, 68, 0.3)"
          }}
        >
          <div className="text-sm font-medium mb-2" style={{ color: "#991B1B" }}>
            Database Not Configured
          </div>
          <div className="text-xs" style={{ color: "#7F1D1D" }}>
            {status.error || "Supabase credentials are not configured on the server. Please contact support."}
          </div>
        </div>
      )}

      {/* Info Box */}
      <div 
        className="p-4 rounded-xl text-xs leading-relaxed"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.02)",
          color: "#6B7280"
        }}
      >
        <strong>Cloud Sync:</strong> KAAL uses Supabase for multi-device synchronization. 
        All data is saved locally first, then synced to the cloud automatically. 
        {!status?.ready && " Run setup to create required database tables."}
      </div>
    </div>
  );
}