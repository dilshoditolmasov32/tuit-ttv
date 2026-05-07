import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { Language } from "../../types";

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

type ShowcaseItem = {
  id: string;
  title: Record<Language, string>;
  body: Record<Language, string>;
  color: string;
};

type MindARThreeInstance = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  addAnchor: (targetIndex: number) => {
    group: THREE.Group;
    onTargetFound?: () => void;
    onTargetLost?: () => void;
  };
  start: () => Promise<void>;
  stop: () => void;
};

declare global {
  interface Window {
    MINDAR?: {
      IMAGE?: {
        MindARThree: new (options: {
          container: HTMLElement;
          imageTargetSrc: string;
          filterMinCF?: number;
          filterBeta?: number;
          warmupTolerance?: number;
          missTolerance?: number;
          uiLoading?: "yes" | "no";
          uiScanning?: "yes" | "no";
          uiError?: "yes" | "no";
        }) => MindARThreeInstance;
      };
    };
  }
}

const MINDAR_SCRIPT =
  "https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js";

const modelUrl = new URL("../../assests/highres.glb", import.meta.url).href;
const logoUrl = new URL("../../assests/logo.jpg", import.meta.url).href;

const showcaseItems: ShowcaseItem[] = [
  {
    id: "camera",
    color: "#22d3ee",
    title: {
      uz: "Telekamera tizimi",
      ru: "Television Camera Rig",
      en: "Television Camera Rig",
    },
    body: {
      uz: "Studiyadagi optika, sensor va efirga tayyor kadr kompozitsiyasini AR ko'rinishida namoyish qiladi.",
      ru: "Shows studio optics, sensor workflow, and broadcast framing as an AR layer.",
      en: "Shows studio optics, sensor workflow, and broadcast framing as an AR layer.",
    },
  },
  {
    id: "audio",
    color: "#a855f7",
    title: {
      uz: "Mikrofon va audio yo'nalishi",
      ru: "Microphone and Audio Chain",
      en: "Microphone and Audio Chain",
    },
    body: {
      uz: "Ovoz yozish, monitoring va media ishlab chiqarish jarayonlarini interaktiv tushuntiradi.",
      ru: "Explains recording, monitoring, and media production workflows interactively.",
      en: "Explains recording, monitoring, and media production workflows interactively.",
    },
  },
  {
    id: "studio",
    color: "#38bdf8",
    title: {
      uz: "Studio uskunalari",
      ru: "Studio Equipment",
      en: "Studio Equipment",
    },
    body: {
      uz: "Yoritish, ekran, kamera va rejissyor pulti bir sahnada kinematik AR ekspozitsiya sifatida ko'rinadi.",
      ru: "Lighting, screen, camera, and control-room ideas appear as one cinematic AR exhibit.",
      en: "Lighting, screen, camera, and control-room ideas appear as one cinematic AR exhibit.",
    },
  },
];

const text = {
  uz: {
    start: "AR kamerani ishga tushirish",
    stop: "To'xtatish",
    scan: "Fakultet logosi yoki posterini kameraga tuting",
    found: "Marker topildi",
    lost: "Marker yo'qoldi",
    permission: "Kamera ruxsati so'ralmoqda",
    loading: "MindAR va 3D model yuklanmoqda",
    checking: "AR target tekshirilmoqda",
    missing: "MindAR target fayli topilmadi: public/assets/targets/faculty-logo.mind",
    insecure: "Telefonda kamera uchun HTTPS kerak. Oddiy IP/http orqali WebAR ishlamaydi.",
    unsupported: "Bu brauzer kamera WebAR uchun mos emas",
    error: "Kamera ruxsati yoki AR ishga tushirishda xato",
    hint: "Drag - aylantirish, pinch - zoom, tap - ma'lumot, double tap - reset",
    target: "Image target",
    ready: "Kamera tayyor, target kutilmoqda",
  },
  ru: {
    start: "Start AR Camera",
    stop: "Stop",
    scan: "Point the camera at the faculty logo or poster",
    found: "Target detected",
    lost: "Target lost",
    permission: "Requesting camera permission",
    loading: "Loading MindAR and 3D model",
    checking: "Checking AR target",
    missing: "MindAR target file is missing: public/assets/targets/faculty-logo.mind",
    insecure: "Camera WebAR on phones requires HTTPS. Plain IP/http will not work.",
    unsupported: "This browser is not compatible with camera WebAR",
    error: "Camera permission or AR startup failed",
    hint: "Drag to rotate, pinch to zoom, tap for info, double tap to reset",
    target: "Image target",
    ready: "Camera ready, waiting for target",
  },
  en: {
    start: "Start AR Camera",
    stop: "Stop",
    scan: "Point the camera at the faculty logo or poster",
    found: "Target detected",
    lost: "Target lost",
    permission: "Requesting camera permission",
    loading: "Loading MindAR and 3D model",
    checking: "Checking AR target",
    missing: "MindAR target file is missing: public/assets/targets/faculty-logo.mind",
    insecure: "Camera WebAR on phones requires HTTPS. Plain IP/http will not work.",
    unsupported: "This browser is not compatible with camera WebAR",
    error: "Camera permission or AR startup failed",
    hint: "Drag to rotate, pinch to zoom, tap for info, double tap to reset",
    target: "Image target",
    ready: "Camera ready, waiting for target",
  },
} as const;

function loadScript(src: string) {
  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) {
    return existing.dataset.loaded === "true"
      ? Promise.resolve()
      : new Promise<void>((resolve, reject) => {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error(`Unable to load ${src}`)), {
            once: true,
          });
        });
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.head.appendChild(script);
  });
}

function createFallbackBroadcastRig() {
  const group = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.35, 0.7, 0.78),
    new THREE.MeshStandardMaterial({
      color: "#07111f",
      metalness: 0.65,
      roughness: 0.28,
      emissive: "#061b2f",
      emissiveIntensity: 0.7,
    }),
  );
  body.position.y = 0.48;
  group.add(body);

  const lens = new THREE.Mesh(
    new THREE.CylinderGeometry(0.28, 0.38, 0.62, 32),
    new THREE.MeshStandardMaterial({
      color: "#0ea5e9",
      metalness: 0.5,
      roughness: 0.18,
      emissive: "#22d3ee",
      emissiveIntensity: 0.55,
    }),
  );
  lens.rotation.x = Math.PI / 2;
  lens.position.set(0, 0.5, -0.68);
  group.add(lens);

  const mic = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.1, 0.95, 20),
    new THREE.MeshStandardMaterial({
      color: "#a855f7",
      metalness: 0.45,
      roughness: 0.32,
      emissive: "#4c1d95",
      emissiveIntensity: 0.8,
    }),
  );
  mic.rotation.z = Math.PI / 2;
  mic.position.set(0, 1.02, 0.1);
  group.add(mic);

  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.58, 0.72, 0.12, 48),
    new THREE.MeshStandardMaterial({
      color: "#111827",
      metalness: 0.55,
      roughness: 0.34,
      emissive: "#020617",
      emissiveIntensity: 0.4,
    }),
  );
  base.position.y = 0.04;
  group.add(base);

  return group;
}

function addNeonStage(group: THREE.Group) {
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: "#22d3ee",
    transparent: true,
    opacity: 0.82,
    depthWrite: false,
  });

  [0.68, 1.03, 1.38].forEach((radius, index) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(radius, radius + 0.018, 96), ringMaterial.clone());
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.018 + index * 0.014;
    ring.userData.spinSpeed = 0.18 + index * 0.12;
    group.add(ring);
  });

  const halo = new THREE.Mesh(
    new THREE.TorusGeometry(0.95, 0.015, 12, 96),
    new THREE.MeshBasicMaterial({
      color: "#a855f7",
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
    }),
  );
  halo.position.y = 1.35;
  halo.rotation.x = Math.PI / 2;
  halo.userData.spinSpeed = -0.32;
  group.add(halo);
}

export default function MobileWebARExperience({
  lang,
  onStatusChange,
}: {
  lang: Language;
  onStatusChange?: (status: ARStatus) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mindarRef = useRef<MindARThreeInstance | null>(null);
  const contentRef = useRef<THREE.Group | null>(null);
  const frameRef = useRef<number | null>(null);
  const pointerState = useRef({
    active: false,
    lastX: 0,
    lastY: 0,
    moved: false,
    pinchDistance: 0,
    lastTap: 0,
  });
  const transform = useRef({ rotationX: -0.16, rotationY: 0, scale: 0.74 });
  const [status, setStatus] = useState<ARStatus>("idle");
  const [running, setRunning] = useState(false);
  const [activeInfo, setActiveInfo] = useState<ShowcaseItem | null>(null);
  const targetMindUrl = "/assets/targets/faculty-logo.mind";
  const t = text[lang];

  const statusLabel = useMemo(() => {
    const map: Record<ARStatus, string> = {
      idle: t.scan,
      checking: t.checking,
      loading: t.loading,
      "camera-permission": t.permission,
      ready: t.ready,
      "marker-found": t.found,
      "marker-lost": t.lost,
      "target-missing": t.missing,
      "camera-error": t.error,
      "insecure-context": t.insecure,
      unsupported: t.unsupported,
    };
    return map[status];
  }, [status, t]);

  const updateStatus = useCallback(
    (nextStatus: ARStatus) => {
      setStatus(nextStatus);
      onStatusChange?.(nextStatus);
    },
    [onStatusChange],
  );

  const resetTransform = useCallback(() => {
    transform.current = { rotationX: -0.16, rotationY: 0, scale: 0.74 };
    setActiveInfo(null);
  }, []);

  const stop = useCallback(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    mindarRef.current?.stop();
    mindarRef.current?.renderer.setAnimationLoop(null);
    const container = containerRef.current;
    if (container) {
      container.querySelectorAll("canvas, video").forEach((node) => node.remove());
    }
    mindarRef.current = null;
    contentRef.current = null;
    setRunning(false);
    updateStatus("idle");
  }, [updateStatus]);

  const start = useCallback(async () => {
    if (!containerRef.current || running) return;

    if (!window.isSecureContext) {
      updateStatus("insecure-context");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      updateStatus("unsupported");
      return;
    }

    try {
      updateStatus("checking");
      const targetResponse = await fetch(targetMindUrl, { method: "HEAD" });
      if (!targetResponse.ok) {
        updateStatus("target-missing");
        return;
      }

      updateStatus("loading");
      await loadScript(MINDAR_SCRIPT);
      const MindARThree = window.MINDAR?.IMAGE?.MindARThree;
      if (!MindARThree) {
        updateStatus("unsupported");
        return;
      }

      const mindarThree = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: targetMindUrl,
        filterMinCF: 0.0001,
        filterBeta: 0.01,
        warmupTolerance: 3,
        missTolerance: 8,
        uiLoading: "no",
        uiScanning: "no",
        uiError: "no",
      });

      const { renderer, scene, camera } = mindarThree;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = false;

      scene.add(new THREE.HemisphereLight("#9ee7ff", "#050816", 1.45));
      const keyLight = new THREE.DirectionalLight("#9bdcff", 1.8);
      keyLight.position.set(1.8, 3.2, 2.4);
      scene.add(keyLight);
      const rimLight = new THREE.PointLight("#a855f7", 2.8, 6);
      rimLight.position.set(-1.5, 1.4, 1.2);
      scene.add(rimLight);

      const anchor = mindarThree.addAnchor(0);
      const content = new THREE.Group();
      content.position.set(0, 0, 0);
      content.scale.setScalar(transform.current.scale);
      content.rotation.set(transform.current.rotationX, transform.current.rotationY, 0);
      anchor.group.add(content);
      contentRef.current = content;

      let model = createFallbackBroadcastRig();
      try {
        const draco = new DRACOLoader();
        draco.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        const gltf = await loader.loadAsync(modelUrl);
        model = gltf.scene;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.frustumCulled = true;
            child.castShadow = false;
            child.receiveShadow = false;
            if (child.material instanceof THREE.MeshStandardMaterial) {
              child.material.envMapIntensity = 0.8;
              child.material.needsUpdate = true;
            }
          }
        });
        const bounds = new THREE.Box3().setFromObject(model);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        model.position.sub(center);
        model.scale.setScalar(1.35 / maxAxis);
      } catch {
        model = createFallbackBroadcastRig();
      }

      model.userData.selectable = showcaseItems[0].id;
      content.add(model);
      addNeonStage(content);

      anchor.onTargetFound = () => updateStatus("marker-found");
      anchor.onTargetLost = () => updateStatus("marker-lost");

      updateStatus("camera-permission");
      await mindarThree.start();
      mindarRef.current = mindarThree;
      setRunning(true);
      updateStatus("ready");

      const clock = new THREE.Clock();
      const animate = () => {
        const elapsed = clock.getElapsedTime();
        if (contentRef.current) {
          const current = transform.current;
          contentRef.current.rotation.x = THREE.MathUtils.lerp(
            contentRef.current.rotation.x,
            current.rotationX + Math.sin(elapsed * 1.35) * 0.035,
            0.14,
          );
          contentRef.current.rotation.y = THREE.MathUtils.lerp(
            contentRef.current.rotation.y,
            current.rotationY,
            0.18,
          );
          contentRef.current.scale.lerp(
            new THREE.Vector3(current.scale, current.scale, current.scale),
            0.16,
          );
          contentRef.current.position.y = Math.sin(elapsed * 1.4) * 0.045;
          contentRef.current.children.forEach((child) => {
            if (typeof child.userData.spinSpeed === "number") {
              child.rotation.z += child.userData.spinSpeed * 0.016;
            }
          });
        }
        renderer.render(scene, camera);
      };
      renderer.setAnimationLoop(animate);
    } catch (error) {
      console.error("MindAR startup failed:", error);
      stop();
      updateStatus("camera-error");
    }
  }, [running, stop, updateStatus]);

  useEffect(() => stop, [stop]);

  const getTouchDistance = (touches: TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <div
        ref={containerRef}
        className="absolute inset-0 touch-none"
        onPointerDown={(event) => {
          pointerState.current.active = true;
          pointerState.current.lastX = event.clientX;
          pointerState.current.lastY = event.clientY;
          pointerState.current.moved = false;
        }}
        onPointerMove={(event) => {
          if (!pointerState.current.active) return;
          const dx = event.clientX - pointerState.current.lastX;
          const dy = event.clientY - pointerState.current.lastY;
          if (Math.abs(dx) + Math.abs(dy) > 4) pointerState.current.moved = true;
          pointerState.current.lastX = event.clientX;
          pointerState.current.lastY = event.clientY;
          transform.current.rotationY += dx * 0.008;
          transform.current.rotationX = THREE.MathUtils.clamp(
            transform.current.rotationX + dy * 0.006,
            -0.72,
            0.48,
          );
        }}
        onPointerUp={() => {
          const now = Date.now();
          if (!pointerState.current.moved) {
            if (now - pointerState.current.lastTap < 280) {
              resetTransform();
            } else {
              const nextIndex = activeInfo
                ? (showcaseItems.findIndex((item) => item.id === activeInfo.id) + 1) %
                  showcaseItems.length
                : 0;
              setActiveInfo(showcaseItems[nextIndex]);
            }
            pointerState.current.lastTap = now;
          }
          pointerState.current.active = false;
        }}
        onTouchStart={(event) => {
          pointerState.current.pinchDistance = getTouchDistance(event.touches);
        }}
        onTouchMove={(event) => {
          if (event.touches.length < 2) return;
          const nextDistance = getTouchDistance(event.touches);
          const previousDistance = pointerState.current.pinchDistance || nextDistance;
          const factor = nextDistance / previousDistance;
          transform.current.scale = THREE.MathUtils.clamp(transform.current.scale * factor, 0.46, 1.45);
          pointerState.current.pinchDistance = nextDistance;
        }}
      />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(2,6,23,0.44)_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[58vmin] w-[58vmin] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-cyan-300/40 shadow-[0_0_30px_rgba(34,211,238,0.16)]">
        <div className="absolute -left-1 -top-1 h-8 w-8 border-l-2 border-t-2 border-cyan-300" />
        <div className="absolute -right-1 -top-1 h-8 w-8 border-r-2 border-t-2 border-cyan-300" />
        <div className="absolute -bottom-1 -left-1 h-8 w-8 border-b-2 border-l-2 border-cyan-300" />
        <div className="absolute -bottom-1 -right-1 h-8 w-8 border-b-2 border-r-2 border-cyan-300" />
      </div>

      <div className="absolute left-3 right-3 top-3 z-20 rounded-lg border border-white/10 bg-black/55 p-3 backdrop-blur-md">
        <div className="flex items-start gap-3">
          <img src={logoUrl} alt="Faculty target" className="h-12 w-12 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] uppercase tracking-[0.24em] text-cyan-300">{t.target}</p>
            <p className="mt-1 text-sm font-medium text-white">{statusLabel}</p>
            <p className="mt-1 text-[11px] leading-4 text-white/55">{t.hint}</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 left-3 right-3 z-20 flex items-end gap-3">
        <button
          onClick={running ? stop : start}
          className="min-h-12 flex-1 rounded-lg border border-cyan-300/40 bg-cyan-400/15 px-4 py-3 text-sm font-semibold text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.12)] backdrop-blur-md transition active:scale-[0.98]"
        >
          {running ? t.stop : t.start}
        </button>
        <button
          onClick={resetTransform}
          className="min-h-12 rounded-lg border border-white/10 bg-black/45 px-4 py-3 text-sm font-semibold text-white/80 backdrop-blur-md transition active:scale-[0.98]"
          title="Reset"
        >
          Reset
        </button>
      </div>

      {activeInfo && (
        <div className="absolute bottom-20 left-3 right-3 z-30 rounded-lg border border-cyan-300/25 bg-[#020617]/85 p-4 text-white shadow-[0_0_36px_rgba(34,211,238,0.18)] backdrop-blur-xl">
          <div className="mb-3 h-1 w-16 rounded-full" style={{ backgroundColor: activeInfo.color }} />
          <h2 className="text-lg font-semibold">{activeInfo.title[lang]}</h2>
          <p className="mt-2 text-sm leading-6 text-white/68">{activeInfo.body[lang]}</p>
        </div>
      )}
    </div>
  );
}
