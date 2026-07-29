import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShieldAlert, Grid, List, ArrowUpDown, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import NurseCard from '../components/NurseCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const SPECIALTY_DESCRIPTIONS = {
  'Pediatric & Child Care': 'Certified nursing support, developmental activities, and specialized pediatric medical care for children of all ages.',
  'Post-Surgical Recovery': 'Targeted post-operative monitoring, wound care, vitals tracking, and mobility support for adults and seniors.',
  'Dementia & Elder Care': 'Clinical memory assistance, cognitive behavioral exercises, and safe ambient tracking for senior patients.',
  'Medication Management': 'Accurate multi-dose coordination, vitals tracking, and timely IV/oral clinical administration for all ages.',
  'Physical Therapy': 'Guided therapeutic exercises, mobility restoration, and fall-prevention transfers for injury recovery.',
  'IV Therapy': 'Intravenous hydration, vitamin blends, antibiotics, and clinical lines maintenance for all wellness needs.',
};

const FRIENDLY_SPECIALTIES = {
  'Pediatric & Child Care': 'Child & Infant Care',
  'Post-Surgical Recovery': 'Recovery After Surgery',
  'Dementia & Elder Care': 'Elderly & Memory Care',
  'Medication Management': 'Medication Support',
  'Physical Therapy': 'Mobility & Therapy Help',
  'IV Therapy': 'IV & Nursing Care',
};

function DirectorySkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card-premium rounded-2xl p-6 h-[380px] flex flex-col justify-between shimmer animate-pulse">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="h-14 w-14 rounded-xl bg-slate-200"></div>
              <div className="h-6 w-16 rounded bg-slate-200"></div>
            </div>
            <div className="h-6 w-3/4 rounded bg-slate-200"></div>
            <div className="h-4 w-1/2 rounded bg-slate-200"></div>
          </div>
          <div className="h-10 w-full rounded-xl bg-slate-200"></div>
        </div>
      ))}
    </div>
  );
}

export default function Directory() {
  const navigate = useNavigate();

  // Filter & Search states
  const [specialty, setSpecialty] = useState('');
  const [availability, setAvailability] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [layoutMode, setLayoutMode] = useState('grid');

  // Data states
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ponytail: Use simple native useEffect for local fetching (YAGNI on custom hooks/caching files)
  const fetchNurses = useCallback(() => {
    let active = true;
    setLoading(true);
    setError('');
    let url = `/nurses?maxRate=200&`;
    if (specialty) url += `specialty=${encodeURIComponent(specialty)}&`;
    if (availability) url += `availability=${encodeURIComponent(availability)}&`;

    api.get(url)
      .then(data => { if (active) setNurses(data); })
      .catch(err => { if (active) setError(err); })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [specialty, availability]);

  useEffect(() => {
    return fetchNurses();
  }, [fetchNurses]);

  // ponytail: Inline client-side filter (local filtering of ~100 items is instant, no debounce hook needed)
  const processedNurses = useMemo(() => {
    const matchText = searchQuery.toLowerCase();
    return nurses
      .filter((nurse) => {
        return nurse.name.toLowerCase().includes(matchText) || 
               nurse.specialties.toLowerCase().includes(matchText);
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
        if (sortBy === 'rate_asc') return a.hourly_rate - b.hourly_rate;
        if (sortBy === 'experience') return b.experience_years - a.experience_years;
        return 0;
      });
  }, [nurses, searchQuery, sortBy]);

  const handleClearFilters = useCallback(() => {
    setSpecialty('');
    setAvailability('');
    setSearchQuery('');
  }, []);

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-10 relative z-10">
        
        {/* Apple-style Directory Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 pb-4 text-left">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
              Find a <span className="text-gradient">Trusted Caregiver</span>
            </h1>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
              Every caregiver here has passed strict background and nursing license verification checks. Select a professional below to request care.
            </p>
          </div>
        </div>

        {/* Unified Search & Sort Bar */}
        <Card isPremium={true} isNeumorphic={true} className="p-4 flex flex-col md:flex-row items-center gap-4 shadow-md w-full">
          <div className="relative flex-grow w-full">
            <Input
              isNeumorphic={true}
              type="text"
              placeholder="Search by caregiver name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={Search}
              className="!py-3"
            />
          </div>

          <div className="h-8 w-px bg-slate-200 hidden md:block" />

          <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-brand-bg border border-transparent neumorphic-concave rounded-xl shrink-0">
              <ArrowUpDown className="h-4 w-4 text-brand-primary" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
              >
                <option value="rating">Top Rated First</option>
                <option value="rate_asc">Lowest Price First</option>
                <option value="experience">Most Experienced First</option>
              </select>
            </div>

            <div className="flex bg-brand-bg p-1 rounded-xl border border-transparent neumorphic-concave shrink-0">
              <button
                onClick={() => setLayoutMode('grid')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${layoutMode === 'grid' ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setLayoutMode('list')}
                className={`p-2 rounded-lg transition-all cursor-pointer ${layoutMode === 'list' ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </Card>

        {/* Main Content Area */}
        <div className="grid lg:grid-cols-4 gap-8 items-start">
          
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1 space-y-6 text-left">
            <Card isPremium={true} isNeumorphic={true} className="p-6 space-y-6">
              
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  What kind of care is needed?
                </h4>
                <div className="flex flex-col gap-1.5">
                  {Object.keys(SPECIALTY_DESCRIPTIONS).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSpecialty(specialty === cat ? '' : cat)}
                      className={`text-xs text-left px-3 py-2.5 rounded-lg transition-all font-semibold cursor-pointer border ${specialty === cat ? 'neumorphic-convex text-brand-primary font-bold shadow-md bg-brand-primary/5 border-transparent animate-pulse' : 'bg-transparent border-transparent text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary'}`}
                    >
                      {FRIENDLY_SPECIALTIES[cat] || cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-px bg-slate-100/60" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  When do you need them?
                </h4>
                <div className="flex flex-col gap-1.5">
                  {[
                    { key: 'Weekdays', label: 'Monday to Friday' },
                    { key: 'Weekends', label: 'Saturday & Sunday' },
                    { key: '24/7', label: 'Everyday (24/7 Care)' }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setAvailability(availability === item.key ? '' : item.key)}
                      className={`text-xs text-left px-3 py-2.5 rounded-lg transition-all font-semibold cursor-pointer border ${availability === item.key ? 'neumorphic-convex text-brand-primary font-bold shadow-md bg-brand-primary/5 border-transparent animate-pulse' : 'bg-transparent border-transparent text-slate-600 hover:bg-brand-primary/5 hover:text-brand-primary'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100/60 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400">Available caregivers</span>
                  <span className="font-bold text-slate-800">{processedNurses.length}</span>
                </div>
              </div>

            </Card>
          </aside>

          {/* Directory Listings */}
          <div className="lg:col-span-3">
            {loading ? (
              <DirectorySkeleton />
            ) : error ? (
              <div className="glass-card-premium p-16 rounded-2xl text-center space-y-4 max-w-xl mx-auto border border-slate-100">
                <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">Failed to load caregivers</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{typeof error === 'string' ? error : 'Network error occurred'}</p>
                <button onClick={fetchNurses} className="btn-primary py-2 px-6 text-xs">Try Again</button>
              </div>
            ) : processedNurses.length === 0 ? (
              <div className="glass-card-premium p-16 rounded-2xl text-center space-y-4 max-w-xl mx-auto border border-slate-100">
                <Users className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No Caregivers Found</h3>
                <p className="text-xs text-slate-500 leading-relaxed">Try clearing filters to see all active providers.</p>
                <button onClick={handleClearFilters} className="btn-glass py-2 px-6 text-xs cursor-pointer">Clear Filters</button>
              </div>
            ) : (
              <div className={layoutMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-6'}>
                <AnimatePresence mode="popLayout">
                  {processedNurses.map((nurse, i) => (
                    <motion.div
                      layout
                      key={nurse.id}
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
