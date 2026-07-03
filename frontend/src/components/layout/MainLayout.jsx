import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle } from 'lucide-react';

export default function MainLayout() {
  const { errorMessage, successMessage, clearMessages } = useAuth();

  return (
    <div className="min-h-screen bg-surface-bg flex flex-col font-outfit selection:bg-primary/20">
      <div className="bg-glow-mesh-1" />
      <div className="bg-glow-mesh-2" />
      
      <Navbar />
      
      <main className="flex-grow relative z-10">
        <div className="fixed bottom-10 right-10 z-[200] flex flex-col gap-4 max-w-md">
          <AnimatePresence>
            {errorMessage && (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-l-4 border-red-500 shadow-2xl p-4 flex items-start gap-3 rounded-r-lg"
              >
                <ShieldCheck className="text-red-500 mt-1" size={20} />
                <div className="flex-1">
                  <h4 className="font-black text-text-primary text-sm uppercase tracking-widest">Error Occurred</h4>
                  <p className="text-text-secondary text-sm mt-1">{errorMessage}</p>
                </div>
                <button onClick={clearMessages} className="text-text-light hover:text-text-primary transition-colors">
                  <CheckCircle size={18} />
                </button>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border-l-4 border-primary shadow-2xl p-4 flex items-start gap-3 rounded-r-lg"
              >
                <CheckCircle className="text-primary mt-1" size={20} />
                <div className="flex-1">
                  <h4 className="font-black text-text-primary text-sm uppercase tracking-widest">Success</h4>
                  <p className="text-text-secondary text-sm mt-1">{successMessage}</p>
                </div>
                <button onClick={clearMessages} className="text-text-light hover:text-text-primary transition-colors">
                  <CheckCircle size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Outlet />
      </main>

      <footer className="bg-white border-t border-border py-12 px-6 lg:px-20 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-primary tracking-tighter">
            <span>Careos</span>
            <span className="text-secondary">.</span>
          </div>
          <p className="text-text-light text-sm font-medium">
            © 2026 Careos Local Registry. All rights reserved. 
            <span className="ml-4 px-2 py-0.5 bg-slate-100 rounded text-[0.65rem] uppercase font-black tracking-widest">Sandbox Mode</span>
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-text-light hover:text-primary transition-colors text-sm font-bold">Privacy</a>
            <a href="#" className="text-text-light hover:text-primary transition-colors text-sm font-bold">Terms</a>
            <a href="#" className="text-text-light hover:text-primary transition-colors text-sm font-bold">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
