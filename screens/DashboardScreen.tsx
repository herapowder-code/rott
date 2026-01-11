
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stat, TrainingSession } from '../types';

const DashboardScreen: React.FC = () => {
  const navigate = useNavigate();
  const [needsPhoto, setNeedsPhoto] = useState(false);
  const [hasActiveRoutine, setHasActiveRoutine] = useState(false);
  const [avgDuration, setAvgDuration] = useState('0');
  
  useEffect(() => {
    const lastCheck = localStorage.getItem('rottweider_last_photo');
    if (!lastCheck) setNeedsPhoto(true);
    else {
      const days = (Date.now() - parseInt(lastCheck)) / (1000 * 60 * 60 * 24);
      if (days > 7) setNeedsPhoto(true);
    }

    const active = localStorage.getItem('rottweider_active_routine');
    if (active) {
      const parsed = JSON.parse(active);
      if (Array.isArray(parsed) && parsed.length > 0) setHasActiveRoutine(true);
    }

    // Calcular duración promedio
    const history: TrainingSession[] = JSON.parse(localStorage.getItem('rottweider_training_history') || '[]');
    if (history.length > 0) {
      const total = history.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      setAvgDuration(Math.round(total / history.length).toString());
    }
  }, []);

  const stats: Stat[] = [
    { icon: 'schedule', label: 'Tiempo de Sesión Promedio', lvl: `${avgDuration}min`, pc: '100%', extra: 'Densidad Óptima' },
    { icon: 'fitness_center', label: 'Potencia Muscular', lvl: '12', pc: '65%' },
    { icon: 'nutrition', label: 'Eficiencia Nutricional', lvl: '09', pc: '88%' },
    { icon: 'shield', label: 'Tasa de Recuperación', lvl: '15', pc: '82%' },
  ];

  const handleTrainingClick = () => {
    if (hasActiveRoutine) {
      navigate('/training');
    } else {
      navigate('/routines');
    }
  };

  return (
    <div className="pb-24 bg-background-dark min-h-screen">
      <header className="flex items-center bg-background-dark/50 p-4 justify-between sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
        <div className="flex size-10 shrink-0 items-center">
          <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-primary/40 shadow-lg shadow-primary/10" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=100")'}}></div>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-white text-base font-black tracking-[0.2em] italic">ROTTWEIDER</h2>
          <span className="text-[8px] font-black text-primary uppercase tracking-widest">SISTEMA DE GESTIÓN BIOMÉTRICA v2.4</span>
        </div>
        <button onClick={() => navigate('/evolution-lab')} className="flex size-10 items-center justify-center rounded-full bg-white/5 text-primary">
          <span className="material-symbols-outlined text-xl">science</span>
        </button>
      </header>

      {needsPhoto && (
        <div className="mx-4 mt-6 p-4 gold-gradient rounded-2xl flex items-center justify-between shadow-2xl animate-pulse cursor-pointer" onClick={() => navigate('/progress')}>
          <div className="flex items-center gap-3">
             <span className="material-symbols-outlined text-black text-2xl">photo_camera</span>
             <div>
                <p className="text-black font-black text-[10px] uppercase tracking-widest leading-none">REGISTRO ANTROPOMÉTRICO SEMANAL</p>
                <p className="text-black/60 text-[9px] font-bold mt-1 uppercase">Actualice sus registros para análisis IA</p>
             </div>
          </div>
          <span className="material-symbols-outlined text-black">chevron_right</span>
        </div>
      )}

      <section className="p-4 mt-2">
        <div className="glass-card rounded-3xl p-6 relative overflow-hidden border-primary/20">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-7xl text-primary">trending_up</span>
          </div>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-2">Indicador de Rendimiento Sistémico</p>
          <div className="flex items-end gap-2 mb-4">
             <h3 className="text-white text-4xl font-black tracking-tighter italic">+12.4%</h3>
             <p className="text-primary text-[10px] font-black mb-1 uppercase tracking-widest">Densidad de Trabajo</p>
          </div>
          
          <div className="flex gap-1 h-12 items-end">
             {[30, 45, 35, 60, 55, 75, 70, 90].map((h, i) => (
               <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group">
                  <div className="absolute bottom-0 w-full bg-primary/40 rounded-t-sm group-hover:bg-primary transition-all" style={{height: `${h}%`}}></div>
               </div>
             ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4 py-2">
        <button onClick={handleTrainingClick} className="flex flex-col items-center justify-center gap-3 h-32 bg-surface-dark border border-white/5 rounded-3xl active:scale-95 transition-all shadow-xl group">
          <div className={`size-12 rounded-full ${hasActiveRoutine ? 'bg-primary text-black' : 'bg-primary/10 text-primary'} flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-all`}>
            <span className="material-symbols-outlined text-2xl font-black">{hasActiveRoutine ? 'bolt' : 'fitness_center'}</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{hasActiveRoutine ? 'Sesión Activa' : 'Entrenamiento'}</span>
        </button>
        <button onClick={() => navigate('/diet')} className="flex flex-col items-center justify-center gap-3 h-32 bg-surface-dark border border-white/5 rounded-3xl active:scale-95 transition-all shadow-xl group">
          <div className="size-12 rounded-full bg-accent-copper/10 flex items-center justify-center text-accent-copper group-hover:bg-accent-copper group-hover:text-black transition-all">
            <span className="material-symbols-outlined text-2xl font-black">restaurant</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Plan Nutricional</span>
        </button>
      </section>

      <section className="grid grid-cols-2 gap-3 px-4 py-2">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col gap-3 p-4 bg-surface-dark rounded-2xl border border-white/5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">{stat.icon}</span>
              <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">{stat.label}</p>
            </div>
            <div className="flex justify-between items-end">
               <p className="text-white text-lg font-black italic">{stat.lvl}</p>
               <p className="text-primary text-[10px] font-black">{stat.pc}</p>
            </div>
            <div className="rounded-full bg-white/5 h-1 overflow-hidden">
              <div className="h-full bg-primary" style={{width: stat.pc}}></div>
            </div>
          </div>
        ))}
      </section>

      <section className="p-4">
         <button onClick={() => navigate('/progress')} className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] active:scale-[0.98] transition-all">
            <span className="material-symbols-outlined text-primary">monitoring</span>
            Historial de Evolución
         </button>
      </section>
    </div>
  );
};

export default DashboardScreen;
