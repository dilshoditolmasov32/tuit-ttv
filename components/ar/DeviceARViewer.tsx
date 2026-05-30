import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ModelViewerElement } from "../../types/model-viewer";

const DEFAULT_MODEL_SRC = `${import.meta.env.BASE_URL}images/car.glb`;
// iPhone uchun default USDZ fayl manzili

const MODEL_VIEWER_SCRIPT =
  "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";

type LoadState = "booting" | "loading" | "ready" | "error";
type ARSupportLevel = "unknown" | "supported" | "limited" | "unsupported";

function isAndroidDevice() {
  return /Android/i.test(navigator.userAgent || "");
}

async function detectARSupport(): Promise<ARSupportLevel> {
  if (!window.isSecureContext) return "unsupported";

  const xr = navigator.xr;
  if (xr?.isSessionSupported) {
    try {
      if (await xr.isSessionSupported("immersive-ar")) {
        return "supported";
      }
    } catch {
      // Ignore
    }
  }

  if (isAndroidDevice()) {
    return "limited";
  }

  if (/iPhone|iPad|iPod/i.test(navigator.userAgent || "")) {
    return "limited";
  }

  return "unsupported";
}

function ensureModelViewerReady(): Promise<void> {
  if (customElements.get("model-viewer")) {
    return Promise.resolve();
  }

  const existingScript = document.querySelector<HTMLScriptElement>(
    'script[data-model-viewer-loader="true"]',
  );

  if (existingScript) {
    return customElements.whenDefined("model-viewer").then(() => undefined);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = MODEL_VIEWER_SCRIPT;
    script.dataset.modelViewerLoader = "true";
    script.onload = () => {
      customElements
        .whenDefined("model-viewer")
        .then(() => resolve())
        .catch(reject);
    };
    script.onerror = () =>
      reject(new Error("model-viewer script failed to load"));
    document.head.appendChild(script);
  });
}

export interface DeviceARViewerProps {
  modelSrc?: string;
  iosModelSrc?: string; 
  modelAlt?: string;
  className?: string;
  arButtonLabel?: string;
  loadingLabel?: string;
  errorLabel?: string;
  unsupportedLabel?: string;
  arLimitedLabel?: string;
  arFailedLabel?: string;
  hintLabel?: string;
}

export default function DeviceARViewer({
  modelSrc = DEFAULT_MODEL_SRC,
  iosModelSrc,
  modelAlt = "3D avtomobil modeli",
  className = "",
  arButtonLabel = "Xonaga joylashtirish (AR)",
  loadingLabel = "3D model yuklanmoqda",
  errorLabel = "Model yuklanmadi. Internet va fayl manzilini tekshiring.",
  unsupportedLabel = "Bu qurilmada AR qo'llab-quvvatlanmaydi. Android Chrome yoki iPhone Safari ishlating.",
  arLimitedLabel = "Bu telefon Google Play Services for AR (ARCore) ni qo'llab-quvvatlamaydi. 3D modelni sahifada aylantirish ishlaydi, lekin xonaga joylashtirish AR ishlamasligi mumkin.",
  arFailedLabel = "AR ochilmadi. Telefoningiz ARCore bilan mos emas. Modelni yuqorida 3D rejimda ko'rishingiz mumkin.",
  hintLabel = "Modelni aylantirish uchun barmoq bilan suring. Kattalashtirish — pinch.",
}: DeviceARViewerProps) {
  const viewerRef = useRef<ModelViewerElement>(null);
  const [loadState, setLoadState] = useState<LoadState>("booting");
  const [progress, setProgress] = useState(0);
  const [canActivateAR, setCanActivateAR] = useState(false);
  const [isActivatingAR, setIsActivatingAR] = useState(false);
  const [arSupport, setArSupport] = useState<ARSupportLevel>("unknown");
  const [arNotice, setArNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    detectARSupport().then((level) => {
      if (!cancelled) setArSupport(level);
    });

    ensureModelViewerReady()
      .then(() => {
        if (!cancelled) {
          setLoadState("loading");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoadState("error");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loadState === "booting") return;

    let cancelled = false;
    let detachListeners: (() => void) | undefined;

    const bindViewer = () => {
      const viewer = viewerRef.current;
      if (!viewer) {
        requestAnimationFrame(bindViewer);
        return;
      }
      if (cancelled) return;

      setLoadState("loading");
      setProgress(0);

      const handleLoad = () => {
        if (cancelled) return;
        setLoadState("ready");
        setProgress(100);
        setCanActivateAR(viewer.canActivateAR);
      };

      const handleProgress = (event: Event) => {
        const detail = (event as CustomEvent<{ totalProgress: number }>).detail;
        if (typeof detail?.totalProgress === "number") {
          setProgress(Math.min(100, Math.round(detail.totalProgress * 100)));
        }
      };

      const handleError = () => {
        if (!cancelled) setLoadState("error");
      };

      const handleARStatus = (event: Event) => {
        const status = (event as CustomEvent<{ status?: string }>).detail
          ?.status;
        if (status === "failed" || status === "not-presenting") {
          setArNotice(arFailedLabel);
        }
      };

      viewer.addEventListener("load", handleLoad);
      viewer.addEventListener("progress", handleProgress);
      viewer.addEventListener("error", handleError);
      viewer.addEventListener("ar-status", handleARStatus as EventListener);

      if (viewer.loaded) {
        handleLoad();
      }

      detachListeners = () => {
        viewer.removeEventListener("load", handleLoad);
        viewer.removeEventListener("progress", handleProgress);
        viewer.removeEventListener("error", handleError);
        viewer.removeEventListener(
          "ar-status",
          handleARStatus as EventListener,
        );
      };
    };

    bindViewer();

    return () => {
      cancelled = true;
      detachListeners?.();
    };
  }, [loadState, modelSrc, arFailedLabel]);

  const handleActivateAR = useCallback(async () => {
    const viewer = viewerRef.current;
    if (!viewer?.canActivateAR || loadState !== "ready") return;

    if (arSupport === "limited" && isAndroidDevice()) {
      setArNotice(arLimitedLabel);
    }

    setIsActivatingAR(true);
    try {
      await viewer.activateAR();
    } catch (error) {
      console.error("Device AR activation failed:", error);
      setArNotice(arFailedLabel);
    } finally {
      setIsActivatingAR(false);
    }
  }, [arFailedLabel, arLimitedLabel, arSupport, loadState]);

  const showModelSpinner = loadState === "booting" || loadState === "loading";
  const showLimitedAndroidNotice = arSupport === "limited" && isAndroidDevice();
  const arButtonDisabled =
    loadState !== "ready" ||
    !canActivateAR ||
    isActivatingAR ||
    arSupport === "unsupported";

  return (
    <div
      className={`flex h-full min-h-0 w-full flex-col overflow-hidden bg-[#020617] ${className}`}
    >
      <div className="relative min-h-0 flex-1">
        {loadState !== "booting" && (
          <model-viewer
            key={modelSrc} 
            ref={viewerRef}
            src={modelSrc}
            {...(iosModelSrc ? { "ios-src": iosModelSrc } : {})}
            alt={modelAlt}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="fixed" // TO'G'RILANDI: iPhone-da obyektning o'lchami buzilib, yo'qolib qolishini oldini oladi
            ar-placement="floor"
            camera-controls
            auto-rotate
            rotation-per-second="30deg"
            shadow-intensity="1"
            shadow-softness="0.8"
            exposure="1"
            environment-image="neutral"
            loading="eager"
            reveal="auto"
            interaction-prompt="auto"
            touch-action="pan-y"
            camera-orbit="0deg 75deg 105%"
            min-camera-orbit="auto auto 50%"
            max-camera-orbit="auto auto 200%"
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#020617",
              // @ts-ignore
              "--poster-color": "#020617",
            }}
          />
        )}

        {showModelSpinner && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#020617]/92 backdrop-blur-sm">
            <div
              className="h-14 w-14 animate-spin rounded-full border-[3px] border-cyan-300/25 border-t-cyan-300"
              aria-hidden="true"
            />
            <p className="mt-4 text-sm font-medium text-white">
              {loadState === "booting"
                ? "AR tizimi yuklanmoqda..."
                : loadingLabel}
            </p>
            {loadState === "loading" && (
              <>
                <p className="mt-1 text-xs text-cyan-200/80">{progress}%</p>
                <div className="mt-4 h-1.5 w-48 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-purple-400 transition-all duration-300"
                    style={{ width: `${Math.max(progress, 8)}%` }}
                  />
                </div>
              </>
            )}
          </div>
        )}

        {loadState === "error" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#020617]/95 p-6 text-center">
            <p className="max-w-xs text-sm leading-6 text-red-200">
              {errorLabel}
            </p>
          </div>
        )}
      </div>

      <div className="relative z-10 shrink-0 space-y-2 border-t border-white/10 bg-black/75 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] pt-3 backdrop-blur-xl">
        <p className="text-center text-[11px] leading-4 text-white/50">
          {hintLabel}
        </p>

        {showLimitedAndroidNotice && (
          <div className="rounded-lg border border-amber-400/30 bg-amber-500/10 px-3 py-2.5 text-xs leading-5 text-amber-100/90">
            {arLimitedLabel}
          </div>
        )}

        {arNotice && (
          <div className="rounded-lg border border-red-400/25 bg-red-500/10 px-3 py-2.5 text-xs leading-5 text-red-100/90">
            {arNotice}
          </div>
        )}

        <button
          type="button"
          onClick={handleActivateAR}
          disabled={arButtonDisabled}
          className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/45 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-3 text-sm font-semibold text-cyan-50 shadow-[0_0_32px_rgba(34,211,238,0.18)] transition enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-white/35"
        >
          {isActivatingAR ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-200/30 border-t-cyan-100" />
              AR ochilmoqda...
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <path d="M4 8V6a2 2 0 0 1 2-2h2" />
                <path d="M4 16v2a2 2 0 0 0 2 2h2" />
                <path d="M16 4h2a2 2 0 0 1 2 2v2" />
                <path d="M16 20h2a2 2 0 0 0 2-2v-2" />
                <path d="M9 12h6" />
                <path d="M12 9v6" />
              </svg>
              {arButtonLabel}
            </>
          )}
        </button>

        {loadState === "ready" && !canActivateAR && (
          <p className="text-center text-xs leading-5 text-amber-200/85">
            {unsupportedLabel}
          </p>
        )}
      </div>
    </div>
  );
}
