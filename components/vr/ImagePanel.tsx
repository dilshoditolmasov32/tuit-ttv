import React, { useEffect, useMemo, useRef, useState } from "react";
import { Float, Text, useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export interface ImagePanelProps {
  accentColor: string;
  active: boolean;
  dimmed: boolean;
  focused: boolean;
  image: string;
  label: string;
  onClick?: () => void;
  onHover?: (hovered: boolean) => void;
  position: [number, number, number];
  rotation?: [number, number, number];
  maxHeight?: number;
  maxWidth?: number;
}

const tempVector = new THREE.Vector3();
const tempEuler = new THREE.Euler();

export function ImagePanel({
  accentColor,
  active,
  dimmed,
  focused,
  image,
  label,
  onClick,
  onHover,
  position,
  rotation = [0, 0, 0],
  maxHeight = 2.2,
  maxWidth = 3.7,
}: ImagePanelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const imageRef = useRef<THREE.Mesh>(null);
  const imageBoostRef = useRef<THREE.Mesh>(null);
  const glassRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const labelBarRef = useRef<THREE.Mesh>(null);
  const overlayRef = useRef<THREE.Mesh>(null);
  const borderRefs = useRef<THREE.Mesh[]>([]);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(image);
  const { gl, pointer } = useThree();

  const size = useMemo<[number, number]>(() => {
    const source = texture.image as HTMLImageElement | ImageBitmap | undefined;
    const imageWidth = source?.width || 16;
    const imageHeight = source?.height || 9;
    const aspect = imageWidth / imageHeight;
    let width = maxHeight * aspect;
    let height = maxHeight;

    if (width > maxWidth) {
      width = maxWidth;
      height = maxWidth / aspect;
    }

    return [width, height];
  }, [maxHeight, maxWidth, texture.image]);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy());
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = true;
    texture.needsUpdate = true;
  }, [gl, texture]);

  useEffect(() => {
    borderRefs.current = borderRefs.current.slice(0, 4);
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const t = state.clock.elapsedTime;
    const hoverMix = hovered ? 1 : 0;
    const activeMix = active ? 1 : 0;
    const focusMix = focused ? 1 : 0;
    const dimMix = dimmed ? 1 : 0;
    const pulse = 0.5 + Math.sin(t * 2.7 + position[0]) * 0.5;

    tempEuler.set(rotation[0], rotation[1], rotation[2]);
    tempVector.set(0, 0, 1).applyEuler(tempEuler).normalize();

    const targetScale = 1 + hoverMix * 0.03 + activeMix * 0.08 + focusMix * 0.12 - dimMix * 0.04;
    const targetX = position[0] + pointer.x * 0.08 * hoverMix;
    const targetY = position[1] + Math.sin(t * (focusMix ? 1.7 : 0.95) + position[0]) * (focusMix ? 0.08 : 0.045);
    const targetZ =
      position[2] +
      tempVector.z * (focusMix ? 0.48 : activeMix ? 0.26 : 0) -
      tempVector.z * (dimMix ? 0.34 : 0);
    const targetRotX = rotation[0] + pointer.y * 0.06 * hoverMix;
    const targetRotY = rotation[1] - pointer.x * 0.08 * hoverMix;

    groupRef.current.position.lerp(
      new THREE.Vector3(targetX, targetY, targetZ),
      1 - Math.pow(0.001, delta),
    );
    groupRef.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      1 - Math.pow(0.001, delta),
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.08);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.08);

    const frameMaterial = frameRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (frameMaterial) {
      frameMaterial.emissiveIntensity = THREE.MathUtils.lerp(
        frameMaterial.emissiveIntensity,
        0.16 + hoverMix * 0.16 + activeMix * 0.24 + focusMix * 0.42 - dimMix * 0.08,
        0.08,
      );
      frameMaterial.roughness = THREE.MathUtils.lerp(
        frameMaterial.roughness,
        focused ? 0.16 : hovered ? 0.2 : 0.28,
        0.06,
      );
    }

    const imageMaterial = imageRef.current?.material as THREE.MeshStandardMaterial | undefined;
    if (imageMaterial) {
      imageMaterial.emissiveIntensity = THREE.MathUtils.lerp(
        imageMaterial.emissiveIntensity,
        focusMix ? 0.28 : activeMix ? 0.14 : hovered ? 0.08 : 0.03,
        0.1,
      );
      imageMaterial.opacity = THREE.MathUtils.lerp(
        imageMaterial.opacity,
        focusMix ? 1 : dimmed ? 0.45 : 1,
        0.08,
      );
      imageMaterial.roughness = THREE.MathUtils.lerp(
        imageMaterial.roughness,
        focusMix ? 0.18 : hovered ? 0.28 : 0.34,
        0.08,
      );
    }

    const imageBoostMaterial = imageBoostRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (imageBoostMaterial) {
      imageBoostMaterial.opacity = THREE.MathUtils.lerp(
        imageBoostMaterial.opacity,
        focusMix ? 0.22 : activeMix ? 0.08 : hovered ? 0.04 : 0,
        0.08,
      );
    }

    const glassMaterial = glassRef.current?.material as THREE.MeshPhysicalMaterial | undefined;
    if (glassMaterial) {
      glassMaterial.opacity = THREE.MathUtils.lerp(
        glassMaterial.opacity,
        focusMix ? 0.06 : hovered ? 0.18 : dimmed ? 0.04 : 0.1,
        0.08,
      );
    }

    const glowMaterial = glowRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (glowMaterial) {
      glowMaterial.opacity = THREE.MathUtils.lerp(
        glowMaterial.opacity,
        dimmed ? 0.04 : 0.14 + hoverMix * 0.1 + activeMix * 0.16 + focusMix * 0.24 + pulse * 0.08,
        0.08,
      );
    }

    const overlayMaterial = overlayRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (overlayMaterial) {
      overlayMaterial.opacity = THREE.MathUtils.lerp(
        overlayMaterial.opacity,
        focusMix ? 0 : dimmed ? 0.28 : 0.02,
        0.08,
      );
    }

    const labelMaterial = labelBarRef.current?.material as THREE.MeshBasicMaterial | undefined;
    if (labelMaterial) {
      labelMaterial.opacity = THREE.MathUtils.lerp(
        labelMaterial.opacity,
        dimmed ? 0.12 : focusMix ? 0.4 : activeMix ? 0.32 : hovered ? 0.26 : 0.18,
        0.08,
      );
    }

    borderRefs.current.forEach((border) => {
      const material = border.material as THREE.MeshBasicMaterial;
      material.opacity = THREE.MathUtils.lerp(
        material.opacity,
        dimmed ? 0.1 : 0.2 + hoverMix * 0.12 + activeMix * 0.18 + focusMix * 0.28 + pulse * 0.12,
        0.08,
      );
    });
  });

  const handlePointerEnter = () => {
    setHovered(true);
    onHover?.(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerLeave = () => {
    setHovered(false);
    onHover?.(false);
    document.body.style.cursor = "default";
  };

  const [width, height] = size;
  const borderThickness = 0.05;

  return (
    <Float
      speed={focused ? 1.9 : active ? 1.5 : 1.05}
      floatIntensity={focused ? 0.22 : active ? 0.15 : 0.09}
      rotationIntensity={0.035}
    >
      <group ref={groupRef} position={position} rotation={rotation}>
        <mesh ref={glowRef} position={[0, 0, -0.12]}>
          <planeGeometry args={[width + 0.6, height + 0.6]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.2} depthWrite={false} />
        </mesh>

        <mesh ref={frameRef} position={[0, 0, -0.04]} castShadow receiveShadow>
          <boxGeometry args={[width + 0.26, height + 0.26, 0.09]} />
          <meshStandardMaterial
            color="#07111f"
            emissive={accentColor}
            emissiveIntensity={0.18}
            metalness={0.76}
            roughness={0.24}
          />
        </mesh>

        {[
          { key: "top", position: [0, height / 2 + 0.11, 0.045] as [number, number, number], args: [width + 0.2, borderThickness] },
          { key: "bottom", position: [0, -height / 2 - 0.11, 0.045] as [number, number, number], args: [width + 0.2, borderThickness] },
          { key: "left", position: [-width / 2 - 0.11, 0, 0.045] as [number, number, number], args: [borderThickness, height + 0.2] },
          { key: "right", position: [width / 2 + 0.11, 0, 0.045] as [number, number, number], args: [borderThickness, height + 0.2] },
        ].map((border, index) => (
          <mesh
            key={border.key}
            ref={(node) => {
              if (node) borderRefs.current[index] = node;
            }}
            position={border.position}
          >
            <planeGeometry args={border.args} />
            <meshBasicMaterial color={accentColor} transparent opacity={0.22} depthWrite={false} />
          </mesh>
        ))}

        <mesh
          ref={imageRef}
          position={[0, 0, 0.02]}
          onClick={onClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          castShadow
        >
          <planeGeometry args={[width, height]} />
          <meshStandardMaterial
            map={texture}
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.04}
            metalness={0}
            roughness={0.34}
            transparent
            opacity={1}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={imageBoostRef} position={[0, 0, 0.028]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial
            map={texture}
            transparent
            opacity={0}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        <mesh ref={overlayRef} position={[0, 0, 0.03]}>
          <planeGeometry args={[width, height]} />
          <meshBasicMaterial color="#020617" transparent opacity={0.02} depthWrite={false} />
        </mesh>

        <mesh ref={glassRef} position={[0, 0, 0.04]}>
          <planeGeometry args={[width, height]} />
          <meshPhysicalMaterial
            color="#dff6ff"
            transparent
            opacity={0.1}
            roughness={0.04}
            metalness={0}
            transmission={0.28}
            thickness={0.04}
            depthWrite={false}
          />
        </mesh>

        <mesh ref={labelBarRef} position={[0, -height / 2 - 0.2, 0.02]}>
          <planeGeometry args={[Math.min(width, 3), 0.28]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.2} />
        </mesh>

        <Text
          position={[0, -height / 2 - 0.21, 0.05]}
          fontSize={0.09}
          maxWidth={Math.min(width - 0.2, 2.7)}
          textAlign="center"
          color={dimmed ? "#94a3b8" : "#dff6ff"}
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
}
