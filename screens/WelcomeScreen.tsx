
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [hasKey, setHasKey] = useState<boolean>(false);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        // Fallback para entornos donde no esté el bridge de AI Studio
        setHasKey(true);
      }
    };
    checkKey();
  }, []);

  const handleAccess = async () => {
    if (!hasKey && window.aistudio?.openSelectKey) {
      await window.aistudio.openSelectKey();
      // Asumimos éxito tras el diálogo según las reglas de carrera
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col items-center max-w-md mx-auto relative overflow-hidden">
      <header className="w-full flex items-center bg-transparent p-4 pb-2 justify-center pt-12">
        <div className="text-primary flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-[64px] shadow-primary/20 drop-shadow-2xl">shield_person</span>
          <h2 className="text-white text-2xl font-black leading-tight tracking-[0.3em] uppercase italic">ROTTWEIDER</h2>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col px-6 pb-12 justify-center">
        <section className="mt-4">
          <h1 className="text-white tracking-tighter text-[42px] font-black leading-tight text-center pb-3 uppercase italic">
            EVOLUCIÓN<br/><span className="text-gold-gradient">SISTÉMICA.</span>
          </h1>
          <p className="text-white/40 text-[10px] font-black leading-relaxed pb-6 pt-1 text-center px-4 uppercase tracking-[0.4em]">
            Optimización Biopsicosocial <br/>y Rendimiento Físico Avanzado.
          </p>
        </section>

        <section className="flex flex-col items-center justify-center py-6 relative">
          <div className="w-full aspect-square max-w-[280px] relative flex items-center justify-center">
            <svg className="w-full h-full animate-[pulse_4s_infinite]" viewBox="0 0 200 200">
              <circle className="radar-grid opacity-20" cx="100" cy="100" fill="none" r="80"></circle>
              <circle className="radar-grid opacity-40" cx="100" cy="100" fill="none" r="60"></circle>
              <polygon className="radar-shape opacity-10" points="100,40 145,100 100,150 60,100"></polygon>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-black/60 backdrop-blur-xl border border-primary/20 rounded-full p-8 flex items-center justify-center shadow-[0_0_60px_rgba(234,164,19,0.1)]">
                <span className="material-symbols-outlined text-primary text-5xl animate-pulse">fitness_center</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 space-y-4">
          {!hasKey && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl mb-4">
              <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">
                Se requiere una API Key de un proyecto con facturación habilitada para operar los modelos Pro.
              </p>
              <a 
                href="https://ai.google.dev/gemini-api/docs/billing" 
                target="_blank" 
                rel="noreferrer"
                className="block text-center text-white/40 text-[8px] font-bold underline mt-2 uppercase"
              >
                Ver documentación de facturación
              </a>
            </div>
          )}

          <button 
            onClick={handleAccess}
            className="w-full gold-gradient text-black font-black text-base py-5 rounded-2xl shadow-[0_15px_40px_rgba(211,84,0,0.3)] transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-[0.2em]"
          >
            {!hasKey ? 'Configurar API Key' : 'Acceder al Sistema'}
            <span className="material-symbols-outlined font-black text-xl">
              {!hasKey ? 'key' : 'login'}
            </span>
          </button>
          
          <p className="mt-6 text-center text-[9px] text-white/20 font-bold uppercase tracking-[0.4em]">Plataforma de Optimización Biocéntrica v2.4</p>
        </section>
      </main>

      <div className="absolute top-[-20%] left-[-20%] w-[140%] aspect-square rounded-full bg-gradient-to-br from-primary/10 to-transparent blur-[150px] -z-10"></div>
    </div>
  );
};

export default WelcomeScreen;
