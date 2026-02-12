import { useState, useEffect } from "react";
import { Flame, MoreHorizontal, Zap, Users, ChevronLeft, ChevronRight, LinkIcon, Timer, CheckCircle } from "lucide-react";
import { NudgeSystem } from "./NudgeSystem";
import { FocusFlowModal } from "./FocusFlowModal";
import { useNavigate } from "react-router";
import { AIControlCenter } from "./AIControlCenter";
import { useAIContext } from "../context/AIContext";
import { useProfile } from "../context/ProfileContext";
import { storageService } from "../services/storage-service";
import { toast } from "sonner@2.0.3";
import { NotificationCenter } from "./NotificationCenter";
import { useTasks } from "../hooks/useTasks";

export function PremiumHomeDashboard() {
  const [currentTime] = useState(new Date());
  const [showFocusFlowModal, setShowFocusFlowModal] = useState(false);
  const [timelineDay, setTimelineDay] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0, lastActive: '' });
  const [todayStats, setTodayStats] = useState({
    focusMinutes: 0,
    tasksCompleted: 0,
    sessionsCount: 0
  });
  const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
  const monthName = currentTime.toLocaleDateString('en-US', { month: 'long' });
  const day = currentTime.getDate();
  const navigate = useNavigate();
  const { startSession } = useAIContext();
  const { profile } = useProfile();
  
  // Use Supabase backend for tasks
  const { tasks } = useTasks();

  // Get time-based greeting
  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
  };

  const handleMoreOptions = () => {
    toast.info("More options", {
      description: "Customize your dashboard view and widgets."
    });
  };

  const handleTimelineNav = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setTimelineDay(prev => prev - 1);
      toast.info("Viewing previous day's timeline");
    } else {
      setTimelineDay(prev => prev + 1);
      toast.info("Viewing next day's timeline");
    }
  };

  // Load data from storage
  useEffect(() => {
    const loadData = () => {
      const streakData = storageService.getStreak();
      setStreak(streakData);

      const today = new Date().toISOString().split('T')[0];
      const stats = storageService.getDailyStats(today);
      setTodayStats({
        focusMinutes: stats.focusMinutes,
        tasksCompleted: stats.tasksCompleted,
        sessionsCount: stats.sessionsCount
      });
    };

    loadData();
    
    // Refresh every minute
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic progress
  const allTasks = tasks || [];
  const completedTasks = allTasks.filter(t => t.status === 'completed');
  const activeTasks = allTasks.filter(t => t.status !== 'completed');
  const totalTasks = allTasks.length;
  const completionPercent = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;
  const focusGoalHours = 6;
  const focusMinutes = todayStats.focusMinutes;
  const focusHours = Math.floor(focusMinutes / 60);
  const focusMins = focusMinutes % 60;
  const focusPercent = Math.min(100, Math.round((focusMinutes / (focusGoalHours * 60)) * 100));
  const progressDashoffset = 628 - (628 * completionPercent / 100);
  const progressAngle = (completionPercent / 100) * 360;

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth" style={{ backgroundColor: "#F8F9FA" }}>
      {/* AI Nudging System */}
      <NudgeSystem isActive={true} sessionDuration={0} />
      
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
            style={{ 
              color: "#6B7280",
              fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            }}
          >
            Dashboard
          </h1>
          <p 
            className="text-2xl italic"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              color: "#111827"
            }}
          >
            {dayName}, {monthName} {day}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.6)",
              backdropFilter: "blur(4px)",
              borderColor: "rgba(255, 255, 255, 0.8)"
            }}
          >
            <Flame className="w-4 h-4 text-orange-600 fill-orange-600" style={{ filter: "drop-shadow(0 0 10px rgba(234, 88, 12, 0.3))" }} />
            <span className="text-xs font-bold tracking-wide" style={{ color: "#111827" }}>
              {streak.current} DAY STREAK
            </span>
          </div>
          
          <div className="h-10 w-px bg-gray-200"></div>
          
          <NotificationCenter />
          
          <div 
            className="w-10 h-10 rounded-full ring-2 ring-white shadow-lg overflow-hidden cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img 
              alt="User" 
              className="w-full h-full object-cover" 
              src={profile.profileImage}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-10">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Title Section */}
          <div className="flex justify-between items-end flex-wrap gap-6">
            <div>
              <h2 
                className="text-5xl font-medium tracking-tight leading-tight"
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "#111827",
                  animation: "settle 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards"
                }}
              >
                {getGreeting()}, <span className="italic">{(profile.fullName || 'there').split(' ')[0]}.</span>
              </h2>
              <p 
                className="mt-3 text-lg font-light tracking-wide max-w-lg"
                style={{
                  color: "#6B7280",
                  animation: "fadeInUp 0.8s ease-out 0.2s forwards",
                  opacity: 0
                }}
              >
                Here's a curated overview of your workspace activity for today.
              </p>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-8">
            {/* Today's Progress Card */}
            <div 
              className="col-span-12 lg:col-span-8 rounded-3xl p-8 relative transition-all duration-500 hover:shadow-lg"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.4)",
                animation: "fadeInUp 0.8s ease-out 0.3s forwards",
                opacity: 0
              }}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 
                  className="text-xl font-medium italic"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  Today's Progress
                </h3>
                <button className="p-2 hover:bg-black/5 rounded-full transition-colors" style={{ color: "#6B7280" }} onClick={handleMoreOptions}>
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-12 items-center">
                {/* Circular Progress */}
                <div className="relative w-56 h-56 flex-shrink-0">
                  <div 
                    className="absolute inset-0 bg-gray-200 rounded-full blur-2xl opacity-20 transform scale-90"
                  ></div>
                  <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 224 224">
                    <defs>
                      <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#374151" stopOpacity="1" />
                        <stop offset="100%" stopColor="#111827" stopOpacity="1" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    <circle 
                      cx="112" 
                      cy="112" 
                      r="100" 
                      fill="none" 
                      stroke="rgba(0,0,0,0.04)" 
                      strokeWidth="8"
                    />
                    <circle 
                      cx="112" 
                      cy="112" 
                      r="100" 
                      fill="none" 
                      stroke="url(#gradientStroke)" 
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray="628"
                      strokeDashoffset={progressDashoffset}
                      filter="url(#glow)"
                      className="transition-all duration-1000 ease-out"
                    />
                    <circle 
                      cx="112" 
                      cy="112" 
                      r="4" 
                      fill="#111827"
                      style={{
                        transformOrigin: "112px 112px",
                        transform: `rotate(${progressAngle}deg) translate(100px)`,
                        filter: "drop-shadow(0 0 8px rgba(17,24,39,0.8))"
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                    <span 
                      className="text-5xl font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                    >
                      {completionPercent}<span className="text-2xl align-top">%</span>
                    </span>
                    <span 
                      className="text-[10px] font-bold tracking-widest uppercase mt-2"
                      style={{ color: "#6B7280" }}
                    >
                      Completed
                    </span>
                  </div>
                </div>

                {/* Progress Details */}
                <div className="flex-1 w-full space-y-8">
                  <div className="flex justify-between items-center text-sm border-b border-gray-100 pb-2">
                    <span className="font-medium" style={{ color: "#6B7280" }}>Focus Goal</span>
                    <span className="font-bold" style={{ color: "#111827" }}>
                      {focusHours}h {focusMins}m <span className="text-gray-300 font-light mx-1">/</span> 6h
                    </span>
                  </div>
                  
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-full rounded-full"
                      style={{ 
                        width: `${focusPercent}%`,
                        backgroundColor: "#111827",
                        boxShadow: "0 0 10px rgba(0,0,0,0.2)"
                      }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-6 pt-2">
                    <div 
                      className="p-5 rounded-2xl border flex flex-col items-center justify-center text-center gap-1 shadow-sm transition-transform hover:-translate-y-1 duration-300"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        borderColor: "white"
                      }}
                    >
                      <span 
                        className="text-3xl font-bold"
                        style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                      >
                        {completedTasks.length}
                      </span>
                      <span 
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: "#6B7280" }}
                      >
                        Done
                      </span>
                    </div>
                    
                    <div 
                      className="p-5 rounded-2xl border flex flex-col items-center justify-center text-center gap-1 shadow-sm transition-transform hover:-translate-y-1 duration-300"
                      style={{ 
                        background: "linear-gradient(to bottom right, rgba(255, 255, 255, 0.6), rgba(239, 246, 255, 0.5))",
                        borderColor: "rgba(191, 219, 254, 0.5)"
                      }}
                    >
                      <span 
                        className="text-3xl font-bold"
                        style={{ fontFamily: "'Playfair Display', serif", color: "#1e3a8a" }}
                      >
                        {todayStats.sessionsCount || (activeTasks.length > 0 ? 1 : 0)}
                      </span>
                      <span 
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: "rgba(30, 58, 138, 0.6)" }}
                      >
                        Active
                      </span>
                    </div>
                    
                    <div 
                      className="p-5 rounded-2xl border flex flex-col items-center justify-center text-center gap-1 shadow-sm transition-transform hover:-translate-y-1 duration-300"
                      style={{ 
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        borderColor: "white"
                      }}
                    >
                      <span 
                        className="text-3xl font-bold"
                        style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                      >
                        {activeTasks.length}
                      </span>
                      <span 
                        className="text-[10px] font-bold tracking-widest uppercase"
                        style={{ color: "#6B7280" }}
                      >
                        ToDo
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Cards */}
            <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
              {/* New Focus Session Button */}
              <button 
                onClick={() => setShowFocusFlowModal(true)}
                className="group flex-1 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left flex items-center gap-6 relative overflow-hidden"
                style={{
                  background: "rgba(255, 255, 255, 0.55)",
                  backdropFilter: "blur(24px) saturate(180%)",
                  WebkitBackdropFilter: "blur(24px) saturate(180%)",
                  border: "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
                  animation: `fadeInUp 0.8s ease-out 0.4s forwards`,
                  opacity: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                  e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.55)";
                  e.currentTarget.style.boxShadow = "0 10px 40px -10px rgba(0,0,0,0.08)";
                }}
              >
                <div 
                  className="absolute right-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "#111827" }}
                ></div>
                <div 
                  className="w-14 h-14 rounded-2xl shadow-sm border flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative z-10"
                  style={{ 
                    backgroundColor: "white",
                    borderColor: "rgba(255, 255, 255, 0.8)",
                    color: "#111827"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "#111827";
                    e.currentTarget.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#111827";
                  }}
                >
                  <Zap className="w-6 h-6" strokeWidth={1.5} fill="currentColor" />
                </div>
                <div className="relative z-10">
                  <h4 className="font-bold text-lg" style={{ color: "#111827" }}>New Focus Session</h4>
                  <p className="text-xs font-medium mt-1 opacity-80" style={{ color: "#6B7280" }}>
                    Build your deep work flow
                  </p>
                </div>
              </button>

              {[
                { icon: Users, title: "Energy", desc: "Log energy levels.", delay: "0.5s", onClick: () => navigate("/energy") }
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button 
                    key={i}
                    onClick={action.onClick}
                    className="group flex-1 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 text-left flex items-center gap-6 relative overflow-hidden"
                    style={{
                      background: "rgba(255, 255, 255, 0.55)",
                      backdropFilter: "blur(24px) saturate(180%)",
                      WebkitBackdropFilter: "blur(24px) saturate(180%)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
                      animation: `fadeInUp 0.8s ease-out ${action.delay} forwards`,
                      opacity: 0
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
                      e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.55)";
                      e.currentTarget.style.boxShadow = "0 10px 40px -10px rgba(0,0,0,0.08)";
                    }}
                  >
                    <div 
                      className="absolute right-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ backgroundColor: "#111827" }}
                    ></div>
                    <div 
                      className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110 relative z-10"
                      style={{ color: "#4B5563" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#111827";
                        e.currentTarget.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                        e.currentTarget.style.color = "#4B5563";
                      }}
                    >
                      <Icon className="w-6 h-6" strokeWidth={1.5} />
                    </div>
                    <div className="relative z-10">
                      <h4 className="font-bold text-lg" style={{ color: "#111827" }}>{action.title}</h4>
                      <p className="text-xs font-medium mt-1 opacity-80" style={{ color: "#6B7280" }}>
                        {action.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Timeline Card */}
            <div 
              className="col-span-12 rounded-3xl p-10 shadow-lg border"
              style={{
                background: "rgba(255, 255, 255, 0.55)",
                backdropFilter: "blur(24px) saturate(180%)",
                WebkitBackdropFilter: "blur(24px) saturate(180%)",
                borderColor: "rgba(255, 255, 255, 0.6)",
                boxShadow: "0 10px 40px -10px rgba(0,0,0,0.08)",
                animation: "fadeInUp 0.8s ease-out 0.7s forwards",
                opacity: 0
              }}
            >
              <div className="flex items-center justify-between mb-10">
                <h3 
                  className="text-xl font-medium italic"
                  style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                >
                  Today's Timeline
                </h3>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-black/5 rounded-full transition-colors" style={{ color: "#6B7280" }} onClick={() => handleTimelineNav('prev')}>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="p-2 hover:bg-black/5 rounded-full transition-colors" style={{ color: "#6B7280" }} onClick={() => handleTimelineNav('next')}>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="relative pl-4">
                <div 
                  className="absolute left-[95px] top-2 bottom-6 w-px border-l border-dashed"
                  style={{ borderColor: "rgba(209, 213, 219, 0.8)" }}
                ></div>
                
                {/* Timeline Item 1 - Done */}
                <div className="flex group mb-10 relative">
                  <div className="w-[95px] pr-8 text-right pt-1">
                    <span 
                      className="block text-sm font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                    >
                      09:00
                    </span>
                    <span 
                      className="block text-[10px] font-bold mt-1 tracking-wider uppercase opacity-70"
                      style={{ color: "#6B7280" }}
                    >
                      15m
                    </span>
                  </div>
                  
                  <div className="relative flex-1">
                    <div 
                      className="absolute left-[-5.5px] top-2 w-3 h-3 rounded-full border-2 border-white z-10"
                      style={{
                        backgroundColor: "#10b981",
                        boxShadow: "0 0 10px rgba(34,197,94,0.4)"
                      }}
                    >
                      <div 
                        className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"
                      ></div>
                    </div>
                    
                    <div 
                      className="ml-8 p-6 rounded-2xl border shadow-sm group-hover:shadow-md transition-all duration-300 flex justify-between items-start"
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.4)",
                        backdropFilter: "blur(4px)",
                        borderColor: "white"
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.6)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.4)"}
                    >
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-bold" style={{ color: "#111827" }}>Team Standup</h4>
                          <span 
                            className="px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider"
                            style={{
                              backgroundColor: "rgba(220, 252, 231, 0.5)",
                              color: "#166534",
                              borderColor: "#bbf7d0"
                            }}
                          >
                            Done
                          </span>
                        </div>
                        <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                          Daily sync with design and engineering team.
                        </p>
                      </div>
                      <div className="flex -space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm"></div>
                        <div className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 2 - Active */}
                <div className="flex group mb-10 relative">
                  <div className="w-[95px] pr-8 text-right pt-1">
                    <span 
                      className="block text-sm font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                    >
                      09:30
                    </span>
                    <span 
                      className="block text-[10px] font-bold mt-1 tracking-wider uppercase opacity-70"
                      style={{ color: "#6B7280" }}
                    >
                      2h
                    </span>
                  </div>
                  
                  <div className="relative flex-1">
                    <div 
                      className="absolute left-[-7.5px] top-1.5 w-4 h-4 rounded-full border-2 border-white z-10"
                      style={{
                        backgroundColor: "#111827",
                        boxShadow: "0 0 20px rgba(17, 24, 39, 0.4)"
                      }}
                    ></div>
                    
                    <div 
                      className="ml-8 p-6 bg-white rounded-2xl border shadow-lg relative overflow-hidden group-hover:shadow-2xl transition-all duration-300"
                      style={{ borderColor: "rgba(255, 255, 255, 0.8)" }}
                    >
                      <div 
                        className="absolute left-0 top-0 bottom-0 w-1.5"
                        style={{ backgroundColor: "#111827" }}
                      ></div>
                      
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-bold text-lg" style={{ color: "#111827" }}>
                          Project Phoenix: UI Design
                        </h4>
                        <span 
                          className="px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider flex items-center gap-2 shadow-sm"
                          style={{
                            backgroundColor: "#eff6ff",
                            color: "#1d4ed8",
                            borderColor: "#dbeafe"
                          }}
                        >
                          <span 
                            className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"
                            style={{ boxShadow: "0 0 8px rgba(59,130,246,0.5)" }}
                          ></span>
                          In Progress
                        </span>
                      </div>
                      
                      <p className="text-sm mb-5 leading-relaxed font-light" style={{ color: "#6B7280" }}>
                        Focusing on dashboard components and interaction patterns for the new release.
                      </p>
                      
                      <div className="flex items-center gap-6 text-xs font-medium" style={{ color: "rgba(107, 114, 128, 0.8)" }}>
                        <span className="flex items-center gap-1.5 hover:text-gray-900 transition-colors cursor-pointer">
                          <LinkIcon className="w-4 h-4" />
                          Figma Link
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Timer className="w-4 h-4" />
                          1h 24m elapsed
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Timeline Item 3 - Upcoming */}
                <div className="flex group opacity-50 hover:opacity-100 transition-opacity duration-300">
                  <div className="w-[95px] pr-8 text-right pt-1">
                    <span 
                      className="block text-sm font-bold"
                      style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
                    >
                      12:00
                    </span>
                    <span 
                      className="block text-[10px] font-bold mt-1 tracking-wider uppercase opacity-70"
                      style={{ color: "#6B7280" }}
                    >
                      1h
                    </span>
                  </div>
                  
                  <div className="relative flex-1">
                    <div 
                      className="absolute left-[-5.5px] top-2 w-3 h-3 rounded-full bg-gray-300 border-2 border-white shadow-sm z-10"
                    ></div>
                    
                    <div 
                      className="ml-8 p-5 bg-transparent border border-dashed rounded-2xl hover:bg-white/20 transition-colors"
                      style={{ borderColor: "rgba(156, 163, 175, 0.5)" }}
                    >
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium text-gray-500">Lunch Break</h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wider">
                          Upcoming
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Checkout Prompt */}
          <div 
            className="rounded-2xl p-6 border flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(251, 191, 36, 0.05))",
              borderColor: "rgba(255, 255, 255, 0.6)",
              animation: "fadeInUp 0.8s ease-out 0.8s forwards",
              opacity: 0
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(251, 191, 36, 0.1))",
                  border: "1px solid rgba(139, 92, 246, 0.2)"
                }}
              >
                <CheckCircle className="w-6 h-6" style={{ color: "#8B5CF6" }} />
              </div>
              <div>
                <h4 className="font-bold text-sm" style={{ color: "#111827" }}>
                  Ready to end your day?
                </h4>
                <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                  Review your achievements and sign off for today
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/daily-checkout")}
              className="px-6 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95 shadow-sm"
              style={{
                backgroundColor: "#111827",
                color: "white"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1F2937";
                e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#111827";
                e.currentTarget.style.boxShadow = "0 1px 2px 0 rgba(0, 0, 0, 0.05)";
              }}
            >
              Daily Checkout
            </button>
          </div>

          <div className="h-24"></div>
        </div>
      </div>

      {/* Global Animations */}
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

      {/* Focus Flow Modal */}
      <FocusFlowModal 
        isOpen={showFocusFlowModal} 
        onClose={() => setShowFocusFlowModal(false)} 
      />
    </div>
  );
}