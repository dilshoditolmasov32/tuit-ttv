import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  Sphere,
  PerspectiveCamera,
  Stars,
  MeshTransmissionMaterial,
  ScrollControls,
  useScroll,
  useTexture,
} from '@react-three/drei';
import * as THREE from 'three';

// ── Rasm importlari (sintaksis xatolari tuzatildi) ──────────────────────────
import logoImg     from '../assests/logo.jpg';
import image1      from '../assests/050A7790.JPG';
import image2      from '../assests/050A7793.JPG';
import image3      from '../assests/IMG_3288.jpg';
import image4      from '../assests/IMG_3297.jpg';
import image5      from '../assests/IMG_3312.jpg';
import image6      from '../assests/IMG_3320.jpg';
import image7      from '../assests/IMG_3325.jpg';
import image8      from '../assests/IMG_3327.jpg';
import image9      from '../assests/media-markaz-1.jpg';

// ── JSX alias'lar (original pattern saqlandi) ───────────────────────────────
const AmbientLight         = 'ambientLight'         as any;
const PointLight           = 'pointLight'           as any;
const Group                = 'group'                as any;
const Mesh                 = 'mesh'                 as any;
const TorusGeometry        = 'torusGeometry'        as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
// Tour uchun yangi alias'lar
const PlaneGeometry        = 'planeGeometry'        as any;
const MeshBasicMaterial    = 'meshBasicMaterial'    as any;

// ── Tour konfiguratsiyasi ────────────────────────────────────────────────────
const TOUR_IMAGES = [image1, image2, image3, image4, image5, image6, image7, image8, image9];
const TOTAL       = TOUR_IMAGES.length;
const RADIUS      = 6.5;
const PW          = 3.6;   // panel kengligi
const PH          = 2.25;  // panel balandligi

// ════════════════════════════════════════════════════════════════════════════
//  ORIGINAL Experience komponenti — HECH NARSA O'ZGARMADI
// ════════════════════════════════════════════════════════════════════════════
const Experience = () => {
  const scroll       = useScroll();
  const mainSphereRef = useRef<THREE.Mesh>(null!);
  const groupRef      = useRef<THREE.Group>(null!);
  const ringRef       = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const offset = scroll.offset;
    state.camera.position.z = 8 - offset * 4;
    state.camera.position.y = offset * 2;
    state.camera.lookAt(0, 0, 0);

    if (mainSphereRef.current) {
      mainSphereRef.current.rotation.y += 0.005;
      mainSphereRef.current.scale.setScalar(1 + offset * 0.5);
    }
    if (groupRef.current) groupRef.current.rotation.y = offset * Math.PI;
    if (ringRef.current) {
      ringRef.current.rotation.x = offset * 2;
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Group ref={groupRef}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Sphere ref={mainSphereRef} args={[1.5, 64, 64]}>
          <MeshTransmissionMaterial
            backside samples={16} thickness={1.5}
            chromaticAberration={0.05} anisotropy={0.3}
            distortion={0.3} distortionScale={0.5}
            temporalDistortion={0.1} color="#00f2fe" roughness={0}
          />
        </Sphere>
      </Float>
      <Mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <TorusGeometry args={[3, 0.01, 16, 100]} />
        <MeshStandardMaterial
          color="#00f2fe" emissive="#00f2fe"
          emissiveIntensity={5} transparent opacity={0.3}
        />
      </Mesh>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </Group>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  YANGI: Kamera menejeri (FOV o'tishlarini yumshatadi)
// ════════════════════════════════════════════════════════════════════════════
const CameraManager: React.FC<{ tourMode: boolean }> = ({ tourMode }) => {
  useFrame((state) => {
    const cam = state.camera as THREE.PerspectiveCamera;
    const targetFov = tourMode ? 72 : 35;
    if (Math.abs(cam.fov - targetFov) > 0.15) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, targetFov, 0.06);
      cam.updateProjectionMatrix();
    }
  });
  return null;
};

// ════════════════════════════════════════════════════════════════════════════
//  YANGI: Bitta rasm paneli
// ════════════════════════════════════════════════════════════════════════════
const TourPanel: React.FC<{
  url: string;
  index: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ url, index, isActive, onClick }) => {
  const texture  = useTexture(url);
  const meshRef  = useRef<THREE.Mesh>(null!);
  const glowRef  = useRef<THREE.Mesh>(null!);

  // Har bir panel uchun burchak va 3D joylashuv
  const angle = (index / TOTAL) * Math.PI * 2;
  const x     = Math.sin(angle) * RADIUS;
  const z     = Math.cos(angle) * RADIUS;
  const rotY  = angle + Math.PI; // markazga qaratilgan

  useFrame(() => {
    if (meshRef.current) {
      const target = isActive ? 1.07 : 1.0;
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.07);
    }
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, isActive ? 0.75 : 0.0, 0.08);
    }
  });

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Aktiv panel uchun ko'k yonish effekti */}
      <Mesh ref={glowRef} position={[0, 0, -0.07]}>
        <PlaneGeometry args={[PW + 0.28, PH + 0.28]} />
        <MeshBasicMaterial color="#00f2fe" transparent opacity={0} />
      </Mesh>
      {/* Rasm */}
      <Mesh ref={meshRef} onClick={onClick}>
        <PlaneGeometry args={[PW, PH]} />
        <MeshBasicMaterial map={texture} toneMapped={false} />
      </Mesh>
    </group>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  YANGI: 360° Galereya (aylantirish + kamera boshqaruvi)
// ════════════════════════════════════════════════════════════════════════════
const TourGallery: React.FC<{
  currentIndex: number;
  onSelect:     (i: number) => void;
  autoRotate:   boolean;
}> = ({ currentIndex, onSelect, autoRotate }) => {
  const groupRef  = useRef<THREE.Group>(null!);
  const currentRot = useRef(Math.PI); // index 0 kamerani oldida bo'lsin

  useFrame((state, delta) => {
    // Avtomatik aylantirish
    if (autoRotate) {
      currentRot.current -= delta * 0.18;
    } else {
      // Tanlangan rasmni kamera oldiga olib kelish formulasi
      // Rasm i burchagi = (i/TOTAL)*2PI → guruhni PI - (i/TOTAL)*2PI aylantiramiz
      const snap = Math.PI - (currentIndex / TOTAL) * Math.PI * 2;
      currentRot.current = THREE.MathUtils.lerp(currentRot.current, snap, 0.055);
    }

    if (groupRef.current) groupRef.current.rotation.y = currentRot.current;

    // Tour kamerasi: markaz nuqtada, -Z yo'nalishiga qaraydi
    state.camera.position.lerp(new THREE.Vector3(0, 0.2, 0), 0.06);
    state.camera.lookAt(0, 0.2, -1);
  });

  return (
    <Group ref={groupRef}>
      <Stars radius={100} depth={50} count={2500} factor={4} saturation={0} fade speed={0.4} />
      {/* Yengil ko'k muhit yoritgichi */}
      <AmbientLight intensity={0.6} />
      <PointLight position={[0, 6, 0]} intensity={1.2} color="#00f2fe" />
      {TOUR_IMAGES.map((url, i) => (
        <TourPanel
          key={i} url={url} index={i}
          isActive={i === currentIndex}
          onClick={() => onSelect(i)}
        />
      ))}
    </Group>
  );
};

// ════════════════════════════════════════════════════════════════════════════
//  Asosiy Scene3D komponenti
// ════════════════════════════════════════════════════════════════════════════
const Scene3D: React.FC = () => {
  const [tourMode,      setTourMode]      = useState(false);
  const [currentIndex,  setCurrentIndex]  = useState(0);
  const [autoRotate,    setAutoRotate]    = useState(false);
  const [dragStartX,    setDragStartX]    = useState<number | null>(null);

  const prev = useCallback(() => {
    setCurrentIndex(i => (i - 1 + TOTAL) % TOTAL);
    setAutoRotate(false);
  }, []);

  const next = useCallback(() => {
    setCurrentIndex(i => (i + 1) % TOTAL);
    setAutoRotate(false);
  }, []);

  const enterTour = useCallback(() => {
    setTourMode(true);
    setCurrentIndex(0);
    setAutoRotate(false);
  }, []);

  const exitTour = useCallback(() => {
    setTourMode(false);
    setAutoRotate(false);
  }, []);

  // Klaviatura boshqaruvi (← → Esc)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!tourMode) return;
      if (e.key === 'ArrowLeft')  prev();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'Escape')     exitTour();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tourMode, prev, next, exitTour]);

  // Swiping (siljitish) boshqaruvi
  const onPointerDown = (e: React.PointerEvent) => {
    if (tourMode) setDragStartX(e.clientX);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (dragStartX !== null) {
      const d = e.clientX - dragStartX;
      if (d > 55)       prev();
      else if (d < -55) next();
      setDragStartX(null);
    }
  };

  // ── UI yordamchi uslublar ────────────────────────────────────────────────
  const glass: React.CSSProperties = {
    background:     'rgba(0,0,0,0.52)',
    border:         '1px solid rgba(0,242,254,0.42)',
    color:          '#00f2fe',
    cursor:         'pointer',
    backdropFilter: 'blur(8px)',
  };

  return (
    <div
      className="fixed inset-0 -z-10 bg-[#050505]"
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault fov={35} position={[0, 0, 8]} />
        <AmbientLight intensity={0.2} />
        <PointLight position={[10, 10, 10]}   intensity={1.5} color="#4facfe" />
        <PointLight position={[-10, -5, -10]} intensity={1.0} color="#00f2fe" />

        {/* FOV o'tishlarini yumshatish */}
        <CameraManager tourMode={tourMode} />

        {tourMode ? (
          <TourGallery
            currentIndex={currentIndex}
            onSelect={(i) => { setCurrentIndex(i); setAutoRotate(false); }}
            autoRotate={autoRotate}
          />
        ) : (
          <ScrollControls pages={4} damping={0.2}>
            <Experience />
          </ScrollControls>
        )}
      </Canvas>

      {/* ── Tour kirish tugmasi (asosiy ko'rinish) ─────────────────────── */}
      {!tourMode && (
        <button
          onClick={enterTour}
          style={{
            ...glass,
            position:      'absolute',
            bottom:        32,
            left:          '50%',
            transform:     'translateX(-50%)',
            padding:       '13px 30px',
            borderRadius:  50,
            fontSize:      13,
            fontWeight:    600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            zIndex:        200,
          }}
        >
          ◎ &nbsp; 360° Tour
        </button>
      )}

      {tourMode && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 200 }}>

          {/* Yopish (✕) */}
          <button
            onClick={exitTour}
            style={{
              ...glass,
              pointerEvents: 'auto',
              position:   'absolute',
              top: 22, right: 22,
              width: 44, height: 44,
              borderRadius: '50%',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >✕</button>

          {/* Avto-aylantirish */}
          <button
            onClick={() => setAutoRotate(r => !r)}
            style={{
              ...glass,
              pointerEvents: 'auto',
              position:      'absolute',
              top: 22, left: 22,
              padding:       '8px 18px',
              borderRadius:  20,
              fontSize:      11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: autoRotate
                ? 'rgba(0,242,254,0.18)'
                : 'rgba(0,0,0,0.52)',
            }}
          >
            {autoRotate ? '⏸  Pauza' : '▶  Avto'}
          </button>

          {/* Rasm hisoblagichi */}
          <div style={{
            position:      'absolute',
            top: 30, left: '50%',
            transform:     'translateX(-50%)',
            color:         'rgba(0,242,254,0.65)',
            fontSize:      12,
            letterSpacing: '0.2em',
            fontFamily:    'monospace',
          }}>
            {String(currentIndex + 1).padStart(2, '0')} / {String(TOTAL).padStart(2, '0')}
          </div>

          {/* Chapga / O'ngga o'qlar */}
          {(['left', 'right'] as const).map(dir => (
            <button
              key={dir}
              onClick={dir === 'left' ? prev : next}
              style={{
                ...glass,
                pointerEvents:  'auto',
                position:       'absolute',
                top:            '50%',
                transform:      'translateY(-50%)',
                [dir]:          20,
                width:          52,
                height:         52,
                borderRadius:   '50%',
                fontSize:       30,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                lineHeight:     1,
              }}
            >
              {dir === 'left' ? '‹' : '›'}
            </button>
          ))}

          {/* Nuqta indikatorlari */}
          <div style={{
            position:  'absolute',
            bottom:    30,
            left:      '50%',
            transform: 'translateX(-50%)',
            display:   'flex',
            gap:       9,
            alignItems: 'center',
          }}>
            {TOUR_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrentIndex(i); setAutoRotate(false); }}
                style={{
                  pointerEvents: 'auto',
                  width:      i === currentIndex ? 28 : 8,
                  height:     8,
                  borderRadius: 4,
                  background: i === currentIndex
                    ? '#00f2fe'
                    : 'rgba(0,242,254,0.28)',
                  border:     'none',
                  cursor:     'pointer',
                  padding:    0,
                  transition: 'width 0.35s ease, background 0.35s ease',
                }}
              />
            ))}
          </div>

          {/* Maslahat */}
          <div style={{
            position:      'absolute',
            bottom:        56,
            left:          '50%',
            transform:     'translateX(-50%)',
            color:         'rgba(0,242,254,0.32)',
            fontSize:      10,
            letterSpacing: '0.18em',
            fontFamily:    'monospace',
            textTransform: 'uppercase',
            whiteSpace:    'nowrap',
          }}>
            ← Swipe yoki klaviatura o'qlari →
          </div>
        </div>
      )}
    </div>
  );
};

export default Scene3D;