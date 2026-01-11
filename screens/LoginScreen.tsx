
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (memberId.trim() && password.trim()) {
      localStorage.setItem('rottweider_auth', JSON.stringify({ memberId, timestamp: new Date().getTime() }));
      navigate('/dashboard');
    } else {
      setError('Por favor, ingrese sus credenciales de acceso.');
    }
  };

  return (
    <div className="bg-background-dark min-h-screen flex flex-col items-center justify-center p-6 max-w-md mx-auto relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-48 h-48 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
      
      <div className="w-full relative z-10 flex flex-col items-center">
        <div className="size-24 gold-gradient rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(234,164,19,0.2)] mb-8 transform rotate-3">
          <span className="material-symbols-outlined text-black text-5xl font-black">shield_person</span>
        </div>
        
        <h1 className="text-white text-3xl font-black tracking-tight uppercase italic mb-2 text-center">Protocolo de Acceso</h1>
        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-12">Autenticación de Usuario</p>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-2">
            <label className="text-white/30 text-[9px] font-black uppercase tracking-widest ml-1">RUT o ID de Usuario</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">badge</span>
              <input 
                type="text" 
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                placeholder="12.345.678-9"
                className="w-full h-14 bg-surface-dark border-white/5 rounded-2xl pl-12 pr-4 text-white font-bold outline-none focus:ring-1 focus:ring-primary/50 transition-all border group-focus-within:border-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/30 text-[9px] font-black uppercase tracking-widest ml-1">Clave de Seguridad</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors">lock</span>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 bg-surface-dark border-white/5 rounded-2xl pl-12 pr-4 text-white font-bold outline-none focus:ring-1 focus:ring-primary/50 transition-all border group-focus-within:border-primary/20"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-center animate-pulse">{error}</p>}

          <button 
            type="submit"
            className="w-full h-16 gold-gradient rounded-2xl text-black font-black uppercase tracking-[0.2em] shadow-2xl active:scale-[0.97] transition-all flex items-center justify-center gap-3 mt-4"
          >
            Sincronizar Datos
            <span className="material-symbols-outlined font-black">fingerprint</span>
          </button>
        </form>

        <button className="mt-8 text-white/20 text-[10px] font-bold uppercase tracking-widest hover:text-white/40 transition-colors">
          ¿Problemas con su acceso? Contacte a soporte
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
