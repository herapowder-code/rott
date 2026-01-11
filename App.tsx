
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TrainingScreen from './screens/TrainingScreen';
import RoutinesScreen from './screens/RoutinesScreen';
import AIScreen from './screens/AIScreen';
import ProfileScreen from './screens/ProfileScreen';
import DietScreen from './screens/DietScreen';
import ProgressScreen from './screens/ProgressScreen';

const Layout: React.FC<{ children: React.ReactNode, hideNav?: boolean }> = ({ children, hideNav = false }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-x-hidden bg-background-dark border-x border-white/5 shadow-2xl">
      <div className="flex-1 pb-20">
        {children}
      </div>
      
      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md nav-blur border-t border-white/5 px-2 py-5 flex justify-between items-center z-50">
          <Link to="/dashboard" className={`flex flex-col items-center gap-1.5 flex-1 ${location.pathname === '/dashboard' ? 'text-primary' : 'text-white/30'}`}>
            <span className="material-symbols-outlined fill-1 text-2xl">home</span>
            <span className="text-[9px] font-black tracking-widest uppercase">Inicio</span>
          </Link>
          <Link to="/diet" className={`flex flex-col items-center gap-1.5 flex-1 ${location.pathname === '/diet' ? 'text-primary' : 'text-white/30'}`}>
            <span className="material-symbols-outlined text-2xl">restaurant</span>
            <span className="text-[9px] font-black tracking-widest uppercase">Dieta</span>
          </Link>
          <Link to="/training" className={`flex flex-col items-center gap-1.5 flex-1 ${location.pathname === '/training' ? 'text-primary' : 'text-white/30'}`}>
            <span className="material-symbols-outlined text-2xl">fitness_center</span>
            <span className="text-[9px] font-black tracking-widest uppercase">Entrenar</span>
          </Link>
          <Link to="/evolution-lab" className={`flex flex-col items-center gap-1.5 flex-1 ${location.pathname === '/evolution-lab' ? 'text-primary' : 'text-white/30'}`}>
            <span className="material-symbols-outlined text-2xl">science</span>
            <span className="text-[9px] font-black tracking-widest uppercase">Bio-Lab</span>
          </Link>
          <Link to="/profile" className={`flex flex-col items-center gap-1.5 flex-1 ${location.pathname === '/profile' ? 'text-primary' : 'text-white/30'}`}>
            <span className="material-symbols-outlined text-2xl">account_circle</span>
            <span className="text-[9px] font-black tracking-widest uppercase">Perfil</span>
          </Link>
        </nav>
      )}
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode, hideNav?: boolean }> = ({ children, hideNav }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  useEffect(() => {
    const auth = localStorage.getItem('rottweider_auth');
    setIsAuthenticated(!!auth);
  }, []);
  if (isAuthenticated === null) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout hideNav={hideNav}>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
        <Route path="/training" element={<ProtectedRoute hideNav><TrainingScreen /></ProtectedRoute>} />
        <Route path="/routines" element={<ProtectedRoute><RoutinesScreen /></ProtectedRoute>} />
        <Route path="/evolution-lab" element={<ProtectedRoute><AIScreen /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/diet" element={<ProtectedRoute><DietScreen /></ProtectedRoute>} />
        <Route path="/progress" element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />
      </Routes>
    </HashRouter>
  );
};

export default App;
