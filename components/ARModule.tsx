import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Language } from "../types";
import MobileWebARExperience from "./ar/MobileWebARExperience";

interface ARModuleProps {
  lang: Language;
  onBack: () => void;
}

type ARStatus =
  | "idle"
  | "checking"
  | "loading"
  | "camera-permission"
  | "ready"
  | "marker-found"
  | "marker-lost"
  | "target-missing"
  | "camera-error"
  | "insecure-context"
  | "unsupported";

const uiText = {
  uz: {
    title: "Mobile WebAR TV Showcase",
    subtitle:
      "Telefon brauzerida kamera orqali fakultet logosi yoki posterini tanib, televizion texnologiyalar 3D ekspozitsiyasini ko'rsatadi.",
    target: "Target: faculty logo/poster",
    compatibility: "Chrome Android, Safari iOS 16+, secure HTTPS",
    instructions: "Skan qilish",
    instructionsList: [
      "Saytni telefonda HTTPS orqali oching.",
      "AR kamerani ishga tushiring va ruxsat bering.",
      "Fakultet logosi yoki posterini alohida qog'oz/ekranda ko'rsating.",
      "Model chiqqach drag, pinch, tap va double tap bilan boshqaring.",
    ],
    controls: "Touch boshqaruv",
    controlsBody: "Tap - info, drag - rotate, pinch - zoom, double tap - reset.",
    performance: "Mobil optimizatsiya",
    performanceBody:
      "MindAR image tracking, 1.5 DPR limiti, soyasiz mobil renderer, fallback model va GLB bounds normalization ishlatiladi.",
    targetBuild: "Target fayli",
    targetBuildBody:
      "Production uchun faculty-logo.mind faylini MindAR image compiler orqali public/assets/targets ichiga joylashtiring.",
    back: "Orqaga",
    status: "Holat",
  },
  ru: {
    title: "Mobile WebAR TV Showcase",
    subtitle:
      "Browser-based smartphone AR that detects the faculty logo or poster and shows an interactive TV technology 3D exhibit.",
    target: "Target: faculty logo/poster",
    compatibility: "Chrome Android, Safari iOS 16+, secure HTTPS",
    instructions: "Scanning",
    instructionsList: [
      "Open the website on a phone through HTTPS.",
      "Start the AR camera and allow permission.",
      "Show the faculty logo or poster on separate paper or another screen.",
      "Use drag, pinch, tap, and double tap once the model appears.",
    ],
    controls: "Touch controls",
    controlsBody: "Tap for info, drag to rotate, pinch to zoom, double tap to reset.",
    performance: "Mobile optimization",
    performanceBody:
      "Uses MindAR image tracking, capped 1.5 DPR, mobile renderer without shadows, fallback model, and GLB bounds normalization.",
    targetBuild: "Target file",
    targetBuildBody:
      "For production, generate faculty-logo.mind with the MindAR image compiler and place it in public/assets/targets.",
    back: "Back",
    status: "Status",
  },
  en: {
    title: "Mobile WebAR TV Showcase",
    subtitle:
      "Browser-based smartphone AR that detects the faculty logo or poster and shows an interactive TV technology 3D exhibit.",
    target: "Target: faculty logo/poster",
    compatibility: "Chrome Android, Safari iOS 16+, secure HTTPS",
    instructions: "Scanning",
    instructionsList: [
      "Open the website on a phone through HTTPS.",
      "Start the AR camera and allow permission.",
      "Show the faculty logo or poster on separate paper or another screen.",
      "Use drag, pinch, tap, and double tap once the model appears.",
    ],
    controls: "Touch controls",
    controlsBody: "Tap for info, drag to rotate, pinch to zoom, double tap to reset.",
    performance: "Mobile optimization",
    performanceBody:
      "Uses MindAR image tracking, capped 1.5 DPR, mobile renderer without shadows, fallback model, and GLB bounds normalization.",
    targetBuild: "Target file",
    targetBuildBody:
      "For production, generate faculty-logo.mind with the MindAR image compiler and place it in public/assets/targets.",
    back: "Back",
    status: "Status",
  },
} as const;

const statusText = {
  uz: {
    idle: "AR ishga tushirilmagan",
    checking: "Target fayli tekshirilmoqda",
    loading: "MindAR va model yuklanmoqda",
    "camera-permission": "Kamera ruxsati kutilmoqda",
    ready: "Kamera tayyor",
    "marker-found": "Marker topildi",
    "marker-lost": "Marker yo'qoldi",
    "target-missing": "Target .mind fayli topilmadi",
    "camera-error": "Kamera yoki AR xatosi",
    "insecure-context": "HTTPS kerak: telefon IP/http orqali kamerani ochmaydi",
    unsupported: "Brauzer mos emas yoki HTTPS kerak",
  },
  ru: {
    idle: "AR not started",
    checking: "Checking target file",
    loading: "Loading MindAR and model",
    "camera-permission": "Waiting for camera permission",
    ready: "Camera ready",
    "marker-found": "Target detected",
    "marker-lost": "Target lost",
    "target-missing": "Target .mind file missing",
    "camera-error": "Camera or AR error",
    "insecure-context": "HTTPS required: phones block camera on IP/http pages",
    unsupported: "Browser unsupported or HTTPS required",
  },
  en: {
    idle: "AR not started",
    checking: "Checking target file",
    loading: "Loading MindAR and model",
    "camera-permission": "Waiting for camera permission",
    ready: "Camera ready",
    "marker-found": "Target detected",
    "marker-lost": "Target lost",
    "target-missing": "Target .mind file missing",
    "camera-error": "Camera or AR error",
    "insecure-context": "HTTPS required: phones block camera on IP/http pages",
    unsupported: "Browser unsupported or HTTPS required",
  },
} as const;

const mobileUserAgentPattern =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

export default function ARModule({ lang, onBack }: ARModuleProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [status, setStatus] = useState<ARStatus>("idle");
  const text = uiText[lang];

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || "";
    const hasTouch = navigator.maxTouchPoints > 1;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(mobileUserAgentPattern.test(userAgent) || (hasTouch && coarsePointer));
  }, []);

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      <header className="relative z-30 flex items-center justify-between border-b border-white/10 bg-black/45 px-3 py-3 backdrop-blur-xl md:px-6">
        <div className="min-w-0">
          <p className="truncate text-[10px] uppercase tracking-[0.3em] text-cyan-300">
            {text.target}
          </p>
          <h1 className="mt-1 truncate text-base font-semibold md:text-xl">{text.title}</h1>
        </div>
        <button
          onClick={onBack}
          className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
        >
          {text.back}
        </button>
      </header>

      <div className="relative z-10 grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[1fr_22rem]">
        <main className="relative min-h-0">
          {isMobile ? (
            <MobileWebARExperience lang={lang} onStatusChange={setStatus} />
          ) : (
            <div className="flex h-full items-center justify-center p-6">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md rounded-lg border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-xl"
              >
                <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300">
                  Mobile WebAR
                </p>
                <h2 className="mt-4 text-2xl font-semibold">
                  Open this experience on a smartphone.
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Camera AR needs a mobile browser, HTTPS or localhost, and a compiled
                  MindAR image target.
                </p>
              </motion.div>
            </div>
          )}
        </main>

        <aside className="hidden min-h-0 overflow-y-auto border-l border-white/10 bg-black/30 p-5 backdrop-blur-xl xl:block">
          <p className="text-[10px] uppercase tracking-[0.3em] text-cyan-300">
            {text.compatibility}
          </p>
          <p className="mt-4 text-sm leading-6 text-white/65">{text.subtitle}</p>

          <div className="mt-5 rounded-lg border border-cyan-400/25 bg-cyan-400/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300">
              {text.status}
            </p>
            <p className="mt-2 text-sm font-medium text-white">{statusText[lang][status]}</p>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">
              {text.instructions}
            </p>
            <div className="mt-3 space-y-2">
              {text.instructionsList.map((item) => (
                <p key={item} className="rounded-md border border-white/10 bg-black/25 px-3 py-2 text-xs leading-5 text-white/65">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300">
              {text.controls}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">{text.controlsBody}</p>
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300">
              {text.performance}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">{text.performanceBody}</p>
          </div>

          <div className="mt-5 rounded-lg border border-purple-400/20 bg-purple-500/10 p-4">
            <p className="text-[10px] uppercase tracking-[0.28em] text-purple-200">
              {text.targetBuild}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">{text.targetBuildBody}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
