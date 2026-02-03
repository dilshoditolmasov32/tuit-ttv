
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

const VIDEOS = [
  { id: 1, title: 'Intro to WebGL', thumb: 'https://picsum.photos/seed/webgl/800/450', category: 'Dev' },
  { id: 2, title: 'ARKit for Beginners', thumb: 'https://picsum.photos/seed/arkit/800/450', category: 'AR' },
  { id: 3, title: 'Metaverse Concept', thumb: 'https://picsum.photos/seed/meta/800/450', category: 'Theory' },
  { id: 4, title: 'Unity 3D Physics', thumb: 'https://picsum.photos/seed/unity/800/450', category: 'Game' },
];

const Videos: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-4xl font-bold mb-10">{lang === 'uz' ? 'Video Darsliklar' : 'Video Tutorials'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {VIDEOS.map((vid) => (
          <motion.div 
            key={vid.id}
            whileHover={{ scale: 1.02 }}
            className="group relative overflow-hidden rounded-3xl aspect-video glass"
          >
            <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-cyan-500 text-[10px] font-bold px-2 py-1 rounded mb-2 inline-block uppercase">{vid.category}</span>
              <h3 className="text-2xl font-bold">{vid.title}</h3>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-black text-2xl">
                <i className="fas fa-play ml-1"></i>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Videos;
