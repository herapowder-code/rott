
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeeklyDiet, UserProfile } from '../types';
import { generateAIWeeklyDiet, analyzeMedicalExam } from '../services/geminiService';

const DietScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [diet, setDiet] = useState<WeeklyDiet | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('rottweider_diet_plan');
    if (saved) setDiet(JSON.parse(saved));
  }, []);

  const handleGenerateDiet = async () => {
    const savedProfile = localStorage.getItem('rottweider_profile');
    const medicalSummary = localStorage.getItem('rottweider_medical_summary') || 'Sin antecedentes clínicos relevantes.';
    if (!savedProfile) return navigate('/profile');

    setIsLoading(true);
    try {
      const profile: UserProfile = JSON.parse(savedProfile);
      const plan = await generateAIWeeklyDiet(profile, medicalSummary);
      setDiet(plan);
      localStorage.setItem('rottweider_diet_plan', JSON.stringify(plan));
    } catch (e) {
      alert("Error en la sincronización del protocolo nutricional.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center p-8 text-center">
        <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <p className="text-primary font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">
          CALCULANDO GRAMAJES EXACTOS...<br/>OPTIMIZANDO RATIO MACRONUTRIENTES...
        </p>
      </div>
    );
  }

  return (
    <div className="pb-32 bg-background-dark min-h-screen">
      <header className="sticky top-0 z-50 p-4 border-b border-white/5 bg-background-dark/80 backdrop-blur-md flex items-center justify-between">
         <button onClick={() => navigate('/dashboard')} className="text-slate-400"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
         <h1 className="text-white font-black uppercase text-sm tracking-widest italic">Protocolo Nutricional</h1>
         <button onClick={handleGenerateDiet} className="text-primary transition-transform active:rotate-180 duration-500"><span className="material-symbols-outlined">refresh</span></button>
      </header>

      <main className="p-4 space-y-6">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-start gap-3">
          <span className="material-symbols-outlined text-primary text-xl">scale</span>
          <p className="text-white/60 text-[9px] font-bold uppercase leading-relaxed tracking-wider">
            ATENCIÓN: Se requieren pesajes exactos en gramos para garantizar la eficacia metabólica del protocolo.
          </p>
        </div>

        {!diet ? (
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center space-y-6">
            <span className="material-symbols-outlined text-6xl text-white/10">nutrition</span>
            <p className="text-white/30 text-xs font-bold uppercase tracking-widest">Protocolo de alimentación no generado</p>
            <button onClick={handleGenerateDiet} className="gold-gradient px-8 py-4 rounded-2xl text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Generar Estrategia IA</button>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="glass-card p-6 rounded-[2rem] border-primary/20">
               <div className="flex justify-between items-center mb-4">
                  <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">{diet.planName}</h2>
                  <div className="bg-primary/10 border border-primary/20 px-3 py-1 rounded-full text-primary font-black text-[10px]">{diet.dailyKcal} KCAL</div>
               </div>
               <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">
                 Estado: Mediciones precisas configuradas.
               </p>
            </section>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
               {diet.days.map((d, i) => (
                 <button key={i} onClick={() => setActiveDayIdx(i)} className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${activeDayIdx === i ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'bg-white/5 text-white/40'}`}>
                   {d.dayName}
                 </button>
               ))}
            </div>

            <div className="space-y-4">
               {diet.days[activeDayIdx].meals.map((meal, i) => (
                 <div key={i} className="flex flex-col p-5 bg-surface-dark rounded-3xl border border-white/5 relative group overflow-hidden">
                    <div className="flex justify-between items-start mb-3">
                       <div className="flex gap-3 items-center">
                          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                             <span className="material-symbols-outlined text-lg">schedule</span>
                          </div>
                          <div>
                             <p className="text-white font-black text-xs uppercase tracking-tight">{meal.name}</p>
                             <p className="text-white/30 text-[8px] font-black uppercase tracking-widest">{meal.time}</p>
                          </div>
                       </div>
                       <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5">
                          <span className="text-primary font-black text-[10px]">{meal.kcal} KCAL</span>
                       </div>
                    </div>
                    
                    <div className="bg-background-dark/50 rounded-2xl p-4 border border-primary/10">
                       <div className="flex items-center gap-2 mb-2">
                          <span className="material-symbols-outlined text-primary text-sm">monitor_weight</span>
                          <span className="text-white font-black text-[11px] uppercase tracking-wider">{meal.quantity}</span>
                       </div>
                       <p className="text-white/60 text-[10px] leading-relaxed italic border-t border-white/5 pt-2">{meal.description}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DietScreen;
