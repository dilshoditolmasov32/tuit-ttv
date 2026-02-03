
import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, PerspectiveCamera, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Language, StaffMember } from '../types';
import { TRANSLATIONS, STAFF, HISTORY, MISSIONS } from '../constants';

// Fix: Define intrinsic elements as any to avoid 'Property does not exist on type JSX.IntrinsicElements' errors
const MeshBasicMaterial = 'meshBasicMaterial' as any;

const PanoramicViewer = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  // Fix: Added useMemo to the React imports and using it here for texture creation
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
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    }
    for (let i = 0; i < 512; i += 64) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText('VIRTUAL LAB SCANNER', 400, 256);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <Sphere ref={meshRef} args={[500, 60, 40]} scale={[-1, 1, 1]}>
      {/* Fix: Using the capitalized MeshBasicMaterial constant */}
      <MeshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  );
};

const StaffCard3D = ({ person, lang, onClick }: { person: StaffMember, lang: Language, onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    onClick={onClick}
    className="relative group perspective-1000 cursor-pointer"
  >
    <motion.div
      whileHover={{ rotateY: 15, rotateX: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="glass rounded-[2rem] overflow-hidden transform-style-3d shadow-2xl border border-white/5 group-hover:border-cyan-500/30"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={person.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={person.name[lang]} />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h4 className="text-xl font-bold">{person.name[lang]}</h4>
          <p className="text-[10px] text-cyan-500 uppercase tracking-widest">{person.role[lang]}</p>
        </div>
      </div>
    </motion.div>
  </motion.div>
);

const StaffModal = ({ person, lang, onClose }: { person: StaffMember, lang: Language, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      className="glass max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-[3rem] p-8 md:p-12 relative border border-white/10"
      onClick={e => e.stopPropagation()}
    >
      <button onClick={onClose} className="absolute top-8 right-8 text-2xl hover:text-cyan-500 transition-colors">
        <i className="fas fa-times"></i>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          <img src={person.image} className="w-full rounded-3xl shadow-2xl" alt={person.name[lang]} />
          <div className="flex gap-4">
            <a href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-cyan-500 transition-all"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" className="w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-cyan-500 transition-all"><i className="fas fa-envelope"></i></a>
          </div>
        </div>
        <div>
          <span className="text-cyan-500 font-bold uppercase tracking-[0.2em] text-xs mb-2 block">Professional Profile</span>
          <h2 className="text-4xl font-black mb-2">{person.name[lang]}</h2>
          <p className="text-gray-400 mb-8 italic">{person.role[lang]}</p>
          <div className="space-y-8">
             <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-widest">Biography</h4>
                <p className="text-gray-300 leading-relaxed">{person.bio[lang]}</p>
             </div>
             <div>
                <h4 className="text-sm font-bold text-gray-500 uppercase mb-4 tracking-widest">Experience</h4>
                <div className="space-y-4">
                  {person.career.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                       <span className="text-cyan-500 font-mono text-xs pt-1">{item.year}</span>
                       <p className="text-sm text-gray-400">{item.desc[lang]}</p>
                    </div>
                  ))}
                </div>
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
    <div className="pt-32 pb-32">
      {/* 1. HISTORY TIMELINE */}
      <section className="container mx-auto px-6 mb-48">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter">{TRANSLATIONS[lang].historyTitle}</h2>
          <div className="w-24 h-1 bg-cyan-500 mx-auto"></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
          
          <div className="space-y-24">
            {HISTORY.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex items-center gap-12 ${i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
              >
                <div className={`w-1/2 ${i % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <span className="text-6xl font-black text-white/5 font-mono block mb-2">{item.year}</span>
                  <h3 className="text-3xl font-bold mb-4">{item.title[lang]}</h3>
                  <p className="text-gray-500 leading-relaxed max-w-md ml-auto mr-auto">{item.desc[lang]}</p>
                </div>
                <div className="relative z-10 w-4 h-4 rounded-full bg-cyan-500 shadow-[0_0_20px_rgba(0,242,254,0.8)]"></div>
                <div className="w-1/2"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. MISSIONS & GOALS */}
      <section className="container mx-auto px-6 mb-48">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter">{TRANSLATIONS[lang].missionsTitle}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {MISSIONS.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="glass p-16 rounded-[4rem] text-center group"
            >
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-10 group-hover:bg-cyan-500 transition-all">
                <i className={`${m.icon} text-3xl text-cyan-500 group-hover:text-white`}></i>
              </div>
              <h3 className="text-3xl font-bold mb-6">{m.title[lang]}</h3>
              <p className="text-gray-400 text-lg leading-relaxed">{m.desc[lang]}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. TEACHERS GALLERY */}
      <section className="container mx-auto px-6 mb-48">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter">{TRANSLATIONS[lang].staffTitle}</h2>
          <p className="text-gray-500 uppercase tracking-widest text-sm">{TRANSLATIONS[lang].staffSubtitle}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {STAFF.map((person) => (
            <StaffCard3D key={person.id} person={person} lang={lang} onClick={() => setSelectedPerson(person)} />
          ))}
        </div>
      </section>

      {/* 4. LAB 360 TOUR */}
      <section className="container mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-6xl font-black mb-6 uppercase tracking-tighter">{TRANSLATIONS[lang].lab360Title}</h2>
        </div>
        <div className="h-[600px] w-full glass rounded-[4rem] overflow-hidden relative">
          <Canvas>
            <PanoramicViewer />
            <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.5} />
            <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
          </Canvas>
          <div className="absolute top-12 left-12 bg-black/50 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10 flex items-center gap-3">
             <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse"></div>
             <span className="text-xs font-bold uppercase tracking-widest">VR-LAB SCAN_01 ACTIVE</span>
          </div>
          <div className="absolute bottom-12 right-12 text-right">
             <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">Instructions</p>
             <p className="text-xs font-bold">DRAG TO EXPLORE VIRTUAL SPACE</p>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedPerson && (
          <StaffModal person={selectedPerson} lang={lang} onClose={() => setSelectedPerson(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default About;
