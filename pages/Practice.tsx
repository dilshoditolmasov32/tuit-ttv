
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Stars, Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

// Fixed intrinsic elements
const Mesh = 'mesh' as any;
const Group = 'group' as any;
const BoxGeometry = 'boxGeometry' as any;
const SphereGeometry = 'sphereGeometry' as any;
const CylinderGeometry = 'cylinderGeometry' as any;
const MeshStandardMaterial = 'meshStandardMaterial' as any;
const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;
const MeshBasicMaterial = 'meshBasicMaterial' as any;

// VR Studio Scene Component
const StudioEnv = () => {
  return (
    <Group>
      {/* Studio Floor */}
      <Mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <BoxGeometry args={[20, 20, 0.1]} />
        <MeshStandardMaterial color="#111" roughness={0.1} metalness={0.8} />
      </Mesh>
      
      {/* Decorative Server Racks */}
      {[...Array(6)].map((_, i) => (
        <Mesh key={i} position={[i % 2 === 0 ? -5 : 5, -0.5, (i - 2.5) * 3]}>
          <BoxGeometry args={[1, 3, 1]} />
          <MeshStandardMaterial color="#222" emissive="#00f2fe" emissiveIntensity={0.2 * Math.sin(Date.now() * 0.001 + i)} />
        </Mesh>
      ))}

      {/* Floating Centerpiece (TV Tech Core) */}
      <Float speed={4} rotationIntensity={1} floatIntensity={2}>
        <Mesh position={[0, 1, 0]}>
          <BoxGeometry args={[1, 1, 1]} />
          <MeshDistortMaterial color="#00f2fe" speed={5} distort={0.3} radius={0.5} />
        </Mesh>
      </Float>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <AmbientLight intensity={0.5} />
      <PointLight position={[10, 10, 10]} intensity={1} color="#00f2fe" />
    </Group>
  );
};

// 360 Video Player Mesh
const PanoVideoMesh = ({ videoUrl }: { videoUrl: string }) => {
  const [video] = useState(() => {
    const vid = document.createElement('video');
    vid.src = videoUrl;
    vid.crossOrigin = 'Anonymous';
    vid.loop = true;
    vid.muted = true;
    vid.play();
    return vid;
  });

  return (
    <Mesh scale={[-1, 1, 1]}>
      <SphereGeometry args={[500, 60, 40]} />
      <MeshBasicMaterial map={new THREE.VideoTexture(video)} side={THREE.BackSide} />
    </Mesh>
  );
};

const Practice: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeMode, setActiveMode] = useState<'selection' | 'vr_studio' | 'ar_cam' | 'pano_360'>('selection');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVirtualTourActive, setIsVirtualTourActive] = useState(false);

  useEffect(() => {
    if (activeMode === 'ar_cam') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(err => console.error("Camera access denied:", err));
    } else {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    }
  }, [activeMode]);

  const modes = [
    { 
      id: 'vr_studio', 
      title: TRANSLATIONS[lang].vrStudioTitle, 
      desc: TRANSLATIONS[lang].vrStudioDesc,
      icon: 'fas fa-cube'
    },
    { 
      id: 'ar_cam', 
      title: TRANSLATIONS[lang].arCamTitle, 
      desc: TRANSLATIONS[lang].arCamDesc,
      icon: 'fas fa-camera'
    },
    { 
      id: 'pano_360', 
      title: TRANSLATIONS[lang].pano360Title, 
      desc: TRANSLATIONS[lang].pano360Desc,
      icon: 'fas fa-globe'
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto">
        <AnimatePresence mode="wait">
          {activeMode === 'selection' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-6xl mx-auto"
            >
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
                  {TRANSLATIONS[lang].vrarTitle}
                </h1>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                  Fakultetimizning interaktiv laboratoriyalariga xush kelibsiz. Quyidagi texnologiyalardan birini tanlang va o'rganishni boshlang.
                </p>
                <div className="mt-8">
                   <button 
                     onClick={() => setIsVirtualTourActive(true)}
                     className="px-8 py-4 glass border border-cyan-500/30 text-cyan-400 rounded-full font-bold hover:bg-cyan-500 hover:text-white transition-all transform hover:scale-105"
                   >
                     <i className="fas fa-route mr-2"></i> {TRANSLATIONS[lang].virtualTourBtn}
                   </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {modes.map((mode) => (
                  <motion.div
                    key={mode.id}
                    whileHover={{ y: -10 }}
                    onClick={() => setActiveMode(mode.id as any)}
                    className="glass p-12 rounded-[3rem] cursor-pointer group hover:border-cyan-500/50 transition-all border border-white/5"
                  >
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500 transition-all">
                      <i className={`${mode.icon} text-2xl text-cyan-400 group-hover:text-white`}></i>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">{mode.title}</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed">{mode.desc}</p>
                    <div className="flex items-center text-cyan-500 font-bold gap-2">
                       Enter <i className="fas fa-arrow-right text-xs"></i>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeMode === 'vr_studio' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-[80vh] w-full glass rounded-[3rem] overflow-hidden relative"
            >
              <Canvas shadows>
                <PerspectiveCamera makeDefault position={[10, 5, 10]} fov={50} />
                <OrbitControls enableDamping minDistance={5} maxDistance={20} />
                <StudioEnv />
              </Canvas>
              <div className="absolute top-10 left-10 p-6 glass rounded-2xl border-l-4 border-cyan-500 max-w-xs">
                 <h4 className="font-bold text-lg mb-2">VR STUDIO MODE</h4>
                 <p className="text-xs text-gray-400">Sichqoncha yordamida olamni aylantiring va 3D muhitni kashf qiling.</p>
              </div>
              <button 
                onClick={() => setActiveMode('selection')}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 glass bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white"
              >
                Back to Lab
              </button>
            </motion.div>
          )}

          {activeMode === 'ar_cam' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-[80vh] w-full glass rounded-[3rem] overflow-hidden relative"
            >
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-full object-cover grayscale opacity-50"
              />
              {/* Mock AR Overlays */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                 <motion.div 
                   animate={{ 
                     rotateY: 360,
                     scale: [1, 1.1, 1],
                     y: [0, -20, 0]
                   }}
                   transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                   className="w-64 h-64 border-4 border-cyan-400/20 rounded-full flex items-center justify-center relative"
                 >
                    <div className="absolute inset-0 border border-cyan-500/10 animate-ping rounded-full"></div>
                    <div className="w-40 h-40 glass rounded-3xl border border-cyan-500/50 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(0,242,254,0.3)]">
                        <i className="fas fa-microchip text-5xl text-cyan-400 mb-4 animate-pulse"></i>
                        <span className="text-[10px] font-black tracking-widest text-cyan-300">TV-CORE v2.5</span>
                        <span className="text-[8px] text-white/40 mt-1 uppercase">Tracking active</span>
                    </div>
                 </motion.div>
              </div>
              
              <div className="absolute top-10 left-10 flex flex-col gap-4">
                 <div className="bg-black/50 backdrop-blur-xl px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Live AR Scanner</span>
                 </div>
                 <div className="glass p-4 rounded-xl max-w-[200px]">
                    <p className="text-[8px] text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-[10px] font-bold">Synchronizing with spatial coordinates...</p>
                 </div>
              </div>

              <button 
                onClick={() => setActiveMode('selection')}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 glass bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white"
              >
                Close AR
              </button>
            </motion.div>
          )}

          {activeMode === 'pano_360' && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="h-[80vh] w-full glass rounded-[3rem] overflow-hidden relative"
            >
              <Canvas>
                 <PerspectiveCamera makeDefault position={[0, 0, 0.1]} fov={75} />
                 <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={-0.5} />
                 {/* Using a placeholder URL that represents a panoramic video or static room image if video fails */}
                 <PanoVideoMesh videoUrl="https://vjs.zencdn.net/v/oceans.mp4" />
              </Canvas>
              <div className="absolute top-10 left-10 p-6 glass rounded-2xl max-w-xs">
                 <h4 className="font-bold text-lg mb-2">360° IMMERSIVE PLAYER</h4>
                 <p className="text-xs text-gray-400">Atrofga qarash uchun sichqoncha bilan buring.</p>
              </div>
              <button 
                onClick={() => setActiveMode('selection')}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-8 py-3 glass bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white"
              >
                Stop Video
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Virtual Tour Overlay */}
      <AnimatePresence>
        {isVirtualTourActive && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black flex items-center justify-center p-12"
          >
            <div className="text-center max-w-xl">
               <motion.div 
                 initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                 className="w-32 h-32 glass border-2 border-cyan-500 rounded-full flex items-center justify-center mx-auto mb-12 shadow-[0_0_100px_rgba(0,242,254,0.4)]"
               >
                  <i className="fas fa-vr-cardboard text-5xl text-cyan-400 animate-bounce"></i>
               </motion.div>
               <h2 className="text-5xl font-black mb-6 uppercase">Virtual Ekskursiya</h2>
               <p className="text-gray-400 text-lg mb-12">
                 Fakultetimiz bo'ylab 3D sayohat boshlanmoqda. Iltimos, barcha resurslar yuklanishini kuting.
               </p>
               <div className="flex justify-center gap-6">
                 <button onClick={() => setIsVirtualTourActive(false)} className="px-10 py-4 glass text-white font-bold rounded-xl hover:bg-white/10 transition-all">Bekor qilish</button>
                 <button className="px-10 py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-500 transition-all animate-pulse">Davom etish</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Practice;
