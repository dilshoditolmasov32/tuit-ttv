import React, { useRef, useState, Suspense } from 'react';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { VRZone } from '../data/zones';

interface VRZoneBlockProps {
  zone: VRZone;
  onHover?: (isHover: boolean) => void;
  onClick?: () => void;
}

/**
 * VRZoneBlock Component
 * Rasmli tekstura bilan dinamik 3D zonasi
 * Rasmlar faqat OLD tomonida (material-4) ko'rinadi
 * Qolgan tomonlar #1a1a1a rangida bo'ladi
 */
export const VRZoneBlock: React.FC<VRZoneBlockProps> = ({
  zone,
  onHover,
  onClick,
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // useTexture hook - rasmni yuklash
  const texture = useTexture(zone.image);
  
  // Tekstura uchun optimal sozlamalar
  if (texture) {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
  }

  // Hover animatsiyasi
  useFrame(() => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.1 : 1.0;
      const currentScale = meshRef.current.scale.x;
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(currentScale, targetScale, 0.1)
      );
    }
  });

  const handleHover = (hover: boolean) => {
    setIsHovered(hover);
    onHover?.(hover);
  };

  return (
    <group position={zone.position}>
      {/* Glowing effect o'ng tomonida hover qilganda */}
      {isHovered && (
        <mesh position={[0, 0, 0.15]}>
          <boxGeometry args={[3.2, 2.2, 0.1]} />
          <meshBasicMaterial
            color="#00f2fe"
            emissive="#00f2fe"
            emissiveIntensity={0.5}
            toneMapped={false}
          />
        </mesh>
      )}

      {/* Asosiy blok - tekstura va rang materiallar */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => handleHover(true)}
        onPointerLeave={() => handleHover(false)}
        onClick={onClick}
      >
        <boxGeometry args={[3, 2, 0.2]} />
        
        {/* Material array: [right, left, top, bottom, front, back] */}
        <meshStandardMaterial
          attachArray="material"
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.2}
        />
        <meshStandardMaterial
          attachArray="material"
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.2}
        />
        <meshStandardMaterial
          attachArray="material"
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.2}
        />
        <meshStandardMaterial
          attachArray="material"
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.2}
        />
        
        {/* Front material - tekstura */}
        <meshStandardMaterial
          attachArray="material"
          map={texture}
          toneMapped={false}
          roughness={0.3}
          metalness={0.0}
        />
        
        <meshStandardMaterial
          attachArray="material"
          color="#1a1a1a"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Info label ostida */}
      <mesh position={[0, -1.5, 0]}>
        <planeGeometry args={[3.5, 0.4]} />
        <meshBasicMaterial color="#0f0f0f" toneMapped={false} />
      </mesh>
    </group>
  );
};

/**
 * VRZoneBlock bilan Suspense wrapper
 * Rasmlari yuklanguncha fallback ko'rsatadi
 */
export const VRZoneBlockWithSuspense: React.FC<VRZoneBlockProps> = (props) => {
  return (
    <Suspense fallback={
      <mesh position={props.zone.position}>
        <boxGeometry args={[3, 2, 0.2]} />
        <meshStandardMaterial color="#333333" wireframe />
      </mesh>
    }>
      <VRZoneBlock {...props} />
    </Suspense>
  );
};
