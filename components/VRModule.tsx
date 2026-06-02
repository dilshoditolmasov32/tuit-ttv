

import React, {
  Suspense,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Language } from "../types";
import { ShowroomArea, VRShowroomScene } from "./vr/VRShowroomScene";
import { VRPointerLockController } from "./VRPointerLockController";

import studioImage from "../assests/050A7790.JPG";
import controlImage from "../assests/050A7793.JPG";
import audioImage from "../assests/IMG_3288.jpg";
import newsImage from "../assests/IMG_3327.jpg";
import mediaImage from "../assests/media-markaz-1.jpg";
import deanImage from "../assests/IMG_3320.jpg";

// ── showroomAreas: o'zgarishsiz (asl kodingizdan) ──────────────────────────
const showroomAreas: ShowroomArea[] = [
  {
    id: "studio",
    color: "#22d3ee",
    image: studioImage,
    position: [-4.9, 2.55, -3.8],
    rotation: [0, 0.48, 0],
    title: {
      uz: "Teleko'rsatuv studiyasi",
      ru: "Telestudiya",
      en: "Broadcast Studio",
    },
    summary: {
      uz: "Kamera, yoritish va sahna kompozitsiyasi uchun immersiv zona.",
      ru: "Immersive zone for camera, lighting, and stage composition.",
      en: "Immersive zone for camera, lighting, and stage composition.",
    },
    details: {
      uz: "Real fakultet fotosurati endi quti yuzasiga cho'zilmaydi.",
      ru: "The faculty image is shown on a true gallery plane.",
      en: "The faculty image is shown on a true gallery plane.",
    },
    mediaHint: {
      uz: "16:9 yoki vertikal rasmlarni bemalol almashtiring.",
      ru: "Swap in 16:9 or portrait images freely.",
      en: "Swap in 16:9 or portrait images freely.",
    },
    stats: [
      {
        label: { uz: "Format", ru: "Format", en: "Format" },
        value: "Aspect safe",
      },
      {
        label: { uz: "Yorug'lik", ru: "Light", en: "Light" },
        value: "Cinematic",
      },
      {
        label: { uz: "Holat", ru: "Status", en: "Status" },
        value: "Interactive",
      },
    ],
  },
  {
    id: "control",
    color: "#8b5cf6",
    image: controlImage,
    position: [0, 2.45, -5.45],
    rotation: [0, 0, 0],
    title: { uz: "Rejissyor pulti", ru: "Control Room", en: "Control Room" },
    summary: {
      uz: "Jonli efir, monitoring va montaj jarayonlarini ko'rsatish paneli.",
      ru: "A focused display area for live production.",
      en: "A focused display area for live production.",
    },
    details: {
      uz: "Markaziy devor paneli media studiya atmosferasini beradi.",
      ru: "The center wall panel creates a media-studio feel.",
      en: "The center wall panel creates a media-studio feel.",
    },
    mediaHint: {
      uz: "Keyin OBS, mikser, efir yoki montaj ekranlarini shu panelga qo'yish mumkin.",
      ru: "Later you can place OBS, mixer, or editing screenshots here.",
      en: "Later you can place OBS, mixer, or editing screenshots here.",
    },
    stats: [
      {
        label: { uz: "Ekran", ru: "Screen", en: "Screen" },
        value: "Wall panel",
      },
      { label: { uz: "Fokus", ru: "Focus", en: "Focus" }, value: "Auto" },
      { label: { uz: "Soya", ru: "Shadows", en: "Shadows" }, value: "Enabled" },
    ],
  },
  {
    id: "audio",
    color: "#f59e0b",
    image: audioImage,
    position: [4.9, 2.35, -3.75],
    rotation: [0, -0.48, 0],
    title: { uz: "Audio studiya", ru: "Audio Studio", en: "Audio Studio" },
    summary: {
      uz: "Mikrofon, akustika va podkast yozuvlari uchun namoyish nuqtasi.",
      ru: "A display point for microphones and podcast production.",
      en: "A display point for microphones and podcast production.",
    },
    details: {
      uz: "Yon devordagi suzuvchi ekran paneli maydonni yengil qiladi.",
      ru: "The angled floating screen keeps the room light.",
      en: "The angled floating screen keeps the room light.",
    },
    mediaHint: {
      uz: "Mikrofon rasmi, waveform yoki qisqa video prevyusi uchun mos.",
      ru: "Works well for microphone photos or waveforms.",
      en: "Works well for microphone photos or waveforms.",
    },
    stats: [
      { label: { uz: "Panel", ru: "Panel", en: "Panel" }, value: "Floating" },
      { label: { uz: "Rang", ru: "Color", en: "Color" }, value: "Warm accent" },
      { label: { uz: "Anim.", ru: "Anim.", en: "Anim." }, value: "Subtle" },
    ],
  },
  {
    id: "news",
    color: "#10b981",
    image: newsImage,
    position: [-3.25, 1.75, 1.75],
    rotation: [0, 1.05, 0],
    title: { uz: "Yangiliklar desk zonasi", ru: "News Desk", en: "News Desk" },
    summary: {
      uz: "Spiker chiqishi, frontal kadr va teleprompter g'oyasi uchun zona.",
      ru: "A zone for anchor delivery and teleprompter concepts.",
      en: "A zone for anchor delivery and teleprompter concepts.",
    },
    details: {
      uz: "Ko'rgazma ekranlari va realistik pult sahna chuqurligini beradi.",
      ru: "Gallery screens and a realistic console create scene depth.",
      en: "Gallery screens and a realistic console create scene depth.",
    },
    mediaHint: {
      uz: "Fakultet yangiliklari, 16:9 video poster yoki spiker rasmi uchun ishlating.",
      ru: "Use it for faculty news or 16:9 video posters.",
      en: "Use it for faculty news or 16:9 video posters.",
    },
    stats: [
      { label: { uz: "Joy", ru: "Place", en: "Place" }, value: "Front left" },
      { label: { uz: "Tur", ru: "Type", en: "Type" }, value: "Media" },
      { label: { uz: "UX", ru: "UX", en: "UX" }, value: "Clickable" },
    ],
  },
  {
    id: "media",
    color: "#38bdf8",
    image: mediaImage,
    position: [3.25, 1.75, 1.75],
    rotation: [0, -1.05, 0],
    title: { uz: "Media markaz", ru: "Media Center", en: "Media Center" },
    summary: {
      uz: "Fakultet faoliyati va media loyihalarini taqdim etuvchi ekran.",
      ru: "A screen for faculty activity and student media projects.",
      en: "A screen for faculty activity and student media projects.",
    },
    details: {
      uz: "Ko'rgazma xonasi virtual tur hissini beradi.",
      ru: "The showroom feels like a virtual university tour.",
      en: "The showroom feels like a virtual university tour.",
    },
    mediaHint: {
      uz: "Talaba ishlari, video lavhalar uchun mos.",
      ru: "Good for student work or video stills.",
      en: "Good for student work or video stills.",
    },
    stats: [
      {
        label: { uz: "Kontent", ru: "Content", en: "Content" },
        value: "Faculty",
      },
      {
        label: { uz: "Sifat", ru: "Quality", en: "Quality" },
        value: "Mipmapped",
      },
      { label: { uz: "DPR", ru: "DPR", en: "DPR" }, value: "Adaptive" },
    ],
  },
  {
    id: "dean",
    color: "#f472b6",
    image: deanImage,
    position: [0, 2.05, 2.55],
    rotation: [0, Math.PI, 0],
    title: {
      uz: "Fakultet rahbariyati",
      ru: "Faculty Leadership",
      en: "Faculty Leadership",
    },
    summary: {
      uz: "Rahbariyat va fakultet jamoasini portret panelda ko'rsatish.",
      ru: "A portrait display for faculty leadership.",
      en: "A portrait display for faculty leadership.",
    },
    details: {
      uz: "Portret rasm ham cho'zilmaydi.",
      ru: "Portrait images are not stretched either.",
      en: "Portrait images are not stretched either.",
    },
    mediaHint: {
      uz: "Dekan, o'qituvchilar va kafedra ma'lumotlari uchun portret galereya.",
      ru: "Use it as a portrait gallery for dean and teachers.",
      en: "Use it as a portrait gallery for dean and teachers.",
    },
    stats: [
      { label: { uz: "Nisbat", ru: "Ratio", en: "Ratio" }, value: "Preserved" },
      {
        label: { uz: "Portret", ru: "Portrait", en: "Portrait" },
        value: "Ready",
      },
      { label: { uz: "Hover", ru: "Hover", en: "Hover" }, value: "Glow" },
    ],
  },
];

// ── uiText: o'zgarishsiz ──────────────────────────────────────────────────
const uiText = {
  uz: {
    title: "VR Fakultet Showroom",
    subtitle:
      "Real rasmlar, nisbat saqlovchi panellar va media studiya atmosferasi bilan virtual ko'rgazma.",
    areas: "Ko'rgazma zonalari",
    sceneInfo: "Sahna ma'lumoti",
    controls: "Boshqaruv",
    controlsBody: "WASD — harakat  •  Sichqoncha — qarash  •  Esc — chiqish",
    strategy: "Texnik yechim",
    strategyBody:
      "Rasmlar PlaneGeometry ustida ko'rsatiladi, texture mipmap va anisotropy bilan optimallashtiriladi.",
    replaceLabel: "Media joylashtirish",
    sceneReady: "Professional VR xona",
    back: "Orqaga",
    enterPrompt: "VRga kirish uchun bosing",
    enterHint: "WASD — harakat  ·  Sichqoncha — qarash  ·  Esc — chiqish",
    proximity: "Yaqin panel",
  },
  ru: {
    title: "VR Faculty Showroom",
    subtitle:
      "A virtual exhibition with real images, aspect-safe panels, and a media studio atmosphere.",
    areas: "Gallery zones",
    sceneInfo: "Scene info",
    controls: "Controls",
    controlsBody: "WASD — move  •  Mouse — look  •  Esc — exit",
    strategy: "Technical setup",
    strategyBody: "Images render on PlaneGeometry with mipmaps and anisotropy.",
    replaceLabel: "Media placement",
    sceneReady: "Professional VR room",
    back: "Back",
    enterPrompt: "Click to enter VR",
    enterHint: "WASD — move  ·  Mouse — look  ·  Esc — exit",
    proximity: "Nearby panel",
  },
  en: {
    title: "VR Faculty Showroom",
    subtitle:
      "A virtual exhibition with real images, aspect-safe panels, and a media studio atmosphere.",
    areas: "Gallery zones",
    sceneInfo: "Scene info",
    controls: "Controls",
    controlsBody: "WASD — move  •  Mouse — look  •  Esc — exit",
    strategy: "Technical setup",
    strategyBody: "Images render on PlaneGeometry with mipmaps and anisotropy.",
    replaceLabel: "Media placement",
    sceneReady: "Professional VR room",
    back: "Back",
    enterPrompt: "Click to enter VR",
    enterHint: "WASD — move  ·  Mouse — look  ·  Esc — exit",
    proximity: "Nearby panel",
  },
} as const;

interface VRModuleProps {
  lang: Language;
  onBack: () => void;
}

function CanvasLoader() {
  return (
    <Html center>
      <div className="rounded-xl border border-cyan-400/30 bg-black/70 px-5 py-3 text-center text-xs uppercase tracking-[0.22em] text-cyan-200 backdrop-blur-md">
        Loading VR showroom
      </div>
    </Html>
  );
}

// ── Crosshair: pointer lock aktiv bo'lganda markaz dot ───────────────────
function Crosshair() {
  return (
    <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center">
      <div className="relative h-5 w-5">
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/70" />
        <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/70" />
        <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80" />
      </div>
    </div>
  );
}

export default function VRModule({ lang, onBack }: VRModuleProps) {
  const [selectedArea, setSelectedArea] = useState<ShowroomArea>(
    showroomAreas[0],
  );
  const [focusedArea, setFocusedArea] = useState<ShowroomArea | null>(null);
  const [hoveredArea, setHoveredArea] = useState<ShowroomArea | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);

  // ── YANGI state'lar ──────────────────────────────────────────────────────
  const [isLocked, setIsLocked] = useState(false); // Pointer Lock holati
  const [nearbyArea, setNearbyArea] = useState<ShowroomArea | null>(null); // Proximity

  const text = uiText[lang];
  const visibleArea = hoveredArea || focusedArea || selectedArea;
  const selectedIndex = useMemo(
    () => showroomAreas.findIndex((a) => a.id === selectedArea.id),
    [selectedArea],
  );

  // ── Klaviatura (pointer lock rejimida sidebar tugmalari ishlamaydi,
  //    shuning uchun faqat lock bo'lmagan holatda arrow key'larni ulang) ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLocked) return; // WASD/arrow = harakat, sidebar emas

      if (e.key === "Escape") {
        setFocusedArea(null);
        return;
      }
      if (e.key === "ArrowRight") {
        const next = showroomAreas[(selectedIndex + 1) % showroomAreas.length];
        setSelectedArea(next);
        setFocusedArea(next);
      }
      if (e.key === "ArrowLeft") {
        const next =
          showroomAreas[
            (selectedIndex - 1 + showroomAreas.length) % showroomAreas.length
          ];
        setSelectedArea(next);
        setFocusedArea(next);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex, isLocked]);

  

  const focusArea = (area: ShowroomArea) => {
    setSelectedArea(area);
    setFocusedArea(area);
  };

  const resetFocus = () => {
    setFocusedArea(null);
    setResetSignal((v) => v + 1);
  };

  // Proximity callback: VRPointerLockController dan keladi
  const handleProximity = useCallback((area: ShowroomArea | null) => {
    setNearbyArea(area);
    if (area) {
      setSelectedArea(area); // sidebar ham yangilansin
    }
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.2),transparent_30%)]" />

      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(1,4,10,0.76)_100%)]"
        animate={{ opacity: focusedArea ? 0.85 : 0.38 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      {/* ── TOP BAR ── */}
      <div className="relative z-40 flex items-center justify-between border-b border-white/10 bg-black/45 px-3 py-3 backdrop-blur-xl md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 transition hover:bg-cyan-500/20"
            title={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 8h18M3 16h18" />
            </svg>
          </button>
          <h1 className="truncate text-base font-semibold md:text-lg">
            {text.title}
          </h1>

          {/* Lock holat indikatori */}
          <AnimatePresence>
            {isLocked && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="hidden items-center gap-1.5 rounded-full border border-green-500/40 bg-green-500/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-green-300 sm:flex"
              >
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
                FPS Mode
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setRightSidebarOpen((v) => !v)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 transition hover:bg-cyan-500/20"
            title={rightSidebarOpen ? "Close info" : "Open info"}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ── (o'zgarishsiz) */}
        <aside
          className={`fixed bottom-0 left-0 top-[61px] z-30 flex w-72 flex-col overflow-hidden border-r border-white/10 bg-black/35 p-4 backdrop-blur-xl transition duration-300 hover:overflow-y-auto md:w-80 md:p-6 xl:static xl:top-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"
          }`}
        >
          <div className="mb-5">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {text.sceneReady}
            </p>
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              {text.title}
            </h2>
            <p className="mt-2 text-xs leading-5 text-white/60 md:text-sm">
              {text.subtitle}
            </p>
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/35">
            {text.areas}
          </p>
          <div className="space-y-2 overflow-y-auto pr-1">
            {showroomAreas.map((area) => {
              const active = area.id === selectedArea.id;
              const isNear = nearbyArea?.id === area.id;
              return (
                <motion.button
                  key={area.id}
                  onClick={() => {
                    focusArea(area);
                    setSidebarOpen(false);
                  }}
                  onHoverStart={() => setHoveredArea(area)}
                  onHoverEnd={() => setHoveredArea(null)}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full rounded-lg border px-3 py-3 text-left text-sm transition ${
                    active
                      ? "border-cyan-300/50 bg-cyan-500/12 shadow-[0_0_36px_rgba(34,211,238,0.1)]"
                      : "border-white/10 bg-white/[0.035] hover:border-white/25 hover:bg-white/[0.06]"
                  }`}
                >
                  <span
                    className="mb-2 block h-1.5 w-12 rounded-full"
                    style={{
                      backgroundColor: area.color,
                      boxShadow:
                        active || isNear ? `0 0 14px ${area.color}` : "none",
                    }}
                  />
                  <span className="block font-medium">
                    {area.title[lang]}
                    {isNear && (
                      <span className="ml-2 rounded-full bg-white/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-white/50">
                        yaqin
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-xs leading-4 text-white/45">
                    {area.summary[lang]}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/55 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="relative flex flex-1 flex-col">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
              stencil: false,
              depth: true,
              failIfMajorPerformanceCaveat: false,
            }}
            camera={{ fov: 75, position: [0, 1.7, 4] }}
            className="flex-1"
            frameloop="always"
          >
            <Suspense fallback={<CanvasLoader />}>
              <VRPointerLockController
                areas={showroomAreas}
                onProximity={handleProximity as any}
                onLockChange={setIsLocked}
                speed={5}
                sprintMultiplier={2.2}
                proximityRadius={2.8}
              />

              <VRShowroomScene
                areas={showroomAreas}
                focusedArea={focusedArea}
                lang={lang}
                onBackgroundDoubleClick={resetFocus}
                selectedArea={selectedArea}
                hoveredArea={hoveredArea}
                onSelect={focusArea}
                onHover={setHoveredArea}
                resetSignal={resetSignal}
              />
            </Suspense>
          </Canvas>

          {/* ── CROSSHAIR (pointer lock aktiv) ── */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Crosshair />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── "CLICK TO ENTER" overlay (lock yo'q) ── */}
          <AnimatePresence>
            {!isLocked && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
              >
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{
                    duration: 2.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="rounded-2xl border border-white/20 bg-black/55 px-8 py-6 text-center backdrop-blur-lg"
                >
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-500/15">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {text.enterPrompt}
                  </p>
                  <p className="mt-1.5 text-[11px] text-white/45">
                    {text.enterHint}
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── PROXIMITY TOAST (panelga yaqinlashganda) ── */}
          <AnimatePresence>
            {isLocked && nearbyArea && (
              <motion.div
                key={nearbyArea.id}
                initial={{ opacity: 0, y: 20, x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: 12, x: "-50%" }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute bottom-28 left-1/2 z-50 rounded-xl border bg-black/70 px-4 py-3 backdrop-blur-lg"
                style={{ borderColor: nearbyArea.color + "55" }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{
                      backgroundColor: nearbyArea.color,
                      boxShadow: `0 0 10px ${nearbyArea.color}`,
                    }}
                  />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
                      {text.proximity}
                    </p>
                    <p className="text-sm font-medium text-white">
                      {nearbyArea.title[lang]}
                    </p>
                  </div>
                  <p className="ml-2 text-[10px] text-white/35">E yoki Click</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Controls hint (lock bo'lmagan holat) ── */}
          {!isLocked && (
            <div className="pointer-events-none absolute left-3 top-3 max-w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-xs backdrop-blur-md md:left-6 md:top-6 md:px-4 md:py-3 md:text-sm">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300 md:text-xs">
                {text.controls}
              </p>
              <p className="mt-1 leading-4 text-white/62 md:mt-2">
                {text.controlsBody}
              </p>
            </div>
          )}

          {/* ── Esc hint (lock aktiv) ── */}
          <AnimatePresence>
            {isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute right-3 top-3 z-50 rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/45 backdrop-blur-md md:right-6 md:top-3"
              >
                Esc — exit FPS
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={onBack}
            className="absolute bottom-3 right-3 z-50 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 hover:text-white md:bottom-6 md:right-6 md:px-5 md:py-3 md:text-sm"
          >
            {text.back}
          </button>
        </main>

        {/* ── RIGHT SIDEBAR ── (o'zgarishsiz) */}
        <aside
          className={`fixed bottom-0 right-0 top-[61px] z-30 flex flex-col overflow-hidden border-l border-white/10 bg-black/35 p-4 backdrop-blur-xl transition duration-300 hover:overflow-y-auto md:p-6 xl:static xl:top-0 ${
            rightSidebarOpen
              ? "w-72 translate-x-0 md:w-80 xl:w-80"
              : "w-0 translate-x-full xl:w-0"
          }`}
        >
          <motion.div
            key={visibleArea.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-y-auto pr-1"
          >
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">
              {text.sceneInfo}
            </p>
            <h3 className="mt-2 text-xl font-semibold">
              {visibleArea.title[lang]}
            </h3>
            <p className="mt-2 text-sm leading-5 text-white/65">
              {visibleArea.details[lang]}
            </p>

            <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
              <div className="aspect-video w-full overflow-hidden bg-black/50">
                <img
                  src={visibleArea.image}
                  alt={visibleArea.title[lang]}
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
              <p className="px-3 py-2 text-xs text-white/50">
                {visibleArea.title[lang]}
              </p>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">
                {text.replaceLabel}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/62">
                {visibleArea.mediaHint[lang]}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {visibleArea.stats.map((item) => (
                <div
                  key={item.label[lang]}
                  className="rounded-lg border border-white/10 bg-white/[0.035] p-3"
                >
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">
                    {item.label[lang]}
                  </p>
                  <p className="mt-1 text-xs font-medium text-white/85">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">
                {text.strategy}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/65">
                {text.strategyBody}
              </p>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
