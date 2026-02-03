
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  Float, 
  PerspectiveCamera, 
  MeshDistortMaterial, 
  TorusKnot, 
  OrbitControls,
  ContactShadows,
  PresentationControls
} from '@react-three/drei';
import * as THREE from 'three';
import { Language, StudentProject } from '../types';
import { TRANSLATIONS, PROJECTS } from '../constants';

const AmbientLight = 'ambientLight' as any;
const PointLight = 'pointLight' as any;

const StudentGallery3D = () => {
  return (
    <div className="h-[400px] w-full glass rounded-[4rem] overflow-hidden relative mb-24">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <AmbientLight intensity={0.5} />
        <PointLight position={[10, 10, 10]} intensity={1.5} color="#00f2fe" />
        
        <PresentationControls
          global
          config={{ mass: 2, tension: 500 }}
          snap={{ mass: 4, tension: 1500 }}
          rotation={[0, 0.3, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
        >
          <Float speed={5} rotationIntensity={2} floatIntensity={2}>
            <TorusKnot args={[1, 0.3, 128, 16]}>
              <MeshDistortMaterial
                color="#00f2fe"
                speed={3}
                distort={0.4}
                radius={1}
                metalness={0.8}
                roughness={0.1}
                emissive="#00f2fe"
                emissiveIntensity={0.5}
              />
            </TorusKnot>
          </Float>
        </PresentationControls>
        
        <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={10} blur={2} far={4} />
      </Canvas>
      <div className="absolute bottom-10 left-10 text-xs font-bold uppercase tracking-[0.4em] text-white/40">
        3D Interaction Lab / Student Sculpture #102
      </div>
    </div>
  );
};

const ProjectCard = ({ project, lang, onSelect }: { project: StudentProject, lang: Language, onSelect: () => void }) => {
  return (
    <motion.div
      layoutId={`proj-${project.id}`}
      whileHover={{ y: -10 }}
      onClick={onSelect}
      className="glass rounded-[3rem] overflow-hidden cursor-pointer group border border-white/5 hover:border-cyan-500/30 transition-all"
    >
      <div className="relative h-64 overflow-hidden">
        <img 
          src={project.thumbnail} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
          alt={project.title[lang]} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute top-6 left-6">
          <span className="bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
            {project.type}
          </span>
        </div>
      </div>

      <div className="p-10">
        <p className="text-cyan-500 text-[10px] font-black uppercase tracking-widest mb-2">{project.student}</p>
        <h3 className="text-3xl font-black mb-4 group-hover:text-cyan-400 transition-colors">
          {project.title[lang]}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
          {project.description[lang]}
        </p>
      </div>
    </motion.div>
  );
};

const CaseStudyModal = ({ project, lang, onClose }: { project: StudentProject, lang: Language, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/95 backdrop-blur-3xl"
      onClick={onClose}
    >
      <motion.div
        layoutId={`proj-${project.id}`}
        onClick={(e) => e.stopPropagation()}
        className="glass max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-[4rem] border border-white/10 relative p-8 md:p-20"
      >
        <button
          onClick={onClose}
          className="absolute top-10 right-10 w-12 h-12 glass rounded-full flex items-center justify-center hover:bg-cyan-500 transition-all"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <span className="text-cyan-500 font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">
              {TRANSLATIONS[lang].caseStudyTitle}
            </span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
              {project.title[lang]}
            </h2>
            <p className="text-xl text-gray-400 mb-12 font-light italic">
              Created by {project.student}
            </p>

            <div className="space-y-12">
              <section>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <div className="w-8 h-px bg-cyan-500"></div> {TRANSLATIONS[lang].challenge}
                </h4>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {project.caseStudy.challenge[lang]}
                </p>
              </section>

              <section>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <div className="w-8 h-px bg-cyan-500"></div> {TRANSLATIONS[lang].solution}
                </h4>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {project.caseStudy.solution[lang]}
                </p>
              </section>

              <section>
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-3">
                  <div className="w-8 h-px bg-cyan-500"></div> {TRANSLATIONS[lang].outcome}
                </h4>
                <div className="glass p-8 rounded-3xl border-l-4 border-cyan-500">
                  <p className="text-white text-xl font-bold italic leading-relaxed">
                    "{project.caseStudy.outcome[lang]}"
                  </p>
                </div>
              </section>
            </div>
          </div>

          <div className="space-y-8">
            <img src={project.thumbnail} className="w-full aspect-[4/3] object-cover rounded-[3rem] shadow-2xl" alt="Gallery" />
            <div className="grid grid-cols-2 gap-8">
              <div className="aspect-square glass rounded-[2rem] flex items-center justify-center">
                 <i className="fas fa-play-circle text-6xl text-cyan-500/20"></i>
              </div>
              <div className="aspect-square glass rounded-[2rem] flex items-center justify-center">
                 <i className="fas fa-expand text-6xl text-cyan-500/20"></i>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Projects: React.FC<{ lang: Language }> = ({ lang }) => {
  const [selectedProject, setSelectedProject] = useState<StudentProject | null>(null);

  return (
    <div className="pt-32 pb-32">
      <section className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-[7rem] font-black mb-8 uppercase tracking-tighter"
          >
            {TRANSLATIONS[lang].projectsTitle}
          </motion.h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto uppercase tracking-widest">
            {TRANSLATIONS[lang].projectsSubtitle}
          </p>
        </div>

        <h3 className="text-xs font-black text-cyan-500 uppercase tracking-[0.5em] mb-12 text-center">
          {TRANSLATIONS[lang].gallery3D}
        </h3>
        <StudentGallery3D />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PROJECTS.map((proj) => (
            <ProjectCard 
              key={proj.id} 
              project={proj} 
              lang={lang} 
              onSelect={() => setSelectedProject(proj)} 
            />
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <CaseStudyModal 
            project={selectedProject} 
            lang={lang} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
