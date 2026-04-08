import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Language } from "../types";

interface ARModuleProps {
  lang: Language;
  onBack: () => void;
}

const uiText = {
  uz: {
    title: "WebAR Marker Tajribasi",
    subtitle:
      "Mobil qurilmada kamerani ochib, Hiro marker ustida fakultet uchun AR obyektni ko'rsating.",
    marker: "Marker: Hiro",
    compatibility: "Mos brauzer: Chrome / Android",
    mobileHint:
      "Telefon kamerasi ochilgach, Hiro markerga qarating. Marker aniqlansa 3D obyekt va sarlavha ko'rinadi.",
    desktopFallback: "Please open this feature on your mobile device to use AR.",
    fallbackHint:
      "Bu AR sahna mobil brauzer uchun mo'ljallangan. Telefon orqali ochib ko'ring.",
    checklistTitle: "Ishlash tartibi",
    checklist: [
      "1. Sahifani telefonda oching.",
      "2. Kamera ruxsatini bering.",
      "3. Hiro markerini ekranga tuting.",
      "4. 3D obyekt animatsiya bilan paydo bo'ladi.",
    ],
    back: "Orqaga",
  },
  ru: {
    title: "WebAR С Marker Tracking",
    subtitle:
      "Откройте камеру на мобильном устройстве и наведите её на Hiro marker для AR просмотра факультета.",
    marker: "Маркер: Hiro",
    compatibility: "Совместимо: Chrome / Android",
    mobileHint:
      "После запуска камеры наведите устройство на Hiro marker. При распознавании появятся 3D объект и заголовок.",
    desktopFallback: "Please open this feature on your mobile device to use AR.",
    fallbackHint:
      "Эта AR сцена предназначена для мобильного браузера. Откройте её на телефоне.",
    checklistTitle: "Как использовать",
    checklist: [
      "1. Откройте страницу на телефоне.",
      "2. Разрешите доступ к камере.",
      "3. Наведите камеру на Hiro marker.",
      "4. 3D объект появится с анимацией.",
    ],
    back: "Назад",
  },
  en: {
    title: "WebAR Marker Experience",
    subtitle:
      "Open the camera on a mobile device and point it at the Hiro marker to preview the faculty AR scene.",
    marker: "Marker: Hiro",
    compatibility: "Compatible with: Chrome / Android",
    mobileHint:
      "Once the camera opens, aim it at the Hiro marker. The 3D object and title will appear when the marker is detected.",
    desktopFallback: "Please open this feature on your mobile device to use AR.",
    fallbackHint:
      "This AR scene is intended for mobile browsers. Open it on your phone to use the camera.",
    checklistTitle: "How it works",
    checklist: [
      "1. Open the page on your phone.",
      "2. Allow camera access.",
      "3. Point the camera at the Hiro marker.",
      "4. The 3D object appears with animation.",
    ],
    back: "Back",
  },
} as const;

const mobileUserAgentPattern =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

function buildArDocument(title: string) {
  const overlaySvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="256" viewBox="0 0 512 256">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#22d3ee"/>
          <stop offset="100%" stop-color="#818cf8"/>
        </linearGradient>
      </defs>
      <rect width="512" height="256" rx="28" fill="#06131f"/>
      <rect x="16" y="16" width="480" height="224" rx="22" fill="url(#g)" opacity="0.18"/>
      <text x="36" y="92" fill="#d9f7ff" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700">
        TV Faculty
      </text>
      <text x="36" y="138" fill="#8fdfff" font-family="Arial, Helvetica, sans-serif" font-size="26">
        AR overlay preview
      </text>
      <text x="36" y="184" fill="#c4fbff" font-family="Arial, Helvetica, sans-serif" font-size="20">
        Marker detected content panel
      </text>
    </svg>
  `);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
    />
    <title>TV Faculty WebAR</title>
    <script src="https://aframe.io/releases/1.5.0/aframe.min.js"></script>
    <script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
    <style>
      html, body {
        margin: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #000;
        font-family: Arial, Helvetica, sans-serif;
      }
      .ar-note {
        position: fixed;
        left: 50%;
        bottom: 18px;
        transform: translateX(-50%);
        z-index: 20;
        padding: 10px 14px;
        border-radius: 999px;
        background: rgba(3, 7, 18, 0.72);
        color: #d8f8ff;
        border: 1px solid rgba(34, 211, 238, 0.35);
        font-size: 12px;
        letter-spacing: 0.04em;
        text-align: center;
        backdrop-filter: blur(12px);
      }
    </style>
    <script>
      window.addEventListener("DOMContentLoaded", function () {
        AFRAME.registerComponent("marker-feedback", {
          init: function () {
            var note = document.getElementById("ar-note");
            this.el.addEventListener("markerFound", function () {
              note.textContent = "Marker detected. AR object is active.";
            });
            this.el.addEventListener("markerLost", function () {
              note.textContent = "Point the camera at the Hiro marker.";
            });
          }
        });

        AFRAME.registerComponent("tap-pulse", {
          init: function () {
            var el = this.el;
            var enlarged = false;
            el.addEventListener("click", function () {
              enlarged = !enlarged;
              el.setAttribute(
                "animation__tap",
                "property: scale; to: " + (enlarged ? "1.35 1.35 1.35" : "1 1 1") + "; dur: 280; easing: easeInOutQuad"
              );
            });
          }
        });
      });
    </script>
  </head>
  <body>
    <div id="ar-note" class="ar-note">Point the camera at the Hiro marker.</div>

    <a-scene
      embedded
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
      renderer="antialias: true; alpha: true"
      arjs="trackingMethod: best; sourceType: webcam; debugUIEnabled: false;"
    >
      <a-assets>
        <img id="facultyOverlay" src="data:image/svg+xml;charset=utf-8,${overlaySvg}" />
      </a-assets>

      <a-marker preset="hiro" marker-feedback>
        <a-entity position="0 0.2 0">
          <a-box
            position="0 0.7 0"
            depth="0.8"
            height="0.8"
            width="0.8"
            color="#22d3ee"
            material="metalness: 0.25; roughness: 0.3;"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 5000; easing: linear"
            animation__float="property: position; dir: alternate; dur: 1800; loop: true; to: 0 0.95 0"
            tap-pulse
          ></a-box>

          <a-ring
            position="0 0.18 0"
            rotation="-90 0 0"
            radius-inner="0.95"
            radius-outer="1.15"
            color="#818cf8"
            animation="property: rotation; to: -90 0 360; loop: true; dur: 6000; easing: linear"
          ></a-ring>

          <a-text
            value="${title}"
            position="0 1.85 0"
            align="center"
            color="#FFFFFF"
            width="4.8"
            shader="msdf"
          ></a-text>

          <a-plane
            src="#facultyOverlay"
            position="0 1.1 -0.95"
            width="2.6"
            height="1.3"
            material="transparent: true"
          ></a-plane>
        </a-entity>
      </a-marker>

      <a-entity camera></a-entity>
    </a-scene>
  </body>
</html>`;
}

export default function ARModule({ lang, onBack }: ARModuleProps) {
  const [isMobile, setIsMobile] = useState(false);
  const text = uiText[lang];

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || "";
    const hasTouch = navigator.maxTouchPoints > 1;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(mobileUserAgentPattern.test(userAgent) || (hasTouch && coarsePointer));
  }, []);

  const arDocument = useMemo(
    () => buildArDocument("TV Faculty - AR View"),
    [],
  );

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

        <div className="grid flex-1 grid-cols-1 gap-6 p-5 md:p-8 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="relative min-h-[60vh] overflow-hidden rounded-[2rem] border border-white/10 bg-black/60 shadow-[0_0_60px_rgba(0,0,0,0.35)]">
            {isMobile ? (
              <>
                <iframe
                  title="TV Faculty WebAR"
                  srcDoc={arDocument}
                  allow="camera; microphone; accelerometer; gyroscope"
                  className="h-full min-h-[60vh] w-full border-0"
                />
                <div className="pointer-events-none absolute left-4 top-4 max-w-xs rounded-2xl border border-white/10 bg-black/55 px-4 py-3 backdrop-blur-md">
                  <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
                    {text.compatibility}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-white/70">{text.mobileHint}</p>
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

            <div className="mt-6 rounded-3xl border border-cyan-500/20 bg-cyan-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">
                A-Frame + AR.js
              </p>
              <p className="mt-3 text-sm leading-6 text-white/65">
                Marker aniqlanganda 3D box, aylanish animatsiyasi, floating effect,
                sarlavha va image overlay chiqadi. Box ustiga tap qilsangiz, obyekt
                kattalashib-kichrayadi.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
