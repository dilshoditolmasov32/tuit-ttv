
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language } from '../types';

const QUESTIONS = [
  {
    id: 1,
    text: "VR texnologiyasida 'Latency' nima?",
    options: ["Rasm sifati", "Kechikish vaqti", "Ranglar kontrasti", "Ovoz balandligi"],
    correct: 1
  },
  {
    id: 2,
    text: "Qaysi qurilma 'Standalone VR' hisoblanadi?",
    options: ["Google Cardboard", "Meta Quest 3", "Sony PSVR", "Valve Index"],
    correct: 1
  },
  {
    id: 3,
    text: "AR texnologiyasining asosiy vazifasi nima?",
    options: ["To'liq virtual olam yaratish", "Ovozni o'zgartirish", "Haqiqiy olamga virtual ob'ekt qo'shish", "Videoni tezlatish"],
    correct: 2
  }
];

const Tests: React.FC<{ lang: Language }> = ({ lang }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (idx: number) => {
    if (idx === QUESTIONS[currentStep].correct) {
      setScore(s => s + 1);
    }
    
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(s => s + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 max-w-3xl">
      <div className="mb-10 flex items-center justify-between">
         <h2 className="text-3xl font-bold">{lang === 'uz' ? 'Bilimni sinash' : 'Quiz Center'}</h2>
         {!isFinished && (
           <div className="text-cyan-400 font-bold">
             {currentStep + 1} / {QUESTIONS.length}
           </div>
         )}
      </div>

      <div className="glass p-10 rounded-3xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <h3 className="text-2xl font-medium">{QUESTIONS[currentStep].text}</h3>
              <div className="grid gap-4">
                {QUESTIONS[currentStep].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-2xl hover:bg-cyan-600/20 hover:border-cyan-500/50 transition-all text-lg"
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-white/10 text-center leading-8 mr-4 text-sm font-bold">{i + 1}</span>
                    {opt}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-7xl mb-6">🏆</div>
              <h3 className="text-4xl font-black mb-4">{lang === 'uz' ? 'Natija' : 'Result'}</h3>
              <p className="text-2xl text-cyan-400 mb-10">
                {score} / {QUESTIONS.length}
              </p>
              <button 
                onClick={() => {
                  setCurrentStep(0);
                  setScore(0);
                  setIsFinished(false);
                }}
                className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-cyan-500 hover:text-white transition-all"
              >
                {lang === 'uz' ? 'Qayta urinish' : 'Try Again'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Tests;
