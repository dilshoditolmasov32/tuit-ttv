
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, TRANSLATIONS } from './constants';
import { Language } from './types';

import Home from './pages/Home';
import About from './pages/About';
import Programs from './pages/Programs';
import Projects from './pages/Projects';
import News from './pages/News';
import Contact from './pages/Contact';
import Lectures from './pages/Lectures';
import Videos from './pages/Videos';
import Practice from './pages/Practice';
import Tests from './pages/Tests';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing TUIT_TV_CORE...');

  const loadingMessages = [
    'Establishing satellite connection...',
    'Rendering 3D Campus environments...',
    'Syncing VR laboratory data...',
    'Loading academic modules...',
    'Preparing AR interface...',
    'Ready to transmit.'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 3) + 1;
        return next > 100 ? 100 : next;
      });
    }, 40);

    return () => clearInterval(timer);
  }, [onComplete]);

  useEffect(() => {
    const msgIndex = Math.floor((progress / 100) * loadingMessages.length);
    if (loadingMessages[msgIndex]) {
      setStatusText(loadingMessages[msgIndex]);
    }
  }, [progress]);

  return (
    <motion.div 
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
      className="fixed inset-0 z-[300] bg-[#050505] flex flex-col items-center justify-center p-12 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,242,254,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,242,254,0.1)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] rounded-full"></div>

      <div className="relative w-full max-w-2xl text-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[8rem] md:text-[14rem] font-black font-space leading-none tracking-tighter mb-4 flex justify-center items-baseline"
        >
          <span className="text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)]">{progress}</span>
          <span className="text-cyan-500 text-3xl font-light ml-2">%</span>
        </motion.div>

        <div className="w-full h-1 bg-white/5 rounded-full mb-12 relative overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-cyan-500 shadow-[0_0_20px_rgba(0,242,254,1)] relative"
          >
            <div className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-white to-transparent"></div>
          </motion.div>
        </div>

        <div className="h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p 
              key={statusText}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="text-cyan-400 font-mono text-sm uppercase tracking-[0.3em] font-medium"
            >
              {statusText}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const LanguageSelector = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'uz', label: "O'zbek", flag: '🇺🇿' },
    { code: 'ru', label: "Русский", flag: '🇷🇺' },
    { code: 'en', label: "English", flag: '🇺🇸' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === lang);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 px-4 py-2 glass rounded-xl border transition-all duration-500 ${isOpen ? 'border-cyan-500 shadow-[0_0_20px_rgba(0,242,254,0.1)] bg-cyan-500/5' : 'border-white/10 hover:border-white/30'}`}
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-white hidden lg:block">
          {currentLang?.label}
        </span>
        <motion.i 
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="fas fa-angle-down text-[8px] text-cyan-500"
        ></motion.i>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-40 glass border border-white/10 rounded-2xl overflow-hidden z-[200] shadow-2xl"
          >
            <div className="p-1.5 space-y-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code as Language);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group ${lang === l.code ? 'bg-cyan-500/15 text-cyan-400' : 'hover:bg-white/5 text-gray-400 hover:text-white'}`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest">{l.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sahifa o'zgarganda mobil menyuni yopish
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[150] transition-all duration-500 ${scrolled ? 'py-4 glass border-b' : 'py-8'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:rotate-[360deg] transition-transform duration-1000 shadow-lg shadow-cyan-500/20">
              <i className="fas fa-broadcast-tower text-white text-xl"></i>
            </div>
            <span className="font-black text-2xl tracking-tighter">TV-TECH</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_ITEMS.map(item => (
              <Link 
                key={item.id} 
                to={item.path} 
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:text-cyan-400 relative group ${location.pathname === item.path ? 'text-cyan-400' : 'text-gray-400'}`}
              >
                {item.label[lang]}
                {location.pathname === item.path && (
                  <motion.div layoutId="nav-line" className="absolute -bottom-2 left-0 w-full h-0.5 bg-cyan-500 rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <LanguageSelector lang={lang} setLang={setLang} />
            
            {/* Mobile Hamburger Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="w-10 h-10 glass rounded-xl flex items-center justify-center md:hidden border border-white/10 hover:border-cyan-500 transition-all text-white"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[140] glass bg-black/95 flex flex-col pt-32 px-10 pb-10 md:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    to={item.path} 
                    className={`text-3xl font-black uppercase tracking-tighter transition-all ${location.pathname === item.path ? 'text-cyan-500' : 'text-gray-500 hover:text-white'}`}
                  >
                    {item.label[lang]}
                  </Link>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-auto pt-10 border-t border-white/5">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4">Contact Info</p>
              <p className="text-gray-400 text-sm mb-2">info@tv-tech.uz</p>
              <p className="text-gray-400 text-sm">+998 71 234 56 78</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = ({ lang }: { lang: Language }) => (
  <footer className="relative z-10 glass border-t border-white/5 pt-24 pb-12 overflow-hidden">
    <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-cyan-500/5 to-transparent pointer-events-none"></div>
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-20 relative">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <i className="fas fa-broadcast-tower text-white text-2xl"></i>
          </div>
          <span className="font-black text-3xl tracking-tighter">TV-TECH</span>
        </div>
        <p className="text-gray-400 text-lg max-w-md leading-relaxed mb-10">
          {TRANSLATIONS[lang].footerAbout}
        </p>
        <div className="flex gap-6">
          {['facebook-f', 'instagram', 'telegram-plane', 'youtube'].map(s => (
            <a key={s} href="#" className="w-12 h-12 rounded-xl glass border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all transform hover:-translate-y-2">
              <i className={`fab fa-${s}`}></i>
            </a>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em] mb-10">Explore</h4>
        <ul className="space-y-4">
          {NAV_ITEMS.map(item => (
            <li key={item.id}>
              <Link to={item.path} className="text-gray-400 hover:text-cyan-400 transition-colors font-medium">
                {item.label[lang]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-[0.4em] mb-10">Contact</h4>
        <ul className="space-y-6 text-gray-400">
          <li className="flex gap-4">
            <i className="fas fa-map-marker-alt text-cyan-500 pt-1"></i>
            <span>Tashkent, Uzbekistan<br/>Amir Temur Street, 108</span>
          </li>
          <li className="flex gap-4">
            <i className="fas fa-phone-alt text-cyan-500 pt-1"></i>
            <span>+998 71 234 56 78</span>
          </li>
          <li className="flex gap-4">
            <i className="fas fa-envelope text-cyan-500 pt-1"></i>
            <span>info@tv-tech.uz</span>
          </li>
        </ul>
      </div>
    </div>
    <div className="container mx-auto px-6 border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-500 text-xs uppercase tracking-widest">
      <div>&copy; {new Date().getFullYear()} TV-TECH FACULTY.</div>
      <div className="flex gap-8">
        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
      </div>
    </div>
  </footer>
);

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('uz');
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoaded && <LoadingScreen onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>
      
      {isLoaded && (
        <div className="min-h-screen selection:bg-cyan-500 selection:text-white">
          <Navbar lang={lang} setLang={setLang} />
          <main>
            <Routes>
              <Route path="/" element={<Home lang={lang} />} />
              <Route path="/about" element={<About lang={lang} />} />
              <Route path="/programs" element={<Programs lang={lang} />} />
              <Route path="/projects" element={<Projects lang={lang} />} />
              <Route path="/news" element={<News lang={lang} />} />
              <Route path="/contact" element={<Contact lang={lang} />} />
              <Route path="/lectures" element={<Lectures lang={lang} />} />
              <Route path="/videos" element={<Videos lang={lang} />} />
              <Route path="/practice" element={<Practice lang={lang} />} />
              <Route path="/tests" element={<Tests lang={lang} />} />
            </Routes>
          </main>
          <Footer lang={lang} />
        </div>
      )}
    </>
  );
};

export default App;
