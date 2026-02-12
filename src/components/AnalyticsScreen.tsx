import { useState } from "react";
import { 
  Brain, 
  PieChart, 
  Target,
  Filter,
  Mail,
  MessageSquare,
  Users,
  RotateCw,
  TrendingUp,
  Clock
} from "lucide-react";
import { TimelineScreen } from "./TimelineScreen";
import { useProfile } from "../context/ProfileContext";
import { toast } from "sonner@2.0.3";
import { NotificationCenter } from "./NotificationCenter";
import { useAnalytics } from "../hooks/useAnalytics";

type TimeRange = "daily" | "weekly" | "monthly";

export function AnalyticsScreen() {
  const [timeRange, setTimeRange] = useState<TimeRange>("weekly");
  const [activeTab, setActiveTab] = useState<"analytics" | "timeline">("analytics");
  const { profile } = useProfile();
  
  const { metrics, chartData, cognitiveLoadBars, generateChartPath, lastUpdated, refresh, loading } = useAnalytics(timeRange);

  const handleRefreshData = () => {
    refresh();
    toast.success("Refreshing analytics data...", {
      description: "Latest data has been updated."
    });
  };

  const handleFilterChart = () => {
    toast.info("Chart Filters", {
      description: "Toggle between Deep Work only, Shallow Work only, or both metrics."
    });
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 overflow-hidden flex flex-col items-center justify-center" style={{ backgroundColor: "#F8F9FA" }}>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
            Executive Suite
          </h1>
          <p 
            className="text-2xl italic"
            style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
          >
            Analytics Overview
          </p>
        </div>

        <div className="flex items-center gap-6">
          {/* Live Data Indicator */}
          <div 
            className="flex items-center gap-4 px-5 py-2 rounded-full border shadow-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.4)",
              borderColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(4px)"
            }}
          >
            <div className="flex items-center gap-2 border-r border-gray-300 pr-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "#111827" }}>
                Live Data
              </span>
            </div>
            <div 
              className="text-xs italic"
              style={{ fontFamily: "'Playfair Display', serif", color: "#6B7280" }}
            >
              Updated just now
            </div>
          </div>

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

      {/* Tab Navigation Bar */}
      <div 
        className="border-b px-10 py-4 sticky top-24 z-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderColor: "rgba(255, 255, 255, 0.5)"
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div 
            className="inline-flex p-1 rounded-xl shadow-sm"
            style={{
              backgroundColor: "rgba(243, 244, 246, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.8)"
            }}
          >
            <button
              onClick={() => setActiveTab("analytics")}
              className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2"
              style={{
                backgroundColor: activeTab === "analytics" ? "#111827" : "transparent",
                color: activeTab === "analytics" ? "white" : "#6B7280",
                boxShadow: activeTab === "analytics" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none"
              }}
            >
              <TrendingUp className="w-4 h-4" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab("timeline")}
              className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 flex items-center gap-2"
              style={{
                backgroundColor: activeTab === "timeline" ? "#111827" : "transparent",
                color: activeTab === "timeline" ? "white" : "#6B7280",
                boxShadow: activeTab === "timeline" ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none"
              }}
            >
              <Clock className="w-4 h-4" />
              Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === "timeline" ? (
        <TimelineScreen />
      ) : (
      <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Title & Time Range Selector */}
          <div 
            className="flex justify-between items-end mb-4 opacity-0"
            style={{ animation: "fadeInUp 0.8s ease-out forwards" }}
          >
            <div>
              <h2 
                className="text-3xl font-medium tracking-tight leading-tight"
                style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
              >
                Weekly Performance
              </h2>
              <p className="mt-1 text-sm font-light tracking-wide opacity-80" style={{ color: "#6B7280" }}>
                Insight into cognitive output and focus depth.
              </p>
            </div>
            <div className="flex gap-3">
              {(["daily", "weekly", "monthly"] as TimeRange[]).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className="px-4 py-2 border rounded-lg text-sm font-medium transition-colors shadow-sm capitalize"
                  style={{
                    backgroundColor: timeRange === range ? "#111827" : "rgba(255, 255, 255, 0.5)",
                    borderColor: timeRange === range ? "#111827" : "white",
                    color: timeRange === range ? "white" : "#6B7280",
                    boxShadow: timeRange === range ? "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" : "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
                  }}
                  onMouseEnter={(e) => {
                    if (timeRange !== range) e.currentTarget.style.color = "#111827";
                  }}
                  onMouseLeave={(e) => {
                    if (timeRange !== range) e.currentTarget.style.color = "#6B7280";
                  }}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Deep Work Ratio */}
            <div 
              className="p-6 rounded-3xl border opacity-0"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.8s ease-out 0.1s forwards",
                transition: "all 0.5s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)";
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Brain className="w-6 h-6" style={{ color: "#111827" }} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                  metrics.trends.deepWorkChange >= 0 
                    ? 'text-green-600 bg-green-50 border-green-100' 
                    : 'text-red-600 bg-red-50 border-red-100'
                }`}>
                  {metrics.trends.deepWorkChange >= 0 ? '+' : ''}{metrics.trends.deepWorkChange}%
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#6B7280" }}>
                  Deep Work Ratio
                </h3>
                <p 
                  className="text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  {metrics.deepWorkRatio}<span className="text-xl align-top opacity-60" style={{ color: "#6B7280" }}>%</span>
                </p>
              </div>
              <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full relative transition-all duration-500"
                  style={{ width: `${metrics.deepWorkRatio}%`, backgroundColor: "#111827" }}
                >
                  <div 
                    className="absolute right-0 top-0 bottom-0 w-2 bg-white/30"
                    style={{ filter: "blur(1px)" }}
                  ></div>
                </div>
              </div>
              <p className="mt-3 text-xs font-medium" style={{ color: "#6B7280" }}>
                Target: 65% • <span style={{ color: metrics.deepWorkRatio >= 65 ? "#111827" : "#EF4444" }}>
                  {metrics.deepWorkRatio >= 65 ? "Exceeded" : "Below Target"}
                </span>
              </p>
            </div>

            {/* Cognitive Load */}
            <div 
              className="p-6 rounded-3xl border opacity-0"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.8s ease-out 0.2s forwards",
                transition: "all 0.5s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)";
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <PieChart className="w-6 h-6" style={{ color: "#111827" }} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                  metrics.cognitiveLoad >= 7 
                    ? 'text-orange-600 bg-orange-50 border-orange-100' 
                    : metrics.cognitiveLoad >= 4
                    ? 'text-yellow-600 bg-yellow-50 border-yellow-100'
                    : 'text-green-600 bg-green-50 border-green-100'
                }`}>
                  {metrics.cognitiveLoad >= 7 ? 'High' : metrics.cognitiveLoad >= 4 ? 'Medium' : 'Low'}
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#6B7280" }}>
                  Cognitive Load
                </h3>
                <p 
                  className="text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  {metrics.cognitiveLoad}<span className="text-xl align-top opacity-60" style={{ color: "#6B7280" }}>/10</span>
                </p>
              </div>
              <div className="mt-6 flex items-end gap-1 h-8">
                {cognitiveLoadBars.map((height, i) => (
                  <div 
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${height}%`,
                      backgroundColor: i === 4 ? "#111827" : `rgba(17, 24, 39, ${0.2 + (height / 100) * 0.4})`,
                      boxShadow: i === 4 ? "0 0 10px rgba(17,24,39,0.3)" : "none"
                    }}
                  ></div>
                ))}
              </div>
              <p className="mt-3 text-xs font-medium" style={{ color: "#6B7280" }}>
                Peak at {metrics.peakPerformanceTime} • <span className={metrics.cognitiveLoad >= 7 ? "text-orange-600" : "text-gray-600"}>
                  {metrics.cognitiveLoad >= 7 ? 'Take a break' : 'Steady pace'}
                </span>
              </p>
            </div>

            {/* Focus Score */}
            <div 
              className="p-6 rounded-3xl border opacity-0"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.8s ease-out 0.3s forwards",
                transition: "all 0.5s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)";
              }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100">
                  <Target className="w-6 h-6" style={{ color: "#111827" }} />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                  metrics.trends.focusScoreChange >= 0 
                    ? 'text-green-600 bg-green-50 border-green-100' 
                    : 'text-red-600 bg-red-50 border-red-100'
                }`}>
                  {metrics.trends.focusScoreChange >= 0 ? '+' : ''}{metrics.trends.focusScoreChange}%
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "#6B7280" }}>
                  Focus Score
                </h3>
                <p 
                  className="text-4xl font-bold"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  {metrics.focusScore}
                </p>
              </div>
              <div className="mt-6 relative h-10 w-full overflow-hidden">
                <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 30">
                  <path 
                    d="M0,30 Q20,28 30,15 T60,20 T100,5" 
                    fill="none" 
                    stroke="#111827" 
                    strokeWidth="2"
                    style={{
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }}
                  />
                  <path 
                    d="M0,30 Q20,28 30,15 T60,20 T100,5 V30 H0 Z" 
                    fill="url(#gradientChart)" 
                    opacity="0.1"
                  />
                  <defs>
                    <linearGradient id="gradientChart" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" style={{ stopColor: "#111827", stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: "#111827", stopOpacity: 0 }} />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="mt-3 text-xs font-medium" style={{ color: "#6B7280" }}>
                {metrics.trends.focusScoreChange >= 0 ? 'Improving' : 'Declining'} trend • <span style={{ color: metrics.focusScore >= 800 ? "#111827" : "#6B7280" }}>
                  {metrics.focusScore >= 800 ? 'Excellent' : 'Good'}
                </span>
              </p>
            </div>
          </div>

          {/* Focus Trend Chart */}
          <div 
            className="rounded-3xl p-8 border opacity-0"
            style={{
              background: "rgba(255, 255, 255, 0.55)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              borderColor: "rgba(255, 255, 255, 0.6)",
              boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
              animation: "fadeInUp 0.8s ease-out 0.4s forwards"
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <h3 
                  className="text-xl italic font-medium"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  Focus Trend
                </h3>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#111827" }}></span>
                  <span style={{ color: "#111827" }}>Deep Work</span>
                  <span className="w-2 h-2 rounded-full bg-gray-300 ml-2"></span>
                  <span style={{ color: "#6B7280" }}>Shallow Work</span>
                </div>
              </div>
              <button 
                className="p-2 rounded-full transition-colors"
                style={{ color: "#6B7280" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "#111827";
                  e.currentTarget.style.backgroundColor = "rgba(0, 0, 0, 0.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "#6B7280";
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
                onClick={handleFilterChart}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full h-80 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                {/* Grid */}
                <g className="opacity-30">
                  <line x1="0" y1="50" x2="800" y2="50" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="0" y1="125" x2="800" y2="125" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="0" y1="200" x2="800" y2="200" stroke="#E5E7EB" strokeDasharray="4 4" />
                  <line x1="0" y1="275" x2="800" y2="275" stroke="#E5E7EB" strokeDasharray="4 4" />
                </g>

                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#111827" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#111827" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Shallow Work Line */}
                <path 
                  d="M0,250 C100,240 150,200 200,220 C300,260 350,230 400,210 C500,190 550,220 600,200 C700,180 750,210 800,200" 
                  fill="none" 
                  stroke="#E5E7EB" 
                  strokeDasharray="4 4" 
                  strokeWidth="2"
                />

                {/* Deep Work Line */}
                <path 
                  d="M0,200 C100,180 150,100 200,120 C300,140 350,80 400,60 C500,40 550,90 600,70 C700,50 750,40 800,30" 
                  fill="none" 
                  stroke="#111827" 
                  strokeWidth="3"
                  style={{
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    filter: "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))"
                  }}
                />

                {/* Area Fill */}
                <path 
                  d="M0,200 C100,180 150,100 200,120 C300,140 350,80 400,60 C500,40 550,90 600,70 C700,50 750,40 800,30 V300 H0 Z" 
                  fill="url(#areaGradient)"
                  className="opacity-0"
                  style={{ animation: "fadeInUp 0.8s ease-out 1s forwards" }}
                />

                {/* Data Points */}
                <g 
                  className="opacity-0"
                  style={{ animation: "fadeInUp 0.8s ease-out 1.2s forwards" }}
                >
                  <circle cx="200" cy="120" r="4" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
                  
                  {/* Highlighted Point with Pulsing Animation */}
                  <circle cx="400" cy="60" r="6" fill="#111827" stroke="rgba(255,255,255,0.5)" strokeWidth="4">
                    <animate attributeName="r" values="6;8;6" dur="3s" repeatCount="indefinite" />
                  </circle>
                  
                  {/* Tooltip */}
                  <g transform="translate(365, 10)">
                    <rect x="0" y="0" width="70" height="30" rx="8" fill="#111827" />
                    <text 
                      x="35" 
                      y="20" 
                      textAnchor="middle" 
                      fill="white" 
                      fontFamily="Inter" 
                      fontSize="12" 
                      fontWeight="bold"
                    >
                      4.2 hrs
                    </text>
                    <path d="M35,30 L30,36 L40,36 Z" fill="#111827" />
                  </g>

                  <circle cx="600" cy="70" r="4" fill="#FFFFFF" stroke="#111827" strokeWidth="2" />
                </g>
              </svg>

              <div className="flex justify-between text-xs font-medium uppercase tracking-wider mt-2 px-2" style={{ color: "#6B7280" }}>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>

          {/* Bottom Row: Interruption Sources & Peak Performance */}
          <div className="grid grid-cols-12 gap-6 pb-8">
            {/* Interruption Sources */}
            <div 
              className="col-span-12 lg:col-span-7 rounded-3xl p-8 opacity-0"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.8s ease-out 0.5s forwards"
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 
                  className="text-lg italic font-medium"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  Interruption Sources
                </h3>
                <span className="text-xs font-bold uppercase tracking-widest border border-gray-200 rounded-full px-3 py-1" style={{ color: "#6B7280" }}>
                  Last 7 Days
                </span>
              </div>

              <div className="space-y-5">
                {[
                  { icon: Mail, label: "Email", count: metrics.interruptions.email, percent: Math.round((metrics.interruptions.email / (metrics.interruptions.email + metrics.interruptions.slack + metrics.interruptions.meetings)) * 100) || 0, color: "#1F2937" },
                  { icon: MessageSquare, label: "Slack", count: metrics.interruptions.slack, percent: Math.round((metrics.interruptions.slack / (metrics.interruptions.email + metrics.interruptions.slack + metrics.interruptions.meetings)) * 100) || 0, color: "#4B5563" },
                  { icon: Users, label: "Meetings", count: metrics.interruptions.meetings, percent: Math.round((metrics.interruptions.meetings / (metrics.interruptions.email + metrics.interruptions.slack + metrics.interruptions.meetings)) * 100) || 0, color: "#9CA3AF" }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="group">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium flex items-center gap-2" style={{ color: "#111827" }}>
                          <Icon className="w-[18px] h-[18px]" style={{ color: "#6B7280" }} />
                          {item.label}
                        </span>
                        <span className="font-bold" style={{ color: "#111827" }}>{item.count} switches</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-colors duration-300"
                          style={{ 
                            width: `${item.percent}%`,
                            backgroundColor: item.color
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#111827";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = item.color;
                          }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Peak Performance */}
            <div 
              className="col-span-12 lg:col-span-5 rounded-3xl p-8 flex flex-col justify-between opacity-0"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderColor: "rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.8s ease-out 0.6s forwards"
              }}
            >
              <h3 
                className="text-lg italic font-medium mb-4"
                style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
              >
                Peak Performance
              </h3>

              <div className="flex items-center justify-center relative py-4">
                <div 
                  className="relative w-48 h-48 rounded-full border border-gray-200 flex items-center justify-center"
                  style={{
                    background: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(4px)"
                  }}
                >
                  <div 
                    className="absolute inset-0 rounded-full border-gray-50 transform rotate-45"
                    style={{
                      borderWidth: "10px",
                      borderTopColor: "rgba(17, 24, 39, 0.8)",
                      borderRightColor: "rgba(17, 24, 39, 0.4)",
                      borderBottomColor: "#F9FAFB",
                      borderLeftColor: "#F9FAFB"
                    }}
                  ></div>
                  <div className="text-center relative z-10">
                    <span 
                      className="block text-3xl font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                    >
                      {metrics.peakPerformanceTime}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#6B7280" }}>
                      {parseInt(metrics.peakPerformanceTime.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                    </span>
                  </div>
                </div>

                {/* Rotating Orbit */}
                <div 
                  className="absolute w-56 h-56 border border-dashed border-gray-300 rounded-full"
                  style={{
                    animation: "spin 20s linear infinite"
                  }}
                >
                  <div 
                    className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                    style={{
                      backgroundColor: "#111827",
                      boxShadow: "0 0 15px rgba(0, 0, 0, 0.1)"
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-medium" style={{ color: "#6B7280" }}>
                  Your most productive window is between <span className="font-bold" style={{ color: "#111827" }}>9 AM - 11 AM</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Refresh Data FAB */}
      <div className="fixed bottom-10 right-10 z-50">
        <button 
          className="rounded-full px-6 py-4 shadow-lg flex items-center gap-3 transition-all duration-500 hover:scale-105 active:scale-95 group border-none ring-1"
          style={{
            backgroundColor: "rgba(17, 24, 39, 0.9)",
            color: "white",
            ringColor: "rgba(255, 255, 255, 0.2)",
            backdropFilter: "blur(12px)",
            animation: "breathe 3s ease-in-out infinite",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "black";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(17, 24, 39, 0.3), 0 0 60px rgba(17, 24, 39, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(17, 24, 39, 0.9)";
            e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
          }}
          onClick={handleRefreshData}
        >
          <RotateCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          <span className="font-bold tracking-wide text-xs uppercase">Refresh Data</span>
        </button>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); box-shadow: 0 0 20px rgba(17, 24, 39, 0.2); }
          50% { transform: scale(1.03); box-shadow: 0 0 35px rgba(17, 24, 39, 0.4); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}