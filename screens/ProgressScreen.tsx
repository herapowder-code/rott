
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeEvolutionPhoto } from '../services/geminiService';
import { TrainingSession } from '../types';

const ProgressScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [trainingHistory, setTrainingHistory] = useState<TrainingSession[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rottweider_evolution_history');
    if (saved) setHistory(JSON.parse(saved));
    
    const savedTraining = localStorage.getItem('rottweider_training_history');
    if (savedTraining) setTrainingHistory(JSON.parse(savedTraining));
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setCurrentResult(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const prevData = history.length > 0 ? history[0].analysis : 'No existen registros previos.';
        const result = await analyzeEvolutionPhoto(base64Data, file.type, prevData);
        
        const newEntry = {
          date: new Date().toLocaleDateString('es-CL'),
          url: reader.result as string,
          analysis: result
        };
        
        const newHistory = [newEntry, ...history];
        setHistory(newHistory);
        localStorage.setItem('rottweider_evolution_history', JSON.stringify(newHistory));
        localStorage.setItem('rottweider_last_photo', Date.now().toString());
        setCurrentResult(result);
      } catch (e) {
        alert("Error en el análisis de hardware corporal.");
      } finally {
        setIsAnalyzing(false);
      }
    };
  };

  return (
    <div className="pb-32 bg-background-dark min-h-screen">
      <header className="p-4 flex items-center justify-between sticky top-0 bg-background-dark/80 backdrop-blur-md z-50 border-b border-white/5">
         <button onClick={() => navigate(-1)} className="text-slate-400"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
         <h1 className="text-white font-black uppercase text-sm tracking-widest italic">Análisis de Progreso</h1>
         <div className="w-10"></div>
      </header>

      <main className="p-4 space-y-8">
        <section>
           <button 
             onClick={() => fileInputRef.current?.click()}
             disabled={isAnalyzing}
             className="w-full gold-gradient py-6 rounded-3xl flex items-center justify-center gap-4 text-black font-black uppercase text-xs tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all"
           >
             {isAnalyzing ? (
               <><span className="animate-spin material-symbols-outlined">sync</span> ANALIZANDO...</>
             ) : (
               <><span className="material-symbols-outlined">photo_camera</span> NUEVO REGISTRO VISUAL</>
             )}
           </button>
           <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
        </section>

        {/* Historial de Tiempos de Entrenamiento */}
        <section className="space-y-4">
           <h2 className="text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2">Densidad de Entrenamiento</h2>
           <div className="space-y-3">
              {trainingHistory.length === 0 ? (
                <p className="text-white/10 text-center py-4 uppercase font-black text-[9px]">Sin sesiones registradas</p>
              ) : (
                trainingHistory.slice(0, 5).map((session, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-surface-dark border border-white/5 rounded-2xl">
                     <div>
                        <p className="text-white font-black text-[10px] uppercase">{session.routineName}</p>
                        <p className="text-white/30 text-[8px] font-bold uppercase tracking-widest">{session.date}</p>
                     </div>
                     <div className="text-right">
                        <p className={`font-black text-xs ${session.durationMinutes > 75 ? 'text-red-500' : 'text-primary'}`}>
                           {session.durationMinutes} min
                        </p>
                        <p className="text-white/20 text-[8px] font-bold uppercase">Duración sesión</p>
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>

        {currentResult && (
           <div className="glass-card p-6 rounded-[2rem] border-primary/30 animate-in zoom-in-95">
              <h3 className="text-primary text-[10px] font-black uppercase tracking-widest mb-3">Diagnóstico Biométrico</h3>
              <p className="text-white/90 text-[11px] leading-relaxed italic">{currentResult}</p>
           </div>
        )}

        <section className="space-y-6">
           <h2 className="text-white/40 text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2">Evolución Antropométrica</h2>
           {history.length === 0 ? (
             <p className="text-white/10 text-center py-10 uppercase font-black text-[9px]">Sin registros visuales</p>
           ) : (
             <div className="space-y-6">
               {history.map((entry, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="size-24 rounded-2xl bg-center bg-cover border border-white/10 shrink-0" style={{backgroundImage: `url("${entry.url}")`}}></div>
                    <div className="flex-1 space-y-1">
                       <p className="text-primary text-[9px] font-black uppercase">{entry.date}</p>
                       <p className="text-white/60 text-[10px] line-clamp-3 italic leading-relaxed">{entry.analysis}</p>
                    </div>
                 </div>
               ))}
             </div>
           )}
        </section>
      </main>
    </div>
  );
};

export default ProgressScreen;
