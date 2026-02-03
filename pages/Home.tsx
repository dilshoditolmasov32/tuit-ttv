
import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import Scene3D from '../components/Scene3D';
import { Language, StaffMember } from '../types';
import { TRANSLATIONS, STAFF } from '../constants';
import { getAiResponse } from '../services/gemini';

const SectionHeader = ({ title, subtitle }: { title: string, subtitle?: string }) => (
  <div className="mb-20 text-center">
    <motion.h2 
      whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }}
      viewport={{ once: true }}
      className="text-5xl md:text-7xl font-black mb-6 uppercase"
    >
      {title}
    </motion.h2>
    {subtitle && <p className="text-gray-500 tracking-[0.2em] uppercase text-sm">{subtitle}</p>}
  </div>
);

const Home: React.FC<{ lang: Language }> = ({ lang }) => {
  const [query, setQuery] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAiAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    const res = await getAiResponse(query);
    setAiResult(res || '');
    setLoading(false);
  };

  return (
    <div className="relative">
      <Scene3D />

      {/* 1. HERO SECTION */}
      <section className="h-screen flex flex-col items-center justify-center text-center px-6">
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-cyan-500 font-bold tracking-[0.6em] text-[10px] uppercase mb-6 block">Innovation Hub</span>
          <h1 className="text-6xl md:text-[8rem] font-black leading-none mb-8 tracking-tighter">
            {TRANSLATIONS[lang].welcome.toUpperCase()}
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
            {TRANSLATIONS[lang].heroSubtitle}
          </p>
          <div className="mt-12">
            <button className="px-10 py-5 bg-white text-black font-bold rounded-full hover:bg-cyan-400 hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-cyan-500/20">
              {TRANSLATIONS[lang].explore} <i className="fas fa-arrow-right ml-2 text-xs"></i>
            </button>
          </div>
        </motion.div>
        
        <div className="absolute bottom-12 flex flex-col items-center gap-4 text-gray-500">
           <span className="text-[10px] uppercase tracking-[0.4em]">{TRANSLATIONS[lang].scrolldown}</span>
           <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent"></motion.div>
        </div>
      </section>

      <div className="space-y-32 md:space-y-64 pb-32">
        {/* 2. WHAT IS TV TECH? */}
        <section className="container mx-auto px-6 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            <motion.div 
               initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            >
              <h2 className="text-5xl font-black mb-8">{TRANSLATIONS[lang].whatIsTitle}</h2>
              <p className="text-xl text-gray-400 leading-relaxed font-light">
                {TRANSLATIONS[lang].whatIsDesc}
              </p>
              <div className="mt-10 grid grid-cols-2 gap-8">
                <div className="glass p-6 rounded-2xl">
                  <i className="fas fa-broadcast-tower text-cyan-500 text-3xl mb-4"></i>
                  <h4 className="font-bold mb-2">Broadcasting</h4>
                  <p className="text-xs text-gray-500">Signal transmission & digital encoding</p>
                </div>
                <div className="glass p-6 rounded-2xl">
                  <i className="fas fa-video text-cyan-500 text-3xl mb-4"></i>
                  <h4 className="font-bold mb-2">Media Production</h4>
                  <p className="text-xs text-gray-500">Studio gear & editing workflows</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
               initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
               className="relative"
            >
              <div className="aspect-square glass rounded-[4rem] flex items-center justify-center p-20 overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent"></div>
                 <i className="fas fa-satellite text-[180px] text-white/10 group-hover:scale-110 group-hover:text-cyan-500/30 transition-all duration-1000"></i>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3. VR / AR PREVIEW */}
        <section className="container mx-auto px-6">
          <SectionHeader title={TRANSLATIONS[lang].vrarTitle} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { icon: 'fas fa-glasses', title: 'Immersive Learning', desc: 'Virtual classrooms and remote hands-on practice.' },
               { icon: 'fas fa-cubes', title: '3D Prototyping', desc: 'Real-time simulation of complex mechanical parts.' },
               { icon: 'fas fa-hand-sparkles', title: 'Interactive Media', desc: 'Holographic interfaces for next-gen storytelling.' }
             ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }}
                  className="glass p-12 rounded-[3rem] border border-white/5 hover:border-cyan-500/50 transition-all group"
                >
                   <div className="w-16 h-16 bg-cyan-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-cyan-500 transition-all">
                      <i className={`${item.icon} text-2xl text-cyan-500 group-hover:text-white`}></i>
                   </div>
                   <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                   <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                </motion.div>
             ))}
          </div>
          <p className="text-center mt-16 text-gray-400 max-w-2xl mx-auto">
            {TRANSLATIONS[lang].vrarDesc}
          </p>
        </section>

        {/* 4. STATS SECTION */}
        <section className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
                {[
                    { val: '2000+', label: TRANSLATIONS[lang].stats_students },
                    { val: '12', label: TRANSLATIONS[lang].stats_labs },
                    { val: '45+', label: TRANSLATIONS[lang].stats_projects },
                ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 30 }}
                      viewport={{ once: true }}
                      className="text-center"
                    >
                        <h3 className="text-5xl md:text-7xl font-black text-gradient mb-2">{stat.val}</h3>
                        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>

        {/* AI ADVISOR (Part of storytelling) */}
        <section className="container mx-auto px-6">
          <div className="glass rounded-[4rem] p-10 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 blur-[100px] rounded-full"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-5xl font-black mb-8 leading-tight">DIGITAL <br/><span className="text-gradient">ADVISOR</span></h2>
                <p className="text-gray-400 text-lg mb-12 font-light">
                  Ask me anything about our faculty, curriculum, or career opportunities in media technology.
                </p>
                <form onSubmit={handleAiAsk} className="relative">
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={TRANSLATIONS[lang].askAi}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 outline-none focus:border-cyan-500 transition-all text-lg"
                  />
                  <button type="submit" disabled={loading} className="absolute right-4 top-4 bottom-4 bg-cyan-600 px-8 py-2 rounded-xl hover:bg-cyan-500 transition-all">
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
                  </button>
                </form>
                <AnimatePresence>
                  {aiResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 glass rounded-2xl border-l-4 border-cyan-500 text-gray-300 italic"
                    >
                      "{aiResult}"
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="hidden lg:flex justify-center">
                 <motion.div 
                    animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                    className="w-80 h-80 border-2 border-dashed border-cyan-500/20 rounded-full flex items-center justify-center p-10"
                 >
                    <i className="fas fa-brain text-[120px] text-cyan-500/40"></i>
                 </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
