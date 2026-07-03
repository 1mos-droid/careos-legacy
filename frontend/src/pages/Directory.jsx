import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Star, Filter, Clock, Banknote, ShieldAlert, Award, Grid, List, 
  ArrowUpDown, Heart, Activity, Users, ShieldCheck, Sparkles, X, ChevronRight, CheckCircle2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import NurseCard from '../components/NurseCard';

const SPECIALTY_DESCRIPTIONS = {
  'Pediatric & Child Care': 'Certified nursing support, developmental activities, and specialized pediatric medical care for children of all ages.',
  'Post-Surgical Recovery': 'Targeted post-operative monitoring, wound care, vitals tracking, and mobility support for adults and seniors.',
  'Dementia & Elder Care': 'Clinical memory assistance, cognitive behavioral exercises, and safe ambient tracking for senior patients.',
  'Medication Management': 'Accurate multi-dose coordination, vitals tracking, and timely IV/oral clinical administration for all ages.',
  'Physical Therapy': 'Guided therapeutic exercises, mobility restoration, and fall-prevention transfers for injury recovery.',
  'IV Therapy': 'Intravenous hydration, vitamin blends, antibiotics, and clinical lines maintenance for all wellness needs.',
};

function DirectorySkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card rounded-[32px] p-6 h-[400px] flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-16 w-16 rounded-2xl shimmer"></div>
              <div className="h-8 w-16 rounded-lg shimmer"></div>
            </div>
            <div className="h-6 w-3/4 rounded-lg shimmer"></div>
            <div className="h-4 w-1/2 rounded-lg shimmer"></div>
            <div className="flex gap-2">
              <div className="h-6 w-20 rounded-md shimmer"></div>
              <div className="h-6 w-24 rounded-md shimmer"></div>
            </div>
          </div>
          <div className="h-12 w-full rounded-xl shimmer"></div>
        </div>
      ))}
    </div>
  );
}

export default function Directory() {
  const navigate = useNavigate();

  // Filter & Search states
  const [specialty, setSpecialty] = useState('');
  const [maxRate, setMaxRate] = useState(200);
  const [availability, setAvailability] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [layoutMode, setLayoutMode] = useState('grid');

  // Assistant states
  const [showMatchFinder, setShowMatchFinder] = useState(false);
  const [matchStep, setMatchStep] = useState(1);
  const [patientType, setPatientType] = useState('');
  const [clinicalNeed, setClinicalNeed] = useState('');
  const [targetBudget, setTargetBudget] = useState(200);
  const [matchCompleted, setMatchCompleted] = useState(false);

  // Data states
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNurses = async () => {
    setLoading(true);
    setError('');
    let url = `/nurses?maxRate=${maxRate}&`;
    if (specialty) url += `specialty=${encodeURIComponent(specialty)}&`;
    if (availability) url += `availability=${encodeURIComponent(availability)}&`;

    try {
      const data = await api.get(url);
      setNurses(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurses();
  }, [specialty, maxRate, availability]);

  const processedNurses = nurses
    .filter((nurse) => {
      const matchText = searchQuery.toLowerCase();
      return nurse.name.toLowerCase().includes(matchText) || 
             nurse.specialties.toLowerCase().includes(matchText);
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'rate_asc') return a.hourly_rate - b.hourly_rate;
      if (sortBy === 'experience') return b.experience_years - a.experience_years;
      return 0;
    });

  const handleApplyMatchResults = () => {
    if (patientType === 'child') setSpecialty('Pediatric & Child Care');
    else if (patientType === 'senior') setSpecialty('Dementia & Elder Care');
    else if (clinicalNeed === 'wound') setSpecialty('Post-Surgical Recovery');
    else if (clinicalNeed === 'meds') setSpecialty('Medication Management');
    else if (clinicalNeed === 'iv') setSpecialty('IV Therapy');
    else if (clinicalNeed === 'pt') setSpecialty('Physical Therapy');
    
    setMaxRate(targetBudget);
    setMatchCompleted(true);
    setTimeout(() => {
      setShowMatchFinder(false);
      setMatchCompleted(false);
      setMatchStep(1);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-20 lg:px-12">
      <div className="mx-auto max-w-[1600px] space-y-24 relative z-10">
        
        {/* Massive Industrial Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-12 border-l-8 border-brand-primary pl-12">
          <div className="space-y-8 max-w-4xl text-left">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-7xl lg:text-[10rem] font-black text-slate-900 tracking-tighter leading-[0.8] uppercase"
            >
              Registry <br />
              <span className="text-gradient">Intelligence.</span>
            </motion.h1>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl">
              Real-time access to the elite clinical fleet. Fully authenticated nursing professionals, deployed for precision care.
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMatchFinder(!showMatchFinder)}
            className="btn-primary !py-8 !px-12 text-xl flex items-center gap-4 group shadow-[0_30px_60px_-15px_rgba(13,148,136,0.4)]"
          >
            <Sparkles className="h-6 w-6 animate-pulse" />
            {showMatchFinder ? 'Close Engine' : 'Match Protocol'}
          </motion.button>
        </div>

        {/* Hyper Search & Mode Bar */}
        <div className="glass-card-premium rounded-[40px] p-4 lg:p-6 flex flex-col lg:flex-row items-center gap-6 shadow-2xl">
          <div className="relative flex-grow w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-brand-primary transition-all duration-500" />
            <input
              type="text"
              placeholder="Query Clinical Database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-16 pr-6 py-5 bg-white/40 border border-transparent focus:border-brand-primary/20 rounded-[28px] text-lg font-bold outline-none placeholder:text-slate-400 transition-all"
            />
          </div>

          <div className="h-12 w-px bg-slate-200 hidden lg:block" />

          <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            <div className="flex items-center gap-3 px-6 py-3 bg-white/60 border border-white rounded-[24px] shadow-sm">
              <ArrowUpDown className="h-5 w-5 text-brand-primary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm font-black text-slate-700 outline-none cursor-pointer uppercase tracking-widest"
              >
                <option value="rating">Top Tier</option>
                <option value="rate_asc">Rate: Low</option>
                <option value="experience">Experience</option>
              </select>
            </div>

            <div className="flex bg-white/60 p-2 rounded-[24px] border border-white shadow-sm">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-3 rounded-[18px] transition-all cursor-pointer ${layoutMode === 'grid' ? 'bg-brand-primary shadow-xl text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-3 rounded-[18px] transition-all cursor-pointer ${layoutMode === 'list' ? 'bg-brand-primary shadow-xl text-white' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area - Split Industrial Layout */}
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          
          {/* Floating Glass Bento Filters */}
          <aside className="lg:col-span-1 space-y-10 text-left sticky top-32">
            <div className="glass-card rounded-[45px] p-10 space-y-12 border-white/80 shadow-2xl">
              <div className="space-y-8">
                <h4 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-brand-primary" /> Protocol Filters
                </h4>

                <div className="space-y-6">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Clinical Specialty</label>
                  <div className="flex flex-col gap-2">
                    {Object.keys(SPECIALTY_DESCRIPTIONS).map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSpecialty(specialty === cat ? '' : cat)}
                        className={`text-sm text-left px-5 py-4 rounded-[22px] transition-all font-black uppercase tracking-tight cursor-pointer border-2 ${specialty === cat ? 'bg-brand-primary text-white border-brand-primary shadow-xl shadow-brand-primary/20 scale-[1.05]' : 'bg-white/40 border-transparent text-slate-500 hover:border-slate-100 hover:text-slate-800'}`}
                      >
                        {cat.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Operational Sync</label>
                  <div className="grid grid-cols-1 gap-2">
                    {['Weekdays', 'Weekends', '24/7'].map(val => (
                      <button
                        key={val}
                        onClick={() => setAvailability(availability === val ? '' : val)}
                        className={`text-sm text-left px-5 py-4 rounded-[22px] font-black uppercase tracking-tight transition-all cursor-pointer border-2 ${availability === val ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20' : 'bg-white/40 border-transparent text-slate-500 hover:bg-white'}`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Count</span>
                  <span className="text-xl font-black text-slate-900">{processedNurses.length}</span>
                </div>
                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div animate={{ width: `${(processedNurses.length / 50) * 100}%` }} className="h-full bg-brand-primary" />
                </div>
              </div>
            </div>
          </aside>

          {/* High-Velocity Results Grid */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[500px] glass-card rounded-[50px] shimmer" />)}
              </div>
            ) : error ? (
              <div className="glass-card-premium p-20 rounded-[60px] text-center space-y-8">
                <ShieldAlert className="h-20 w-20 text-rose-500 mx-auto" />
                <h3 className="text-4xl font-black text-slate-900 uppercase">System Error Detected</h3>
                <p className="text-xl text-slate-500">{error}</p>
                <button onClick={fetchNurses} className="btn-primary">Initiate Re-Fetch</button>
              </div>
            ) : processedNurses.length === 0 ? (
              <div className="glass-card-premium p-20 rounded-[60px] text-center space-y-8">
                <Users className="h-20 w-20 text-slate-200 mx-auto" />
                <h3 className="text-4xl font-black text-slate-900 uppercase">No Matches Found</h3>
                <p className="text-xl text-slate-500">Query returned zero clinical results. Adjust protocol parameters.</p>
                <button onClick={() => { setSpecialty(''); setMaxRate(200); setAvailability(''); setSearchQuery(''); }} className="btn-glass cursor-pointer">Reset Database</button>
              </div>
            ) : (
              <div className={layoutMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-10' : 'space-y-8'}>
                <AnimatePresence mode="popLayout">
                  {processedNurses.map((nurse, i) => (
                    <motion.div
                      layout
                      key={nurse.id}
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className={layoutMode === 'list' ? 'flex items-center gap-12 p-2' : ''}
                    >
                      <NurseCard 
                        nurse={nurse} 
                        onSelect={(n) => navigate(`/profile/${n.id}`)}
                        onBook={(n) => navigate(`/booking/${n.id}`)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
