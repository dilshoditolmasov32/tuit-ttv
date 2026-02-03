import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { Language, Program } from '../types';
import { TRANSLATIONS, PROGRAMS } from '../constants';

// Fix: Define intrinsic elements as any to avoid 'Property does not exist on type JSX.IntrinsicElements' errors
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

const ProgramIcon3D = ({ color }: { color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.5;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={5} rotationIntensity={1} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color={color}
          speed={3}
          distort={0.4}
          radius={1}
          metalness={0.5}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </Sphere>
    </Float>
  );
};

const ProgramCard = ({ program, lang, onSelect }: { program: Program, lang: Language, onSelect: () => void }) => {
  return (
    <motion.div
      layoutId={`card-${program.id}`}
      whileHover={{ y: -10 }}
      onClick={onSelect}
      className="glass rounded-[3rem] p-8 cursor-pointer group border border-white/5 hover:border-white/20 transition-all overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent blur-3xl group-hover:w-full group-hover:h-full transition-all duration-700"></div>
      
      <div className="h-48 mb-8 relative">
        <Canvas dpr={[1, 2]}>
          <PerspectiveCamera makeDefault position={[0, 0, 3]} />
          {/* Fix: Using capitalized constant for ambientLight */}
          <AmbientLight intensity={0.5} />
          {/* Fix: Using capitalized constant for pointLight */}
          <PointLight position={[10, 10, 10]} intensity={1} color={program.color} />
          <ProgramIcon3D color={program.color} />
        </Canvas>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <i className={`${program.icon} text-3xl text-white/50 group-hover:text-white transition-colors duration-500`}></i>
        </div>
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-black mb-4 group-hover:text-cyan-400 transition-colors">
          {program.title[lang]}
        </h3>
        <p className="text-gray-400 leading-relaxed mb-8">
          {program.shortDesc[lang]}
        </p>
        
        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-cyan-500">
          <span>{TRANSLATIONS[lang].viewProgram}</span>
          <i className="fas fa-arrow-right transition-transform group-hover:translate-x-2"></i>
        </div>
      </div>
    </motion.div>
  );
};

const ProgramModal = ({ program, lang, onClose }: { program: Program, lang: Language, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-2xl"
      onClick={onClose}
    >
      <motion.div
        layoutId={`card-${program.id}`}
        onClick={(e) => e.stopPropagation()}
        className="glass max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[4rem] border border-white/10 p-8 md:p-16 relative"
      >
        <button
          onClick={onClose}
          className="absolute top-8 right-8 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-red-500/20 transition-all"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="h-[400px]">
            <Canvas dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[0, 0, 3]} />
              {/* Fix: Using capitalized constant for ambientLight */}
              <AmbientLight intensity={0.5} />
              {/* Fix: Using capitalized constant for pointLight */}
              <PointLight position={[10, 10, 10]} intensity={1.5} color={program.color} />
              <ProgramIcon3D color={program.color} />
            </Canvas>
          </div>

          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-cyan-500 mb-4 block">
              FACULTY PROGRAM
            </span>
            <h2 className="text-5xl font-black mb-8 leading-tight">
              {program.title[lang]}
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              {program.fullDesc[lang]}
            </p>

            <div className="grid grid-cols-2 gap-6">
              {program.stats.map((stat, i) => (
                <div key={i} className="glass p-6 rounded-3xl">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{stat.label[lang]}</p>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                </div>
              ))}
            </div>

            <button className="w-full mt-12 py-6 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 hover:text-white transition-all">
              Apply Now
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Programs: React.FC<{ lang: Language }> = ({ lang }) => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  return (
    <div className="pt-32 pb-32">
      <section className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 uppercase tracking-tighter"
          >
            {TRANSLATIONS[lang].programsTitle}
          </motion.h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto uppercase tracking-widest">
            {TRANSLATIONS[lang].programsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {PROGRAMS.map((program) => (
            <ProgramCard 
              key={program.id} 
              program={program} 
              lang={lang} 
              onSelect={() => setSelectedProgram(program)} 
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProgram && (
          <ProgramModal 
            program={selectedProgram} 
            lang={lang} 
            onClose={() => setSelectedProgram(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Programs;