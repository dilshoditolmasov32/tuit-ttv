import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VRModule from "../components/VRModule";
import ARModule from "../components/ARModule";
import { Language } from "../types";

type Section = "menu" | "vr" | "ar" | "tour";

const TourModule = ({ onBack }: { onBack: () => void }) => {
  const rooms = [
    {
      id: 1,
      name: "Yozuv studiyasi",
      desc: "Asosiy studiya - 240 m²",
      color: "#0a1a12",
      icon: "🎬",
      mediaType: "Panorama rasm",
      fileHint: "/tour/studio-360.jpg",
      note: "Kamera, dekor va yoritish zonasi uchun asosiy panorama.",
      points: ["360 korinish", "Studiya markazi", "Kamera nuqtasi"],
    },
    {
      id: 2,
      name: "Multimedia laboratoriya",
      desc: "Post-production xonasi - 80 m²",
      color: "#0a0a1a",
      icon: "💻",
      mediaType: "Statik preview",
      fileHint: "/tour/lab-preview.jpg",
      note: "Montaj kompyuterlari va post-production ish stansiyalari.",
      points: ["Edit stol", "Monitorlar", "Render zonasi"],
    },
    {
      id: 3,
      name: "Ovoz studiyasi",
      desc: "Dublyaj va recording - 60 m²",
      color: "#1a0a1a",
      icon: "🎙️",
      mediaType: "Video placeholder",
      fileHint: "/tour/sound-room.mp4",
      note: "Ovoz yozish, mikrofon va akustik muhit namoyishi.",
      points: ["Mikrofon", "Audio booth", "Voice over"],
    },
    {
      id: 4,
      name: "Efir xonasi",
      desc: "Live broadcast - 120 m²",
      color: "#1a1400",
      icon: "📡",
      mediaType: "Panorama video",
      fileHint: "/tour/broadcast-360.mp4",
      note: "Jonli efirni boshqarish va monitoring uchun tayyor nuqta.",
      points: ["Switcher", "Signal control", "Live desk"],
    },
  ];

  const [activeRoom, setActiveRoom] = useState(rooms[0]);
  const [yaw, setYaw] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const delta = e.clientX - lastX;
    setYaw((y) => y + delta * 0.3);
    setLastX(e.clientX);
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col">
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
        >
          <span>←</span>
          <span>Orqaga</span>
        </button>
        <h1 className="text-lg font-medium text-white/90">360° Virtual Tur</h1>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs text-cyan-400">Static Demo</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r border-white/10 p-4 flex flex-col gap-2 overflow-y-auto">
          <p className="text-xs text-white/40 uppercase tracking-widest mb-2 px-2">
            Xonalar
          </p>
          {rooms.map((room) => (
            <button
              key={room.id}
              onClick={() => setActiveRoom(room)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                activeRoom.id === room.id
                  ? "bg-cyan-500/10 border-cyan-500/40 text-cyan-300"
                  : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10"
              }`}
            >
              <div className="text-xl mb-1">{room.icon}</div>
              <div className="text-sm font-medium">{room.name}</div>
              <div className="text-xs text-white/40 mt-0.5">{room.desc}</div>
              <div className="text-[10px] text-cyan-400/80 mt-2">
                {room.mediaType}
              </div>
            </button>
          ))}
        </div>

        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRoom.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full relative"
              style={{
                background: `radial-gradient(ellipse at center, ${activeRoom.color} 0%, #050505 100%)`,
                cursor: isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <div className="absolute inset-0 flex items-center justify-center select-none">
                <div
                  className="transition-transform duration-75 w-full max-w-6xl px-8"
                  style={{ transform: `rotateY(${yaw * 0.1}deg)` }}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_320px] gap-8 items-center">
                    <div className="rounded-[28px] border border-white/10 bg-black/25 backdrop-blur-md overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                      <div className="aspect-[16/9] relative bg-gradient-to-br from-white/10 to-white/0 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_55%)]" />
                        <div className="absolute top-4 left-4 px-3 py-1 rounded-full border border-white/15 text-[11px] text-cyan-300 bg-black/30">
                          {activeRoom.mediaType}
                        </div>
                        <div className="text-center relative z-10 px-6">
                          <div className="text-7xl mb-5">{activeRoom.icon}</div>
                          <p className="text-2xl font-light text-white/85">
                            {activeRoom.name}
                          </p>
                          <p className="text-sm text-white/45 mt-2">
                            {activeRoom.desc}
                          </p>
                          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-white/50">
                            <span>Static preview</span>
                            <span>•</span>
                            <span>Keyin media bilan almashtiriladi</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 p-4 bg-black/25 border-t border-white/10">
                        {activeRoom.points.map((point) => (
                          <div
                            key={point}
                            className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-center text-xs text-white/55"
                          >
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-[28px] border border-white/10 bg-black/30 backdrop-blur-md p-5">
                      <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">
                        Media ma'lumoti
                      </p>
                      <p className="mt-4 text-lg text-white/85">
                        {activeRoom.name}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-white/55">
                        {activeRoom.note}
                      </p>
                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                          Fayl yo'li
                        </p>
                        <p className="mt-3 text-sm text-amber-300 break-all">
                          {activeRoom.fileHint}
                        </p>
                      </div>
                      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                          Eslatma
                        </p>
                        <p className="mt-3 text-sm leading-6 text-white/55">
                          Hozirgi preview blok o'rniga keyin 360 panorama rasm,
                          video yoki viewer joylashtirishingiz mumkin.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-white/30 pointer-events-none">
                <span>←</span>
                <span>Sichqoncha bilan aylantiring</span>
                <span>→</span>
              </div>

              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
                <p className="text-sm font-medium text-white">
                  {activeRoom.name}
                </p>
                <p className="text-xs text-white/40">{activeRoom.desc}</p>
              </div>

              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 text-xs text-cyan-400">
                {Math.round(((yaw % 360) + 360) % 360)}°
              </div>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {rooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => setActiveRoom(room)}
                      className={`rounded-2xl border px-4 py-3 text-left backdrop-blur-sm transition-all ${
                        activeRoom.id === room.id
                          ? "border-cyan-400/40 bg-cyan-500/10"
                          : "border-white/10 bg-black/35 hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{room.icon}</span>
                        <div>
                          <p className="text-sm text-white/80">{room.name}</p>
                          <p className="text-[10px] text-white/40 mt-1">
                            {room.mediaType}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

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
        "Interaktiv 3D muhitda yurish va objektlarni tahlil qilish. Klaviatura bilan harakat qiling va tanlash uchun bosing.",
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
    {
      id: "tour" as Section,
      icon: "🎬",
      title: "360° Tur",
      description:
        "Panoramik video va rasmlar uchun tayyor statik preview. Keyin haqiqiy media bilan almashtirasiz.",
      color: "from-amber-500/20 to-transparent",
      border: "border-amber-500/30 hover:border-amber-400/60",
      accent: "text-amber-400",
      badge: "bg-amber-500/20 text-amber-300",
    },
  ];

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
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Kichraytirish" : "To'liq ekran"}
          style={{
            position: "absolute",
            bottom: "14px",
            right: "16px",
            zIndex: 10000,
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            background: "rgba(0,0,0,0.55)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "999px",
            color: "#22d3ee",
            fontSize: "12px",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(34,211,238,0.15)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(0,0,0,0.55)")
          }
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
              Kichraytirish
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
              To'liq ekran
            </>
          )}
        </button>

        {activeSection === "vr" && (
          <VRModule lang={lang} onBack={() => setActiveSection("menu")} />
        )}
        {activeSection === "ar" && (
          <ARModule lang={lang} onBack={() => setActiveSection("menu")} />
        )}
        {activeSection === "tour" && (
          <TourModule onBack={() => setActiveSection("menu")} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto mt-10 px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          
          <h1 className="text-5xl font-bold mb-4 tracking-tight">
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
          <p className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed">
            Fakultetimizning interaktiv laboratoriyalariga xush kelibsiz.
            Quyidagi texnologiyalardan birini tanlang va o'rganishni boshlang.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <button
                onClick={() => setActiveSection(card.id)}
                className={`w-full text-left p-7 rounded-2xl border bg-white/[0.03] backdrop-blur-sm transition-all duration-300 group relative overflow-hidden ${card.border}`}
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div className="text-5xl mb-5">{card.icon}</div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${card.badge} mb-4 inline-block`}
                  >
                    {card.id === "vr"
                      ? "WebXR"
                      : card.id === "ar"
                        ? "Camera API"
                        : "360 Media"}
                  </span>

                  <h3 className="text-xl font-semibold text-white mb-3">
                    {card.title}
                  </h3>

                  <p className="text-white/50 text-sm leading-relaxed mb-6">
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

      
      </div>
    </div>
  );
}
