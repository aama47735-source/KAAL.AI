import { useState } from "react";
import { Brain } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CreativeCanvasScreen } from "./CreativeCanvasScreen";

export function DumpEverythingFAB() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-10 right-10 z-40 text-white rounded-full px-8 py-4 flex items-center gap-3 transition-all duration-500 hover:scale-105 active:scale-95 group ring-1 shadow-2xl"
        style={{
          backgroundColor: "rgba(17, 24, 39, 0.9)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          ringColor: "rgba(255, 255, 255, 0.2)",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#000000";
          e.currentTarget.style.boxShadow = "0 0 30px rgba(17, 24, 39, 0.3), 0 0 60px rgba(17, 24, 39, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(17, 24, 39, 0.9)";
          e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
        }}
      >
        <Brain className="w-5 h-5 group-hover:rotate-12 transition-transform" strokeWidth={2.5} />
        <span className="font-bold tracking-wide text-xs uppercase">Creative Canvas</span>
      </motion.button>

      {/* Creative Canvas Modal */}
      <AnimatePresence>
        {isOpen && <CreativeCanvasScreen onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
}