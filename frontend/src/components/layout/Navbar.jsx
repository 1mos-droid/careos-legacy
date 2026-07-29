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
    <nav className="sticky top-0 z-[100] bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-sm">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
              Careos<span className="text-brand-primary">.</span>
            </span>
            <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
              Care Registry
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="relative py-1.5"
            >
              <span className={`text-xs font-semibold tracking-wide transition-colors ${location.pathname === link.path ? 'text-brand-primary' : 'text-slate-500 hover:text-slate-900'}`}>
                {link.name}
              </span>
              {location.pathname === link.path && (
                <motion.div 
                  layoutId="navUnderline"
                  className="absolute -bottom-1.5 left-0 right-0 h-0.5 bg-brand-primary rounded-full" 
                />
              )}
            </Link>
          ))}
          
          <div className="h-6 w-px bg-slate-200" />

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 pl-1.5 pr-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100/60 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 leading-none">{user.name.split(' ')[0]}</span>
                  <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider mt-1">{user.role}</span>
                </div>
              </div>
              <button
                onClick={() => { onLogout(); navigate('/'); }}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer border border-transparent"
                title="Sign Out"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/auth?tab=login" className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Sign In</Link>
              <Link to="/directory" className="btn-primary !py-2 !px-4 text-xs">Browse Registry</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-slate-500 cursor-pointer">
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
            <div className="p-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <link.icon className="h-4.5 w-4.5 text-brand-primary" />
                  <span>{link.name}</span>
                </Link>
              ))}
              <div className="pt-3 border-t border-slate-100">
                {user ? (
                  <button
                    onClick={() => { onLogout(); navigate('/'); setIsOpen(false); }}
                    className="w-full flex items-center gap-3 py-2 px-3 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-50 cursor-pointer"
                  >
                    <LogOut className="h-4.5 w-4.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <Link to="/auth?tab=login" onClick={() => setIsOpen(false)} className="btn-glass text-center py-2 px-4 text-xs">Sign In</Link>
                    <Link to="/directory" onClick={() => setIsOpen(false)} className="btn-primary text-center py-2 px-4 text-xs">Browse</Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
