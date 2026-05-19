/**
 * VRPointerLockController.tsx
 *
 * O'yindagi kabi erkin kamera harakati:
 * - Sichqoncha: ko'rish yo'nalishi (Pointer Lock)
 * - WASD / Arrow keys: oldinga/orqaga/chapga/o'ngga harakat
 * - Shift: tezroq yugurish
 * - Space / E: yuqoriga, C / Q: pastga
 * - Esc: chiqish
 *
 * Props:
 *   areas          – ShowroomArea[] (proximity uchun)
 *   onProximity    – yaqin panel o'zgarganda chaqiriladi
 *   onLockChange   – lock/unlock holati
 *   speed          – harakat tezligi (default 4)
 *   sprintMultiplier – Shift bosganda (default 2.4)
 *   proximityRadius  – yaqinlik radiusi metrda (default 2.8)
 */

import { useEffect, useRef, useCallback } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import type { PointerLockControls as PointerLockControlsImpl } from "three-stdlib";

interface AreaLike {
  id: string;
  position: [number, number, number];
  color?: string;
}

interface Props {
  areas?: AreaLike[];
  onProximity?: (area: AreaLike | null) => void;
  onLockChange?: (locked: boolean) => void;
  speed?: number;
  sprintMultiplier?: number;
  proximityRadius?: number;
}

const _v3 = new THREE.Vector3();

export function VRPointerLockController({
  areas = [],
  onProximity,
  onLockChange,
  speed = 4,
  sprintMultiplier = 2.4,
  proximityRadius = 2.8,
}: Props) {
  const controlsRef = useRef<PointerLockControlsImpl>(null);
  const { camera } = useThree();

  // Bosilgan tugmalar
  const keys = useRef<Record<string, boolean>>({});
  // Joriy yaqin panel
  const nearArea = useRef<AreaLike | null>(null);

  // ---- Klaviatura ----
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    keys.current[e.code] = true;
  }, []);
  const onKeyUp = useCallback((e: KeyboardEvent) => {
    keys.current[e.code] = false;
  }, []);

  // ---- Lock/Unlock eventlari ----
  const handleLock = useCallback(() => onLockChange?.(true), [onLockChange]);
  const handleUnlock = useCallback(() => onLockChange?.(false), [onLockChange]);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  // ---- Har kadr ----
  useFrame((_, delta) => {
    const ctrl = controlsRef.current;
    if (!ctrl?.isLocked) return;

    const k = keys.current;
    const sprint = k["ShiftLeft"] || k["ShiftRight"] ? sprintMultiplier : 1;
    const actualSpeed = speed * sprint * delta;

    // Harakat yo'nalishlari
    const fw = (k["KeyW"] || k["ArrowUp"] ? 1 : 0) - (k["KeyS"] || k["ArrowDown"] ? 1 : 0);
    const rl = (k["KeyD"] || k["ArrowRight"] ? 1 : 0) - (k["KeyA"] || k["ArrowLeft"] ? 1 : 0);
    const ud = (k["Space"] || k["KeyE"] ? 1 : 0) - (k["KeyC"] || k["KeyQ"] ? 1 : 0);

    if (fw !== 0) ctrl.moveForward(fw * actualSpeed);
    if (rl !== 0) ctrl.moveRight(rl * actualSpeed);
    if (ud !== 0) camera.position.y += ud * actualSpeed;

    // Yerdan pastga tushmasligi (ixtiyoriy: min y = 0.8)
    if (camera.position.y < 0.8) camera.position.y = 0.8;
    // Sahna chegarasi
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -9, 9);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -9, 9);

    // ---- Proximity tekshiruvi ----
    if (areas.length && onProximity) {
      let closest: AreaLike | null = null;
      let minDist = Infinity;
      for (const area of areas) {
        _v3.set(...area.position);
        const d = camera.position.distanceTo(_v3);
        if (d < proximityRadius && d < minDist) {
          minDist = d;
          closest = area;
        }
      }
      if (closest?.id !== nearArea.current?.id) {
        nearArea.current = closest;
        onProximity(closest);
      }
    }
  });

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={handleLock}
      onUnlock={handleUnlock}
    />
  );
}