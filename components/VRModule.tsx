import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
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

function VRZoneMesh({
  area,
  active,
  onSelect,
}: {
  area: VRArea;
  active: boolean;
  onSelect: (area: VRArea) => void;
}) {
  const meshRef = React.useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const pulse = active ? 1 + Math.sin(state.clock.elapsedTime * 2.2) * 0.06 : 1;
    meshRef.current.scale.set(
      area.scale[0] * pulse,
      area.scale[1] * pulse,
      area.scale[2] * pulse,
    );
    meshRef.current.rotation.y += active ? 0.006 : 0.0025;
  });

  return (
    <Float speed={active ? 2 : 1.2} floatIntensity={active ? 0.8 : 0.35}>
      <mesh
        ref={meshRef}
        position={area.position}
        onClick={() => onSelect(area)}
        onPointerOver={() => {
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "default";
        }}
      >
        <boxGeometry args={area.scale} />
        <meshStandardMaterial
          color={area.color}
          emissive={area.color}
          emissiveIntensity={active ? 0.7 : 0.25}
          metalness={0.45}
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

function VRLabScene({
  selectedArea,
  onSelect,
}: {
  selectedArea: VRArea;
  onSelect: (area: VRArea) => void;
}) {
  const gridColor = useMemo(
    () => new THREE.Color(selectedArea.color).multiplyScalar(0.55),
    [selectedArea.color],
  );

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 7, 13]} fov={42} />
      <color attach="background" args={["#04070d"]} />
      <fog attach="fog" args={["#04070d", 16, 28]} />

      <ambientLight intensity={0.7} />
      <pointLight position={[0, 8, 0]} intensity={14} color={selectedArea.color} />
      <pointLight position={[-8, 4, 6]} intensity={8} color="#38bdf8" />
      <pointLight position={[8, 3, -6]} intensity={7} color="#f97316" />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#0b1220" roughness={0.95} metalness={0.1} />
      </mesh>

      <gridHelper args={[24, 24, gridColor, "#111827"]} position={[0, 0.01, 0]} />

      <mesh position={[0, 3.5, -8]}>
        <boxGeometry args={[18, 7, 0.4]} />
        <meshStandardMaterial color="#0f172a" emissive="#111827" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-9, 3.5, 0]}>
        <boxGeometry args={[0.4, 7, 18]} />
        <meshStandardMaterial color="#0f172a" emissive="#0f172a" emissiveIntensity={0.25} />
      </mesh>
      <mesh position={[9, 3.5, 0]}>
        <boxGeometry args={[0.4, 7, 18]} />
        <meshStandardMaterial color="#0f172a" emissive="#0f172a" emissiveIntensity={0.25} />
      </mesh>

      <mesh position={[0, 0.6, 5.2]}>
        <boxGeometry args={[5.2, 1.2, 0.7]} />
        <meshStandardMaterial color="#111827" emissive="#0f172a" emissiveIntensity={0.3} />
      </mesh>
      <mesh position={[0, 2.2, -6.8]}>
        <boxGeometry args={[4.4, 2, 0.3]} />
        <meshStandardMaterial color="#111827" emissive="#22d3ee" emissiveIntensity={0.15} />
      </mesh>

      {vrAreas.map((area) => (
        <VRZoneMesh
          key={area.id}
          area={area}
          active={area.id === selectedArea.id}
          onSelect={onSelect}
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
  const text = uiText[lang];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04070d] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(129,140,248,0.14),transparent_28%)]" />

      <div className="relative z-10 grid min-h-screen grid-cols-1 xl:grid-cols-[320px_minmax(0,1fr)_340px]">
        <aside className="border-b border-white/10 bg-black/20 p-6 backdrop-blur-xl xl:border-b-0 xl:border-r">
          <div className="mb-8">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {text.sceneReady}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">{text.title}</h2>
            <p className="mt-3 text-sm leading-6 text-white/60">{text.subtitle}</p>
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/35">
              {text.areas}
            </p>
            <div className="space-y-3">
              {vrAreas.map((area) => {
                const active = area.id === selectedArea.id;

                return (
                  <button
                    key={area.id}
                    onClick={() => setSelectedArea(area)}
                    className={`w-full rounded-2xl border px-4 py-4 text-left transition-all ${
                      active
                        ? "border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_40px_rgba(34,211,238,0.08)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="mb-3 h-2 w-14 rounded-full" style={{ backgroundColor: area.color }} />
                    <p className="text-base font-medium">{area.title[lang]}</p>
                    <p className="mt-2 text-sm leading-5 text-white/50">{area.summary[lang]}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        <div className="relative min-h-[48vh] xl:min-h-screen">
          <Canvas dpr={[1, 2]}>
            <VRLabScene selectedArea={selectedArea} onSelect={setSelectedArea} />
          </Canvas>

          <div className="pointer-events-none absolute left-6 top-6 rounded-2xl border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
            <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">{text.controls}</p>
            <p className="mt-2 max-w-xs text-sm leading-5 text-white/60">{text.controlsBody}</p>
          </div>

          <button
            onClick={onBack}
            className="absolute bottom-6 right-6 rounded-full border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500 hover:text-white"
          >
            {text.back}
          </button>
        </div>

        <aside className="border-t border-white/10 bg-black/20 p-6 backdrop-blur-xl xl:border-l xl:border-t-0">
          <motion.div
            key={selectedArea.id}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
          >
            <p className="text-xs uppercase tracking-[0.35em] text-white/35">{text.sceneInfo}</p>
            <h3 className="mt-3 text-2xl font-semibold">{selectedArea.title[lang]}</h3>
            <p className="mt-3 text-sm leading-6 text-white/65">{selectedArea.details[lang]}</p>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">{text.replaceLabel}</p>
              <p className="mt-3 text-sm leading-6 text-white/60">{selectedArea.mediaHint[lang]}</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {selectedArea.stats.map((item) => (
                <div key={item.label[lang]} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">
                    {item.label[lang]}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/85">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">{text.strategy}</p>
              <p className="mt-3 text-sm leading-6 text-white/65">{text.strategyBody}</p>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/55">
              <span>{text.objectCount}</span>
              <span className="font-medium text-cyan-300">{vrAreas.length}</span>
            </div>
            <div className="mt-3 flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/55">
              <span>{text.mode}</span>
              <span className="font-medium text-cyan-300">{text.modeValue}</span>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}
