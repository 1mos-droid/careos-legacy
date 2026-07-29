import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Directory from './pages/Directory';
import NurseProfile from './pages/NurseProfile';
import BookingPage from './pages/BookingPage';
import Dashboard from './pages/Dashboard';
import Legal from './pages/Legal';
// ponytail: Unused AdminDashboard import removed (dashboard sub-routes are handled dynamically within Dashboard.jsx).
import { AuthProvider, useAuth } from './context/AuthContext';

// 1. Establish unified global Toast Context
export const ToastContext = createContext(null);

export function useToast() {
  return useContext(ToastContext);
}

function AppContent() {
  const { user, token, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-brand-bg gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-primary border-t-transparent"></div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Careos</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-between relative overflow-x-hidden">
      <Navbar user={user} onLogout={logout} />

      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/profile/:id" element={<NurseProfile />} />
          <Route path="/booking/:id" element={<BookingPage token={token} />} />
          <Route path="/legal" element={<Legal />} />
          <Route 
            path="/dashboard" 
            element={token ? <Dashboard token={token} user={user} /> : <Navigate to="/auth?tab=login" />} 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="py-12 border-t border-slate-200 bg-white/80 backdrop-blur-md text-center relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-lg font-black text-slate-900">
            <span>Careos</span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"></span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            © {new Date().getFullYear()} Careos Private Local Registry. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/legal" className="text-xs font-semibold text-slate-400 hover:text-brand-primary transition-colors">Privacy</Link>
            <Link to="/legal" className="text-xs font-semibold text-slate-400 hover:text-brand-primary transition-colors">Terms</Link>
            <Link to="/legal" className="text-xs font-semibold text-slate-400 hover:text-brand-primary transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [toasts, setToasts] = useState([]);

  // Toast dispatch logic
  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <AuthProvider showToast={showToast}>
        <BrowserRouter>
          <AppContent />
          
          {/* GLOBAL FLOATING TOASTS DISPLAY CONTAINER */}
          <div className="fixed top-24 right-6 z-[300] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
            {toasts.map((t) => (
              <div
                key={t.id}
                className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl glass-card animate-toast-slide shadow-2xl border-l-4 ${
                  t.type === 'success' 
                    ? 'border-l-brand-primary' 
                    : t.type === 'error' 
                    ? 'border-l-rose-500' 
                    : 'border-l-blue-500'
                }`}
              >
                {t.type === 'success' && <CheckCircle className="h-5 w-5 text-brand-primary shrink-0 mt-0.5" />}
                {t.type === 'error' && <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />}
                {t.type === 'info' && <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />}
                
                <div className="flex-grow text-left">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-widest leading-tight">
                    {t.type === 'success' ? 'Success' : t.type === 'error' ? 'Notice' : 'Alert'}
                  </p>
                  <p className="text-xs font-medium text-slate-500 mt-1">{t.message}</p>
                </div>
                
                <button
                  onClick={() => dismissToast(t.id)}
                  className="p-1 rounded-lg text-slate-300 hover:text-slate-900 transition-all shrink-0 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastContext.Provider>
  );
}
