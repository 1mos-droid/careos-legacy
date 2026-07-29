import React from 'react';
import { Star, Clock, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import Button from './ui/Button';

const FRIENDLY_AVAILABILITY = {
  'Weekdays': 'Mon - Fri',
  'Weekends': 'Sat & Sun',
  '24/7': 'Any Day (24/7)',
};

export default function NurseCard({ nurse, onSelect, onBook }) {
  return (
    <motion.div layout className="h-full">
      <Card
        isPremium={true}
        isHoverable={true}
        isNeumorphic={true}
        className="flex flex-col h-full group text-left transition-all duration-300"
      >
        <div 
          className="p-6 cursor-pointer space-y-6 flex-grow text-left" 
          onClick={() => onSelect(nurse)}
        >
        {/* Top caregiver info */}
        <div className="flex gap-4 items-center">
          <div className="relative shrink-0">
            <img 
              src={nurse.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=250'} 
              alt={nurse.name} 
              className="w-14 h-14 rounded-xl object-cover border border-slate-100 shadow-sm"
            />
            <div className="absolute -bottom-1.5 -right-1.5 bg-emerald-500 text-white p-1 rounded-full border-2 border-white shadow-sm" title="License Checked">
              <ShieldCheck size={11} fill="currentColor" />
            </div>
          </div>
          
          <div className="min-w-0 space-y-1">
            <h3 className="text-base font-bold text-slate-800 truncate group-hover:text-brand-primary transition-colors duration-300">
              {nurse.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50/50 px-2 py-0.5 rounded border border-amber-100">
                <Star size={10} fill="currentColor" />
                <span className="font-semibold text-[10px]">{nurse.rating.toFixed(1)}</span>
              </div>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wide">Licensed Professional</span>
            </div>
          </div>
        </div>

        {/* Categories / Specialties */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {nurse.specialties.split(',').slice(0, 2).map((spec, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-semibold uppercase tracking-wide border border-slate-100">
                {spec.trim()}
              </span>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100/60">
            <div className="flex items-center gap-2 text-slate-500">
              <div className="h-8 w-8 rounded-lg bg-slate-50/80 flex items-center justify-center text-brand-primary shrink-0 border border-slate-100">
                <Award size={15} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Experience</span>
                <span className="text-xs font-bold text-slate-700">{nurse.experience_years} Years</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <div className="h-8 w-8 rounded-lg bg-slate-50/80 flex items-center justify-center text-brand-primary shrink-0 border border-slate-100">
                <Clock size={15} />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Availability</span>
                <span className="text-xs font-bold text-slate-700">{FRIENDLY_AVAILABILITY[nurse.availability] || nurse.availability}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Rate and Action Button */}
      <div className="px-6 pb-6 pt-3 border-t border-slate-100/60 mt-auto bg-slate-50/40">
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="text-[8px] font-semibold text-slate-400 uppercase tracking-wider">Care Rate</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-base font-bold text-slate-800">GH₵{nurse.hourly_rate}</span>
              <span className="text-[9px] font-semibold text-slate-400">/day</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            <Button 
              onClick={(e) => { e.stopPropagation(); onSelect(nurse); }}
              variant="outline"
              size="sm"
              className="!h-8 !w-8 !p-0 !rounded-lg"
              title="View Profile"
              rightIcon={ArrowRight}
            />
            <Button 
              onClick={(e) => { e.stopPropagation(); onBook(nurse); }}
              variant="primary"
              size="sm"
              className="!py-1.5 !px-3"
            >
              Book a Visit
            </Button>
          </div>
        </div>
      </div>
      </Card>
    </motion.div>
  );
}
