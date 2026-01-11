
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzeImage } from '../services/geminiService';
import { PlannedExercise, SeriesLog, TrainingSession } from '../types';

const TrainingScreen: React.FC = () => {
  const navigate = useNavigate();
  
  const [activeRoutine, setActiveRoutine] = useState<PlannedExercise[]>([]);
  const [routineName, setRoutineName] = useState('Protocolo de Ejecución');
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');
  const [completedSeries, setCompletedSeries] = useState<Record<number, SeriesLog[]>>({});
  
  // Estados de tiempo
  const [sessionDuration, setSessionDuration] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const restTimerRef = useRef<number | null>(null);
  const sessionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('rottweider_active_routine');
    const name = localStorage.getItem('rottweider_active_routine_name');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setActiveRoutine(parsed);
        // Iniciar cronómetro de sesión al cargar la rutina
        sessionTimerRef.current = window.setInterval(() => {
          setSessionDuration(prev => prev + 1);
        }, 1000);
      }
    }
    if (name) setRoutineName(name);

    return () => {
      if (sessionTimerRef.current) window.clearInterval(sessionTimerRef.current);
      if (restTimerRef.current) window.clearInterval(restTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isTimerActive && restTime > 0) {
      restTimerRef.current = window.setInterval(() => {
        setRestTime(prev => prev - 1);
      }, 1000);
    } else if (restTime === 0) {
      setIsTimerActive(false);
      if (restTimerRef.current) window.clearInterval(restTimerRef.current);
    }
    return () => { if (restTimerRef.current) window.clearInterval(restTimerRef.current); };
  }, [isTimerActive, restTime]);

  const currentExercise = activeRoutine[currentIdx];

  const handleRegisterSeries = () => {
    if (!weight || !reps) {
      alert("Por favor, ingrese la carga y repeticiones efectuadas.");
      return;
    }

    const newLog: SeriesLog = {
      weight: parseFloat(weight),
      reps: parseInt(reps),
      timestamp: Date.now()
    };

    setCompletedSeries(prev => {
      const exerciseLogs = prev[currentIdx] || [];
      return { ...prev, [currentIdx]: [...exerciseLogs, newLog] };
    });

    setWeight('');
    setReps('');
    setRestTime(90);
    setIsTimerActive(true);
  };

  const finishSession = () => {
    const finalDuration = Math.round(sessionDuration / 60);
    const session: TrainingSession = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('es-CL'),
      durationMinutes: finalDuration,
      routineName: routineName,
      exerciseCount: activeRoutine.length
    };

    const history = JSON.parse(localStorage.getItem('rottweider_training_history') || '[]');
    localStorage.setItem('rottweider_training_history', JSON.stringify([session, ...history]));
    
    navigate('/dashboard');
  };

  const toggleCamera = async () => {
    if (isCameraOpen) {
      const stream = cameraVideoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      setIsCameraOpen(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (cameraVideoRef.current) cameraVideoRef.current.srcObject = stream;
        setIsCameraOpen(true);
      } catch (err) { alert("Dispositivo de captura no disponible."); }
    }
  };

  const handleAnalyzeForm = async () => {
    if (!cameraVideoRef.current || !canvasRef.current || !currentExercise) return;
    setIsAnalyzing(true);
    const canvas = canvasRef.current;
    const video = cameraVideoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
    try {
      const result = await analyzeImage(base64Data, 'image/jpeg', `Analice mi técnica en el ejercicio: ${currentExercise.name}. Entregue retroalimentación formal.`);
      setAiFeedback(result);
    } catch (e) { setAiFeedback("Error de comunicación con el núcleo IA."); }
    finally { setIsAnalyzing(false); }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!currentExercise) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-8 text-center space-y-8">
        <header className="fixed top-0 left-0 w-full p-4 border-b border-white/5">
           <button onClick={() => navigate('/dashboard')} className="text-slate-400 absolute left-4 top-4"><span className="material-symbols-outlined">arrow_back_ios_new</span></button>
           <h1 className="text-white font-black uppercase text-sm tracking-widest italic">Sesión de Entrenamiento</h1>
        </header>
        <div className="relative">
           <div className="size-32 rounded-full border-2 border-primary/20 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-6xl text-primary/30">fitness_center</span>
           </div>
        </div>
        <div className="space-y-3">
          <h2 className="text-white text-xl font-black italic uppercase tracking-tighter">Protocolo no Iniciado</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">Debe seleccionar un protocolo de su plan semanal.</p>
        </div>
        <button onClick={() => navigate('/routines')} className="gold-gradient px-10 py-5 rounded-2xl text-black font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl active:scale-95 transition-all">Ir a Protocolos</button>
      </div>
    );
  }

  const currentLogs = completedSeries[currentIdx] || [];

  return (
    <div className="min-h-screen flex flex-col pb-10 bg-background-dark">
      <header className="flex items-center bg-background-dark/95 p-4 justify-between sticky top-0 z-50 border-b border-white/5 backdrop-blur-md">
        <button onClick={() => navigate('/dashboard')} className="text-primary active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-2xl font-bold">close</span>
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-white text-base font-black leading-tight uppercase truncate px-4">{currentExercise.name}</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="text-primary text-[9px] font-black uppercase tracking-widest">Región: {currentExercise.muscle}</span>
            <span className="text-white/20 text-[9px] font-black uppercase tracking-widest">•</span>
            <span className={`text-[9px] font-black uppercase tracking-widest ${sessionDuration > 5400 ? 'text-red-500 animate-pulse' : 'text-white/40'}`}>
              Tiempo: {formatTime(sessionDuration)}
            </span>
          </div>
        </div>
        <div className="size-10 rounded-full border-2 border-primary/20 flex items-center justify-center font-black text-[10px] text-primary">
          {currentIdx + 1}/{activeRoutine.length}
        </div>
      </header>

      <section className="px-4 pt-4 relative">
        <div className="relative rounded-[2.5rem] overflow-hidden aspect-video border border-white/10 glass-card">
          <video ref={videoRef} className="w-full h-full object-cover opacity-80" src={currentExercise.videoUrl} autoPlay loop muted playsInline />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="bg-black/60 backdrop-blur-md border border-primary/30 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-xs">timer</span>
              <span className="text-[10px] font-black uppercase text-white">Cadencia: {currentExercise.tempo || '3-1-1-0'}</span>
            </div>
          </div>
          <button onClick={toggleCamera} className="absolute bottom-4 right-4 size-12 bg-primary text-black rounded-2xl flex items-center justify-center shadow-2xl active:scale-90 transition-all">
             <span className="material-symbols-outlined text-2xl">{isCameraOpen ? 'videocam_off' : 'videocam'}</span>
          </button>
        </div>
      </section>

      <canvas ref={canvasRef} className="hidden" />

      <main className="flex-1 px-4 py-6 space-y-6 overflow-y-auto no-scrollbar">
        {restTime > 0 && (
          <div className="glass-card rounded-3xl p-6 border-primary/30 flex items-center justify-between animate-in zoom-in-95">
            <div className="flex items-center gap-4">
               <div className="size-12 rounded-full border-2 border-primary/20 flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-primary">hourglass_empty</span>
               </div>
               <div>
                  <p className="text-[9px] font-black text-white/30 uppercase tracking-widest">Recuperación</p>
                  <p className="text-2xl font-black text-white tabular-nums">00:{restTime < 10 ? `0${restTime}` : restTime}</p>
               </div>
            </div>
            <button onClick={() => setRestTime(0)} className="bg-white/5 text-white/40 text-[9px] font-black uppercase px-4 py-2 rounded-xl border border-white/5">Omitir</button>
          </div>
        )}

        <div className="rounded-[2.5rem] bg-surface-dark border border-white/5 p-8 shadow-2xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h3 className="text-white text-3xl font-black tracking-tighter uppercase italic">Serie {currentLogs.length + 1}</h3>
              <p className="text-primary/60 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Prescripción: {currentExercise.sets} series</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-8">
            <div className="space-y-3">
              <p className="text-white/30 text-[9px] font-black uppercase tracking-widest text-center">Carga (kg)</p>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="0" className="w-full rounded-2xl text-white border-none bg-background-dark/80 h-20 text-4xl font-black text-center focus:ring-1 focus:ring-primary shadow-inner" />
            </div>
            <div className="space-y-3">
              <p className="text-white/30 text-[9px] font-black uppercase tracking-widest text-center">Reps</p>
              <input type="number" value={reps} onChange={(e) => setReps(e.target.value)} placeholder="0" className="w-full rounded-2xl text-white border-none bg-background-dark/80 h-20 text-4xl font-black text-center focus:ring-1 focus:ring-primary shadow-inner" />
            </div>
          </div>

          <button onClick={handleRegisterSeries} className="w-full h-16 bg-primary text-black font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
            Registrar Ejecución <span className="material-symbols-outlined font-black">add_task</span>
          </button>
        </div>
      </main>

      <footer className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md p-6 bg-background-dark/80 backdrop-blur-2xl border-t border-white/5 z-40 flex gap-4">
        <button onClick={() => currentIdx > 0 && setCurrentIdx(currentIdx - 1)} disabled={currentIdx === 0} className="flex-1 h-14 bg-white/5 rounded-2xl text-white/40 font-black uppercase text-[10px] tracking-widest disabled:opacity-10 border border-white/5">Anterior</button>
        <button 
          onClick={() => {
            if (currentIdx < activeRoutine.length - 1) {
              setCurrentIdx(currentIdx + 1);
              setWeight(''); setReps('');
            } else {
              finishSession();
            }
          }}
          className="flex-1 h-14 gold-gradient rounded-2xl text-black font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-[0.98] transition-all"
        >
          {currentIdx === activeRoutine.length - 1 ? 'Finalizar Sesión' : 'Siguiente Ejercicio'}
        </button>
      </footer>
    </div>
  );
};

export default TrainingScreen;
