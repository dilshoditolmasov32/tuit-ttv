import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, ARObject } from "../types";
import {
  MarkerDetector,
  ARModelTransform,
  ARCamera,
  ARPerformanceMonitor,
  ARSessionInfo,
  createARSessionInfo,
} from "../services/arUtils";

// ====================
// AR CONTENT OBJECTS
// ====================

const ARObjects: { [key: string]: ARObject } = {
  "tv-campus": {
    id: "tv-campus",
    name: "TV-Campus 3D Model",
    modelUrl: "/models/campus.glb",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    info: {
      uz: "Fakultetimizning 3D virtual kampusi. Shuning uchun mobil qurilmani markerga qaratib, model atrofiga aylantirishingiz mumkin.",
      ru: "3D виртуальный кампус нашего факультета. Направьте свое мобильное устройство на маркер и вращайте модель вокруг себя.",
      en: "3D virtual campus of our faculty. Point your mobile device at the marker and rotate the model around yourself.",
    },
  },
  "vr-lab": {
    id: "vr-lab",
    name: "VR Lab Equipment",
    modelUrl: "/models/vr-lab.glb",
    scale: [1, 1, 1],
    rotation: [0, 0, 0],
    info: {
      uz: "VR laboratoriyasining to'liq o'rnatilmasi. Barcha qurilmalarni batafsil o'rganishing mumkin.",
      ru: "Полная установка лаборатории VR. Вы можете подробно изучить все оборудование.",
      en: "Complete VR lab setup. You can study all equipment in detail.",
    },
  },
  studio: {
    id: "studio",
    name: "Broadcasting Studio",
    modelUrl: "/models/studio.glb",
    scale: [0.8, 0.8, 0.8],
    rotation: [0, 0, 0],
    info: {
      uz: "Professional TV studiyosi - shuning uchun biz ta'lim beraman.Kameralar, yorug'liklar va barcha asboblar.",
      ru: "Профессиональная ТВ-студия - здесь мы учим. Камеры, освещение и все инструменты.",
      en: "Professional TV studio - where we teach. Cameras, lights, and all tools.",
    },
  },
};

// ====================
// AR 3D MODEL PLACEHOLDER
// ====================

interface AR3DModelProps {
  transform: ARModelTransform;
  isDetected: boolean;
}

const AR3DModel: React.FC<AR3DModelProps> = ({ transform, isDetected }) => {
  return (
    <div
      className="absolute w-40 h-40 flex items-center justify-center pointer-events-auto"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(-50%, -50%) ${transform.getTransformMatrix()}`,
        opacity: isDetected ? 1 : 0.5,
        transition: "opacity 0.3s ease",
      }}
    >
      {/* 3D Model Placeholder - Animatsiyali Kub */}
      <div className="relative w-32 h-32">
        <motion.div
          animate={{
            rotateX: isDetected ? 360 : 0,
            rotateY: isDetected ? 360 : 0,
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="w-full h-full perspective"
          style={{
            transformStyle: "preserve-3d",
          }}
        >
          {/* Cube Faces */}
          <div
            className="absolute inset-0 border-2 border-cyan-400 bg-cyan-500/10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ transform: "translateZ(64px)" }}
          >
            Front
          </div>
          <div
            className="absolute inset-0 border-2 border-cyan-400 bg-cyan-500/10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ transform: "translateZ(-64px)" }}
          >
            Back
          </div>
          <div
            className="absolute inset-0 border-2 border-cyan-400 bg-cyan-500/10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ transform: "rotateY(90deg) translateZ(64px)" }}
          >
            Right
          </div>
          <div
            className="absolute inset-0 border-2 border-cyan-400 bg-cyan-500/10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ transform: "rotateY(-90deg) translateZ(64px)" }}
          >
            Left
          </div>
          <div
            className="absolute inset-0 border-2 border-cyan-400 bg-cyan-500/10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ transform: "rotateX(90deg) translateZ(64px)" }}
          >
            Top
          </div>
          <div
            className="absolute inset-0 border-2 border-cyan-400 bg-cyan-500/10 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ transform: "rotateX(-90deg) translateZ(64px)" }}
          >
            Bottom
          </div>
        </motion.div>
      </div>

      {/* Glow effect */}
      {isDetected && (
        <motion.div
          animate={{
            boxShadow: [
              "0 0 20px rgba(0,242,254,0.4)",
              "0 0 40px rgba(0,242,254,0.8)",
              "0 0 20px rgba(0,242,254,0.4)",
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-lg"
        />
      )}
    </div>
  );
};

// ====================
// AR MARKER DETECTOR VISUALIZATION
// ====================

const MarkerVisualization: React.FC<{
  isDetected: boolean;
  confidence: number;
}> = ({ isDetected, confidence }) => {
  return (
    <motion.div
      animate={{
        scale: isDetected ? 1 : 0.95,
        opacity: isDetected ? 1 : 0.5,
        borderColor: isDetected ? "#00f2fe" : "#ff6b6b",
      }}
      transition={{ duration: 0.3 }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 rounded-2xl pointer-events-none"
    >
      {/* Inner circle */}
      <div className="absolute inset-4 border-2 border-cyan-500/50 rounded-lg" />

      {/* Corner markers */}
      {[
        "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
        "top-0 right-0 translate-x-1/2 -translate-y-1/2",
        "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
        "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-4 h-4 bg-cyan-400 rounded-full`}
        />
      ))}

      {/* Center indicator */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-cyan-400 rounded-full" />

      {/* Detection info */}
      <div className="absolute bottom-4 left-4 right-4 text-center text-xs">
        <p
          className={`font-bold ${isDetected ? "text-cyan-400" : "text-red-400"}`}
        >
          {isDetected ? "MARKER DETECTED" : "SEARCHING..."}
        </p>
        <p className="text-cyan-300 text-[10px] mt-1">
          {(confidence * 100).toFixed(0)}%
        </p>
      </div>
    </motion.div>
  );
};

// ====================
// AR MODULE MAIN COMPONENT
// ====================

interface ARModuleProps {
  lang: Language;
  onBack: () => void;
}

export const ARModule: React.FC<ARModuleProps> = ({ lang, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [sessionInfo, setSessionInfo] = useState<ARSessionInfo>(
    createARSessionInfo(),
  );
  const [selectedObject, setSelectedObject] = useState<ARObject>(
    ARObjects["tv-campus"],
  );
  const [modelTransform, setModelTransform] = useState(new ARModelTransform());
  const [markerDetector, setMarkerDetector] = useState<MarkerDetector | null>(
    null,
  );
  const [arCamera, setARCamera] = useState<ARCamera | null>(null);
  const [perfMonitor, setPerfMonitor] = useState<ARPerformanceMonitor | null>(
    null,
  );

  // Initialization
  useEffect(() => {
    const initializeAR = async () => {
      try {
        // Initialize marker detector
        const detector = new MarkerDetector();
        setMarkerDetector(detector);

        // Initialize AR camera
        const camera = new ARCamera();
        const cameraStarted = await camera.startCamera(
          videoRef.current!,
          "environment",
        );

        if (cameraStarted) {
          setARCamera(camera);

          // Performance monitor
          const monitor = new ARPerformanceMonitor();
          setPerfMonitor(monitor);

          setSessionInfo((prev) => ({ ...prev, cameraActive: true }));
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("AR initialization error:", error);
      }
    };

    initializeAR();

    return () => {
      arCamera?.dispose();
      markerDetector?.dispose();
    };
  }, []);

  // Marker detection loop
  useEffect(() => {
    if (!videoRef.current || !markerDetector || !perfMonitor) return;

    const detectionInterval = setInterval(async () => {
      const isDetected = await markerDetector.detectMarker(videoRef.current!);
      const fps = perfMonitor.update();

      setSessionInfo((prev) => ({
        ...prev,
        isMarkerDetected: isDetected,
        markerConfidence: isDetected ? 0.85 + Math.random() * 0.15 : 0,
        fps: fps,
      }));
    }, 100);

    return () => clearInterval(detectionInterval);
  }, [markerDetector, perfMonitor]);

  // Touch controls for mobile AR
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let lastTouchX = 0;
    let lastTouchY = 0;
    let lastDistance = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        // Zoom gesture
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastDistance = Math.sqrt(dx * dx + dy * dy);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - lastTouchX;
        const deltaY = e.touches[0].clientY - lastTouchY;

        // Rotate model
        modelTransform.rotateAroundMarker(deltaX, deltaY);
        setModelTransform(new ARModelTransform());
        setModelTransform(modelTransform);

        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        // Zoom gesture
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const currentDistance = Math.sqrt(dx * dx + dy * dy);

        if (lastDistance > 0) {
          const scale = currentDistance / lastDistance;
          modelTransform.scale3DModel(scale);
          setModelTransform(new ARModelTransform());
          setModelTransform(modelTransform);
        }

        lastDistance = currentDistance;
      }
    };

    container.addEventListener("touchstart", handleTouchStart);
    container.addEventListener("touchmove", handleTouchMove);

    return () => {
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [modelTransform]);

  // Mouse controls for desktop AR
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;

      modelTransform.rotateAroundMarker(deltaX, deltaY);
      setModelTransform(new ARModelTransform());
      setModelTransform(modelTransform);

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const scale = e.deltaY < 0 ? 1.05 : 0.95;
      modelTransform.scale3DModel(scale);
      setModelTransform(new ARModelTransform());
      setModelTransform(modelTransform);
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("wheel", handleWheel);
    };
  }, [modelTransform]);

  const getObjectInfo = (obj: ARObject) => {
    return obj.info[lang] || obj.info["en"];
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[80vh] bg-black rounded-[3rem] overflow-hidden"
    >
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: "brightness(0.8) contrast(1.1)",
        }}
      />

      {/* AR Overlay */}
      {isInitialized && (
        <>
          {/* Marker Visualization */}
          <MarkerVisualization
            isDetected={sessionInfo.isMarkerDetected}
            confidence={sessionInfo.markerConfidence}
          />

          {/* 3D Model */}
          {sessionInfo.isMarkerDetected && (
            <AR3DModel
              transform={modelTransform}
              isDetected={sessionInfo.isMarkerDetected}
            />
          )}
        </>
      )}

      {/* Control Panel - Top Left */}
      <div className="absolute top-10 left-10 glass p-6 rounded-2xl max-w-sm z-10">
        <h4 className="font-bold text-cyan-400 mb-3 justify-between flex items-center">
          <span>🔍 AR Объект</span>
          <span
            className={`text-[10px] px-2 py-1 rounded ${sessionInfo.cameraActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
          >
            {sessionInfo.cameraActive ? "ACTIVE" : "OFFLINE"}
          </span>
        </h4>

        {/* Object selector */}
        <div className="space-y-2 mb-4">
          {Object.entries(ARObjects).map(([key, obj]) => (
            <button
              key={key}
              onClick={() => setSelectedObject(obj)}
              className={`w-full px-3 py-2 rounded text-left text-xs transition-all ${
                selectedObject.id === obj.id
                  ? "bg-cyan-500/30 border border-cyan-400 text-cyan-300"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {obj.name}
            </button>
          ))}
        </div>

        <p className="text-[10px] text-gray-400 leading-relaxed">
          {getObjectInfo(selectedObject)}
        </p>
      </div>

      {/* Performance Stats - Top Right */}
      <div className="absolute top-10 right-10 glass p-4 rounded-xl text-xs font-mono text-cyan-400 z-10">
        <div className="flex flex-col gap-2">
          <div>
            FPS: <span className="font-bold">{sessionInfo.fps}</span>
          </div>
          <div>
            Signal:{" "}
            <span
              className={
                sessionInfo.isMarkerDetected ? "text-green-400" : "text-red-400"
              }
              className="font-bold"
            >
              {(sessionInfo.markerConfidence * 100).toFixed(0)}%
            </span>
          </div>
          <div>
            Objects:{" "}
            <span className="font-bold">{Object.keys(ARObjects).length}</span>
          </div>
        </div>
      </div>

      {/* Controls Info */}
      <div className="absolute bottom-10 left-10 glass p-6 rounded-2xl max-w-sm text-sm z-10">
        <h4 className="font-bold text-cyan-400 mb-3 uppercase tracking-wider">
          🎮 Boshqaruv
        </h4>
        <ul className="space-y-2 text-gray-400 text-xs">
          <li>
            <span className="text-cyan-400 font-mono">Sichqoncha Suring</span> -
            Modelni aylantirishish
          </li>
          <li>
            <span className="text-cyan-400 font-mono">Scroll/Pinch</span> -
            Masштаб o'zgartirish
          </li>
          <li>
            <span className="text-cyan-400 font-mono">Double Click</span> -
            Qayta o'rnatish
          </li>
          <li>
            <span className="text-cyan-400 font-mono">Mobile</span> - Touch to
            rotate & zoom
          </li>
        </ul>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute bottom-10 right-10 px-8 py-3 glass bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all z-10"
      >
        🔙 Orqaga
      </button>

      {/* Loading / Not Initialized */}
      {!isInitialized && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-white font-bold">AR Kamerasini initsizlash...</p>
            <p className="text-gray-400 text-sm mt-2">
              Kamera kirish uchun ruxsat bering
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARModule;
