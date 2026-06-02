import React, { useRef, useMemo } from "react";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  Preload,
  Sparkles,
  Stars,
  Text,
  useGLTF,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Language } from "../../types";
import { ImagePanel } from "./ImagePanel";

import { PanelHoverTooltip } from "../PanelHoverTooltip";
import { usePanelProximityAnimation } from "../usePanelProximityAnimation";

const MODEL_PATHS = {
  studio: "/images/low_poly_small_film_studio.glb",
  mic: "/images/studio_microphone.glb",
  speakers: "/images/speakers_subwoofer.glb",
  softbox: "/images/studio_softbox_light.glb",
  spotlight: "/images/spotlight_on_tripod.glb",
} as const;

Object.values(MODEL_PATHS).forEach((path) => useGLTF.preload(path));

export interface ShowroomArea {
  id: string;
  color: string;
  image: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  title: Record<Language, string>;
  summary: Record<Language, string>;
  details: Record<Language, string>;
  mediaHint: Record<Language, string>;
  stats: {
    label: Record<Language, string>;
    value: string;
  }[];
}

interface VRShowroomSceneProps {
  areas: ShowroomArea[];
  focusedArea: ShowroomArea | null;
  hoveredArea: ShowroomArea | null;
  lang: Language;
  onBackgroundDoubleClick: () => void;
  onSelect: (area: ShowroomArea) => void;
  onHover: (area: ShowroomArea | null) => void;
  resetSignal: number;
  selectedArea: ShowroomArea;
}

function FocusVignette({ focused }: { focused: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    const material = meshRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (!material) return;

    material.opacity = THREE.MathUtils.lerp(
      material.opacity,
      focused ? 0.22 : 0.08,
      1 - Math.pow(0.001, delta),
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 3.3, -4.6]}>
      <planeGeometry args={[18, 10]} />
      <meshBasicMaterial color="#02030a" transparent opacity={0.08} depthWrite={false} />
    </mesh>
  );
}

function StudioArchitecture({ accent, focused }: { accent: string; focused: boolean }) {
  const railMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#101827",
        emissive: "#07111f",
        emissiveIntensity: 0.5,
        metalness: 0.7,
        roughness: 0.25,
      }),
    [],
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <MeshReflectorMaterial
          color={focused ? "#050913" : "#070b13"}
          blur={[500, 140]}
          resolution={1024}
          mixBlur={1.35}
          mixStrength={focused ? 0.78 : 0.58}
          roughness={0.74}
          metalness={0.58}
          mirror={0.24}
        />
      </mesh>

      <gridHelper args={[24, 24, "#173653", "#0f172a"]} position={[0, 0.012, 0]} />

      <mesh position={[0, 3.2, -6.4]} receiveShadow>
        <boxGeometry args={[15.5, 5.6, 0.28]} />
        <meshStandardMaterial
          color="#07111f"
          emissive="#0b1d32"
          emissiveIntensity={focused ? 0.45 : 0.8}
          metalness={0.35}
          roughness={0.55}
        />
      </mesh>

      <mesh position={[-7.85, 3.2, 0]} rotation={[0, 0.24, 0]} receiveShadow>
        <boxGeometry args={[0.28, 5.6, 13]} />
        <meshStandardMaterial
          color="#08111f"
          emissive="#111827"
          emissiveIntensity={0.32}
          metalness={0.38}
          roughness={0.58}
        />
      </mesh>

      <mesh position={[7.85, 3.2, 0]} rotation={[0, -0.24, 0]} receiveShadow>
        <boxGeometry args={[0.28, 5.6, 13]} />
        <meshStandardMaterial
          color="#08111f"
          emissive="#111827"
          emissiveIntensity={0.32}
          metalness={0.38}
          roughness={0.58}
        />
      </mesh>

      {[-5.6, -2.8, 0, 2.8, 5.6].map((x) => (
        <group key={x}>
          <mesh position={[x, 5.9, -0.6]} material={railMaterial}>
            <boxGeometry args={[0.06, 0.08, 11]} />
          </mesh>
          <pointLight
            position={[x, 5.45, -2.7]}
            color={x === 0 ? accent : x < 0 ? "#22d3ee" : "#8b5cf6"}
            intensity={focused && x !== 0 ? 20 : 30}
            distance={8}
            decay={2.2}
          />
        </group>
      ))}

      <mesh position={[0, 0.55, 4.65]} castShadow receiveShadow>
        <boxGeometry args={[5.8, 1.1, 1.2]} />
        <meshStandardMaterial
          color="#0b1220"
          emissive={accent}
          emissiveIntensity={focused ? 0.12 : 0.08}
          metalness={0.62}
          roughness={0.34}
        />
      </mesh>

      <mesh position={[0, 1.16, 4.35]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[5.2, 0.1, 0.82]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#22d3ee"
          emissiveIntensity={0.14}
          metalness={0.78}
          roughness={0.22}
        />
      </mesh>
    </group>
  );
}

function LightRibbons({ accent, focused }: { accent: string; focused: boolean }) {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const opacity = focused ? 0.35 : 0.55;
    [leftRef.current, rightRef.current].forEach((mesh, index) => {
      const material = mesh?.material as THREE.MeshBasicMaterial | undefined;
      if (!material) return;
      material.opacity = opacity + Math.sin(state.clock.elapsedTime * 1.8 + index) * 0.06;
    });
  });

  return (
    <group>
      {[-1, 1].map((side, index) => (
        <mesh
          key={side}
          ref={index === 0 ? leftRef : rightRef}
          position={[side * 4.9, 3.8, -2.2]}
          rotation={[0, side * -0.38, 0]}
        >
          <planeGeometry args={[0.06, 5.5]} />
          <meshBasicMaterial
            color={side < 0 ? "#22d3ee" : accent}
            transparent
            opacity={0.55}
          />
        </mesh>
      ))}
    </group>
  );
}

function RoomShell({ onBackgroundDoubleClick }: { onBackgroundDoubleClick: () => void }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.02, 0]}
      onDoubleClick={onBackgroundDoubleClick}
      visible={false}
    >
      <planeGeometry args={[30, 30]} />
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  );
}

// ✅ 3-O'ZGARISH: Yangi wrapper komponent — proximity + tooltip + glow
function ModelPodium({
  accent = "#22d3ee",
  position,
  rotation = [0, 0, 0],
  scale = [1.8, 0.18, 1.25],
}: {
  accent?: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial
          color="#05070d"
          emissive={accent}
          emissiveIntensity={0.42}
          metalness={0.86}
          roughness={0.22}
        />
      </mesh>
      <mesh position={[0, scale[1] / 2 + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[scale[0] * 0.92, scale[2] * 0.82]} />
        <meshBasicMaterial
          color={accent}
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>
      <pointLight position={[0, 0.42, 0]} color={accent} intensity={18} distance={3.2} />
    </group>
  );
}

function ShowroomModels() {
  const studio = useGLTF(MODEL_PATHS.studio);
  const mic = useGLTF(MODEL_PATHS.mic);
  const speakers = useGLTF(MODEL_PATHS.speakers);

  return (
    <group>
      <group position={[-4.7, 0.2, -2.25]} rotation={[0, 0.42, 0]}>
        <ModelPodium accent="#22d3ee" position={[0, 0, 0]} scale={[2.25, 0.2, 1.35]} />
        <primitive
          object={studio.scene}
          position={[-0.22, 0.22, 0]}
          rotation={[0, -0.35, 0]}
          scale={[0.34, 0.34, 0.34]}
        />
      </group>

      <group position={[0, 0.2, -3.78]}>
        <ModelPodium accent="#8b5cf6" position={[0, 0, 0]} scale={[1.75, 0.2, 1.2]} />
      </group>

      <group position={[4.7, 0.2, -2.2]} rotation={[0, -0.42, 0]}>
        <ModelPodium accent="#22d3ee" position={[0, 0, 0]} scale={[2.1, 0.2, 1.3]} />
        <primitive
          object={mic.scene}
          position={[-0.45, 0.24, 0.02]}
          rotation={[0, 0.25, 0]}
          scale={[0.34, 0.34, 0.34]}
        />
        <primitive
          object={speakers.scene}
          position={[0.55, 0.22, -0.02]}
          rotation={[0, -0.1, 0]}
          scale={[0.26, 0.26, 0.26]}
        />
      </group>
    </group>
  );
}

interface AreaPanelWithEffectsProps {
  area: ShowroomArea;
  lang: Language;
  isHovered: boolean;
  isFocused: boolean;
  isActive: boolean;
  isDimmed: boolean;
  onSelect: (area: ShowroomArea) => void;
  onHover: (area: ShowroomArea | null) => void;
}

function AreaPanelWithEffects({
  area,
  lang,
  isHovered,
  isFocused,
  isActive,
  isDimmed,
  onSelect,
  onHover,
}: AreaPanelWithEffectsProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Proximity animatsiya hook — kamera 3.2m yaqinlashganda ishlaydi
  const proximity = usePanelProximityAnimation({
    panelPosition: area.position,
    activationRadius: 3.2,
    scaleMax: 1.055,
    lerpSpeed: 3.5,
  });

  // Har kadrda group scale yumshoq yangilanadi
  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.scale.setScalar(
      THREE.MathUtils.lerp(groupRef.current.scale.x, proximity.scale, 0.1)
    );
  });

  return (
    // group origin = (0,0,0) — scale markaz sifatida
    <group ref={groupRef}>
      {/* Glow plane: proximity yoki hover bo'lganda yonadi */}
      <mesh
        position={[
          area.position[0],
          area.position[1],
          area.position[2] - 0.04,
        ]}
        rotation={area.rotation ? [area.rotation[0], area.rotation[1], area.rotation[2]] : [0, 0, 0]}
      >
        <planeGeometry args={[3.4, 2.2]} />
        <meshBasicMaterial
          color={area.color}
          transparent
          opacity={proximity.glowAlpha * 0.14 + (isHovered ? 0.08 : 0)}
          depthWrite={false}
        />
      </mesh>

      {/* Asl ImagePanel — o'zgarishsiz */}
      <ImagePanel
        accentColor={area.color}
        active={isActive}
        dimmed={isDimmed}
        focused={isFocused}
        image={area.image}
        label={area.title[lang]}
        position={area.position}
        rotation={area.rotation}
        onClick={() => onSelect(area)}
        onHover={(isHov) => onHover(isHov ? area : null)}
      />

      {/* Hover tooltip — panel ustida suzib turadi */}
      <PanelHoverTooltip
        area={area}
        lang={lang}
        visible={isHovered}
        offset={[
          area.position[0],
          area.position[1] + 1.3,
          area.position[2] + 0.1,
        ]}
      />
    </group>
  );
}

export function VRShowroomScene({
  areas,
  focusedArea,
  hoveredArea,
  lang,
  onBackgroundDoubleClick,
  onSelect,
  onHover,
  resetSignal,
  selectedArea,
}: VRShowroomSceneProps) {
  const accent = hoveredArea?.color || focusedArea?.color || selectedArea.color;
  const focused = Boolean(focusedArea);

  return (
    <>
      {/* ✂️ 4-O'ZGARISH: <PerspectiveCamera makeDefault .../> O'CHIRILDI
          Kamera endi VRModule Canvas props: camera={{ fov: 75, position: [0,1.7,4] }} */}

      <color attach="background" args={["#030712"]} />
      <fog attach="fog" args={["#030712", focused ? 11 : 14, 26]} />

      <ambientLight intensity={focused ? 0.18 : 0.28} />
      <hemisphereLight args={["#8bd8ff", "#050713", focused ? 0.9 : 1.2]} />
      <directionalLight
        position={[3.8, 7.5, 5.2]}
        intensity={focused ? 2.45 : 2.1}
        color="#e9f8ff"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-near={0.5}
        shadow-camera-far={25}
        shadow-camera-left={-9}
        shadow-camera-right={9}
        shadow-camera-top={9}
        shadow-camera-bottom={-9}
      />
      <spotLight
        position={[
          (focusedArea ?? selectedArea).position[0],
          5.8,
          (focusedArea ?? selectedArea).position[2] + 1.4,
        ]}
        angle={0.5}
        penumbra={0.7}
        intensity={focused ? 90 : 70}
        distance={16}
        color={accent}
        castShadow
      />

      <Environment preset="city" background={false} environmentIntensity={focused ? 0.55 : 0.78} />
      <Stars radius={70} depth={28} count={1100} factor={2.4} fade speed={0.28} />
      <Sparkles count={150} scale={15} size={1.2} speed={0.4} color="#22d3ee" />
      <Sparkles
        count={focused ? 42 : 30}
        scale={[18, 8, 18]}
        size={2.2}
        speed={0.22}
        color={accent}
        opacity={0.5}
        position={[0, 2.8, -1]}
      />

      <StudioArchitecture accent={accent} focused={focused} />
      <LightRibbons accent={accent} focused={focused} />
      <ShowroomModels />
      <FocusVignette focused={focused} />
      <RoomShell onBackgroundDoubleClick={onBackgroundDoubleClick} />

      <group position={[0, 3.55, -6.2]}>
        <Text
          fontSize={0.24}
          color={focused ? "#c7e9ff" : "#dff6ff"}
          anchorX="center"
          anchorY="middle"
          maxWidth={6}
          textAlign="center"
        >
          {lang === "uz"
            ? "Televideniye texnologiyalari virtual ko'rgazmasi"
            : lang === "ru"
              ? "Virtual faculty exhibition"
              : "Television Technology Virtual Exhibition"}
        </Text>
      </group>

      {/* ✅ 4-O'ZGARISH: ImagePanel → AreaPanelWithEffects bilan almashtirildi */}
      {areas.map((area) => {
        const isFocused = focusedArea?.id === area.id;
        const isActive = selectedArea.id === area.id || isFocused;
        const isDimmed = focused && !isFocused;
        const isHovered = hoveredArea?.id === area.id;

        return (
          <AreaPanelWithEffects
            key={area.id}
            area={area}
            lang={lang}
            isHovered={isHovered}
            isFocused={isFocused}
            isActive={isActive}
            isDimmed={isDimmed}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}

      <ContactShadows
        position={[0, 0.04, 0]}
        opacity={focused ? 0.7 : 0.56}
        scale={18}
        blur={2.6}
        far={7}
        resolution={1024}
        color="#020617"
      />


      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  );
}
