
import React from 'react';
import { motion } from 'framer-motion';
import { Language } from '../types';
import { TRANSLATIONS, NEWS } from '../constants';

const News: React.FC<{ lang: Language }> = ({ lang }) => {
  return (
    <div className="min-h-screen relative pt-32 pb-32">
      {/* Background Video/Cinematic Layer */}
      <div className="fixed inset-0 -z-10 opacity-30">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover"
        >
          <source src="https://vjs.zencdn.net/v/oceans.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black"></div>
      </div>

      <div className="container mx-auto px-6">
        <div className="text-center mb-24">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black mb-8 uppercase tracking-tighter"
          >
            {TRANSLATIONS[lang].newsTitle}
          </motion.h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto uppercase tracking-widest">
            {TRANSLATIONS[lang].newsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-20">
          {NEWS.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="glass rounded-[4rem] overflow-hidden group hover:border-cyan-500/50 transition-all border border-white/5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-[400px] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title[lang]} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  <div className="absolute top-8 left-8">
                    <span className="bg-cyan-600/80 backdrop-blur-xl px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest text-white">
                      {item.category[lang]}
                    </span>
                  </div>
                </div>
                <div className="p-12 md:p-20 flex flex-col justify-center">
                  <span className="text-cyan-500 font-mono text-sm mb-4">{item.date}</span>
                  <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                    {item.title[lang]}
                  </h2>
                  <p className="text-gray-400 text-xl leading-relaxed mb-12 font-light">
                    {item.content[lang]}
                  </p>
                  <div className="mt-auto">
                    <button className="flex items-center gap-4 text-cyan-400 font-black uppercase tracking-widest group-hover:gap-6 transition-all">
                      {TRANSLATIONS[lang].readMore} <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default News;
