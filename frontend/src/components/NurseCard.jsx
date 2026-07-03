import React from 'react';
import { Star, Clock, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NurseCard({ nurse, onSelect, onBook }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -16, rotateX: 4, rotateY: -4, scale: 1.04 }}
      className="glass-card-premium rounded-[50px] overflow-hidden flex flex-col h-full group border-white/80 shadow-[0_40px_80px_-20px_rgba(15,23,42,0.15)] perspective-1000"
    >
      <div 
        className="p-10 cursor-pointer space-y-8 relative preserve-3d" 
        onClick={() => onSelect(nurse)}
      >
        {/* Organic Hover Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/5 via-transparent to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        <div className="flex gap-8 items-center relative z-10">
          <div className="relative group/avatar">
            <div className="absolute -inset-2 bg-gradient-to-tr from-brand-primary to-blue-500 rounded-[30px] blur-xl opacity-0 group-hover/avatar:opacity-40 transition-all duration-700 scale-90 group-hover/avatar:scale-110" />
            <img 
              src={nurse.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250'} 
              alt={nurse.name} 
              className="relative w-28 h-28 rounded-[25px] object-cover border-4 border-white shadow-2xl"
            />
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-2 rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.4)] border-4 border-white"
            >
              <ShieldCheck size={18} fill="currentColor" />
            </motion.div>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <h3 className="text-3xl font-black text-slate-900 truncate font-display tracking-tighter group-hover:text-brand-primary transition-colors duration-500">{nurse.name}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                <Star size={14} fill="currentColor" />
                <span className="font-black text-xs">{nurse.rating.toFixed(1)}</span>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Clinical Elite</span>
            </div>
          </div>
        </div>

        <div className="space-y-5 relative z-10">
          <div className="flex flex-wrap gap-3">
            {nurse.specialties.split(',').slice(0, 3).map((spec, i) => (
              <span key={i} className="px-5 py-2 bg-white/60 backdrop-blur-md text-slate-700 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white shadow-sm group-hover:border-brand-primary/30 group-hover:text-brand-primary transition-all duration-500">
                {spec.trim()}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100/50">
            <div className="flex items-center gap-3 text-slate-500">
              <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary shadow-inner">
                <Award size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Experience</span>
                <span className="text-sm font-black text-slate-900">{nurse.experience_years} Years</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-brand-primary shadow-inner">
                <Clock size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Availability</span>
                <span className="text-sm font-black text-slate-900">{nurse.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto px-10 pb-10 pt-4 relative z-10">
        <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Institutional Rate</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-black text-slate-900 tracking-tighter">GH₵{nurse.hourly_rate}</span>
              <span className="text-[11px] font-black text-slate-400 uppercase">/Session</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); onSelect(nurse); }}
              className="h-14 w-14 rounded-[22px] border-2 border-slate-100 text-slate-400 hover:text-brand-primary hover:border-brand-primary hover:bg-brand-primary/5 transition-all flex items-center justify-center group/btn shadow-sm"
            >
              <ArrowRight className="h-6 w-6 group-hover/btn:translate-x-2 transition-transform duration-500" />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onBook(nurse); }}
              className="btn-primary !py-4 !px-10 shadow-[0_25px_50px_-12px_rgba(13,148,136,0.4)] hover:scale-105 active:scale-95"
            >
              Secure Care
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
