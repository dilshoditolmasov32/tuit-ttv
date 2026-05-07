import React, { Suspense, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Language } from "../types";
import { ShowroomArea, VRShowroomScene } from "./vr/VRShowroomScene";

import studioImage from "../assests/050A7790.JPG";
import controlImage from "../assests/050A7793.JPG";
import audioImage from "../assests/IMG_3288.jpg";
import newsImage from "../assests/IMG_3327.jpg";
import mediaImage from "../assests/media-markaz-1.jpg";
import deanImage from "../assests/dekan.png";

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
      uz: "Real fakultet fotosurati endi quti yuzasiga cho'zilmaydi. Panel rasm nisbatini avtomatik saqlaydi, shuning uchun studio ko'rinishi toza va professional turadi.",
      ru: "The faculty image is shown on a true gallery plane, preserving its original ratio and avoiding stretched block textures.",
      en: "The faculty image is shown on a true gallery plane, preserving its original ratio and avoiding stretched block textures.",
    },
    mediaHint: {
      uz: "16:9 yoki vertikal rasmlarni bemalol almashtiring, panel o'lchami avtomatik moslashadi.",
      ru: "Swap in 16:9 or portrait images freely; the panel dimensions adapt automatically.",
      en: "Swap in 16:9 or portrait images freely; the panel dimensions adapt automatically.",
    },
    stats: [
      { label: { uz: "Format", ru: "Format", en: "Format" }, value: "Aspect safe" },
      { label: { uz: "Yorug'lik", ru: "Light", en: "Light" }, value: "Cinematic" },
      { label: { uz: "Holat", ru: "Status", en: "Status" }, value: "Interactive" },
    ],
  },
  {
    id: "control",
    color: "#8b5cf6",
    image: controlImage,
    position: [0, 2.45, -5.45],
    rotation: [0, 0, 0],
    title: {
      uz: "Rejissyor pulti",
      ru: "Control Room",
      en: "Control Room",
    },
    summary: {
      uz: "Jonli efir, monitoring va montaj jarayonlarini ko'rsatish paneli.",
      ru: "A focused display area for live production, monitoring, and editing workflows.",
      en: "A focused display area for live production, monitoring, and editing workflows.",
    },
    details: {
      uz: "Markaziy devor paneli media studiya atmosferasini beradi. Hover va click holatlarida kamera yumshoq shu zonaga qaraydi.",
      ru: "The center wall panel creates a media-studio feel. Hover and click states guide the camera smoothly toward the active zone.",
      en: "The center wall panel creates a media-studio feel. Hover and click states guide the camera smoothly toward the active zone.",
    },
    mediaHint: {
      uz: "Keyin OBS, mikser, efir yoki montaj ekranlarini shu panelga qo'yish mumkin.",
      ru: "Later you can place OBS, mixer, broadcast, or editing screenshots on this panel.",
      en: "Later you can place OBS, mixer, broadcast, or editing screenshots on this panel.",
    },
    stats: [
      { label: { uz: "Ekran", ru: "Screen", en: "Screen" }, value: "Wall panel" },
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
    title: {
      uz: "Audio studiya",
      ru: "Audio Studio",
      en: "Audio Studio",
    },
    summary: {
      uz: "Mikrofon, akustika va podkast yozuvlari uchun namoyish nuqtasi.",
      ru: "A display point for microphones, acoustics, and podcast production.",
      en: "A display point for microphones, acoustics, and podcast production.",
    },
    details: {
      uz: "Yon devordagi suzuvchi ekran paneli maydonni yengil qiladi va eski parallelepiped ko'rinishini olib tashlaydi.",
      ru: "The angled floating screen keeps the room light and removes the old parallelepiped look.",
      en: "The angled floating screen keeps the room light and removes the old parallelepiped look.",
    },
    mediaHint: {
      uz: "Mikrofon rasmi, waveform yoki qisqa video prevyusi uchun mos.",
      ru: "Works well for microphone photos, waveforms, or short video previews.",
      en: "Works well for microphone photos, waveforms, or short video previews.",
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
    title: {
      uz: "Yangiliklar desk zonasi",
      ru: "News Desk",
      en: "News Desk",
    },
    summary: {
      uz: "Spiker chiqishi, frontal kadr va teleprompter g'oyasi uchun zona.",
      ru: "A zone for anchor delivery, frontal framing, and teleprompter concepts.",
      en: "A zone for anchor delivery, frontal framing, and teleprompter concepts.",
    },
    details: {
      uz: "Oldingi yirik blok o'rniga ko'rgazma ekranlari va realistik pult sahna chuqurligini beradi.",
      ru: "Gallery screens and a realistic console replace the previous large block and create scene depth.",
      en: "Gallery screens and a realistic console replace the previous large block and create scene depth.",
    },
    mediaHint: {
      uz: "Fakultet yangiliklari, 16:9 video poster yoki spiker rasmi uchun ishlating.",
      ru: "Use it for faculty news, 16:9 video posters, or anchor images.",
      en: "Use it for faculty news, 16:9 video posters, or anchor images.",
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
    title: {
      uz: "Media markaz",
      ru: "Media Center",
      en: "Media Center",
    },
    summary: {
      uz: "Fakultet faoliyati va media loyihalarini taqdim etuvchi ekran.",
      ru: "A screen for faculty activity and student media projects.",
      en: "A screen for faculty activity and student media projects.",
    },
    details: {
      uz: "Ko'rgazma xonasi endi bitta demo emas, balki universitet bo'ylab virtual tur hissini beradi.",
      ru: "The showroom now feels like a virtual university tour instead of a single geometry demo.",
      en: "The showroom now feels like a virtual university tour instead of a single geometry demo.",
    },
    mediaHint: {
      uz: "Talaba ishlari, video lavhalar yoki media markaz fotoalbomi uchun mos.",
      ru: "Good for student work, video stills, or a media-center photo album.",
      en: "Good for student work, video stills, or a media-center photo album.",
    },
    stats: [
      { label: { uz: "Kontent", ru: "Content", en: "Content" }, value: "Faculty" },
      { label: { uz: "Sifat", ru: "Quality", en: "Quality" }, value: "Mipmapped" },
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
      ru: "A portrait display for faculty leadership and team introductions.",
      en: "A portrait display for faculty leadership and team introductions.",
    },
    details: {
      uz: "Portret rasm ham cho'zilmaydi: komponent balandlik va kenglikni rasm nisbatiga qarab hisoblaydi.",
      ru: "Portrait images are not stretched either; the component calculates panel width and height from the real image ratio.",
      en: "Portrait images are not stretched either; the component calculates panel width and height from the real image ratio.",
    },
    mediaHint: {
      uz: "Dekan, o'qituvchilar va kafedra ma'lumotlari uchun portret galereya sifatida ishlating.",
      ru: "Use it as a portrait gallery for dean, teachers, and department information.",
      en: "Use it as a portrait gallery for dean, teachers, and department information.",
    },
    stats: [
      { label: { uz: "Nisbat", ru: "Ratio", en: "Ratio" }, value: "Preserved" },
      { label: { uz: "Portret", ru: "Portrait", en: "Portrait" }, value: "Ready" },
      { label: { uz: "Hover", ru: "Hover", en: "Hover" }, value: "Glow" },
    ],
  },
];

const uiText = {
  uz: {
    title: "VR Fakultet Showroom",
    subtitle: "Real rasmlar, nisbat saqlovchi panellar va media studiya atmosferasi bilan virtual ko'rgazma.",
    areas: "Ko'rgazma zonalari",
    sceneInfo: "Sahna ma'lumoti",
    controls: "Boshqaruv",
    controlsBody: "Sichqoncha yoki touch bilan aylantiring, scroll/pinch bilan yaqinlashing, panelni bosing.",
    strategy: "Texnik yechim",
    strategyBody: "Rasmlar PlaneGeometry ustida ko'rsatiladi, texture mipmap va anisotropy bilan optimallashtiriladi, kamera tanlangan panelga yumshoq fokuslanadi.",
    replaceLabel: "Media joylashtirish",
    sceneReady: "Professional VR xona",
    back: "Orqaga",
  },
  ru: {
    title: "VR Faculty Showroom",
    subtitle: "A virtual exhibition with real images, aspect-safe panels, and a media studio atmosphere.",
    areas: "Gallery zones",
    sceneInfo: "Scene info",
    controls: "Controls",
    controlsBody: "Rotate with mouse or touch, zoom with wheel or pinch, and click a panel.",
    strategy: "Technical setup",
    strategyBody: "Images render on PlaneGeometry with mipmaps and anisotropy; the camera smoothly focuses the selected panel.",
    replaceLabel: "Media placement",
    sceneReady: "Professional VR room",
    back: "Back",
  },
  en: {
    title: "VR Faculty Showroom",
    subtitle: "A virtual exhibition with real images, aspect-safe panels, and a media studio atmosphere.",
    areas: "Gallery zones",
    sceneInfo: "Scene info",
    controls: "Controls",
    controlsBody: "Rotate with mouse or touch, zoom with wheel or pinch, and click a panel.",
    strategy: "Technical setup",
    strategyBody: "Images render on PlaneGeometry with mipmaps and anisotropy; the camera smoothly focuses the selected panel.",
    replaceLabel: "Media placement",
    sceneReady: "Professional VR room",
    back: "Back",
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

export default function VRModule({ lang, onBack }: VRModuleProps) {
  const [selectedArea, setSelectedArea] = useState<ShowroomArea>(showroomAreas[0]);
  const [focusedArea, setFocusedArea] = useState<ShowroomArea | null>(null);
  const [hoveredArea, setHoveredArea] = useState<ShowroomArea | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [resetSignal, setResetSignal] = useState(0);
  const text = uiText[lang];
  const visibleArea = hoveredArea || focusedArea || selectedArea;
  const selectedIndex = useMemo(
    () => showroomAreas.findIndex((area) => area.id === selectedArea.id),
    [selectedArea],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFocusedArea(null);
        return;
      }

      if (event.key === "ArrowRight") {
        const nextArea = showroomAreas[(selectedIndex + 1) % showroomAreas.length];
        setSelectedArea(nextArea);
        setFocusedArea(nextArea);
      }

      if (event.key === "ArrowLeft") {
        const nextArea =
          showroomAreas[(selectedIndex - 1 + showroomAreas.length) % showroomAreas.length];
        setSelectedArea(nextArea);
        setFocusedArea(nextArea);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIndex]);

  const focusArea = (area: ShowroomArea) => {
    setSelectedArea(area);
    setFocusedArea(area);
  };

  const resetFocus = () => {
    setFocusedArea(null);
    setResetSignal((value) => value + 1);
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(139,92,246,0.2),transparent_30%)]" />
      <motion.div
        className="pointer-events-none absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,transparent_28%,rgba(1,4,10,0.76)_100%)]"
        animate={{ opacity: focusedArea ? 0.85 : 0.38 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      />

      <div className="relative z-40 flex items-center justify-between border-b border-white/10 bg-black/45 px-3 py-3 backdrop-blur-xl md:px-6 md:py-4">
        <div className="flex min-w-0 items-center gap-2">
          <button
            onClick={() => setSidebarOpen((value) => !value)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 transition hover:bg-cyan-500/20"
            title={sidebarOpen ? "Close menu" : "Open menu"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h18M3 16h18" />
            </svg>
          </button>
          <h1 className="truncate text-base font-semibold md:text-lg">{text.title}</h1>
        </div>

        <button
          onClick={() => setRightSidebarOpen((value) => !value)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 transition hover:bg-cyan-500/20"
          title={rightSidebarOpen ? "Close info" : "Open info"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          </svg>
        </button>
      </div>

      <div className="relative z-10 flex flex-1 overflow-hidden">
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
            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">{text.title}</h2>
            <p className="mt-2 text-xs leading-5 text-white/60 md:text-sm">{text.subtitle}</p>
          </div>

          <p className="mb-3 text-xs uppercase tracking-[0.32em] text-white/35">{text.areas}</p>
          <div className="space-y-2 overflow-y-auto pr-1">
            {showroomAreas.map((area) => {
              const active = area.id === selectedArea.id;
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
                    style={{ backgroundColor: area.color, boxShadow: active ? `0 0 14px ${area.color}` : "none" }}
                  />
                  <span className="block font-medium">{area.title[lang]}</span>
                  <span className="mt-1 block text-xs leading-4 text-white/45">{area.summary[lang]}</span>
                </motion.button>
              );
            })}
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/55 xl:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="relative flex flex-1 flex-col">
          <Canvas
            shadows
            dpr={[1, 1.75]}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: false,
            }}
            camera={{ fov: 42, position: [0, 7.4, 15.2] }}
            className="flex-1"
            onDoubleClick={resetFocus}
          >
            <Suspense fallback={<CanvasLoader />}>
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

          <div className="pointer-events-none absolute left-3 top-3 max-w-[min(20rem,calc(100vw-1.5rem))] rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-xs backdrop-blur-md md:left-6 md:top-6 md:px-4 md:py-3 md:text-sm">
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300 md:text-xs">{text.controls}</p>
            <p className="mt-1 leading-4 text-white/62 md:mt-2">{text.controlsBody}</p>
          </div>

          <motion.div
            className="pointer-events-none absolute bottom-20 left-1/2 -translate-x-1/2 rounded-full border border-white/10 bg-black/45 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white/65 backdrop-blur-md"
            animate={{ opacity: focusedArea ? 1 : 0.78, y: focusedArea ? 0 : 8 }}
            transition={{ duration: 0.35 }}
          >
            {focusedArea ? "Esc to exit focus  •  Double click to reset" : "Click a panel to focus  •  Arrow keys to browse"}
          </motion.div>

          <button
            onClick={onBack}
            className="absolute bottom-3 right-3 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 hover:text-white md:bottom-6 md:right-6 md:px-5 md:py-3 md:text-sm"
          >
            {text.back}
          </button>
        </main>

        <aside
          className={`fixed bottom-0 right-0 top-[61px] z-30 flex flex-col overflow-hidden border-l border-white/10 bg-black/35 p-4 backdrop-blur-xl transition duration-300 hover:overflow-y-auto md:p-6 xl:static xl:top-0 ${
            rightSidebarOpen ? "w-72 translate-x-0 md:w-80 xl:w-80" : "w-0 translate-x-full xl:w-0"
          }`}
        >
          <motion.div
            key={visibleArea.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-y-auto pr-1"
          >
            <p className="text-[10px] uppercase tracking-[0.32em] text-white/35">{text.sceneInfo}</p>
            <h3 className="mt-2 text-xl font-semibold">{visibleArea.title[lang]}</h3>
            <p className="mt-2 text-sm leading-5 text-white/65">{visibleArea.details[lang]}</p>

            <div className="mt-4 overflow-hidden rounded-lg border border-white/10 bg-white/[0.035]">
              <div className="aspect-video w-full overflow-hidden bg-black/50">
                <img src={visibleArea.image} alt={visibleArea.title[lang]} className="h-full w-full object-contain" loading="lazy" />
              </div>
              <p className="px-3 py-2 text-xs text-white/50">{visibleArea.title[lang]}</p>
            </div>

            <div className="mt-4 rounded-lg border border-white/10 bg-white/[0.035] p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-white/35">{text.replaceLabel}</p>
              <p className="mt-2 text-xs leading-5 text-white/62">{visibleArea.mediaHint[lang]}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {visibleArea.stats.map((item) => (
                <div key={item.label[lang]} className="rounded-lg border border-white/10 bg-white/[0.035] p-3">
                  <p className="text-[9px] uppercase tracking-[0.18em] text-white/35">{item.label[lang]}</p>
                  <p className="mt-1 text-xs font-medium text-white/85">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-cyan-400/20 bg-cyan-500/10 p-4">
              <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">{text.strategy}</p>
              <p className="mt-2 text-xs leading-5 text-white/65">{text.strategyBody}</p>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
