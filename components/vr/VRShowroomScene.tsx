import React, { useEffect, useMemo, useRef } from "react";
import {
  AdaptiveDpr,
  ContactShadows,
  Environment,
  MeshReflectorMaterial,
  OrbitControls,
  PerspectiveCamera,
  Preload,
  Sparkles,
  Stars,
  Text,
} from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Language } from "../../types";
import { ImagePanel } from "./ImagePanel";

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

interface CameraRigProps {
  focusedArea: ShowroomArea | null;
  resetSignal: number;
}

const defaultCameraPosition = new THREE.Vector3(0, 4.35, 10.8);
const defaultCameraTarget = new THREE.Vector3(0, 1.75, -0.65);

function areaFocusTarget(area: ShowroomArea) {
  return new THREE.Vector3(area.position[0], area.position[1] * 0.82, area.position[2] - 0.12);
}

function areaFocusPosition(area: ShowroomArea, compact: boolean) {
  const rotation = area.rotation ?? [0, 0, 0];
  const normal = new THREE.Vector3(0, 0, 1)
    .applyEuler(new THREE.Euler(rotation[0], rotation[1], rotation[2]))
    .normalize();
  const distance = compact ? 3.45 : 4.15;
  const height = compact ? 0.55 : 0.8;

  return new THREE.Vector3(area.position[0], area.position[1] + height, area.position[2])
    .addScaledVector(normal, distance)
    .add(new THREE.Vector3(normal.x * 0.15, 0, normal.z * 0.15));
}

function CameraRig({ focusedArea, resetSignal }: CameraRigProps) {
  const controlsRef = useRef<any>(null);
  const desiredPosition = useRef(defaultCameraPosition.clone());
  const desiredTarget = useRef(defaultCameraTarget.clone());
  const introProgress = useRef(0);
  const isInteracting = useRef(false);
  const { camera, clock, pointer, viewport } = useThree();

  useEffect(() => {
    camera.position.set(0, 7.4, 15.2);
  }, [camera]);

  useEffect(() => {
    const compact = viewport.width < 7;
    if (focusedArea) {
      desiredPosition.current.copy(areaFocusPosition(focusedArea, compact));
      desiredTarget.current.copy(areaFocusTarget(focusedArea));
    } else {
      desiredPosition.current.copy(defaultCameraPosition);
      desiredTarget.current.copy(defaultCameraTarget);
    }
  }, [focusedArea, viewport.width]);

  useEffect(() => {
    desiredPosition.current.copy(defaultCameraPosition);
    desiredTarget.current.copy(defaultCameraTarget);
    isInteracting.current = false;
  }, [resetSignal]);

  useFrame((state, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    introProgress.current = Math.min(1, introProgress.current + delta * 0.4);
    const introEase = 1 - Math.pow(1 - introProgress.current, 3);
    const settle = focusedArea ? 1 - Math.pow(0.002, delta) : 1 - Math.pow(0.012, delta);
    const targetLerp = isInteracting.current ? 1 - Math.pow(0.15, delta) : settle;
    const positionLerp = isInteracting.current ? 1 - Math.pow(0.24, delta) : settle;

    const parallaxStrength = focusedArea ? 0.04 : 0.14;
    const drift = new THREE.Vector3(
      pointer.x * parallaxStrength,
      Math.sin(clock.elapsedTime * 0.35) * 0.045 + pointer.y * parallaxStrength * 0.55,
      0,
    );

    const nextTarget = desiredTarget.current.clone().add(drift);
    const introPosition = new THREE.Vector3(0, 7.4, 15.2).lerp(desiredPosition.current, introEase);

    controls.target.lerp(nextTarget, targetLerp);
    camera.position.lerp(introProgress.current < 1 ? introPosition : desiredPosition.current, positionLerp);

    const distance = camera.position.distanceTo(controls.target);
    if (distance < controls.minDistance + 0.18) {
      const direction = camera.position.clone().sub(controls.target).normalize();
      camera.position.copy(controls.target.clone().addScaledVector(direction, controls.minDistance + 0.18));
    }

    controls.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.52}
      zoomSpeed={0.82}
      panSpeed={0.58}
      screenSpacePanning={false}
      enablePan
      enableZoom
      minDistance={3.8}
      maxDistance={13.5}
      minPolarAngle={Math.PI / 4.8}
      maxPolarAngle={Math.PI / 1.95}
      minAzimuthAngle={-Math.PI / 2.15}
      maxAzimuthAngle={Math.PI / 2.15}
      touches={{
        ONE: THREE.TOUCH.ROTATE,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
      target={defaultCameraTarget.toArray()}
      onStart={() => {
        isInteracting.current = true;
      }}
      onEnd={() => {
        isInteracting.current = false;
      }}
    />
  );
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
      <PerspectiveCamera makeDefault position={[0, 7.4, 15.2]} fov={42} />
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

      {areas.map((area) => {
        const isFocused = focusedArea?.id === area.id;
        const isActive = selectedArea.id === area.id || isFocused;
        const isDimmed = focused && !isFocused;

        return (
          <ImagePanel
            key={area.id}
            accentColor={area.color}
            active={isActive}
            dimmed={isDimmed}
            focused={isFocused}
            image={area.image}
            label={area.title[lang]}
            position={area.position}
            rotation={area.rotation}
            onClick={() => onSelect(area)}
            onHover={(isHovered) => onHover(isHovered ? area : null)}
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
      <CameraRig focusedArea={focusedArea} resetSignal={resetSignal} />
      <AdaptiveDpr pixelated />
      <Preload all />
    </>
  );
}
