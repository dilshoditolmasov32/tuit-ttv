import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Language } from "../types";
import { TRANSLATIONS } from "../constants";
import { VRModule } from "../components/VRModule";
import { ARModule } from "../components/ARModule";

// ====================
// MODE SELECTION COMPONENT
// ====================

interface ModeSelectionProps {
  lang: Language;
  onModeSelect: (mode: string) => void;
}

const ModeSelection: React.FC<ModeSelectionProps> = ({
  lang,
  onModeSelect,
}) => {
  const modes = [
    {
      id: "vr",
      title:
        lang === "uz"
          ? "🥽 VR Laboratoriyasi"
          : lang === "ru"
            ? "🥽 VR Лаборатория"
            : "🥽 VR Lab",
      desc:
        lang === "uz"
          ? "Interaktiv 3D muhitda yurish va objektlarni tahlil qilish. Klaviatura bilan harakat qiling va tanlash uchun bosing."
          : lang === "ru"
            ? "Ходите в интерактивной 3D среде и анализируйте объекты. Перемещайтесь с клавиатурой и щелкайте для выбора."
            : "Walk in an interactive 3D environment and analyze objects. Move with keyboard and click to select.",
      color: "#00f2fe",
      icon: "🥽",
    },
    {
      id: "ar",
      title:
        lang === "uz"
          ? "📱 AR Markeri"
          : lang === "ru"
            ? "📱 AR Маркер"
            : "📱 AR Marker",
      desc:
        lang === "uz"
          ? "3D modellarni real dunyoda ko'rish. Kamera ishlatib marker aniqlanadi va model ko'rsatiladi."
          : lang === "ru"
            ? "Просмотр 3D-моделей в реальном мире. Используя камеру, обнаруживается маркер и отображается модель."
            : "View 3D models in the real world. Using the camera, the marker is detected and the model is displayed.",
      color: "#a29bfe",
      icon: "📱",
    },
    {
      id: "tour",
      title:
        lang === "uz"
          ? "🎬 360° Tur"
          : lang === "ru"
            ? "🎬 360° Тур"
            : "🎬 360° Tour",
      desc:
        lang === "uz"
          ? "Panoramik video orqali fakultetni virtual sayohati. Hamma tomondan qarab o'rganing."
          : lang === "ru"
            ? "Виртуальный тур по факультету через панорамное видео. Смотрите со всех сторон."
            : "Virtual tour of the faculty through panoramic video. Watch from all angles.",
      color: "#ff7675",
      icon: "🎬",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-7xl font-black mb-6 uppercase tracking-tighter">
          {lang === "uz"
            ? "VR/AR Laboratoriyasi"
            : lang === "ru"
              ? "Лаборатория VR/AR"
              : "VR/AR Laboratory"}
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
          {lang === "uz"
            ? "Fakultetimizning interaktiv laboratoriyalariga xush kelibsiz. Quyidagi texnologiyalardan birini tanlang va o'rganishni boshlang."
            : lang === "ru"
              ? "Добро пожаловать в интерактивные лаборатории нашего факультета. Выберите одну из технологий ниже и начните обучение."
              : "Welcome to the interactive laboratories of our faculty. Choose one of the technologies below and start learning."}
        </p>
      </div>

      {/* Mode Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {modes.map((mode) => (
          <motion.div
            key={mode.id}
            whileHover={{ y: -10 }}
            onClick={() => onModeSelect(mode.id)}
            className="glass p-8 rounded-[2rem] cursor-pointer group hover:border-cyan-500/50 transition-all border border-white/5 h-full"
          >
            {/* Icon */}
            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform">
              {mode.icon}
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
              {mode.title}
            </h3>
            <p className="text-gray-500 mb-8 leading-relaxed text-sm">
              {mode.desc}
            </p>

            {/* CTA */}
            <div className="flex items-center text-cyan-500 font-bold gap-2 group-hover:gap-4 transition-all">
              {lang === "uz" ? "Kirish" : lang === "ru" ? "Вход" : "Enter"}
              <i className="fas fa-arrow-right text-xs"></i>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: "⚡",
            title:
              lang === "uz"
                ? "Tez va Samarali"
                : lang === "ru"
                  ? "Быстро и эффективно"
                  : "Fast & Efficient",
            desc:
              lang === "uz"
                ? "Real-time rendering"
                : lang === "ru"
                  ? "Визуализация в реальном времени"
                  : "Real-time rendering",
          },
          {
            icon: "🎯",
            title:
              lang === "uz"
                ? "Interaktiv"
                : lang === "ru"
                  ? "Интерактивное"
                  : "Interactive",
            desc:
              lang === "uz"
                ? "Foydalanuvchi kiritish"
                : lang === "ru"
                  ? "Ввод пользователя"
                  : "User input",
          },
          {
            icon: "🌐",
            title:
              lang === "uz"
                ? "Veb-asosida"
                : lang === "ru"
                  ? "Веб-базированное"
                  : "Web-based",
            desc:
              lang === "uz"
                ? "Hech qanday yuklamalar yo'q"
                : lang === "ru"
                  ? "Никаких загрузок"
                  : "No downloads",
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="glass p-6 rounded-xl border border-white/5 text-center"
          >
            <p className="text-4xl mb-3">{feature.icon}</p>
            <p className="font-bold mb-1">{feature.title}</p>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ====================
// 360 PANORAMIC VIDEO PLAYER
// ====================

interface PanoramaViewerProps {
  lang: Language;
  onBack: () => void;
}

const PanoramaViewer: React.FC<PanoramaViewerProps> = ({ lang, onBack }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-[80vh] w-full glass rounded-[3rem] overflow-hidden relative bg-gray-900"
    >
      {/* Placeholder for 360 video */}
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-24 h-24 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h3 className="text-2xl font-bold text-white mb-2">
            360° Panoramik Tur
          </h3>
          <p className="text-gray-400">
            {lang === "uz"
              ? "Video yuklanmoqda..."
              : lang === "ru"
                ? "Видео загружается..."
                : "Loading video..."}
          </p>
          <p className="text-gray-500 text-sm mt-4">
            {lang === "uz"
              ? "Sichqoncha yoki touch orqali olamni buring"
              : lang === "ru"
                ? "Вращайте мир с помощью мыши или касания"
                : "Rotate the world with your mouse or touch"}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="absolute top-10 left-10 p-6 glass rounded-2xl border-l-4 border-cyan-500 max-w-xs">
        <h4 className="font-bold text-lg mb-2">360° PANORAMIC VIEW</h4>
        <p className="text-xs text-gray-400">
          {lang === "uz"
            ? "Hamma tomondan fakultetni o'rganing"
            : lang === "ru"
              ? "Изучите факультет со всех сторон"
              : "Explore the faculty from all sides"}
        </p>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute bottom-10 right-10 px-8 py-3 glass bg-red-500/10 border border-red-500/30 text-red-500 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all"
      >
        🔙 {lang === "uz" ? "Orqaga" : lang === "ru" ? "Назад" : "Back"}
      </button>
    </motion.div>
  );
};

// ====================
// MAIN PRACTICE COMPONENT
// ====================

const Practice: React.FC<{ lang: Language }> = ({ lang }) => {
  const [activeMode, setActiveMode] = useState<null | string>(null);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-[#050505] relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <AnimatePresence mode="wait">
          {!activeMode && (
            <ModeSelection lang={lang} onModeSelect={setActiveMode} />
          )}

          {activeMode === "vr" && (
            <VRModule lang={lang} onBack={() => setActiveMode(null)} />
          )}

          {activeMode === "ar" && (
            <ARModule lang={lang} onBack={() => setActiveMode(null)} />
          )}

          {activeMode === "tour" && (
            <PanoramaViewer lang={lang} onBack={() => setActiveMode(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Practice;
