
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Float, 
  MeshDistortMaterial, 
  Box, 
  Cylinder,
  Torus
} from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

// Fix: Define intrinsic elements as any to avoid 'Property does not exist on type JSX.IntrinsicElements' errors
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const Group = 'group' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

const CampusModel = () => {
  const groupRef = useRef<THREE.Group>(null!);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.2;
    }
  });

  return (
    <Group ref={groupRef}>
      {/* Central Hub Structure */}
      <Box args={[2, 0.5, 2]} position={[0, -1, 0]}>
        <MeshDistortMaterial color="#111" distort={0.1} speed={1} roughness={0.1} />
      </Box>
      <Cylinder args={[0.8, 1, 3, 32]} position={[0, 0.5, 0]}>
        <MeshDistortMaterial color="#00f2fe" distort={0.2} speed={3} metalness={0.8} />
      </Cylinder>
      
      {/* Floating Data Rings */}
      <Float speed={5} rotationIntensity={2}>
        <Torus args={[2.5, 0.02, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
          <MeshBasicMaterial color="#00f2fe" transparent opacity={0.3} />
        </Torus>
      </Float>
      
      <Float speed={3} rotationIntensity={1}>
        <Torus args={[3, 0.01, 16, 100]} rotation={[0, 0, 0]}>
          <MeshBasicMaterial color="#4facfe" transparent opacity={0.2} />
        </Torus>
      </Float>
    </Group>
  );
};

const Contact: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="pt-32 pb-32">
      <section className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[7rem] font-black mb-8 uppercase tracking-tighter"
          >
            {TRANSLATIONS[lang].contactTitle}
          </motion.h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto uppercase tracking-widest">
            {TRANSLATIONS[lang].contactSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* 3D Campus Representation */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="h-[600px] glass rounded-[4rem] relative overflow-hidden"
          >
            <div className="absolute top-10 left-10 z-10">
               <span className="text-xs font-black uppercase tracking-[0.5em] text-cyan-500">
                  {TRANSLATIONS[lang].campusModelTitle}
               </span>
            </div>
            
            <Canvas dpr={[1, 2]}>
              <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={40} />
              <AmbientLight intensity={0.5} />
              <PointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
              <CampusModel />
              <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
            </Canvas>

            <div className="absolute bottom-10 left-10 p-8 glass rounded-3xl border border-white/10 max-w-xs">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Location Info</p>
              <p className="text-sm font-bold text-white leading-relaxed">
                {TRANSLATIONS[lang].address}
              </p>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="glass p-12 md:p-20 rounded-[4rem] border border-white/5"
          >
            <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 block">
                  {TRANSLATIONS[lang].nameLabel}
                </label>
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500 transition-all text-white"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 block">
                  {TRANSLATIONS[lang].emailLabel}
                </label>
                <input 
                  type="email" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500 transition-all text-white"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-4 block">
                  {TRANSLATIONS[lang].messageLabel}
                </label>
                <textarea 
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500 transition-all text-white resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button className="w-full py-6 bg-white text-black font-black uppercase tracking-widest rounded-2xl hover:bg-cyan-500 hover:text-white transition-all transform active:scale-95 shadow-xl">
                {TRANSLATIONS[lang].submit}
              </button>
            </form>

            <div className="mt-16 pt-16 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
               <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-cyan-500">
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <span>+998 71 234 56 78</span>
               </div>
               <div className="flex items-center gap-4 text-gray-400">
                  <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-cyan-500">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <span>info@tv-tech.uz</span>
               </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
