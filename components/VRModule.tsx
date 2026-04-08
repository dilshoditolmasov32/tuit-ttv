import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import { Language, VRObject } from "../types";
import {
  createVRScene,
  setupLighting,
  addInteractiveObject,
  KeyboardController,
  RaycastController,
  createParticles,
  resetSceneToDefault,
} from "../services/vrUtils";

// ====================
// VR SAHNA CONTENT
// ====================

const vrSceneObjects: VRObject[] = [
  {
    id: "server-1",
    name: "Server Rack 1",
    position: [-6, 0, -5],
    rotation: [0, 0, 0],
    scale: [1, 3, 1],
    color: "#0099ff",
    info: {
      uz: "Kompyuter serveri - Toshkentdagi eng kuchli vositalar",
      ru: "Компьютерный сервер - мощнейший сервис в Ташкенте",
      en: "Computer Server - The most powerful server in Tashkent",
    },
    interactive: true,
  },
  {
    id: "server-2",
    name: "Server Rack 2",
    position: [6, 0, -5],
    rotation: [0, 0, 0],
    scale: [1, 3, 1],
    color: "#00ff99",
    info: {
      uz: "5G Tarqatuvchi - Zamonaviy raqamli aloqa texnologiyasi",
      ru: "5G раздатчик - современная технология цифровой связи",
      en: "5G Distributor - Modern digital communications technology",
    },
    interactive: true,
  },
  {
    id: "core-unit",
    name: "Core Processing Unit",
    position: [0, 2, 0],
    rotation: [0, 0, 0],
    scale: [1.5, 1.5, 1.5],
    color: "#ffaa00",
    info: {
      uz: "Merkaziy oʻrash birligı - TV-Tech platformasining yuragı",
      ru: "Центральный блок обработки - сердце платформы TV-Tech",
      en: "Central Processing Unit - Heart of TV-Tech Platform",
    },
    interactive: true,
  },
  {
    id: "network-hub",
    name: "Network Hub",
    position: [0, -1, 5],
    rotation: [Math.PI / 4, 0, 0],
    scale: [2, 0.5, 2],
    color: "#ff00ff",
    info: {
      uz: "Tarmoq tuguning markaziyshaharı - barcha ulanishlarning o'rta nuqtasi",
      ru: "Центр сетевого концентратора - центральная точка всех соединений",
      en: "Network Hub Center - Central point of all connections",
    },
    interactive: true,
  },
];

// ====================
// VR ENVIRONMENT 3D SCENE
// ====================

interface VRSceneProps {
  lang: Language;
  selectedObject: VRObject | null;
  onObjectSelect: (obj: VRObject | null) => void;
}

const VREnvironmentScene: React.FC<VRSceneProps> = ({
  lang,
  selectedObject,
  onObjectSelect,
}) => {
  const { camera, scene } = useThree();
  const meshesRef = useRef<THREE.Mesh[]>([]);
  const keyboardControllerRef = useRef<KeyboardController | null>(null);
  const raycastControllerRef = useRef<RaycastController | null>(null);

  useEffect(() => {
    // Scene setup
    setupLighting(scene, {
      ambient: 0.6,
      pointLight: 1.2,
      color: "#00f2fe",
    });

    // Create particles
    createParticles(scene, 800);

    // Create objects
    const meshes = vrSceneObjects.map((obj) => {
      const mesh = addInteractiveObject(scene, obj);
      return mesh;
    });

    meshesRef.current = meshes;

    // Keyboard controller
    keyboardControllerRef.current = new KeyboardController();

    // Raycaster controller
    raycastControllerRef.current = new RaycastController();

    return () => {
      keyboardControllerRef.current?.dispose();
      raycastControllerRef.current?.dispose();
    };
  }, [scene]);

  useFrame(() => {
    // Update keyboard controls
    if (keyboardControllerRef.current) {
      keyboardControllerRef.current.update(camera);
    }

    // Update raycaster selection
    if (raycastControllerRef.current && meshesRef.current.length > 0) {
      raycastControllerRef.current.updateSelection(camera, meshesRef.current);

      const selected = raycastControllerRef.current.getSelectedObject();
      if (selected) {
        onObjectSelect(
          vrSceneObjects.find((obj) => obj.id === selected.id) || null,
        );
      }
    }

    // Animate selected object
    if (selectedObject && meshesRef.current.length > 0) {
      const selectedMesh = meshesRef.current.find(
        (m) => m.userData.id === selectedObject.id,
      );
      if (selectedMesh) {
        selectedMesh.rotation.x += 0.005;
        selectedMesh.rotation.y += 0.01;
        selectedMesh.scale.set(
          selectedObject.scale[0] * (1 + Math.sin(Date.now() * 0.005) * 0.1),
          selectedObject.scale[1] * (1 + Math.sin(Date.now() * 0.005) * 0.1),
          selectedObject.scale[2] * (1 + Math.sin(Date.now() * 0.005) * 0.1),
        );
      }
    }
  });

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 2, -15]}>
        <planeGeometry args={[50, 10]} />
        <meshStandardMaterial
          color="#111111"
          emissive="#00f2fe"
          emissiveIntensity={0.1}
        />
      </mesh>

      <Stars
        radius={150}
        depth={100}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
    </>
  );
};

// ====================
// VR MODULE MAIN COMPONENT
// ====================

interface VRModuleProps {
  lang: Language;
  onBack: () => void;
}

export const VRModule: React.FC<VRModuleProps> = ({ lang, onBack }) => {
  const [selectedObject, setSelectedObject] = useState<VRObject | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const getObjectInfo = (obj: VRObject | null) => {
    if (!obj) return "";
    return obj.info[lang] || obj.info["en"];
  };

  const handleObjectSelect = (obj: VRObject | null) => {
    setSelectedObject(obj);
    if (obj) setShowInfo(true);
  };

  return (
    <div className="relative w-full h-[80vh] bg-black rounded-[3rem] overflow-hidden">
      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 5, 12], fov: 50 }}>
        <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />
        <VREnvironmentScene
          lang={lang}
          selectedObject={selectedObject}
          onObjectSelect={handleObjectSelect}
        />
      </Canvas>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && selectedObject && (
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className="absolute top-10 left-10 p-8 glass rounded-[2rem] max-w-sm border-l-4 border-cyan-500 z-20"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {selectedObject.name}
                </h3>
                <p className="text-cyan-400 text-xs font-mono">
                  ID: {selectedObject.id}
                </p>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-white hover:text-cyan-400 transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-300 leading-relaxed mb-4">
              {getObjectInfo(selectedObject)}
            </p>

            <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-white/10">
              <div>
                <p className="text-[10px] text-gray-500 uppercase">X</p>
                <p className="font-mono text-cyan-400">
                  {selectedObject.position[0].toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Y</p>
                <p className="font-mono text-cyan-400">
                  {selectedObject.position[1].toFixed(1)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-gray-500 uppercase">Z</p>
                <p className="font-mono text-cyan-400">
                  {selectedObject.position[2].toFixed(1)}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Control Tips */}
      <div className="absolute bottom-10 left-10 glass p-6 rounded-2xl max-w-sm text-sm">
        <h4 className="font-bold text-cyan-400 mb-3 uppercase tracking-wider">
          🎮 Boshqaruv
        </h4>
        <ul className="space-y-2 text-gray-400 text-xs">
          <li>
            <span className="text-cyan-400 font-mono">W/A/S/D</span> - Harakat
            qilish
          </li>
          <li>
            <span className="text-cyan-400 font-mono">Space/Ctrl</span> -
            Yuqori/Pastga
          </li>
          <li>
            <span className="text-cyan-400 font-mono">Sichqoncha</span> - Olamni
            aylantirishish
          </li>
          <li>
            <span className="text-cyan-400 font-mono">Click</span> - Objektni
            tanlash
          </li>
        </ul>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute bottom-10 right-10 px-8 py-3 glass bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all z-20"
      >
        🔙 Orqaga
      </button>

      {/* Stats */}
      <div className="absolute top-10 right-10 glass p-4 rounded-xl text-xs font-mono text-cyan-400">
        <div className="flex flex-col gap-2">
          <div>
            Selected:{" "}
            <span className="font-bold">{selectedObject?.name || "None"}</span>
          </div>
          <div>
            Objects: <span className="font-bold">{vrSceneObjects.length}</span>
          </div>
          <div>
            Status: <span className="text-green-400 animate-pulse">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VRModule;
