import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Language } from "../types";

interface ARModuleProps {
  lang: Language;
  onBack: () => void;
}

type ARStatus = "loading" | "ready" | "marker-found" | "marker-lost" | "camera-error";

const uiText = {
  uz: {
    title: "WebAR Marker Tajribasi",
    subtitle:
      "Mobil qurilmada kamerani ochib, Hiro marker ustida fakultet uchun AR obyektni ko'rsating.",
    marker: "Marker: Hiro",
    compatibility: "Mos brauzer: Chrome / Android",
    mobileHint:
      "Kamera ochilgach, Hiro markerini boshqa ekran yoki qog'ozda kameraga tuting. Marker topilganda obyekt chiqadi.",
    desktopFallback: "Please open this feature on your mobile device to use AR.",
    fallbackHint:
      "Bu AR sahna mobil brauzer uchun mo'ljallangan. Telefon orqali ochib ko'ring.",
    checklistTitle: "Ishlash tartibi",
    checklist: [
      "1. Sahifani telefonda oching.",
      "2. Kamera ruxsatini bering.",
      "3. Hiro markerini print qiling yoki boshqa ekranda oching.",
      "4. Kamerani markerga qarating.",
      "5. Marker topilganda 3D obyekt paydo bo'ladi.",
    ],
    statusLabel: "Holat",
    statusMap: {
      loading: "AR sahna yuklanmoqda",
      ready: "Kamera tayyor, marker kutilmoqda",
      "marker-found": "Marker topildi, obyekt faol",
      "marker-lost": "Marker yo'qoldi, qayta qarating",
      "camera-error": "Kamera bilan bog'liq xato",
    },
    markerHelpTitle: "Muhim eslatma",
    markerHelpBody:
      "Agar marker shu telefon ekranida bo'lsa, kamera uni ko'ra olmaydi. Marker boshqa telefon, monitor yoki printda bo'lishi kerak.",
    markerPreviewTitle: "Hiro marker preview",
    previewHint: "Quyidagi marker tasvirini boshqa qurilmada oching yoki print qiling.",
    back: "Orqaga",
  },
  ru: {
    title: "WebAR C Marker Tracking",
    subtitle:
      "Откройте камеру на мобильном устройстве и наведите ее на Hiro marker для просмотра AR сцены факультета.",
    marker: "Маркер: Hiro",
    compatibility: "Совместимо: Chrome / Android",
    mobileHint:
      "После запуска камеры покажите Hiro marker с другого экрана или на бумаге. Объект появится после распознавания.",
    desktopFallback: "Please open this feature on your mobile device to use AR.",
    fallbackHint:
      "Эта AR сцена предназначена для мобильного браузера. Откройте ее на телефоне.",
    checklistTitle: "Как использовать",
    checklist: [
      "1. Откройте страницу на телефоне.",
      "2. Разрешите доступ к камере.",
      "3. Откройте Hiro marker на другом экране или распечатайте его.",
      "4. Наведите камеру на marker.",
      "5. После распознавания появится 3D объект.",
    ],
    statusLabel: "Статус",
    statusMap: {
      loading: "AR сцена загружается",
      ready: "Камера готова, ожидание marker",
      "marker-found": "Marker найден, объект активен",
      "marker-lost": "Marker потерян, наведите снова",
      "camera-error": "Ошибка доступа к камере",
    },
    markerHelpTitle: "Важное примечание",
    markerHelpBody:
      "Если marker находится на экране этого же телефона, камера не сможет его увидеть. Откройте его на другом устройстве или распечатайте.",
    markerPreviewTitle: "Hiro marker preview",
    previewHint: "Откройте marker ниже на другом устройстве или распечатайте.",
    back: "Назад",
  },
  en: {
    title: "WebAR Marker Experience",
    subtitle:
      "Open the camera on a mobile device and point it at a Hiro marker to preview the faculty AR scene.",
    marker: "Marker: Hiro",
    compatibility: "Compatible with: Chrome / Android",
    mobileHint:
      "After the camera opens, show the Hiro marker from another screen or a printed sheet. The object appears when the marker is detected.",
    desktopFallback: "Please open this feature on your mobile device to use AR.",
    fallbackHint:
      "This AR scene is intended for mobile browsers. Open it on your phone to use the camera.",
    checklistTitle: "How it works",
    checklist: [
      "1. Open the page on your phone.",
      "2. Allow camera access.",
      "3. Open the Hiro marker on another screen or print it.",
      "4. Point the camera at the marker.",
      "5. The 3D object appears when the marker is detected.",
    ],
    statusLabel: "Status",
    statusMap: {
      loading: "Loading AR scene",
      ready: "Camera ready, waiting for marker",
      "marker-found": "Marker detected, object active",
      "marker-lost": "Marker lost, aim again",
      "camera-error": "Camera access error",
    },
    markerHelpTitle: "Important note",
    markerHelpBody:
      "If the marker is on the same phone screen, the camera cannot see it. Open it on another phone, monitor, or print it.",
    markerPreviewTitle: "Hiro marker preview",
    previewHint: "Open the marker below on another device or print it.",
    back: "Back",
  },
} as const;

const mobileUserAgentPattern =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

const hiroMarkerUrl =
  "https://raw.githubusercontent.com/AR-js-org/AR.js/master/data/images/hiro.png";

export default function ARModule({ lang, onBack }: ARModuleProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState<ARStatus>("loading");
  const text = uiText[lang];

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || "";
    const hasTouch = navigator.maxTouchPoints > 1;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(mobileUserAgentPattern.test(userAgent) || (hasTouch && coarsePointer));
  }, []);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || data.source !== "tv-tech-ar") return;

      if (data.type === "status" && typeof data.value === "string") {
        if (
          data.value === "loading" ||
          data.value === "ready" ||
          data.value === "marker-found" ||
          data.value === "marker-lost" ||
          data.value === "camera-error"
        ) {
          setStatus(data.value);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.18),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_28%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <div className="flex items-center justify-between border-b border-white/10 bg-black/30 px-5 py-4 backdrop-blur-xl md:px-8">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">{text.marker}</p>
            <h1 className="mt-2 text-2xl font-semibold">{text.title}</h1>
          </div>
          <button
            onClick={onBack}
            className="rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            {text.back}
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-6 p-5 md:p-8 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="relative min-h-[60vh] overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
            {isMobile ? (
              <>
                <iframe
                  title="TV Faculty WebAR"
                  src="/ar-experience.html"
                  allow="camera; microphone; accelerometer; gyroscope"
                  className="h-full min-h-[60vh] w-full border-0"
                />
                <div className="pointer-events-none absolute left-4 top-4 max-w-sm rounded-2xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
                    {text.compatibility}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{text.mobileHint}</p>
                </div>
                <div className="absolute right-4 top-4 rounded-2xl border border-white/10 bg-black/60 px-4 py-3 text-sm backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">
                    {text.statusLabel}
                  </p>
                  <p className="mt-2 font-medium text-cyan-300">
                    {text.statusMap[status]}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[60vh] items-center justify-center p-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-lg rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-xl"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
                    Mobile Only
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold">
                    {text.desktopFallback}
                  </h2>
                  <p className="mt-4 text-sm leading-6 text-white/60">
                    {text.fallbackHint}
                  </p>
                </motion.div>
              </div>
            )}
          </div>

          <aside className="rounded-[2rem] border border-white/10 bg-black/30 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">
              {text.compatibility}
            </p>
            <p className="mt-4 text-sm leading-6 text-white/65">{text.subtitle}</p>

            <div className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
                {text.statusLabel}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">{text.statusMap[status]}</p>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-white/40">
                {text.checklistTitle}
              </p>
              <div className="mt-4 space-y-3">
                {text.checklist.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/70"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
                {text.markerHelpTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                {text.markerHelpBody}
              </p>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
                {text.markerPreviewTitle}
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                {text.previewHint}
              </p>
              <div className="mt-4 rounded-2xl overflow-hidden border border-white/10 bg-white p-4">
                <img
                  src={hiroMarkerUrl}
                  alt="Hiro marker"
                  className="w-full h-auto object-contain"
                />
              </div>
              <a
                href={hiroMarkerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                Hiro marker ochish
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
