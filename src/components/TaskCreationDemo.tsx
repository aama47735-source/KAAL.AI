import { useState } from "react";
import { Plus } from "lucide-react";
import { TaskCreationModal } from "./TaskCreationModal";

export function TaskCreationDemo() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div 
      className="flex-1 overflow-hidden flex flex-col relative"
      style={{ 
        background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
        position: "relative"
      }}
    >
      {/* Noise Texture */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-60 mix-blend-overlay"
        style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulance type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.05%22/%3E%3C/svg%3E')"
        }}
      />

      {/* Header */}
      <header 
        className="h-24 border-b flex items-center justify-between px-10 z-20"
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
            Task Management
          </h1>
          <p 
            className="text-2xl italic"
            style={{ fontFamily: "'Playfair Display', serif", color: "#111827" }}
          >
            Task Creation Suite
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium shadow-lg transition-all duration-300"
          style={{ backgroundColor: "#111827" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(17, 24, 39, 0.15)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow = "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)";
          }}
        >
          <Plus className="w-4 h-4" />
          New Task
        </button>
      </header>

      {/* Main Content - Mock Dashboard */}
      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-12 gap-8">
            <div 
              className="col-span-8 h-64 rounded-3xl"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
            />
            <div 
              className="col-span-4 h-64 rounded-3xl"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
            />
            <div 
              className="col-span-12 h-96 rounded-3xl"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.4)" }}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <TaskCreationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
