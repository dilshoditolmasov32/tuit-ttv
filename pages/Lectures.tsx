
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';

const LECTURES_DATA = [
  { id: 1, title: 'VR Asoslari va Tarixi', author: 'Prof. Alimov', duration: '45 min', description: 'Virtual voqelik texnologiyasining kelib chiqishi va rivojlanish bosqichlari.' },
  { id: 2, title: '3D Modellashtirish: Blender 4.0', author: 'Dots. Karimov', duration: '60 min', description: 'Murakkab 3D modellarni yaratish va render qilish uslublari.' },
  { id: 3, title: 'AR Core API Integration', author: 'Eng. Rasulov', duration: '35 min', description: 'Mobil ilovalarda kengaytirilgan voqelikni joriy etish asoslari.' },
  { id: 4, title: 'Telekommunikatsiya Standartlari', author: 'Prof. Sobirova', duration: '50 min', description: '5G va kelajakdagi video uzatish protokollari.' },
];

const Lectures: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="container mx-auto px-6 py-12">
      <motion.h2 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-10"
      >
        {lang === 'uz' ? 'O\'quv Ma\'ruzalari' : 'Academic Lectures'}
      </motion.h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {LECTURES_DATA.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-8 rounded-3xl hover:border-cyan-500/50 transition-all cursor-pointer group"
          >
            <div className="text-cyan-400 text-xs font-bold uppercase mb-4 tracking-widest">{item.duration}</div>
            <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">{item.title}</h3>
            <p className="text-gray-400 mb-6 text-sm">{item.description}</p>
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-xs text-gray-500"><i className="fas fa-user-circle mr-2"></i>{item.author}</span>
              <button className="text-cyan-400 hover:underline text-sm font-bold">O'qish <i className="fas fa-chevron-right ml-1"></i></button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Lectures;
