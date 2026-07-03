import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, Heart, ArrowRight, Sparkles, Star, Calendar, 
  Users, Award, Clock, Banknote, ShieldAlert, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Landing() {
  const navigate = useNavigate();

  // Interactive Booking Simulator State
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Nurse Selected, 2: Schedule Selected, 3: Confirmed
  const [simNurse, setSimNurse] = useState('Sarah Jenkins, RN');
  const [simRate, setSimRate] = useState(45);
  const [simDays, setSimDays] = useState(5);

  const getSimStageTitle = () => {
    switch (simStep) {
      case 0: return 'Care Registry Simulator';
      case 1: return 'Step 1: Caregiver Profile Inspected';
      case 2: return 'Step 2: Care Schedule Defined';
      case 3: return 'Step 3: Care Request Reserved';
      default: return 'Registry Idle';
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-brand-bg text-left">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="blob bg-brand-primary/10 w-[800px] h-[800px] -top-96 -left-96" 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="blob bg-amber-500/10 w-[600px] h-[600px] top-1/2 -right-48" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Column: Heading & Value Prop */}
            <div className="lg:col-span-7 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-teal-200/50 bg-teal-50 text-brand-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-sm"
              >
                <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                CareOS Professional Nurse Registry
              </motion.div>
              
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-5xl lg:text-7xl font-black text-slate-900 leading-tight tracking-tight"
                >
                  Compassionate Care.<br />
                  <span className="text-gradient">In-Home Peace.</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl border-l-4 border-brand-primary/25 pl-6"
                >
                  We believe that finding exceptional care should bring reassurance, not worry. Careos connects your family with board-verified, dedicated professional nurses who bring clinical expertise and gentle companionship directly to your home.
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4 pt-2"
              >
                <button 
                  onClick={() => navigate('/directory')}
                  className="btn-primary !py-4 !px-8 text-sm flex items-center gap-3 group cursor-pointer"
                >
                  Find a Nurse
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </button>
                <button 
                  onClick={() => navigate('/auth?tab=register&role=nurse')}
                  className="btn-glass !py-4 !px-8 text-sm cursor-pointer"
                >
                  Join as a Nurse
                </button>
              </motion.div>

              {/* Quick Metrics */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/50"
              >
                {[
                  { value: '100%', label: 'Verified Licensure', icon: ShieldCheck },
                  { value: '4.9★', label: 'Average Care Rating', icon: Star },
                  { value: '< 2hr', label: 'Match Confirmation', icon: Clock }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-primary font-black">
                      <stat.icon className="h-4 w-4" />
                      <span className="text-xl font-display">{stat.value}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
            
            {/* Right Column: Interactive Booking Simulator */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-brand-primary/5 blur-3xl rounded-full scale-95" />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="glass-card rounded-[40px] border-slate-200/60 p-6 lg:p-8 shadow-2xl relative z-10 w-full overflow-hidden text-left"
              >
                {/* Simulator Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                      {getSimStageTitle()}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((step) => (
                      <div 
                        key={step} 
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-500 ${simStep === step ? 'w-4 bg-brand-primary' : 'bg-slate-200'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Simulator Screen Content */}
                <div className="min-h-[260px] flex flex-col justify-between">
                  <AnimatePresence mode="wait">
                    {simStep === 0 && (
                      <motion.div 
                        key="step0"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <h4 className="text-lg font-black text-slate-900 tracking-tight">Need In-Home Support?</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Test the simplified booking workflow to see how easy it is to schedule a verified caregiver.
                        </p>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-700">
                            <span>Specialty Focus:</span>
                            <span className="font-bold text-brand-primary bg-brand-primary/10 px-3 py-0.5 rounded-full">Dementia & Elder Care</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-700">
                            <span>Clinical Credentials:</span>
                            <span className="font-bold text-slate-800">RN (Registered Nurse)</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setSimStep(1)}
                          className="btn-primary w-full !py-3.5 !px-4 text-xs flex items-center justify-center gap-2"
                        >
                          Select Provider <ArrowRight className="h-4.5 w-4.5" />
                        </button>
                      </motion.div>
                    )}

                    {simStep === 1 && (
                      <motion.div 
                        key="step1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary text-lg font-black">SJ</div>
                          <div className="text-left">
                            <h5 className="text-sm font-black text-slate-900">{simNurse}</h5>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Verified Registered Nurse</p>
                          </div>
                          <div className="ml-auto flex items-center gap-1 text-xs font-black text-amber-500">
                            <Star className="h-4.5 w-4.5 fill-current" /> 4.9
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          "Dedicated caregiver specializing in elder health management, rehabilitation tracking, and medication schedules."
                        </p>
                        <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">Hourly Registry Rate:</span>
                          <span className="font-black text-slate-800">${simRate}/hr</span>
                        </div>
                        <button 
                          onClick={() => setSimStep(2)}
                          className="btn-primary w-full !py-3.5 !px-4 text-xs flex items-center justify-center gap-2"
                        >
                          Set Care Schedule <ArrowRight className="h-4.5 w-4.5" />
                        </button>
                      </motion.div>
                    )}

                    {simStep === 2 && (
                      <motion.div 
                        key="step2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4"
                      >
                        <h4 className="text-sm font-black text-slate-900 tracking-tight">Configure Duration</h4>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Number of Days</label>
                          <div className="flex gap-2">
                            {[3, 5, 7].map((d) => (
                              <button
                                key={d}
                                onClick={() => setSimDays(d)}
                                className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${simDays === d ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-100 text-slate-400 hover:text-slate-600'}`}
                              >
                                {d} Days
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                          <div className="flex justify-between text-slate-500">
                            <span>Base Rate (8hrs/day):</span>
                            <span>${simRate}/hr</span>
                          </div>
                          <div className="flex justify-between text-slate-800 font-black border-t border-slate-200/50 pt-2 text-sm">
                            <span>Total Price ({simDays} days):</span>
                            <span className="text-brand-primary">${simRate * 8 * simDays}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setSimStep(1)} className="btn-glass !py-3.5 !px-4 text-xs">Back</button>
                          <button 
                            onClick={() => setSimStep(3)}
                            className="btn-primary flex-1 !py-3.5 !px-4 text-xs flex items-center justify-center gap-2"
                          >
                            Reserve Care <ArrowRight className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {simStep === 3 && (
                      <motion.div 
                        key="step3"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="text-center space-y-4 py-4"
                      >
                        <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-100 animate-bounce">
                          <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <h4 className="text-lg font-black text-slate-900">Request Dispatched!</h4>
                        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                          Care request has been logged. {simNurse} will review the schedule requirements and accept.
                        </p>
                        <div className="flex gap-2 justify-center pt-2">
                          <button 
                            onClick={() => { setSimStep(0); setSimDays(5); }}
                            className="btn-glass !py-3 !px-6 text-xs cursor-pointer"
                          >
                            Reset Demo
                          </button>
                          <button 
                            onClick={() => navigate('/directory')}
                            className="btn-primary !py-3 !px-6 text-xs cursor-pointer flex items-center gap-2"
                          >
                            Browse Real Registry <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-slate-100 bg-white/40 backdrop-blur-sm relative z-10 px-6">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Supporting Your Family With <span className="text-gradient">Care & Comfort</span></h2>
            <p className="text-slate-500 font-medium">Every professional nurse undergoes licensing checks to guarantee absolute safety and reassurance for your loved ones.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Licensure',
                desc: 'Every caregiver is credential-verified and background-checked, so you can focus entirely on your loved one’s recovery and peace of mind.',
                icon: ShieldCheck,
                color: 'text-brand-primary bg-brand-primary/10'
              },
              {
                title: 'Flexible Home Scheduling',
                desc: 'Book daily visits, weekend check-ins, or 24/7 care directly. Create a schedule that fits your family’s natural rhythm.',
                icon: Calendar,
                color: 'text-amber-500 bg-amber-500/10'
              },
              {
                title: 'Reassuring Testimonials',
                desc: 'Read honest feedback and heart-warming ratings left by other families, sharing details about both clinical expertise and emotional warmth.',
                icon: Award,
                color: 'text-blue-500 bg-blue-500/10'
              }
            ].map((feature, i) => (
              <div key={i} className="glass-card rounded-[32px] p-8 text-left space-y-6 border-slate-100/50 hover:shadow-xl transition-all duration-500">
                <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900">{feature.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
