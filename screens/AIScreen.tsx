
import React, { useState, useRef } from 'react';
import { analyzeMedicalExam, getGeminiChatResponse } from '../services/geminiService';

const AIScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'lab'>('chat');
  const [chatMessages, setChatMessages] = useState<{ role: string, content: string }[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [labResult, setLabResult] = useState<string | null>(null);
  const [updateNotification, setUpdateNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;
    const msg = userInput;
    setUserInput('');
    setChatMessages(prev => [...prev, { role: 'user', content: msg }]);
    setIsLoading(true);
    setUpdateNotification(null);

    try {
      const result = await getGeminiChatResponse(msg, chatMessages);
      
      // Manejo de Function Calling
      if (result.functionCalls && result.functionCalls.length > 0) {
        for (const fc of result.functionCalls) {
          if (fc.name === 'actualizarProtocoloNutricional') {
            const nuevoPlan = (fc.args as any).nuevoPlan;
            localStorage.setItem('rottweider_diet_plan', JSON.stringify(nuevoPlan));
            setUpdateNotification("SISTEMA: Protocolo nutricional actualizado con éxito según sus requerimientos económicos.");
          }
        }
      }

      const assistantText = result.text || 'He procesado su solicitud. Por favor, verifique los ajustes en su panel de dieta.';
      setChatMessages(prev => [...prev, { role: 'assistant', content: assistantText }]);
      
    } catch (e) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Se ha detectado una anomalía en la sincronización con el núcleo biométrico. Por favor, reintente.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLabUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      try {
        const result = await analyzeMedicalExam(base64Data, file.type);
        setLabResult(result);
        localStorage.setItem('rottweider_medical_summary', result);
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Análisis clínico ejecutado. Los biomarcadores han sido integrados. ¿Desea realizar algún ajuste en su dieta basado en su presupuesto?' }]);
      } catch (e) {
        alert("Error en el procesamiento del informe médico.");
      } finally {
        setIsLoading(false);
      }
    };
  };

  return (
    <div className="pb-24 min-h-screen bg-background-dark">
      <header className="p-4 border-b border-white/5 flex flex-col items-center">
        <h1 className="text-white font-black text-sm uppercase tracking-[0.3em] mb-4 italic">Unidad de Inteligencia</h1>
        <div className="flex w-full bg-white/5 rounded-2xl p-1 gap-1">
          <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'bg-primary text-black' : 'text-white/30'}`}>Intercomunicador</button>
          <button onClick={() => setActiveTab('lab')} className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'lab' ? 'bg-primary text-black' : 'text-white/30'}`}>Laboratorio</button>
        </div>
      </header>

      <main className="p-4">
        {activeTab === 'chat' ? (
          <div className="flex flex-col h-[65vh]">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-3 mb-4">
               <p className="text-primary text-[8px] font-black uppercase tracking-widest leading-relaxed">
                 Aviso: El Director de Bio-Rendimiento puede modificar su dieta actual si usted informa falta de presupuesto o stock de algún ingrediente.
               </p>
            </div>

            {updateNotification && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 mb-4 animate-in slide-in-from-top-2">
                <p className="text-green-500 text-[8px] font-black uppercase tracking-widest text-center">
                  {updateNotification}
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar pb-4">
              <div className="flex justify-start">
                <div className="max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed italic bg-surface-dark border border-white/5 text-white/80">
                  Saludos. Soy su Director de Bio-Rendimiento. Si algún alimento del protocolo excede su presupuesto, solicite una sustitución formal ahora.
                </div>
              </div>
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-[11px] leading-relaxed italic ${m.role === 'user' ? 'bg-primary text-black font-black shadow-lg shadow-primary/10' : 'bg-surface-dark border border-white/5 text-white/80'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-primary text-[9px] font-black animate-pulse px-2 uppercase tracking-widest">Sincronizando con base de datos nutricional...</div>}
            </div>

            <div className="flex gap-2">
              <input 
                value={userInput} 
                onChange={e => setUserInput(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()} 
                className="flex-1 bg-surface-dark border border-white/5 h-14 rounded-2xl px-4 text-white text-xs outline-none focus:ring-1 focus:ring-primary" 
                placeholder="Ej: No tengo dinero para salmón, cámbialo..." 
              />
              <button onClick={handleSendMessage} className="bg-primary text-black size-14 rounded-2xl flex items-center justify-center active:scale-95 transition-all shadow-lg shadow-primary/10">
                <span className="material-symbols-outlined font-black">send</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="glass-card p-10 rounded-[2.5rem] border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary/40 transition-all" onClick={() => fileInputRef.current?.click()}>
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*,application/pdf" onChange={handleLabUpload} />
              <span className="material-symbols-outlined text-5xl text-white/20 mb-4">clinical_notes</span>
              <p className="text-white text-xs font-black uppercase tracking-widest">Sincronización de Informes</p>
              <p className="text-white/20 text-[9px] font-bold mt-2 uppercase">Integrar biomarcadores clínicos al protocolo</p>
            </div>

            {labResult && (
              <div className="glass-card p-6 rounded-2xl border-primary/20 animate-in fade-in slide-in-from-top-4">
                 <div className="flex items-center gap-2 mb-3">
                    <span className="material-symbols-outlined text-primary text-sm">verified</span>
                    <h3 className="text-primary text-[10px] font-black uppercase tracking-widest italic">Informe de Biomarcadores</h3>
                 </div>
                 <p className="text-white/80 text-[11px] leading-relaxed italic whitespace-pre-wrap">{labResult}</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AIScreen;
