import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { Language } from "../types";

type AreaId = "studio" | "control" | "audio" | "news";

interface VRArea {
  id: AreaId;
  color: string;
  position: [number, number, number];
  scale: [number, number, number];
  title: Record<Language, string>;
  summary: Record<Language, string>;
  details: Record<Language, string>;
  mediaHint: Record<Language, string>;
  imageUrl?: string;
  stats: {
    label: Record<Language, string>;
    value: string;
  }[];
}

const vrAreas: VRArea[] = [
  {
    id: "studio",
    color: "#22d3ee",
    position: [-4.5, 1.8, -2],
    scale: [2.2, 2.4, 1.4],
    imageUrl: "/assests/050A7790.JPG",
    title: {
      uz: "Teleko'rsatuv studiyasi",
      ru: "Телестудия",
      en: "Broadcast Studio",
    },
    summary: {
      uz: "Yoritish, kamera va dekoratsiya joylashuvi bilan asosiy studiya maydoni.",
      ru: "Основная студийная зона с освещением, камерами и декорациями.",
      en: "Main studio area with lighting, cameras, and set arrangement.",
    },
    details: {
      uz: "Bu zona talabalarga sahna joylashuvi, kamera rakurslari va kadr kompozitsiyasini VR muhitda tushuntirish uchun xizmat qiladi. Keyinchalik bu yerga real studio panoramasi, videolar va interaktiv nuqtalar qo'shishingiz mumkin.",
      ru: "Эта зона демонстрирует сцену, ракурсы камер и композицию кадра в VR. Позже сюда можно добавить реальные панорамы студии, видео и интерактивные точки.",
      en: "This zone demonstrates stage layout, camera angles, and shot composition in VR. Later you can replace it with real studio panoramas, videos, and interactive hotspots.",
    },
    mediaHint: {
      uz: "Keyin almashtirish: studio rasmi, kamera videosi, yoritish sxemasi",
      ru: "Позже заменить: фото студии, видео камер, схема освещения",
      en: "Replace later with: studio photos, camera footage, lighting scheme",
    },
    stats: [
      {
        label: { uz: "Holat", ru: "Статус", en: "Status" },
        value: "Static Demo",
      },
      {
        label: { uz: "Kontent", ru: "Контент", en: "Content" },
        value: "3 Placeholder",
      },
      {
        label: { uz: "Format", ru: "Формат", en: "Format" },
        value: "3D Scene",
      },
    ],
  },
  {
    id: "control",
    color: "#818cf8",
    position: [0, 1.4, -4],
    scale: [2.6, 1.6, 1.2],
    imageUrl: "/assests/050A7793.JPG",
    title: {
      uz: "Rejissyor pulti",
      ru: "Режиссерский пульт",
      en: "Control Room",
    },
    summary: {
      uz: "Jonli efir va montaj boshqaruvi uchun markaziy monitoring qismi.",
      ru: "Центральная зона мониторинга для эфира и монтажа.",
      en: "Central monitoring area for live broadcast and editing workflow.",
    },
    details: {
      uz: "Rejissyor pulti VR orqali talabalarga efir jarayonini izchil tushuntirish imkonini beradi. Monitorlar o'rniga hozircha neon panellar ishlatilgan, keyin esa haqiqiy interfeys skrinshotlari yoki videolarni joylashtirasiz.",
      ru: "Режиссерский пульт помогает объяснить процесс эфира через VR. Вместо мониторов пока используются неоновые панели, которые позже можно заменить реальными интерфейсами и видео.",
      en: "The control room helps explain the production workflow in VR. Neon panels are used for now and can later be replaced with real UI screenshots or production videos.",
    },
    mediaHint: {
      uz: "Keyin almashtirish: OBS/mikшер skrinshotlari, live efir videosi",
      ru: "Позже заменить: скриншоты микшера/OBS, видео прямого эфира",
      en: "Replace later with: mixer or OBS screenshots, live broadcast video",
    },
    stats: [
      {
        label: { uz: "Holat", ru: "Статус", en: "Status" },
        value: "Ready",
      },
      {
        label: { uz: "Ekran", ru: "Экран", en: "Screens" },
        value: "4 Panels",
      },
      {
        label: { uz: "Interaktiv", ru: "Интерактив", en: "Interactive" },
        value: "Yes",
      },
    ],
  },
  {
    id: "audio",
    color: "#f59e0b",
    position: [4.5, 1.4, -1.8],
    scale: [1.8, 1.8, 1.8],
    imageUrl: "/assests/IMG_3288.jpg",
    title: {
      uz: "Ovoz yozish bo'limi",
      ru: "Аудиозапись",
      en: "Audio Booth",
    },
    summary: {
      uz: "Mikrofon, akustik muhit va podkast yozuvlari uchun namoyish zonasi.",
      ru: "Демонстрационная зона для микрофона, акустики и подкаст-записи.",
      en: "Demonstration area for microphone setup, acoustics, and podcast recording.",
    },
    details: {
      uz: "Bu bo'limda audio yozish jarayoni, shovqinni kamaytirish va ovoz tozalash bosqichlari tushuntiriladi. Hozircha geometrik shakllar ishlatilmoqda, lekin keyinchalik mikrofon rasmi, audio waveform yoki izohli video bilan almashtirish juda oson.",
      ru: "В этой секции можно показать процесс записи, шумоподавление и обработку звука. Сейчас используются геометрические формы, позже их легко заменить фото микрофона, waveform или поясняющим видео.",
      en: "This section can explain recording, noise reduction, and sound processing. Geometric placeholders are used for now and can later be replaced with microphone images, waveforms, or short videos.",
    },
    mediaHint: {
      uz: "Keyin almashtirish: mikrofon rasmi, audio vizualizatsiya, voice-over video",
      ru: "Позже заменить: фото микрофона, аудиовизуализация, voice-over видео",
      en: "Replace later with: microphone photo, audio waveform, voice-over video",
    },
    stats: [
      {
        label: { uz: "Holat", ru: "Статус", en: "Status" },
        value: "Prototype",
      },
      {
        label: { uz: "Audio", ru: "Аудио", en: "Audio" },
        value: "Stereo",
      },
      {
        label: { uz: "Vizual", ru: "Визуал", en: "Visual" },
        value: "Static",
      },
    ],
  },
  {
    id: "news",
    color: "#10b981",
    position: [0, 1.2, 2.8],
    scale: [3.4, 1.2, 0.6],
    imageUrl: "/assests/IMG_3327.jpg",
    title: {
      uz: "Yangiliklar desk zonasi",
      ru: "Новостной desk",
      en: "News Desk",
    },
    summary: {
      uz: "Spiker chiqishi, teleprompter va frontal kadrlashni ko'rsatuvchi demo hudud.",
      ru: "Демо-зона для диктора, телесуфлера и фронтального кадра.",
      en: "Demo zone for anchor presentation, teleprompter setup, and frontal framing.",
    },
    details: {
      uz: "Yangiliklar desk qismi diplom ishida fakultet faoliyatini taqdim etish uchun juda qulay. Hozir bu joy 3D bloklar bilan berilgan, keyin esa fakultet yangiliklari, spiker tasviri yoki 16:9 video panel qo'shishingiz mumkin.",
      ru: "Новостной desk хорошо подходит для демонстрации деятельности факультета в дипломной работе. Сейчас здесь условные 3D-блоки, но позже можно добавить новости факультета, образ диктора или 16:9 видеопанель.",
      en: "The news desk is a strong area for presenting faculty activity in your thesis. It currently uses 3D placeholder blocks, but you can later add faculty news, anchor visuals, or a 16:9 video panel.",
    },
    mediaHint: {
      uz: "Keyin almashtirish: fakultet yangiliklari, 16:9 video panel, teleprompter matni",
      ru: "Позже заменить: новости факультета, 16:9 видеопанель, текст телесуфлера",
      en: "Replace later with: faculty news, 16:9 video panel, teleprompter text",
    },
    stats: [
      {
        label: { uz: "Holat", ru: "Статус", en: "Status" },
        value: "Concept",
      },
      {
        label: { uz: "Aspect", ru: "Формат", en: "Aspect" },
        value: "16:9",
      },
      {
        label: { uz: "Maqsad", ru: "Цель", en: "Goal" },
        value: "Presentation",
      },
    ],
  },
];

const uiText = {
  uz: {
    title: "VR Laboratoriya Demosi",
    subtitle:
      "Hozircha statik 3D muhit, keyinchalik fakultet rasmlari va videolari bilan to'ldiriladi.",
    areas: "VR zonalari",
    sceneInfo: "Sahna ma'lumoti",
    controls: "Boshqaruv",
    controlsBody:
      "Sichqoncha bilan aylantiring, g'ildirak bilan yaqinlashtiring va bloklarni bosib zona tanlang.",
    strategy: "Diplom uchun tavsiya",
    strategyBody:
      "Avval VR struktura, keyin AR markerli ko'rinish, oxirida esa real panorama bilan 360 tur qo'shish eng to'g'ri ketma-ketlik.",
    replaceLabel: "Media almashtirish rejasi",
    sceneReady: "Sahna tayyor",
    objectCount: "Interaktiv nuqtalar",
    mode: "Rejim",
    modeValue: "Static VR",
    back: "Orqaga",
  },
  ru: {
    title: "VR Демонстрация Лаборатории",
    subtitle:
      "Пока используется статическая 3D-сцена, позже сюда можно добавить фото и видео факультета.",
    areas: "VR зоны",
    sceneInfo: "Информация о сцене",
    controls: "Управление",
    controlsBody:
      "Вращайте сцену мышью, приближайте колесиком и кликайте по блокам для выбора зоны.",
    strategy: "Рекомендация для диплома",
    strategyBody:
      "Оптимальная последовательность: сначала VR структура, затем AR с маркером, и в конце 360 тур с реальной панорамой.",
    replaceLabel: "План замены медиа",
    sceneReady: "Сцена готова",
    objectCount: "Интерактивные точки",
    mode: "Режим",
    modeValue: "Static VR",
    back: "Назад",
  },
  en: {
    title: "VR Laboratory Demo",
    subtitle:
      "A static 3D environment for now, designed so you can later swap in real faculty photos and videos.",
    areas: "VR areas",
    sceneInfo: "Scene info",
    controls: "Controls",
    controlsBody:
      "Rotate with the mouse, zoom with the wheel, and click blocks to inspect each zone.",
    strategy: "Thesis recommendation",
    strategyBody:
      "The cleanest sequence is VR structure first, AR marker experience second, and a real 360 tour last.",
    replaceLabel: "Media replacement plan",
    sceneReady: "Scene ready",
    objectCount: "Interactive points",
    mode: "Mode",
    modeValue: "Static VR",
    back: "Back",
  },
} as const;

// 3D Image Frame Component
function ImageFrame3D({
  texture,
  position,
  scale,
  color,
  active,
}: {
  texture: THREE.Texture | null;
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  active: boolean;
}) {
  const frameRef = React.useRef<THREE.Group>(null);
  const imageRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!frameRef.current) return;

    // Floating animation
    frameRef.current.position.y += Math.sin(state.clock.elapsedTime * 0.8) * 0.002;

    // Rotation based on active state
    if (active) {
      frameRef.current.rotation.z += 0.01;
      frameRef.current.rotation.x += 0.005;
    } else {
      frameRef.current.rotation.y += 0.003;
    }

    // Scale pulse when active
    const pulse = active
      ? 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.08
      : 1;
    frameRef.current.scale.setScalar(pulse);

    // Image brightness based on active state
    if (imageRef.current) {
      const material = imageRef.current.material as THREE.MeshStandardMaterial;
      material.emissiveIntensity = active ? 0.5 : 0.15;
    }
  });

  return (
    <group ref={frameRef} position={position}>
      {/* Frame border - 3D effect */}
      <mesh position={[0, 0, -0.08]}>
        <boxGeometry args={[scale[0] * 1.05, scale[1] * 1.05, 0.15]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={active ? 0.3 : 0.1}
          metalness={0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Inner shadow/depth */}
      <mesh position={[0, 0, -0.06]}>
        <boxGeometry args={[scale[0] * 1.02, scale[1] * 1.02, 0.08]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Main image */}
      {texture && (
        <mesh ref={imageRef} position={[0, 0, 0]}>
          {/* 3D effekt (chuqurlik) berish uchun segmentlarni ko'paytiramiz (128x128) */}
          <planeGeometry args={[scale[0], scale[1], 128, 128]} />
          <meshStandardMaterial
            map={texture}
            // Rasmning o'zini chuqurlik xaritasi sifatida ishlatamiz (oq ranglar oldinga chiqadi)
            displacementMap={texture} 
            displacementScale={0.15} // Bo'rtib chiqish darajasi (qanchalik kattaligi)
            emissive="#ffffff"
            emissiveIntensity={0.15}
            metalness={0.1}
            roughness={0.2}
            toneMapped={true}
          />
        </mesh>
      )}

      {/* Glass reflection layer */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[scale[0], scale[1]]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#88ccff"
          emissiveIntensity={active ? 0.08 : 0.02}
          metalness={0.8}
          roughness={0.3}
          transparent
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

function VRZoneMesh({
  area,
  active,
  onSelect,
  onHover,
}: {
  area: VRArea;
  active: boolean;
  onSelect: (area: VRArea) => void;
  onHover: (area: VRArea | null) => void;
}) {
  const boxMeshRef = React.useRef<THREE.Mesh>(null);
  const imageFrameRef = React.useRef<THREE.Group>(null);
  const texture = area.imageUrl
    ? useLoader(THREE.TextureLoader, area.imageUrl)
    : null;

  useFrame((state) => {
    if (!boxMeshRef.current) return;
    const pulse = active
      ? 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.06
      : 1;
    boxMeshRef.current.scale.set(
      area.scale[0] * pulse,
      area.scale[1] * pulse,
      area.scale[2] * pulse,
    );
    boxMeshRef.current.rotation.y += active ? 0.006 : 0.0025;

    // Tilt image frame when interacting
    if (imageFrameRef.current) {
      imageFrameRef.current.position.z = area.position[2] + area.scale[2] / 2 + (active ? 0.3 : 0.1);
    }
  });

  const handlePointerOver = () => {
    document.body.style.cursor = "pointer";
    onHover(area);
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
    onHover(null);
  };

  return (
    <Float speed={active ? 2.5 : 1.2} floatIntensity={active ? 1 : 0.35}>
      {/* Background colored box */}
      <mesh
        ref={boxMeshRef}
        position={area.position}
        onClick={() => onSelect(area)}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        castShadow
        receiveShadow
      >
        <boxGeometry args={area.scale} />
        <meshStandardMaterial
          color={area.color}
          emissive={area.color}
          emissiveIntensity={active ? 0.4 : 0.15}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Enhanced 3D Image Frame */}
      {texture && (
        <group
          ref={imageFrameRef}
          onClick={() => onSelect(area)}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <ImageFrame3D
            texture={texture}
            position={[area.position[0], area.position[1], area.position[2] + area.scale[2] / 2 + 0.1]}
            scale={area.scale}
            color={area.color}
            active={active}
          />
        </group>
      )}
    </Float>
  );
}

// Glow Effect Component - Creates halo around images
function GlowEffect({
  position,
  color,
  active,
}: {
  position: [number, number, number];
  color: string;
  active: boolean;
}) {
  const glowRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!glowRef.current) return;

    // Pulsing effect
    const scale = active
      ? 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.3
      : 1 + Math.sin(state.clock.elapsedTime) * 0.1;
    glowRef.current.scale.setScalar(scale);

    // Rotation
    glowRef.current.rotation.z += 0.001;
  });

  return (
    <mesh ref={glowRef} position={position}>
      <octahedronGeometry args={[1.2, 1]} />
      <meshBasicMaterial
        color={color}
        wireframe
        transparent
        opacity={active ? 0.3 : 0.05}
      />
    </mesh>
  );
}

function VRLabScene({
  selectedArea,
  onSelect,
  onHover,
}: {
  selectedArea: VRArea;
  onSelect: (area: VRArea) => void;
  onHover: (area: VRArea | null) => void;
}) {
  const gridColor = useMemo(
    () => new THREE.Color(selectedArea.color).multiplyScalar(0.55),
    [selectedArea.color],
  );

  // Dynamic lights that follow selected area
  const dynamicLightPos = useMemo(() => {
    return [
      [selectedArea.position[0] + 5, selectedArea.position[1] + 3, selectedArea.position[2] + 5],
      [selectedArea.position[0] - 5, selectedArea.position[1] + 3, selectedArea.position[2] - 5],
      [selectedArea.position[0], selectedArea.position[1] - 2, selectedArea.position[2]],
    ];
  }, [selectedArea]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 7, 13]} fov={42} />
      <color attach="background" args={["#04070d"]} />
      <fog attach="fog" args={["#04070d", 16, 28]} />

      {/* Enhanced Ambient Lighting */}
      <ambientLight intensity={0.8} />

      {/* Main dynamic light following selected area */}
      <pointLight
        position={[selectedArea.position[0], selectedArea.position[1] + 5, selectedArea.position[2] + 3]}
        intensity={18}
        color={selectedArea.color}
        distance={30}
        decay={2}
      />

      {/* Supporting lights */}
      <pointLight
        position={dynamicLightPos[0] as [number, number, number]}
        intensity={10}
        color="#38bdf8"
        distance={20}
        decay={2}
      />
      <pointLight
        position={dynamicLightPos[1] as [number, number, number]}
        intensity={8}
        color="#f97316"
        distance={18}
        decay={2}
      />
      <pointLight
        position={dynamicLightPos[2] as [number, number, number]}
        intensity={6}
        color="#a855f7"
        distance={15}
        decay={2}
      />

      {/* Scene Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial
          color="#0b1220"
          roughness={0.95}
          metalness={0.1}
        />
      </mesh>

      <gridHelper
        args={[24, 24, gridColor, "#111827"]}
        position={[0, 0.01, 0]}
      />

      <mesh position={[0, 3.5, -8]}>
        <boxGeometry args={[18, 7, 0.4]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#111827"
          emissiveIntensity={0.35}
        />
      </mesh>
      <mesh position={[-9, 3.5, 0]}>
        <boxGeometry args={[0.4, 7, 18]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#0f172a"
          emissiveIntensity={0.25}
        />
      </mesh>
      <mesh position={[9, 3.5, 0]}>
        <boxGeometry args={[0.4, 7, 18]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#0f172a"
          emissiveIntensity={0.25}
        />
      </mesh>

      <mesh position={[0, 0.6, 5.2]}>
        <boxGeometry args={[5.2, 1.2, 0.7]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#0f172a"
          emissiveIntensity={0.3}
        />
      </mesh>
      <mesh position={[0, 2.2, -6.8]}>
        <boxGeometry args={[4.4, 2, 0.3]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#22d3ee"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Render all VR zones */}
      {vrAreas.map((area) => (
        <VRZoneMesh
          key={area.id}
          area={area}
          active={area.id === selectedArea.id}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}

      {/* Glow effects around zones */}
      {vrAreas.map((area) => (
        <GlowEffect
          key={`glow-${area.id}`}
          position={area.position as [number, number, number]}
          color={area.color}
          active={area.id === selectedArea.id}
        />
      ))}

      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={18}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 2, 0]}
      />
    </>
  );
}

interface VRModuleProps {
  lang: Language;
  onBack: () => void;
}

export default function VRModule({ lang, onBack }: VRModuleProps) {
  const [selectedArea, setSelectedArea] = useState<VRArea>(vrAreas[0]);
  const [hoveredArea, setHoveredArea] = useState<AreaId | null>(null);
  const [hoveredArea3D, setHoveredArea3D] = useState<VRArea | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const text = uiText[lang];

  const handleAreaSelect = (area: VRArea) => {
    setSelectedArea(area);
  };

  return (
    <div className="relative h-screen w-full bg-[#04070d] text-white flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.14),transparent_28%)]" />

      {/* Top Header with Toggle Buttons */}
      <div className="relative z-40 border-b border-white/10 bg-black/40 backdrop-blur-xl px-3 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
            title={sidebarOpen ? "Menu yopin" : "Menu oching"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8h18M3 16h18" />
            </svg>
          </button>
          <h1 className="text-base md:text-lg font-semibold">{text.title}</h1>
        </div>

        <button
          onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all"
          title={rightSidebarOpen ? "Info yopin" : "Info oching"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          </svg>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 flex flex-1 overflow-hidden">
        {/* Left Sidebar - Collapsible */}
        <aside className={`
          fixed left-0 top-[68px] bottom-0 w-72 md:w-80 xl:static xl:top-0
          border-r border-white/10 bg-black/30 p-4 md:p-6 backdrop-blur-xl
          transition-all duration-300 z-30 flex flex-col
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full xl:translate-x-0'}
          overflow-hidden hover:overflow-y-auto
        `}>
          <div className="mb-6">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {text.sceneReady}
            </p>
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">
              {text.title}
            </h2>
            <p className="mt-2 text-xs md:text-sm leading-5 text-white/60">
              {text.subtitle}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto pr-2">
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/35">
              {text.areas}
            </p>
            <div className="space-y-2">
              {vrAreas.map((area) => {
                const active = area.id === selectedArea.id;
                const hovered = area.id === hoveredArea;

                return (
                  <motion.button
                    key={area.id}
                    onClick={() => {
                      handleAreaSelect(area);
                      setSidebarOpen(false);
                    }}
                    onHoverStart={() => setHoveredArea(area.id)}
                    onHoverEnd={() => setHoveredArea(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full rounded-xl border px-3 py-3 text-left text-xs md:text-sm transition-all ${
                      active
                        ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.08)]"
                        : hovered
                          ? "border-white/30 bg-white/[0.08]"
                          : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div
                      className="mb-2 h-1.5 w-12 rounded-full transition-all"
                      style={{
                        backgroundColor: area.color,
                        boxShadow: hovered || active ? `0 0 12px ${area.color}` : "none",
                      }}
                    />
                    <p className="font-medium">{area.title[lang]}</p>
                    <p className="mt-1 text-white/40 line-clamp-2">
                      {area.summary[lang]}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Overlay when sidebar open on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 xl:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Center Canvas Area - Takes remaining space */}
        <div className="flex-1 flex flex-col relative">
          <Canvas dpr={[1, 2]} className="flex-1">
            <VRLabScene
              selectedArea={selectedArea}
              onSelect={handleAreaSelect}
              onHover={setHoveredArea3D}
            />
          </Canvas>

          {/* Controls Hint */}
          <div className="pointer-events-none absolute left-3 md:left-6 top-3 md:top-6 max-w-xs rounded-lg md:rounded-2xl border border-white/10 bg-black/50 px-3 md:px-4 py-2 md:py-3 backdrop-blur-md text-xs md:text-sm">
            <p className="uppercase tracking-[0.28em] text-cyan-300 text-[10px] md:text-xs">
              {text.controls}
            </p>
            <p className="mt-1 md:mt-2 text-white/60 text-xs md:text-sm leading-4">
              {text.controlsBody}
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={onBack}
            className="absolute bottom-3 md:bottom-6 right-3 md:right-6 rounded-full border border-red-500/30 bg-red-500/10 px-3 md:px-5 py-2 md:py-3 text-xs md:text-sm font-medium text-red-300 transition hover:bg-red-500/20 hover:text-white"
          >
            {text.back}
          </button>
        </div>

        {/* Right Sidebar - Collapsible Info */}
        <aside className={`
          fixed right-0 top-[68px] bottom-0 xl:static xl:top-0
          border-l border-white/10 bg-black/30 p-4 md:p-6 backdrop-blur-xl
          transition-all duration-300 z-30 flex flex-col
          ${rightSidebarOpen ? 'w-72 md:w-80 translate-x-0 xl:w-80' : 'w-0 translate-x-full xl:w-0'}
          overflow-hidden hover:overflow-y-auto
        `}>
          <motion.div
            key={hoveredArea3D?.id || selectedArea.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto pr-2"
          >
            <div className={hoveredArea3D ? "pb-2 border-b border-white/10" : ""}>
              {hoveredArea3D && (
                <p className="text-[10px] uppercase tracking-[0.35em] text-orange-400 font-semibold">
                  Ustiga borgandi ↓
                </p>
              )}
            </div>

            <p className="text-[10px] uppercase tracking-[0.35em] text-white/35 mt-2">
              {hoveredArea3D ? "Tanlangan laboratoriya" : text.sceneInfo}
            </p>
            <h3 className="mt-2 text-lg md:text-xl font-semibold">
              {hoveredArea3D ? hoveredArea3D.title[lang] : selectedArea.title[lang]}
            </h3>
            <p className="mt-2 text-xs md:text-sm leading-5 text-white/65">
              {hoveredArea3D ? hoveredArea3D.details[lang] : selectedArea.details[lang]}
            </p>

            {/* Image Preview */}
            {(hoveredArea3D || selectedArea).imageUrl && (
              <motion.div
                className="mt-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-black/50">
                  <img
                    src={(hoveredArea3D || selectedArea).imageUrl}
                    alt={(hoveredArea3D || selectedArea).title[lang]}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="px-3 py-2 text-xs text-white/50">
                  {(hoveredArea3D || selectedArea).title[lang]}
                </p>
              </motion.div>
            )}

            <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/35">
                {text.replaceLabel}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/60">
                {(hoveredArea3D || selectedArea).mediaHint[lang]}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {(hoveredArea3D || selectedArea).stats.map((item) => (
                <motion.div
                  key={item.label[lang]}
                  className="rounded-lg border border-white/10 bg-white/[0.03] p-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="text-[9px] uppercase tracking-[0.25em] text-white/35">
                    {item.label[lang]}
                  </p>
                  <p className="mt-1 text-xs font-medium text-white/85">
                    {item.value}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="mt-4 rounded-xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-cyan-300">
                {text.strategy}
              </p>
              <p className="mt-2 text-xs leading-5 text-white/65">
                {text.strategyBody}
              </p>
            </motion.div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
