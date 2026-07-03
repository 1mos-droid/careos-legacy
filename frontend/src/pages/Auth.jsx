import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Heart, User, KeyRound, Mail, ChevronRight, Lock, Sparkles, ArrowLeft, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, register, isSubmitting } = useAuth();

  const tabParam = searchParams.get('tab') || 'login';
  const roleParam = searchParams.get('role') || 'family';

  const [activeTab, setActiveTab] = useState(tabParam);
  const [role, setRole] = useState(roleParam);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    setActiveTab(tabParam);
    setRole(roleParam);
  }, [tabParam, roleParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let user;
    if (activeTab === 'login') {
      user = await login(email, password);
    } else {
      user = await register(name, email, password, role, phone, location);
    }
    if (user) {
      setTimeout(() => {
        // Redirect all roles straight to `/dashboard` which handles role-based rendering
        navigate('/dashboard');
      }, 800);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-brand-bg px-6 py-12">
      <div className="absolute top-0 left-0 p-8 lg:p-12">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 group-hover:scale-110 transition-transform">
            <Heart className="h-5 w-5 fill-current" />
          </div>
          <span className="text-xl font-black text-slate-900 tracking-tight">CareOS<span className="text-brand-primary">.</span></span>
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg glass-card rounded-[40px] p-8 lg:p-12 shadow-2xl relative overflow-hidden text-left mt-8">
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-primary/10 text-brand-primary mb-2">
            <Sparkles className="h-6 w-6 animate-pulse" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">{activeTab === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-slate-500 font-medium">{activeTab === 'login' ? 'Access your care dashboard' : 'Join our professional elder care registry'}</p>
        </div>

        <div className="flex border-b border-slate-100 mb-8">
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => navigate(`/auth?tab=${t}`)}
              className={`flex-1 pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative cursor-pointer ${activeTab === t ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t === 'login' ? 'Sign In' : 'Sign Up'}
              {activeTab === t && <motion.div layoutId="authTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            {activeTab === 'register' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                  {['family', 'nurse'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer ${role === r ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                      {r === 'family' ? 'Family / Client' : 'Professional Nurse'}
                    </button>
                  ))}
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="input-field pl-12 py-2.5 text-sm" placeholder="Kwame Mensah" />
                  </div>
                </div>

                 <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="input-field pl-12 py-2.5 text-sm" placeholder="+233-24-000-0000" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Address / Sector Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="text" required value={location} onChange={e => setLocation(e.target.value)} className="input-field pl-12 py-2.5 text-sm" placeholder="House No. 12, Cantonments, Accra" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="input-field pl-12 py-2.5 text-sm" placeholder="you@example.com" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="input-field pl-12 py-2.5 text-sm" placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 mt-6 shadow-xl shadow-brand-primary/20 cursor-pointer">
            {isSubmitting ? 'Processing...' : activeTab === 'login' ? 'Sign In' : 'Create CareOS Account'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
