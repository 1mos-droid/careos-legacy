import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, LogOut, LayoutDashboard, Search, Menu, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);

  const navLinks = [
    { name: 'Directory', path: '/directory', icon: Search },
    user && { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ].filter(Boolean);

  return (
    <nav className="sticky top-0 z-[100] glass-nav">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-6 group">
          <div className="relative perspective-1000">
            <motion.div 
              whileHover={{ rotateY: 180, scale: 1.1 }}
              transition={{ duration: 0.8, ease: "anticipate" }}
              className="h-14 w-14 rounded-[22px] bg-brand-primary flex items-center justify-center text-white shadow-[0_20px_40px_-5px_rgba(13,148,136,0.4)] preserve-3d"
            >
              <Heart className="h-8 w-8 fill-current backface-hidden" />
              <div className="absolute inset-0 flex items-center justify-center rotateY-180 backface-hidden">
                <ShieldCheck className="h-8 w-8 fill-current" />
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col -space-y-2">
            <span className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">Careos<span className="text-brand-primary">.</span></span>
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-400 pl-1">Intelligence Fleet</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-16">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative group py-2"
            >
              <span className={`text-[13px] font-black uppercase tracking-[0.4em] transition-all duration-500 ${location.pathname === link.path ? 'text-brand-primary' : 'text-slate-500 group-hover:text-slate-950'}`}>
                {link.name}
              </span>
              <motion.div 
                layoutId="navUnderline"
                className={`absolute -bottom-2 left-0 h-[3px] bg-brand-primary transition-all duration-700 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`} 
              />
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="navGlow"
                  className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 bg-brand-primary/10 blur-xl rounded-full" 
                />
              )}
            </Link>
          ))}
          
          <div className="h-10 w-px bg-slate-200/50 mx-4" />

          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-5 pl-2 pr-6 py-2.5 rounded-[24px] bg-white border border-slate-100 group cursor-pointer hover:shadow-2xl hover:shadow-slate-200/60 transition-all duration-700">
                <div className="h-12 w-12 rounded-[18px] bg-brand-primary/10 flex items-center justify-center text-brand-primary text-sm font-black uppercase border border-brand-primary/10 group-hover:bg-brand-primary group-hover:text-white transition-all duration-700 group-hover:rotate-[15deg]">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-black text-slate-900 leading-none">{user.name.split(' ')[0]}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{user.role}</span>
                </div>
              </div>
              <button
                onClick={() => { onLogout(); navigate('/'); }}
                className="p-4 rounded-2xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-500 cursor-pointer border border-transparent hover:border-rose-100 group"
                title="Sign Out"
              >
                <LogOut className="h-7 w-7 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/auth?tab=login" className="text-[13px] font-black text-slate-500 hover:text-slate-950 transition-all uppercase tracking-[0.4em] px-4">Sign In</Link>
              <Link to="/auth?tab=register" className="btn-primary !py-5 !px-12 shadow-[0_30px_60px_-10px_rgba(13,148,136,0.4)] hover:scale-110 active:scale-90">Access Registry</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-xl text-slate-500 cursor-pointer">
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-100 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 text-lg font-black text-slate-900"
                >
                  <link.icon className="h-5 w-5 text-brand-primary" />
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100">
                {user ? (
                  <button
                    onClick={() => { onLogout(); navigate('/'); setIsOpen(false); }}
                    className="flex items-center gap-4 text-lg font-black text-rose-500 cursor-pointer"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                ) : (
                  <Link to="/auth?tab=login" onClick={() => setIsOpen(false)} className="btn-primary w-full block text-center">Get Started</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
