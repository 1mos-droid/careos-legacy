import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, ArrowRight, Sparkles, Star, Calendar, 
  Award, Clock, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function Landing() {
  const navigate = useNavigate();

  // Interactive Booking Simulator State
  const [simStep, setSimStep] = useState(0); // 0: Idle, 1: Nurse Selected, 2: Schedule Selected, 3: Confirmed
  const [simNurse] = useState('Sarah Jenkins, RN');
  const [simRate] = useState(350);
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
    <div className="relative min-h-[calc(100vh-80px)] bg-brand-bg text-left overflow-hidden">
      <div className="bg-glow-mesh" />
      
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
                className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-teal-200/40 bg-teal-50 text-brand-primary text-xs font-semibold tracking-wide shadow-sm"
              >
                <Sparkles className="h-4 w-4 text-brand-primary shrink-0" />
                <span>CareOS Professional Nurse Registry</span>
              </motion.div>
              
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight tracking-tight"
                >
                  Compassionate Care.<br />
                  <span className="text-gradient">In-Home Peace.</span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-base text-slate-500 font-medium leading-relaxed max-w-xl border-l-3 border-brand-primary/20 pl-5"
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
                <Button 
                  onClick={() => navigate('/directory')}
                  rightIcon={ArrowRight}
                  className="group"
                >
                  Find a Nurse
                </Button>
                <Button 
                  onClick={() => navigate('/auth?tab=register&role=nurse')}
                  variant="glass"
                >
                  Join as a Nurse
                </Button>
              </motion.div>

              {/* Quick Metrics */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200/60"
              >
                {[
                  { value: '100%', label: 'Verified Licensure', icon: ShieldCheck },
                  { value: '4.9★', label: 'Average Care Rating', icon: Star },
                  { value: '< 2hr', label: 'Match Confirmation', icon: Clock }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-primary font-bold">
                      <stat.icon className="h-4 w-4 shrink-0 text-brand-primary" />
                      <span className="text-lg font-display text-slate-800">{stat.value}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</p>
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
                className="relative z-10 w-full"
              >
                <Card isPremium={true} isNeumorphic={true} className="p-6 lg:p-8 text-left">
                {/* Simulator Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {getSimStageTitle()}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    {[0, 1, 2, 3].map((step) => (
                      <div 
                        key={step} 
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${simStep === step ? 'w-3.5 bg-brand-primary' : 'bg-slate-200'}`} 
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
                        <h4 className="text-base font-bold text-slate-900 tracking-tight">Need In-Home Support?</h4>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          Test the simplified booking workflow to see how easy it is to schedule a verified caregiver.
                        </p>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-3">
                          <div className="flex items-center justify-between text-xs text-slate-700">
                            <span className="font-medium">Specialty Focus:</span>
                            <span className="font-semibold text-brand-primary bg-brand-primary/5 px-2.5 py-0.5 rounded-full text-[10px]">Dementia & Elder Care</span>
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-700">
                            <span className="font-medium">Clinical Credentials:</span>
                            <span className="font-semibold text-slate-800">RN (Registered Nurse)</span>
                          </div>
                        </div>
                        <Button 
                          onClick={() => setSimStep(1)}
                          variant="primary"
                          size="sm"
                          rightIcon={ArrowRight}
                          className="w-full mt-2"
                        >
                          Select Provider
                        </Button>
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
                          <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary text-sm font-semibold">SJ</div>
                          <div className="text-left">
                            <h5 className="text-sm font-bold text-slate-900">{simNurse}</h5>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Verified Registered Nurse</p>
                          </div>
                          <div className="ml-auto flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="h-4 w-4 fill-current" /> 4.9
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                          "Dedicated caregiver specializing in elder health management, rehabilitation tracking, and medication schedules."
                        </p>
                        <div className="p-3 bg-slate-50 rounded-xl flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Daily Registry Rate:</span>
                          <span className="font-bold text-slate-800">GH₵{simRate}/day</span>
                        </div>
                        <Button 
                          onClick={() => setSimStep(2)}
                          variant="primary"
                          size="sm"
                          rightIcon={ArrowRight}
                          className="w-full mt-2"
                        >
                          Set Care Schedule
                        </Button>
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
                        <h4 className="text-xs font-bold text-slate-900 tracking-tight">Configure Duration</h4>
                        <div className="space-y-2">
                          <label className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider block">Number of Days</label>
                          <div className="flex gap-2">
                            {[3, 5, 7].map((d) => (
                              <button
                                key={d}
                                onClick={() => setSimDays(d)}
                                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${simDays === d ? 'border-brand-primary bg-brand-primary/5 text-brand-primary' : 'border-slate-100 text-slate-400 hover:text-slate-600'}`}
                              >
                                {d} Days
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                          <div className="flex justify-between text-slate-500 font-medium">
                            <span>Base Rate:</span>
                            <span>GH₵{simRate}/day</span>
                          </div>
                          <div className="flex justify-between text-slate-800 font-bold border-t border-slate-200/60 pt-2 text-xs">
                            <span>Total Price ({simDays} days):</span>
                            <span className="text-brand-primary">GH₵{simRate * simDays}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => setSimStep(1)} variant="glass" size="sm" className="px-4">Back</Button>
                          <Button 
                            onClick={() => setSimStep(3)}
                            variant="primary"
                            size="sm"
                            rightIcon={ArrowRight}
                            className="flex-grow"
                          >
                            Reserve Care
                          </Button>
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
                        <div className="h-14 w-14 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto border border-emerald-100 shadow-sm">
                          <CheckCircle2 className="h-7 w-7" />
                        </div>
                        <h4 className="text-base font-bold text-slate-900">Hooray! Request Sent! 🎉</h4>
                        <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                          We've pinged {simNurse}. Sit back, relax, and grab a cup of tea – they will review your schedule details and accept shortly!
                        </p>
                        <div className="flex gap-2 justify-center pt-2">
                          <Button 
                            onClick={() => { setSimStep(0); setSimDays(5); }}
                            variant="glass"
                            size="sm"
                            className="px-4"
                          >
                            Reset Demo
                          </Button>
                          <Button 
                            onClick={() => navigate('/directory')}
                            variant="primary"
                            size="sm"
                            rightIcon={ArrowRight}
                            className="flex-grow"
                          >
                            Browse Registry
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                </Card>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 border-t border-slate-100 bg-white/40 backdrop-blur-sm relative z-10 px-6">
        <div className="mx-auto max-w-7xl space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Supporting Your Family With <span className="text-gradient">Care & Comfort</span>
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              Every professional nurse undergoes licensing checks to guarantee absolute safety and reassurance for your loved ones.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Verified Licensure',
                desc: 'Every caregiver is credential-verified and background-checked, so you can focus entirely on your loved one’s recovery and peace of mind.',
                icon: ShieldCheck,
                color: 'text-brand-primary bg-brand-primary/5'
              },
              {
                title: 'Flexible Home Scheduling',
                desc: 'Book daily visits, weekend check-ins, or 24/7 care directly. Create a schedule that fits your family’s natural rhythm.',
                icon: Calendar,
                color: 'text-amber-600 bg-amber-50'
              },
              {
                title: 'Reassuring Testimonials',
                desc: 'Read honest feedback and heart-warming ratings left by other families, sharing details about both clinical expertise and emotional warmth.',
                icon: Award,
                color: 'text-blue-600 bg-blue-50'
              }
            ].map((feature, i) => (
              <Card 
                key={i} 
                isPremium={true} 
                isHoverable={true} 
                className="p-8 text-left space-y-5 border-slate-100/50"
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="h-5 w-5" />
                </div>
                <h4 className="text-base font-bold text-slate-900">{feature.title}</h4>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{feature.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}
