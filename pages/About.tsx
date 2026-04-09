import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { HistoryItem, Language, StaffMember } from '../types';
import { TRANSLATIONS, STAFF, HISTORY, MISSIONS } from '../constants';

const MeshBasicMaterial = 'meshBasicMaterial' as any;

const ABOUT_UI = {
  historyEyebrow: {
    uz: 'Rasmiy TATU manbalari asosida',
    ru: 'На основе официальных источников ТУИТ',
    en: 'Built from official TUIT sources',
  },
  historyHint: {
    uz: 'Yillarni bosing, har bir bosqich bo\'yicha hujjat, fakt va joriy holat ochiladi.',
    ru: 'Нажмите на годы, чтобы открыть документы, факты и текущее состояние каждого этапа.',
    en: 'Click each year to open the documents, facts, and current state for that stage.',
  },
  historyFacts: {
    uz: 'Muhim faktlar',
    ru: 'Ключевые факты',
    en: 'Key facts',
  },
  historySource: {
    uz: 'Rasmiy manbani ochish',
    ru: 'Открыть официальный источник',
    en: 'Open official source',
  },
  historyMarker: {
    uz: 'Tarixiy bosqich',
    ru: 'Исторический этап',
    en: 'Historical stage',
  },
  office: {
    uz: 'Qabul vaqti',
    ru: 'Часы приема',
    en: 'Office hours',
  },
  highlights: {
    uz: 'Asosiy ma\'lumotlar',
    ru: 'Ключевая информация',
    en: 'Key information',
  },
  profile: {
    uz: 'Rasmiy profil',
    ru: 'Официальный профиль',
    en: 'Official profile',
  },
  email: {
    uz: 'Email yozish',
    ru: 'Написать email',
    en: 'Send email',
  },
  timeline: {
    uz: 'Lavozim va yangilanishlar',
    ru: 'Должность и обновления',
    en: 'Role and updates',
  },
  officialPhoto: {
    uz: 'Rasmiy foto',
    ru: 'Официальное фото',
    en: 'Official photo',
  },
};

const PanoramicViewer = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, 1024, 512);
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2;
    for (let i = 0; i < 1024; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 512);
      ctx.stroke();
    }
    for (let i = 0; i < 512; i += 64) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(1024, i);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('VIRTUAL LAB SCANNER', 400, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <Sphere ref={meshRef} args={[500, 60, 40]} scale={[-1, 1, 1]}>
      <MeshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  );
};

const HistoryTimeline = ({
  items,
  lang,
}: {
  items: HistoryItem[];
  lang: Language;
}) => {
  const [activeIndex, setActiveIndex] = useState(items.length - 1);
  const activeItem = items[activeIndex];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 xl:grid-cols-[0.9fr,1.2fr] gap-8 items-start">
        <div className="glass rounded-[2.5rem] border border-white/8 p-5 md:p-7 bg-white/[0.02]">
          <div className="space-y-3">
            {items.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <button
                  key={item.year}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full text-left rounded-[1.75rem] border p-5 transition-all duration-300 ${
                    isActive
                      ? "border-cyan-500/40 bg-cyan-500/10 shadow-[0_0_40px_rgba(0,242,254,0.08)]"
                      : "border-white/8 bg-black/10 hover:border-white/20 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center pt-1">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          isActive
                            ? "bg-cyan-400 shadow-[0_0_18px_rgba(0,242,254,0.9)]"
                            : "bg-white/25"
                        }`}
                      />
                      {index !== items.length - 1 && (
                        <div className="w-px h-14 mt-3 bg-gradient-to-b from-white/30 to-transparent" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-2xl font-black tracking-tight">
                          {item.year}
                        </span>
                        <span className="text-xs md:text-sm uppercase tracking-wider text-gray-300">
                          {item.dateLabel[lang]}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-3 leading-snug text-white">
                        {item.title[lang]}
                      </h3>

                      <p className="text-base md:text-lg text-gray-200 leading-relaxed">
                        {item.desc[lang]}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.year}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            className="glass rounded-[2.75rem] border border-white/8 overflow-hidden bg-[radial-gradient(circle_at_top_right,rgba(0,242,254,0.14),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]"
          >
            <div className="p-8 md:p-10 border-b border-white/8">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.45em] text-cyan-400 mb-4">
                    {ABOUT_UI.historyMarker[lang]}
                  </p>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-6xl font-black tracking-tighter text-white/90">
                      {activeItem.year}
                    </span>
                    <div className="h-px w-16 bg-cyan-500/40" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black mb-3 max-w-2xl">
                    {activeItem.title[lang]}
                  </h3>
                  <p className="text-base md:text-lg text-gray-100 leading-loose max-w-2xl">
                    {activeItem.desc[lang]}
                  </p>
                </div>

                <div className="min-w-[220px] rounded-[2rem] bg-black/20 border border-white/8 p-5">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gray-500 mb-2">
                    {activeItem.metricLabel[lang]}
                  </p>
                  <div className="text-4xl font-black text-cyan-400 mb-3">
                    {activeItem.metricValue}
                  </div>
                  <p className="text-sm text-gray-400">
                    {activeItem.dateLabel[lang]}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-8">
              <div>
                <h4 className="text-sm font-bold uppercase tracking-[0.3em] text-gray-500 mb-5">
                  {ABOUT_UI.historyFacts[lang]}
                </h4>
                <div className="space-y-4">
                  {activeItem.facts.map((fact, index) => (
                    <div
                      key={`${activeItem.year}-${index}`}
                      className="flex gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4"
                    >
                      <div className="w-10 h-10 shrink-0 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                        <i className="fas fa-check"></i>
                      </div>
                      <p className="text-base text-gray-100 leading-relaxed">
                        {fact[lang]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/8 bg-black/20 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-400 mb-4">
                    {activeItem.sourceLabel[lang]}
                  </p>
                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    {activeItem.dateLabel[lang]}
                  </p>
                </div>

                <a
                  href={activeItem.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-3 rounded-full px-6 py-4 bg-cyan-500 text-black font-bold hover:bg-cyan-400 transition-colors"
                >
                  <span>{ABOUT_UI.historySource[lang]}</span>
                  <i className="fas fa-arrow-up-right-from-square text-sm"></i>
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const StaffCard3D = ({
  person,
  lang,
  onClick,
}: {
  person: StaffMember;
  lang: Language;
  onClick: () => void;
}) => (
  <motion.button
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -8 }}
    onClick={onClick}
    type="button"
    className="relative group perspective-1000 text-left"
  >
    <motion.div
      whileHover={{ rotateY: 8, rotateX: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      className="glass rounded-[2rem] overflow-hidden transform-style-3d shadow-2xl border border-white/8 group-hover:border-cyan-500/30 bg-white/[0.02]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={person.image}
          className="w-full h-full object-cover scale-100 group-hover:scale-105 transition-transform duration-700"
          alt={person.name[lang]}
        />

        {/* 🔧 KONTRAST KUCHAYTIRILDI */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        {/* 🔧 BADGE */}
        <div className="absolute top-5 left-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-3 py-1.5 text-xs text-cyan-300 backdrop-blur">
            <i className="fas fa-badge-check"></i>
            {ABOUT_UI.officialPhoto[lang]}
          </span>
        </div>

        {/* 🔧 TEXT BLOCK */}
        <div className="absolute bottom-6 left-6 right-6">
          {/* NAME */}
          <h4 className="text-2xl font-semibold text-white leading-tight mb-1 drop-shadow-md">
            {person.name[lang]}
          </h4>

          {/* ROLE */}
          <p className="text-sm text-cyan-400 mb-4">{person.role[lang]}</p>

          {/* OFFICE */}
          <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3 backdrop-blur-md">
            <p className="text-xs text-gray-400 mb-1">
              {ABOUT_UI.office[lang]}
            </p>
            <p className="text-sm text-white font-medium">
              {person.office[lang]}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.button>
);
const StaffModal = ({
  person,
  lang,
  onClose,
}: {
  person: StaffMember;
  lang: Language;
  onClose: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="glass max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-6 md:p-10 relative border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(0,242,254,0.12),transparent_30%),rgba(255,255,255,0.03)]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CLOSE */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[200] text-xl text-gray-400 hover:text-cyan-400 transition"
      >
        <i className="fas fa-times"></i>
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-6">
          <img
            src={person.image}
            className="w-full rounded-2xl shadow-xl object-cover"
            alt={person.name[lang]}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={person.profileUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-cyan-400 hover:text-black transition px-4 py-3 text-sm font-medium"
            >
              <i className="fas fa-arrow-up-right-from-square"></i>
              {ABOUT_UI.profile[lang]}
            </a>

            <a
              href={`mailto:${person.email}`}
              className="rounded-full flex items-center justify-center gap-2 border border-white/10 bg-white/5 hover:bg-cyan-400 hover:text-black transition px-4 py-3 text-sm font-medium"
            >
              <i className="fas fa-envelope"></i>
              {ABOUT_UI.email[lang]}
            </a>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* HEADER */}
          <p className="text-xs text-cyan-400 mb-1">{ABOUT_UI.profile[lang]}</p>

          <h2 className="text-3xl md:text-4xl font-semibold text-white mb-1 leading-tight">
            {person.name[lang]}
          </h2>

          <p className="text-gray-400 mb-6">{person.role[lang]}</p>

          {/* INFO CARD */}
          <div className="rounded-xl border border-white/10 bg-black/40 p-4 mb-6">
            <p className="text-xs text-gray-400 mb-1">
              {ABOUT_UI.office[lang]}
            </p>
            <p className="text-white text-sm font-medium">
              {person.office[lang]}
            </p>
            <p className="text-sm text-cyan-300 mt-2 break-all">
              {person.email}
            </p>
          </div>

          {/* BIO */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-2">
              Biography
            </h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              {person.bio[lang]}
            </p>
          </div>

          {/* HIGHLIGHTS */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-300 mb-3">
              {ABOUT_UI.highlights[lang]}
            </h4>
            <div className="flex flex-wrap gap-2">
              {person.highlights.map((item, idx) => (
                <span
                  key={idx}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-200"
                >
                  {item[lang]}
                </span>
              ))}
            </div>
          </div>

          {/* TIMELINE */}
          <div>
            <h4 className="text-sm font-semibold text-gray-300 mb-3">
              {ABOUT_UI.timeline[lang]}
            </h4>
            <div className="space-y-3">
              {person.career.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-3"
                >
                  <span className="text-cyan-400 text-xs font-mono min-w-[50px]">
                    {item.year}
                  </span>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {item.desc[lang]}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
const About: React.FC<{ lang: Language }> = ({ lang }) => {
  const [selectedPerson, setSelectedPerson] = useState<StaffMember | null>(null);

  return (
   <div className="pt-32 pb-32 text-base md:text-lg text-gray-200">
      <section className="container mx-auto px-6 mb-48">
        <div className="text-center mb-16">
        
          <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter">
            {TRANSLATIONS[lang].historyTitle}
          </h2>
         
        </div>

        <HistoryTimeline items={HISTORY} lang={lang} />
      </section>

     
      <section className="container mx-auto px-6 mb-48">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter">
            {TRANSLATIONS[lang].staffTitle}
          </h2>
          <p className="text-gray-500 uppercase tracking-widest text-sm">
            {TRANSLATIONS[lang].staffSubtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {STAFF.map((person) => (
            <StaffCard3D
              key={person.id}
              person={person}
              lang={lang}
              onClick={() => setSelectedPerson(person)}
            />
          ))}
        </div>
      </section>

     

      <AnimatePresence>
        {selectedPerson && (
          <StaffModal
            person={selectedPerson}
            lang={lang}
            onClose={() => setSelectedPerson(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
