/**
 * usePanelProximityAnimation.ts
 *
 * Kamera panelga yaqinlashganda avtomatik animatsiya triggerini beradi.
 * VRShowroomScene ichida har bir panel mesh uchun ishlatiladi.
 *
 * Qaytaradi:
 *   scale     – panel kattaroq bo'ladi (1 → 1.06)
 *   glowAlpha – glow intensivligi (0 → 1)
 *   emissiveIntensity – emissive puls effekti
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Options {
  panelPosition: THREE.Vector3 | [number, number, number];
  activationRadius?: number;  // default: 3.5
  scaleMax?: number;          // default: 1.06
  lerpSpeed?: number;         // default: 4
}

interface ProximityState {
  scale: number;
  glowAlpha: number;
  emissiveIntensity: number;
  isNear: boolean;
}

const _pos = new THREE.Vector3();

export function usePanelProximityAnimation({
  panelPosition,
  activationRadius = 3.5,
  scaleMax = 1.06,
  lerpSpeed = 4,
}: Options): ProximityState {
  const { camera } = useThree();
  const state = useRef<ProximityState>({
    scale: 1,
    glowAlpha: 0,
    emissiveIntensity: 0,
    isNear: false,
  });

  useFrame((_, delta) => {
    if (Array.isArray(panelPosition)) {
      _pos.set(...(panelPosition as [number, number, number]));
    } else {
      _pos.copy(panelPosition as THREE.Vector3);
    }

    const dist = camera.position.distanceTo(_pos);
    const target = dist < activationRadius ? 1 : 0;

    const s = state.current;
    const t = 1 - Math.pow(1 - Math.min(lerpSpeed * delta, 1), 1);

    s.glowAlpha += (target - s.glowAlpha) * t;
    s.scale += ((target > 0.5 ? scaleMax : 1) - s.scale) * t;
    s.emissiveIntensity = s.glowAlpha * 0.55;
    s.isNear = dist < activationRadius;
  });

  return state.current;
}

// ============================================================
// VRShowroomScene ichida panel mesh qo'llash namunasi:
// ============================================================
//
//  import { usePanelProximityAnimation } from "./usePanelProximityAnimation";
//  import { PanelHoverTooltip } from "./PanelHoverTooltip";
//
//  function AreaPanel({ area, lang, isHovered, onClick, onHover }) {
//    const panelRef = useRef<THREE.Mesh>(null);
//    const proximity = usePanelProximityAnimation({
//      panelPosition: area.position,
//      activationRadius: 3.2,
//    });
//
//    useFrame(() => {
//      if (!panelRef.current) return;
//      // Proximity scale animatsiyasi
//      panelRef.current.scale.setScalar(
//        THREE.MathUtils.lerp(panelRef.current.scale.x, proximity.scale, 0.12)
//      );
//    });
//
//    return (
//      <group position={area.position} rotation={area.rotation}>
//        <mesh
//          ref={panelRef}
//          onPointerEnter={(e) => { e.stopPropagation(); onHover(area); }}
//          onPointerLeave={(e) => { e.stopPropagation(); onHover(null); }}
//          onClick={(e) => { e.stopPropagation(); onClick(area); }}
//        >
//          <planeGeometry args={[2.4, 1.35]} />
//          <meshStandardMaterial
//            map={texture}
//            emissive={new THREE.Color(area.color)}
//            emissiveIntensity={proximity.emissiveIntensity + (isHovered ? 0.3 : 0)}
//          />
//        </mesh>
//
//        {/* Glow ring (proximity bo'lganda chiqadi) */}
//        <mesh scale={[1.08, 1.08, 1]}>
//          <planeGeometry args={[2.4, 1.35]} />
//          <meshBasicMaterial
//            color={area.color}
//            transparent
//            opacity={proximity.glowAlpha * 0.18}
//            depthWrite={false}
//          />
//        </mesh>
//
//        {/* Hover tooltip */}
//        <PanelHoverTooltip
//          area={area}
//          lang={lang}
//          visible={isHovered}
//          offset={[0, 1.1, 0.01]}
//        />
//      </group>
//    );
//  }