
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile, WeeklyPlan, DailyRoutine, PlannedExercise } from '../types';
import { generateAIWeeklyPlan } from '../services/geminiService';

const RoutinesScreen: React.FC = () => {
  const navigate = useNavigate();
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // State para edición
  const [editingExercise, setEditingExercise] = useState<{dayIdx: number, exIdx: number, exercise: PlannedExercise} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rottweider_weekly_plan');
    if (saved) {
      setWeeklyPlan(JSON.parse(saved));
    }
  }, []);

  const handleGenerateAI = async () => {
    const savedProfile = localStorage.getItem('rottweider_profile');
    if (!savedProfile) {
      alert("Primero configura tu perfil.");
      navigate('/profile');
      return;
    }

    setIsGenerating(true);
    try {
      const profile: UserProfile = JSON.parse(savedProfile);
      const plan = await generateAIWeeklyPlan(profile);
      setWeeklyPlan(plan);
      localStorage.setItem('rottweider_weekly_plan', JSON.stringify(plan));
    } catch (error) {
      alert("Fallo en la sincronización IA.");
    } finally {
      setIsGenerating(false);
    }
  };

  const activateDay = (routine: DailyRoutine) => {
    localStorage.setItem('rottweider_active_routine', JSON.stringify(routine.exercises));
    localStorage.setItem('rottweider_active_routine_name', routine.dayName);
    navigate('/training');
  };

  const saveEditedExercise = () => {
    if (!editingExercise || !weeklyPlan) return;
    
    const newPlan = { ...weeklyPlan };
    newPlan.days[editingExercise.dayIdx].exercises[editingExercise.exIdx] = editingExercise.exercise;
    
    setWeeklyPlan(newPlan);
    localStorage.setItem('rottweider_weekly_plan', JSON.stringify(newPlan));
    setEditingExercise(null);
  };

  return (
    <div className="pb-40 min-h-screen relative bg-background-dark">
      <header className="sticky top-0 z-30 bg-background-dark/90 backdrop-blur-xl px-4 py-4 flex items-center justify-between border-b border-white/5">
        <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center size-10 rounded-full hover:bg-white/5">
          <span className="material-symbols-outlined text-2xl text-slate-400">arrow_back_ios_new</span>
        </button>
        <h1 className="text-lg font-bold tracking-tight text-white/90 uppercase tracking-widest italic">Protocolos</h1>
        <button onClick={handleGenerateAI} disabled={isGenerating} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-[10px] font-black uppercase tracking-widest">
          {isGenerating ? <span className="animate-spin material-symbols-outlined text-sm">sync</span> : <span className="material-symbols-outlined text-sm">psychology</span>}
          Recalibrar
        </button>
      </header>

      <main className="px-4 mt-6">
        {isGenerating && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 animate-in fade-in duration-500">
            <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-primary font-black text-[10px] uppercase tracking-[0.3em] animate-pulse">Optimizando Bio-Datos...</p>
          </div>
        )}

        {weeklyPlan && !isGenerating && (
          <div className="space-y-10">
            {weeklyPlan.days.map((day, dIdx) => (
              <div key={dIdx} className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-primary font-black text-xs uppercase tracking-[0.4em] italic">{day.dayName}</h3>
                  <button onClick={() => activateDay(day)} className="text-[9px] font-black uppercase tracking-widest gold-gradient px-4 py-1.5 rounded-full text-black active:scale-95 transition-all shadow-lg">Iniciar Protocolo</button>
                </div>
                <div className="space-y-3">
                  {day.exercises.map((ex, eIdx) => (
                    <div key={eIdx} className="bg-surface-dark rounded-3xl border border-white/5 overflow-hidden group">
                      <div className="flex items-center gap-4 p-4">
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-2xl size-14 shrink-0 border border-white/10" style={{backgroundImage: `url("${ex.img}")`}}></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-black text-xs truncate uppercase tracking-tighter">{ex.name}</p>
                          <div className="flex gap-2 mt-1">
                             <span className="text-primary text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">{ex.sets} Sets</span>
                             <span className="text-white/40 text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-white/5 border border-white/10">{ex.rir}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setEditingExercise({dayIdx: dIdx, exIdx: eIdx, exercise: {...ex}})}
                          className="size-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/30 group-hover:text-primary group-hover:bg-primary/10 transition-all"
                        >
                          <span className="material-symbols-outlined text-xl">edit_note</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal / Panel de Edición */}
      {editingExercise && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end animate-in fade-in duration-300">
           <div className="w-full bg-surface-dark rounded-t-[3rem] border-t border-white/10 p-8 space-y-8 animate-in slide-in-from-bottom-20 duration-500">
              <div className="flex justify-between items-center">
                 <div>
                    <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">Ajustar Parámetros</h2>
                    <p className="text-primary text-[10px] font-black uppercase tracking-widest">{editingExercise.exercise.name}</p>
                 </div>
                 <button onClick={() => setEditingExercise(null)} className="size-12 rounded-full bg-white/5 flex items-center justify-center text-white/40"><span className="material-symbols-outlined">close</span></button>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 <div className="space-y-3">
                    <label className="text-white/30 text-[9px] font-black uppercase tracking-widest px-1">Número de Series</label>
                    <div className="flex items-center gap-4">
                       <button onClick={() => setEditingExercise(prev => prev ? {...prev, exercise: {...prev.exercise, sets: Math.max(1, prev.exercise.sets - 1)}} : null)} className="size-14 rounded-2xl bg-white/5 border border-white/5 text-white flex items-center justify-center"><span className="material-symbols-outlined">remove</span></button>
                       <div className="flex-1 h-14 bg-background-dark rounded-2xl flex items-center justify-center text-2xl font-black text-primary">{editingExercise.exercise.sets}</div>
                       <button onClick={() => setEditingExercise(prev => prev ? {...prev, exercise: {...prev.exercise, sets: prev.exercise.sets + 1}} : null)} className="size-14 rounded-2xl bg-white/5 border border-white/5 text-white flex items-center justify-center"><span className="material-symbols-outlined">add</span></button>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <label className="text-white/30 text-[9px] font-black uppercase tracking-widest px-1">Intensidad (RIR)</label>
                    <input 
                       type="text" 
                       value={editingExercise.exercise.rir} 
                       onChange={(e) => setEditingExercise(prev => prev ? {...prev, exercise: {...prev.exercise, rir: e.target.value}} : null)}
                       className="w-full h-14 bg-background-dark border border-white/5 rounded-2xl px-6 text-white font-bold outline-none focus:border-primary/40"
                    />
                 </div>

                 <div className="space-y-3">
                    <label className="text-white/30 text-[9px] font-black uppercase tracking-widest px-1">Tempo (Cadencia)</label>
                    <input 
                       type="text" 
                       value={editingExercise.exercise.tempo} 
                       onChange={(e) => setEditingExercise(prev => prev ? {...prev, exercise: {...prev.exercise, tempo: e.target.value}} : null)}
                       className="w-full h-14 bg-background-dark border border-white/5 rounded-2xl px-6 text-white font-bold outline-none focus:border-primary/40"
                    />
                 </div>
              </div>

              <button 
                 onClick={saveEditedExercise}
                 className="w-full h-16 gold-gradient text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-[0.98] transition-all"
              >
                 Actualizar Protocolo
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default RoutinesScreen;
