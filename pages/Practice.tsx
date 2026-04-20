import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import VRModule from "../components/VRModule";
import ARModule from "../components/ARModule";
import { Language } from "../types";

type Section = "menu" | "vr" | "ar";

interface PracticeProps {
  lang: Language;
}

export default function Practice({ lang }: PracticeProps) {
  const [activeSection, setActiveSection] = useState<Section>("menu");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen API xatosi:", e);
    }
  }, []);

  const cards = [
    {
      id: "vr" as Section,
      icon: "🥽",
      title: "VR Laboratoriyasi",
      description:
        "Interaktiv 3D muhitda yurish va objektlarni tahlil qilish. Sichqoncha bilan aylantiring va nuqtalarni bosing.",
      color: "from-purple-500/20 to-transparent",
      border: "border-purple-500/30 hover:border-purple-400/60",
      accent: "text-purple-400",
      badge: "bg-purple-500/20 text-purple-300",
    },
    {
      id: "ar" as Section,
      icon: "📱",
      title: "AR Markeri",
      description:
        "3D modellarni real dunyoda ko'rish. Kamera ishlatib marker aniqlanadi va model ko'rsatiladi.",
      color: "from-cyan-500/20 to-transparent",
      border: "border-cyan-500/30 hover:border-cyan-400/60",
      accent: "text-cyan-400",
      badge: "bg-cyan-500/20 text-cyan-300",
    },
  ];

  // When viewing VR or AR - fullscreen mode
  if (activeSection !== "menu") {
    return (
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "#050505",
          overflow: "hidden",
        }}
      >
        {/* Fullscreen Toggle Button - Responsive Positioning */}
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Kichraytirish" : "To'liq ekran"}
          className="absolute bottom-4 right-4 md:bottom-6 md:right-6 z-10000 flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 text-xs md:text-sm font-medium hover:bg-cyan-500/20 transition-all backdrop-blur-md"
        >
          {isFullscreen ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
              </svg>
              <span className="hidden sm:inline">Kichraytirish</span>
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
              </svg>
              <span className="hidden sm:inline">To'liq ekran</span>
            </>
          )}
        </button>

        
        <button
          onClick={() => setActiveSection("menu")}
          className="absolute top-4 right-4 md:top-6 md:right-16 z-10000 flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 rounded-full border border-red-500/40 bg-red-500/10 text-red-300 text-xs md:text-sm font-medium hover:bg-red-500/20 transition-all backdrop-blur-md"
          title="Orqaga qaytish"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Orqaga</span>
        </button>

        {/* VR Module */}
        {activeSection === "vr" && (
          <VRModule lang={lang} onBack={() => setActiveSection("menu")} />
        )}

        {/* AR Module */}
        {activeSection === "ar" && (
          <ARModule lang={lang} onBack={() => setActiveSection("menu")} />
        )}
      </div>
    );
  }

  // Menu view - showing VR and AR cards
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Background Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
            VR/AR{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: "linear-gradient(135deg, #22d3ee, #818cf8)",
              }}
            >
              Laboratoriyasi
            </span>
          </h1>
          <p className="text-white/50 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
            Fakultetimizning interaktiv laboratoriyalariga xush kelibsiz.
            Quyidagi texnologiyalardan birini tanlang va o'rganishni boshlang.
          </p>
        </motion.div>

        {/* Cards Grid - Responsive Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <button
                onClick={() => setActiveSection(card.id)}
                className={`w-full text-left p-6 sm:p-8 rounded-2xl border bg-white/[0.03] backdrop-blur-sm transition-all duration-300 group relative overflow-hidden h-full ${card.border}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10 flex flex-col h-full">
                  <div className="text-5xl sm:text-6xl mb-4 sm:mb-5">
                    {card.icon}
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${card.badge} mb-4 inline-block w-fit`}
                  >
                    {card.id === "vr"
                      ? "WebXR Technology"
                      : "Camera & AR Kit"}
                  </span>

                  <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3">
                    {card.title}
                  </h3>

                  <p className="text-white/50 text-sm leading-relaxed mb-6 flex-grow">
                    {card.description}
                  </p>

                  <div
                    className={`flex items-center gap-2 text-sm font-medium ${card.accent} group-hover:gap-3 transition-all`}
                  >
                    <span>Kirish</span>
                    <span>→</span>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Features Info - Optional */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 md:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm text-center">
            <p className="text-2xl sm:text-3xl font-bold text-cyan-400">3D</p>
            <p className="text-sm text-white/60 mt-2">Interactive Environments</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm text-center">
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">360°</p>
            <p className="text-sm text-white/60 mt-2">Immersive Experience</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm text-center">
            <p className="text-2xl sm:text-3xl font-bold text-indigo-400">AR</p>
            <p className="text-sm text-white/60 mt-2">Real World Integration</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
