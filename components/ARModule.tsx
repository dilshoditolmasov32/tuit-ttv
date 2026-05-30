import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Language } from "../types";
import DeviceARViewer from "./ar/DeviceARViewer";
import MobileWebARExperience from "./ar/MobileWebARExperience";

type MobileARMode = "device" | "poster";

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
  | "in-app-browser"
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
    modeDevice: "3D model",
    modePoster: "Poster AR",
    modePosterHint: "ARCore kerak emas — logoni kameraga tuting",
  },
  ru: {
    title: "Mobile WebAR TV Showcase",
    subtitle:
      "Смартфонный AR: распознаёт логотип или постер факультета и показывает интерактивную 3D-экспозицию.",
    target: "Target: faculty logo/poster",
    compatibility: "Chrome Android, Safari iOS 16+, secure HTTPS",
    instructions: "Сканирование",
    instructionsList: [
      "Откройте сайт на телефоне через HTTPS.",
      "Запустите AR-камеру и разрешите доступ.",
      "Покажите логотип или постер факультета на бумаге или экране.",
      "После появления модели используйте drag, pinch, tap и double tap.",
    ],
    controls: "Сенсорное управление",
    controlsBody: "Tap — info, drag — rotate, pinch — zoom, double tap — reset.",
    performance: "Мобильная оптимизация",
    performanceBody:
      "MindAR image tracking, лимит DPR 1.5, мобильный renderer без теней, fallback model и нормализация GLB.",
    targetBuild: "Target файл",
    targetBuildBody:
      "Для production создайте faculty-logo.mind через MindAR compiler и поместите в public/assets/targets.",
    back: "Назад",
    status: "Статус",
    modeDevice: "3D модель",
    modePoster: "Poster AR",
    modePosterHint: "ARCore не нужен — наведите камеру на логотип",
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
    modeDevice: "3D model",
    modePoster: "Poster AR",
    modePosterHint: "No ARCore — point camera at the logo",
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
    "in-app-browser": "Ichki brauzer mos emas: linkni Chrome yoki Safari'da oching",
    unsupported: "Android Chrome yoki iPhone Safari kerak",
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
    "in-app-browser": "In-app browser unsupported: open the link in Chrome or Safari",
    unsupported: "Use Android Chrome or iPhone Safari",
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
    "in-app-browser": "In-app browser unsupported: open the link in Chrome or Safari",
    unsupported: "Use Android Chrome or iPhone Safari",
  },
} as const;

const mobileUserAgentPattern =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const deviceModels = [
  {
    id: "jism",
    label: "Avtomobil",
    src: `${import.meta.env.BASE_URL}images/3d-object-2.glb`,
    alt: " Shaklning 3D modeli",
  },
  {
    id: "printer",
    label: "3D printer",
    src: `${import.meta.env.BASE_URL}images/3d-printer.glb`,
    alt: "3D printer modeli",
  },
  {
    id: "mixer",
    label: "Mixer",
    src: `${import.meta.env.BASE_URL}images/mixer.glb`,
    alt: "Mixer modeli",
  },
  {
    id: "studio",
    label: "Studio Microphone",
    src: `${import.meta.env.BASE_URL}images/studio_microphone.glb`,
    alt: "Mikrofon modeli",
  },
  {
    id: "softbox",
    label: "Softbox",
    src: `${import.meta.env.BASE_URL}images/studio_softbox.glb`,
    alt: "Softbox modeli",
  },
] as const;

export default function ARModule({ lang, onBack }: ARModuleProps) {
  const [isMobile, setIsMobile] = useState(true);
  const [mobileMode, setMobileMode] = useState<MobileARMode>("device");
  const [selectedModelId, setSelectedModelId] =
    useState<(typeof deviceModels)[number]["id"]>("jism");
  const [status, setStatus] = useState<ARStatus>("idle");
  const text = uiText[lang];
  const selectedModel =
    deviceModels.find((model) => model.id === selectedModelId) ??
    deviceModels[0];

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || "";
    const hasTouch = navigator.maxTouchPoints > 1;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(mobileUserAgentPattern.test(userAgent) || (hasTouch && coarsePointer));
  }, []);

  return (
    <motion.div className="relative flex h-[100dvh] max-h-[100dvh] w-full flex-col overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.18),transparent_30%)]" />

      <header className="relative z-30 flex shrink-0 items-center justify-between border-b border-white/10 bg-black/45 px-3 py-2.5 backdrop-blur-xl ar-safe-top md:px-6 md:py-3">
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
        <main className="relative min-h-0 flex-1">
          {isMobile ? (
            <div className="flex h-full min-h-0 flex-col">
              <div className="flex shrink-0 gap-2 px-3 pb-2 pt-2">
                <button
                  type="button"
                  onClick={() => setMobileMode("device")}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    mobileMode === "device"
                      ? "border-cyan-300/50 bg-cyan-400/15 text-cyan-100"
                      : "border-white/10 bg-black/30 text-white/60"
                  }`}
                >
                  {text.modeDevice}
                </button>
                <button
                  type="button"
                  onClick={() => setMobileMode("poster")}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                    mobileMode === "poster"
                      ? "border-purple-300/50 bg-purple-400/15 text-purple-100"
                      : "border-white/10 bg-black/30 text-white/60"
                  }`}
                >
                  {text.modePoster}
                </button>
              </div>
              <p className="shrink-0 px-3 pb-2 text-center text-[10px] leading-4 text-white/45">
                {text.modePosterHint}
              </p>
              <div className="flex min-h-0 flex-1 flex-col">
                {mobileMode === "device" ? (
                  <>
                    <div className="flex shrink-0 gap-2 overflow-x-auto px-3 pb-2">
                      {deviceModels.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => setSelectedModelId(model.id)}
                          className={`min-w-fit rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                            selectedModelId === model.id
                              ? "border-cyan-300/55 bg-cyan-400/15 text-cyan-100"
                              : "border-white/10 bg-black/30 text-white/60"
                          }`}
                        >
                          {model.label}
                        </button>
                      ))}
                    </div>
                    <DeviceARViewer
                      className="min-h-0 flex-1"
                      modelSrc={selectedModel.src}
                      iosModelSrc=""
                      modelAlt={selectedModel.alt}
                      arButtonLabel={
                      lang === "uz"
                        ? "Xonaga joylashtirish (AR)"
                        : lang === "ru"
                          ? "Разместить в комнате (AR)"
                          : "Place in room (AR)"
                      }
                      loadingLabel={
                      lang === "uz"
                        ? "3D model yuklanmoqda"
                        : lang === "ru"
                          ? "Загрузка 3D модели"
                          : "Loading 3D model"
                      }
                      arLimitedLabel={
                      lang === "uz"
                        ? "Telefoningiz Google Play Services for AR (ARCore) ni qo'llab-quvvatlamaydi. 3D model sahifada ishlaydi; xonaga joylashtirish AR esa ishlamasligi mumkin."
                        : lang === "ru"
                          ? "Ваш телефон не поддерживает Google Play Services for AR (ARCore). 3D модель на странице работает, но AR в комнате может быть недоступен."
                          : "Your phone does not support Google Play Services for AR (ARCore). The 3D model works on the page, but room AR may be unavailable."
                      }
                      arFailedLabel={
                      lang === "uz"
                        ? "AR ochilmadi. Qurilmangiz ARCore bilan mos emas. Poster AR rejimini sinab ko'ring."
                        : lang === "ru"
                          ? "AR не открылся. Устройство несовместимо с ARCore. Попробуйте режим Poster AR."
                          : "AR failed to open. Your device is not ARCore-compatible. Try Poster AR mode."
                      }
                      hintLabel={
                      lang === "uz"
                        ? "Modelni aylantirish — suring. Kattalashtirish — pinch."
                        : lang === "ru"
                          ? "Поверните модель жестом. Масштаб — pinch."
                          : "Drag to rotate. Pinch to zoom."
                      }
                    />
                  </>
                ) : (
                  <MobileWebARExperience lang={lang} onStatusChange={setStatus} />
                )}
              </div>
            </div>
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
    </motion.div>
  );
}
