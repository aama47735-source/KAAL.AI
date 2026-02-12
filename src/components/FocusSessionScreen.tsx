import { useState } from "react";
import { 
  Music, 
  Maximize, 
  X, 
  Pause, 
  FileEdit, 
  Check 
} from "lucide-react";
import { NudgeSystem } from "./NudgeSystem";
import { useNavigate } from "react-router";
import { toast } from "sonner@2.0.3";

export function FocusSessionScreen() {
  const [isHovered, setIsHovered] = useState(false);
  const [sessionDuration] = useState(45);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const navigate = useNavigate();

  const handleMusicToggle = () => {
    setIsMusicPlaying(!isMusicPlaying);
    toast.info(isMusicPlaying ? "Ambient music paused" : "Ambient music playing", {
      description: isMusicPlaying ? "Music has been paused." : "Lo-fi beats for focus."
    });
  };

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
      toast.info("Exited fullscreen mode");
    } else {
      document.documentElement.requestFullscreen().catch(() => {});
      toast.info("Entered fullscreen mode");
    }
  };

  const handleEndSession = () => {
    if (window.confirm("End this focus session?")) {
      toast.success("Focus session ended. Great work!");
      navigate("/dashboard");
    }
  };

  const handleCompleteTask = () => {
    toast.success("Task marked as complete!", {
      description: "Project Phoenix: UI Design has been completed."
    });
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center relative font-sans antialiased"
      style={{
        backgroundColor: "#0F1115",
        color: "#E5E7EB"
      }}
    >
      {/* AI Nudging System - Active during focus sessions */}
      <NudgeSystem isActive={true} sessionDuration={sessionDuration} />
      
      {/* Background Layer */}
      <div 
        className="absolute inset-0 z-0"
        style={{ backgroundColor: "#0F1115" }}
      />

      {/* Ambient Aura - Breathing */}
      <div 
        className="absolute pointer-events-none z-0"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "120vh",
          height: "120vh",
          background: "radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          animation: "breathe 10s ease-in-out infinite alternate"
        }}
      />

      {/* Noise Texture */}
      <div 
        className="absolute inset-0 z-10 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.03%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Top Right Controls */}
      <div 
        className="absolute top-8 right-8 z-50 flex gap-4 opacity-0"
        style={{ animation: "fadeIn 1.5s ease-out 1s forwards" }}
      >
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ color: isMusicPlaying ? "white" : "#9CA3AF" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isMusicPlaying ? "white" : "#9CA3AF";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={handleMusicToggle}
        >
          <Music className="w-5 h-5" />
        </button>
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ color: "#9CA3AF" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9CA3AF";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={handleFullscreen}
        >
          <Maximize className="w-5 h-5" />
        </button>
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors"
          style={{ color: "#9CA3AF" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "white";
            e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9CA3AF";
            e.currentTarget.style.backgroundColor = "transparent";
          }}
          onClick={handleEndSession}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Timer Section */}
      <main 
        className="relative z-30 flex flex-col items-center justify-center w-full h-full opacity-0"
        style={{ animation: "fadeIn 1.5s ease-out forwards" }}
      >
        {/* Timer with Rings */}
        <div 
          className="relative flex items-center justify-center mb-16 group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Outer Background Ring */}
          <svg 
            className="w-[500px] h-[500px] absolute transform -rotate-90 opacity-60 pointer-events-none" 
            viewBox="0 0 100 100"
          >
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="0.5"
            />
          </svg>

          {/* Animated Rings */}
          <svg 
            className="w-[480px] h-[480px] absolute transform -rotate-90 overflow-visible" 
            viewBox="0 0 100 100"
            style={{ filter: "drop-shadow(0 0 15px rgba(255,255,255,0.1))" }}
          >
            <defs>
              <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
              </linearGradient>
            </defs>
            
            {/* Base Ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="none" 
              stroke="rgba(255,255,255,0.02)" 
              strokeWidth="0.3"
            />
            
            {/* Liquid Gradient Ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="46" 
              fill="none" 
              stroke="url(#liquidGradient)" 
              strokeWidth="0.6"
              strokeLinecap="round"
              strokeDasharray="289"
              strokeDashoffset="40"
              style={{
                transformOrigin: "center",
                animation: "liquidSpin 20s linear infinite"
              }}
            />
            
            {/* Slower Spinning Ring */}
            <circle 
              cx="50" 
              cy="50" 
              r="42" 
              fill="none" 
              stroke="rgba(255,255,255,0.03)" 
              strokeWidth="0.2"
              strokeDasharray="260"
              strokeDashoffset="100"
              style={{
                transformOrigin: "center",
                animation: "spin 40s linear infinite"
              }}
            />
          </svg>

          {/* Timer Display */}
          <div 
            className="relative z-10 text-center flex flex-col items-center select-none transition-transform duration-700 ease-out"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)"
            }}
          >
            <h1 
              className="text-[140px] leading-none font-thin tracking-tighter"
              style={{
                fontFamily: "'Playfair Display', serif",
                background: "linear-gradient(135deg, white, #E5E7EB, #9CA3AF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 25px 25px rgba(0, 0, 0, 0.5))"
              }}
            >
              25:00
            </h1>
            <p 
              className="text-xs uppercase tracking-[0.3em] mt-4 font-medium opacity-60"
              style={{ color: "#9CA3AF" }}
            >
              Focus Interval
            </p>
          </div>

          {/* Pause Button Overlay */}
          <div 
            className="absolute inset-0 rounded-full flex items-center justify-center transition-opacity duration-500 z-20"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center border transition-transform duration-500"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(12px)",
                borderColor: "rgba(255, 255, 255, 0.1)",
                boxShadow: "0 0 40px rgba(255, 255, 255, 0.03)",
                transform: isHovered ? "scale(1)" : "scale(0.9)"
              }}
            >
              <Pause className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        {/* Current Focus Card */}
        <div 
          className="absolute bottom-20 z-40 opacity-0"
          style={{
            animation: "fadeIn 1.5s ease-out 0.5s forwards, float 6s ease-in-out infinite"
          }}
        >
          <div 
            className="rounded-2xl p-1 pr-6 flex items-center gap-5 max-w-lg mx-auto"
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)"
            }}
          >
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center border shadow-inner"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.1), transparent)",
                borderColor: "rgba(255, 255, 255, 0.05)"
              }}
            >
              <FileEdit className="w-6 h-6" style={{ color: "rgba(255, 255, 255, 0.8)" }} />
            </div>

            <div className="flex flex-col">
              <span 
                className="text-[10px] uppercase tracking-widest font-semibold mb-1"
                style={{ color: "#9CA3AF" }}
              >
                Current Focus
              </span>
              <h2 
                className="text-lg tracking-wide"
                style={{ 
                  color: "white",
                  fontFamily: "'Playfair Display', serif"
                }}
              >
                Project Phoenix: UI Design
              </h2>
            </div>

            <div 
              className="ml-8 pl-8 h-8 flex items-center"
              style={{ borderLeft: "1px solid rgba(255, 255, 255, 0.1)" }}
            >
              <button 
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#9CA3AF";
                }}
                onClick={handleCompleteTask}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* KAAL Logo Bottom Left */}
      <div className="absolute bottom-8 left-8 z-10 opacity-30 pointer-events-none">
        <span 
          className="font-bold text-lg tracking-tight"
          style={{ 
            fontFamily: "'Playfair Display', serif",
            color: "white"
          }}
        >
          K
        </span>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes liquidSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}