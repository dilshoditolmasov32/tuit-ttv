import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  Html,
  MeshReflectorMaterial,
  Sparkles,
  Stars,
  Text,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import * as THREE from "three";
import { Language } from "../../types";
import { VRPointerLockController } from "../VRPointerLockController";

import studioImage from "../../assests/050A7790.JPG";
import controlImage from "../../assests/050A7793.JPG";
import mediaImage from "../../assests/media-markaz-1.jpg";

const MODEL_PATHS = {
  onAir: "/images/on_air_sign.glb",
  studio: "/images/low_poly_studio.glb",
  mic: "/images/studio_microphone.glb",
  mixer: "/images/mixer.glb",
  speakers: "/images/speakers_subwoofer.glb",
  softbox: "/images/studio_softbox_light.glb",
  spotlight: "/images/spotlight_on_tripod.glb",
} as const;

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));

const copy = {
  uz: {
    title: "ON AIR Studio",
    subtitle: "Virtual efir xonasi",
    backHub: "VR tanlovga qaytish",
    exit: "Orqaga",
    start: "ON AIR",
    startHint: "Efir rejimini yoqish",
    inactive: "Studio kutish rejimida",
    active: "Jonli efir rejimi",
    walk: "Canvas ustiga bosing: WASD bilan yuring, sichqoncha bilan qarang",
    closeWalk: "Esc - chiqish",
    wallTitle: "Broadcast Media Lab",
    wallSubtitle: "Kamera, audio, montaj va efir jarayonlari bitta immersiv sahnada",
  },
  ru: {
    title: "ON AIR Studio",
    subtitle: "Виртуальная эфирная студия",
    backHub: "Назад к VR выбору",
    exit: "Назад",
    start: "ON AIR",
    startHint: "Запустить эфирный режим",
    inactive: "Студия в режиме ожидания",
    active: "Режим прямого эфира",
    walk: "Нажмите на Canvas: WASD для движения, мышь для обзора",
    closeWalk: "Esc - выйти",
    wallTitle: "Broadcast Media Lab",
    wallSubtitle: "Камера, аудио, монтаж и эфир в одной иммерсивной сцене",
  },
  en: {
    title: "ON AIR Studio",
    subtitle: "Virtual broadcast room",
    backHub: "Back to VR hub",
    exit: "Back",
    start: "ON AIR",
    startHint: "Start broadcast mode",
    inactive: "Studio standby",
    active: "Live broadcast mode",
    walk: "Click the canvas: WASD to move, mouse to look",
    closeWalk: "Esc - exit",
    wallTitle: "Broadcast Media Lab",
    wallSubtitle: "Camera, audio, editing, and live production in one immersive scene",
  },
} as const;

interface OnAirStudioExperienceProps {
  lang: Language;
  onBackToHub: () => void;
  onExit: () => void;
}

function Loader() {
  return (
    <Html center>
      <div className="rounded-xl border border-red-400/30 bg-black/75 px-5 py-3 text-xs uppercase tracking-[0.22em] text-red-200 backdrop-blur-md">
        Loading broadcast studio
      </div>
    </Html>
  );
}

function StudioModel({
  active,
  path,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1],
}: {
  active: boolean;
  path: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  const gltf = useGLTF(path);
  const clone = useMemo(() => gltf.scene.clone(true), [gltf.scene]);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const pulse = active ? Math.sin(state.clock.elapsedTime * 2.2) * 0.025 : 0;
    groupRef.current.scale.lerp(
      new THREE.Vector3(scale[0] + pulse, scale[1] + pulse, scale[2] + pulse),
      0.08,
    );
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      <primitive object={clone} />
    </group>
  );
}

function MediaWall({
  active,
  lang,
}: {
  active: boolean;
  lang: Language;
}) {
  const textureA = useTexture(studioImage);
  const textureB = useTexture(controlImage);
  const textureC = useTexture(mediaImage);
  const textures = [textureA, textureB, textureC];

  useMemo(() => {
    textures.forEach((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 8;
      texture.needsUpdate = true;
    });
  }, textures);

  return (
    <group position={[0, 2.35, -5.05]}>
      <mesh position={[0, 0.1, -0.08]}>
        <planeGeometry args={[7.6, 3.25]} />
        <meshBasicMaterial color={active ? "#ef4444" : "#172033"} transparent opacity={active ? 0.22 : 0.1} />
      </mesh>

      {textures.map((texture, index) => (
        <Float
          key={index}
          speed={active ? 1.4 + index * 0.25 : 0.45}
          floatIntensity={active ? 0.08 : 0.02}
          rotationIntensity={0.025}
        >
          <mesh position={[(index - 1) * 2.25, -0.1, 0]} castShadow>
            <planeGeometry args={[2.02, 1.2]} />
            <meshStandardMaterial
              map={texture}
              emissive={active ? "#ef4444" : "#38bdf8"}
              emissiveIntensity={active ? 0.5 : 0.16}
              roughness={0.28}
              toneMapped={false}
            />
          </mesh>
        </Float>
      ))}

      <Text
        position={[0, 1.65, 0.04]}
        fontSize={0.22}
        color={active ? "#fee2e2" : "#dff6ff"}
        anchorX="center"
        anchorY="middle"
        maxWidth={6.6}
        textAlign="center"
      >
        {copy[lang].wallTitle}
      </Text>
      <Text
        position={[0, -1.65, 0.04]}
        fontSize={0.105}
        color={active ? "#fecaca" : "#9cc9e8"}
        anchorX="center"
        anchorY="middle"
        maxWidth={6.4}
        textAlign="center"
      >
        {copy[lang].wallSubtitle}
      </Text>
    </group>
  );
}

function StudioShell({ active }: { active: boolean }) {
  const accent = active ? "#ef4444" : "#22d3ee";

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <MeshReflectorMaterial
          color={active ? "#0b0507" : "#050913"}
          blur={[500, 150]}
          resolution={1024}
          mixBlur={1.25}
          mixStrength={active ? 0.82 : 0.5}
          roughness={0.74}
          metalness={0.56}
          mirror={0.18}
        />
      </mesh>

      <gridHelper args={[24, 24, active ? "#6f1d1d" : "#173653", "#0f172a"]} position={[0, 0.012, 0]} />

      <mesh position={[0, 3.1, -5.4]} receiveShadow>
        <boxGeometry args={[11, 5.4, 0.32]} />
        <meshStandardMaterial
          color="#080b12"
          emissive={accent}
          emissiveIntensity={active ? 0.22 : 0.08}
          metalness={0.34}
          roughness={0.58}
        />
      </mesh>

      <mesh position={[-5.7, 2.6, -0.5]} rotation={[0, 0.16, 0]} receiveShadow>
        <boxGeometry args={[0.28, 5.2, 9.2]} />
        <meshStandardMaterial color="#08111f" emissive={accent} emissiveIntensity={active ? 0.12 : 0.04} />
      </mesh>
      <mesh position={[5.7, 2.6, -0.5]} rotation={[0, -0.16, 0]} receiveShadow>
        <boxGeometry args={[0.28, 5.2, 9.2]} />
        <meshStandardMaterial color="#08111f" emissive={accent} emissiveIntensity={active ? 0.12 : 0.04} />
      </mesh>

      {[-4.2, -2.1, 0, 2.1, 4.2].map((x, index) => (
        <group key={x}>
          <mesh position={[x, 5.45, -1]} castShadow>
            <boxGeometry args={[0.08, 0.08, 9]} />
            <meshStandardMaterial color="#0b1220" metalness={0.72} roughness={0.22} />
          </mesh>
          <spotLight
            position={[x, 5.1, -2.3]}
            angle={0.38}
            penumbra={0.75}
            intensity={active ? 72 + index * 5 : 18}
            distance={10}
            color={index % 2 === 0 ? accent : "#38bdf8"}
            castShadow
          />
        </group>
      ))}
    </group>
  );
}

function Scene({ active, lang }: { active: boolean; lang: Language }) {
  return (
    <>
      <color attach="background" args={[active ? "#080306" : "#030712"]} />
      <fog attach="fog" args={[active ? "#11050a" : "#030712", 10, 28]} />

      <ambientLight intensity={active ? 0.28 : 0.16} />
      <hemisphereLight args={["#c7e9ff", "#09030a", active ? 1.25 : 0.7]} />
      <directionalLight position={[3.8, 7.2, 4.8]} intensity={active ? 2.8 : 1.2} castShadow />
      <pointLight position={[0, 2.9, 2.3]} color={active ? "#ef4444" : "#22d3ee"} intensity={active ? 42 : 14} distance={8} />

      <Environment preset="city" background={false} environmentIntensity={active ? 0.7 : 0.42} />
      <Stars radius={80} depth={30} count={active ? 1600 : 900} factor={2.6} fade speed={active ? 0.55 : 0.18} />
      <Sparkles count={active ? 170 : 40} scale={[14, 6, 14]} size={active ? 2.1 : 1.2} speed={active ? 0.45 : 0.16} color={active ? "#ef4444" : "#22d3ee"} />

      <StudioShell active={active} />
      <MediaWall active={active} lang={lang} />

      <StudioModel active={active} path={MODEL_PATHS.onAir} position={[0, 3.85, -4.8]} rotation={[0, 0, 0]} scale={[1.4, 1.4, 1.4]} />
      <StudioModel active={active} path={MODEL_PATHS.studio} position={[-3.2, 0.08, -1.6]} rotation={[0, 0.55, 0]} scale={[0.9, 0.9, 0.9]} />
      <StudioModel active={active} path={MODEL_PATHS.mixer} position={[0, 0.74, 2.75]} rotation={[0, Math.PI, 0]} scale={[1.6, 1.6, 1.6]} />
      <StudioModel active={active} path={MODEL_PATHS.mic} position={[-2.1, 0.35, 1.45]} rotation={[0, 0.35, 0]} scale={[0.75, 0.75, 0.75]} />
      <StudioModel active={active} path={MODEL_PATHS.speakers} position={[2.15, 0.28, 1.2]} rotation={[0, -0.35, 0]} scale={[0.75, 0.75, 0.75]} />
      <StudioModel active={active} path={MODEL_PATHS.softbox} position={[-4.25, 0.18, 1.15]} rotation={[0, 0.82, 0]} scale={[0.6, 0.6, 0.6]} />
      <StudioModel active={active} path={MODEL_PATHS.spotlight} position={[4.15, 0.16, 0.82]} rotation={[0, -0.62, 0]} scale={[0.6, 0.6, 0.6]} />

      <Text
        position={[0, 1.38, 2.12]}
        rotation={[-0.2, 0, 0]}
        fontSize={0.15}
        color={active ? "#fecaca" : "#bae6fd"}
        anchorX="center"
        anchorY="middle"
      >
        {active ? copy[lang].active : copy[lang].inactive}
      </Text>

      <ContactShadows position={[0, 0.04, 0]} opacity={active ? 0.72 : 0.48} scale={16} blur={2.8} far={7} resolution={1024} color="#020617" />
    </>
  );
}

export function OnAirStudioExperience({
  lang,
  onBackToHub,
  onExit,
}: OnAirStudioExperienceProps) {
  const [broadcastOn, setBroadcastOn] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const t = copy[lang];

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-[#050308] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.2),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_28%)]" />

      <div className="relative z-40 flex items-center justify-between border-b border-white/10 bg-black/50 px-3 py-3 backdrop-blur-xl md:px-6 md:py-4">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-red-300">{t.subtitle}</p>
          <h1 className="truncate text-base font-semibold md:text-xl">{t.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToHub}
            className="rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/75 transition hover:bg-white/10 hover:text-white md:px-4"
          >
            {t.backHub}
          </button>
          <button
            onClick={onExit}
            className="rounded-lg border border-red-500/35 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-200 transition hover:bg-red-500/20 hover:text-white md:px-4"
          >
            {t.exit}
          </button>
        </div>
      </div>

      <main className="relative z-10 flex-1">
        <Canvas
          shadows
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
          camera={{ fov: 68, position: [0, 1.75, 5.4] }}
          className="h-full w-full"
        >
          <Suspense fallback={<Loader />}>
            <VRPointerLockController
              areas={[]}
              onLockChange={setIsLocked}
              speed={4.2}
              sprintMultiplier={1.8}
            />
            <Scene active={broadcastOn} lang={lang} />
          </Suspense>
        </Canvas>

        <AnimatePresence>
          {!broadcastOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="absolute inset-0 z-30 flex items-center justify-center bg-black/25 px-6"
            >
              <div className="text-center">
                <motion.button
                  onClick={() => setBroadcastOn(true)}
                  initial={{ scale: 0.92, opacity: 0 }}
                  animate={{
                    scale: [1, 1.035, 1],
                    opacity: 1,
                    boxShadow: [
                      "0 0 34px rgba(239,68,68,0.36)",
                      "0 0 72px rgba(239,68,68,0.72)",
                      "0 0 34px rgba(239,68,68,0.36)",
                    ],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  className="h-32 w-32 rounded-full border border-red-300/60 bg-red-600 text-lg font-black uppercase tracking-[0.18em] text-white shadow-2xl md:h-40 md:w-40 md:text-2xl"
                >
                  {t.start}
                </motion.button>
                <p className="mt-5 text-xs uppercase tracking-[0.24em] text-red-100/70">
                  {t.startHint}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {broadcastOn && !isLocked && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              className="pointer-events-none absolute bottom-6 left-1/2 z-40 w-[min(92vw,34rem)] -translate-x-1/2 rounded-xl border border-red-400/25 bg-black/60 px-4 py-3 text-center text-xs text-white/70 backdrop-blur-md"
            >
              {t.walk}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isLocked && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="pointer-events-none absolute right-4 top-4 z-40 rounded-lg border border-white/10 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white/45 backdrop-blur-md"
            >
              {t.closeWalk}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
