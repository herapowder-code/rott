
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProfile } from '../types';
import { generateAIWeeklyPlan } from '../services/geminiService';

const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('rottweider_profile');
    return saved ? JSON.parse(saved) : {
      age: 25,
      weight: 80,
      height: 180,
      goal: 'Desarrollo de Masa Muscular',
      trainingDays: 4,
      injuries: '',
      pathologies: '',
      photo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200',
      availability: '08:00 - 20:00'
    };
  });

  const [photo, setPhoto] = useState<string>(profile.photo || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: (name === 'age' || name === 'weight' || name === 'height' || name === 'trainingDays') ? Number(value) : value }));
  };

  const handleSaveAndForge = async () => {
    setIsSaving(true);
    try {
      const updatedProfile = { ...profile, photo };
      localStorage.setItem('rottweider_profile', JSON.stringify(updatedProfile));
      const medicalSummary = localStorage.getItem('rottweider_medical_summary') || '';
      const newPlan = await generateAIWeeklyPlan(updatedProfile, medicalSummary);
      localStorage.setItem('rottweider_weekly_plan', JSON.stringify(newPlan));
      navigate('/routines');
    } catch (error) {
      console.error(error);
      alert("Error en la sincronización del protocolo. Perfil actualizado, por favor reintente la generación de rutina.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="pb-32 bg-background-dark min-h-screen">
      <header className="flex items-center bg-background-dark/50 p-4 pb-2 justify-between sticky top-0 z-50 backdrop-blur-md border-b border-white/5">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center justify-center rounded-full hover:bg-white/5 text-slate-400">
          <span className="material-symbols-outlined">arrow_back_ios_new</span>
        </button>
        <h2 className="text-white text-lg font-bold leading-tight tracking-[0.2em] uppercase italic">CONFIGURACIÓN BIOMÉTRICA</h2>
        <div className="w-10"></div>
      </header>

      {isSaving && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center p-10 text-center">
           <div className="size-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6 shadow-[0_0_30px_rgba(234,164,19,0.2)]"></div>
           <h3 className="text-white text-xl font-black italic uppercase tracking-widest animate-pulse">Sincronizando Protocolos...</h3>
           <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.3em] mt-4">Procesando datos antropométricos y clínicos</p>
        </div>
      )}

      <main className="p-4 space-y-8">
        <section className="flex flex-col items-center py-10 glass-card rounded-[3rem] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          <div className="relative mb-6">
            <div onClick={() => fileInputRef.current?.click()} className="h-32 w-32 rounded-full border-4 border-primary/20 p-1 cursor-pointer active:scale-95 transition-transform relative">
              <div className="h-full w-full rounded-full bg-cover bg-center shadow-2xl" style={{backgroundImage: `url("${photo}")`}}></div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
          </div>
          <div className="text-center">
            <h3 className="text-white text-2xl font-black tracking-tight italic uppercase">PERFIL DE RENDIMIENTO</h3>
            <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em] mt-2">USUARIO AUTENTICADO</p>
          </div>
        </section>

        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Edad</label>
              <input name="age" type="number" value={profile.age} onChange={handleChange} className="w-full bg-surface-dark border border-white/5 rounded-2xl text-white font-bold h-14 px-4 outline-none focus:border-primary/40" />
            </div>
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Peso Corporal (kg)</label>
              <input name="weight" type="number" value={profile.weight} onChange={handleChange} className="w-full bg-surface-dark border border-white/5 rounded-2xl text-white font-bold h-14 px-4 outline-none focus:border-primary/40" />
            </div>
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Estatura (cm)</label>
              <input name="height" type="number" value={profile.height} onChange={handleChange} className="w-full bg-surface-dark border border-white/5 rounded-2xl text-white font-bold h-14 px-4 outline-none focus:border-primary/40" />
            </div>
            <div className="space-y-2">
              <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Sesiones Semanales</label>
              <input name="trainingDays" type="number" min="1" max="7" value={profile.trainingDays} onChange={handleChange} className="w-full bg-surface-dark border border-white/5 rounded-2xl text-white font-bold h-14 px-4 outline-none focus:border-primary/40" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Disponibilidad Horaria</label>
            <input name="availability" type="text" value={profile.availability} onChange={handleChange} placeholder="Ej: 07:00 - 21:00" className="w-full bg-surface-dark border border-white/5 rounded-2xl text-white font-bold h-14 px-4 outline-none focus:border-primary/40" />
          </div>

          <div className="space-y-2">
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Objetivo Estratégico</label>
            <select name="goal" value={profile.goal} onChange={handleChange} className="w-full bg-surface-dark border border-white/5 rounded-2xl text-white font-bold h-14 px-4 outline-none appearance-none focus:border-primary/40">
              <option value="Déficit Calórico (Pérdida de Grasa)">Déficit Calórico (Pérdida de Grasa)</option>
              <option value="Desarrollo de Masa Muscular">Desarrollo de Masa Muscular (Hipertrofia)</option>
              <option value="Potencia y Fuerza Máxima">Potencia y Fuerza Máxima</option>
              <option value="Definición y Composición Corporal">Definición y Composición Corporal</option>
              <option value="Acondicionamiento Cardiovascular">Acondicionamiento Cardiovascular</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-white/40 text-[10px] font-black uppercase tracking-widest px-1">Antecedentes Médicos o Lesiones</label>
            <textarea name="injuries" value={profile.injuries} onChange={handleChange} placeholder="Detalle cualquier restricción física o patología relevante." className="w-full bg-surface-dark border border-white/5 rounded-2xl text-white text-sm p-4 h-24 outline-none resize-none focus:border-primary/40" />
          </div>
        </section>

        <div className="pt-6">
          <button 
            onClick={handleSaveAndForge}
            disabled={isSaving}
            className="w-full gold-gradient text-black font-black text-sm py-5 rounded-2xl shadow-xl uppercase tracking-widest active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            Sincronizar Protocolos
            <span className="material-symbols-outlined">psychology</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default ProfileScreen;
