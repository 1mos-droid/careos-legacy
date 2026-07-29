import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Award, Clock, Star, ArrowLeft, ShieldAlert, Heart, 
  ShieldCheck, CheckCircle2, ChevronDown, Send, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

const SPECIALTY_DESCRIPTIONS = {
  'Pediatric & Child Care': 'Certified nursing support, developmental activities, and specialized pediatric medical care for children of all ages.',
  'Post-Surgical Recovery': 'Targeted post-operative monitoring, wound care, vitals tracking, and mobility support for adults and seniors.',
  'Dementia & Elder Care': 'Clinical memory assistance, cognitive behavioral exercises, and safe ambient tracking for senior patients.',
  'Medication Management': 'Accurate multi-dose coordination, vitals tracking, and timely IV/oral clinical administration for all ages.',
  'Physical Therapy': 'Guided therapeutic exercises, mobility restoration, and fall-prevention transfers for injury recovery.',
  'IV Therapy': 'Intravenous hydration, vitamin blends, antibiotics, and clinical lines maintenance for all wellness needs.',
};

const DAYS_OF_WEEK = [
  { key: 'Mon', label: 'Monday' },
  { key: 'Tue', label: 'Tuesday' },
  { key: 'Wed', label: 'Wednesday' },
  { key: 'Thu', label: 'Thursday' },
  { key: 'Fri', label: 'Friday' },
  { key: 'Sat', label: 'Saturday' },
  { key: 'Sun', label: 'Sunday' }
];

const CARE_PHILOSOPHIES = [
  {
    title: "Pediatric & Family Support",
    desc: "We focus on clinical safety paired with warm, engaging care designed specifically to match children's emotional and physical developmental milestones."
  },
  {
    title: "Post-Surgical Adult Recovery",
    desc: "Emphasis on rapid mobility restoration, strict medication schedule management, and specialized wound maintenance to eliminate complications."
  },
  {
    title: "Compassionate Senior Care",
    desc: "Gentle assistance with daily living, memory-retention routines, and a warm companion environment that honors patient dignity."
  }
];

const checkDayActive = (dayKey, availability) => {
  const isWeekend = dayKey === 'Sat' || dayKey === 'Sun';
  if (availability === '24/7') return true;
  if (availability === 'Weekdays') return !isWeekend;
  if (availability === 'Weekends') return isWeekend;
  return false;
};

function NurseProfileSkeleton() {
  return (
    <div className="mx-auto max-w-5xl w-full space-y-8">
      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse"></div>
      <div className="glass-card-premium rounded-2xl p-8 lg:p-12 space-y-8 animate-pulse">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="h-40 w-40 rounded-xl bg-slate-200 shrink-0"></div>
          <div className="space-y-4 w-full">
            <div className="h-8 w-1/3 bg-slate-200 rounded"></div>
            <div className="h-6 w-1/4 bg-slate-200 rounded"></div>
            <div className="h-20 w-full bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NurseProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nurse, setNurse] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [activeTab, setActiveTab] = useState('clinical');
  const [openPhilosophyIndex, setOpenPhilosophyIndex] = useState(0);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  // ponytail: Inline data fetching with native Promise.all inside a single useEffect (YAGNI on custom hooks/caching files)
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    Promise.all([
      api.get(`/nurses/${id}`),
      api.get(`/nurses/${id}/reviews`).catch(() => [])
    ])
      .then(([profileData, reviewsData]) => {
        if (!active) return;
        setNurse(profileData);
        setReviews(reviewsData || []);
        setChatMessages([
          { sender: 'nurse', text: `Hi there! I'm ${profileData.name}. Feel free to ask me any questions about my specialties, credentials, or availability.` }
        ]);
      })
      .catch(err => {
        if (active) setError(err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [id]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;
    setChatMessages(prev => [...prev, { sender: 'client', text: textToSend }]);
    setChatInput('');
    setIsTyping(true);
    setTimeout(() => {
      let replyText = `I'd be happy to help! My flat rate is GH₵${nurse?.hourly_rate} per session, which includes comprehensive daily care. I'm fully credentialed and ready to support your needs.`;
      const query = textToSend.toLowerCase();
      if (query.includes('cpr') || query.includes('certif')) {
        replyText = `Yes, I am fully CPR and BLS certified. My credentials have been verified by the Careos registry.`;
      } else if (query.includes('child') || query.includes('pediatric')) {
        replyText = `I have extensive experience in pediatric care, focusing on both clinical needs and emotional support.`;
      }
      setChatMessages(prev => [...prev, { sender: 'nurse', text: replyText }]);
      setIsTyping(false);
    }, 1200);
  };

  if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6"><NurseProfileSkeleton /></div>;
  if (error || !nurse) return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center space-y-6">
      <ShieldAlert className="h-12 w-12 text-rose-500" />
      <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
      <Link to="/directory" className="btn-primary py-2.5 px-6 text-xs">Return to Directory</Link>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-8 relative z-10">
        
        {/* Navigation */}
        <Link 
          to="/directory" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Directory
        </Link>

        {/* Profile Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="glass-card-premium rounded-2xl p-6 lg:p-8 relative overflow-hidden border border-slate-100 shadow-sm"
        >
          <div className="flex flex-col lg:flex-row gap-8 items-start text-left">
            <div className="relative shrink-0 mx-auto lg:mx-0">
              <img 
                src={nurse.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'} 
                alt={nurse.name} 
                className="h-32 w-32 rounded-xl object-cover border-4 border-slate-50 shadow" 
              />
              <div className="absolute -bottom-2.5 -right-2.5 h-10 w-10 rounded-lg bg-brand-primary flex flex-col items-center justify-center text-white shadow-md">
                <span className="text-sm font-bold leading-none">{nurse.experience_years}</span>
                <span className="text-[7px] font-semibold uppercase tracking-wider">Yrs</span>
              </div>
            </div>

            <div className="flex-grow space-y-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">{nurse.name}</h1>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-semibold text-xs">
                    <Star className="h-3.5 w-3.5 fill-current" /> {nurse.rating || '5.0'}
                  </div>
                </div>
                <p className="text-brand-primary font-semibold uppercase tracking-wider text-[10px]">Verified Care Specialist</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {nurse.specialties.split(',').map((s, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-semibold text-[10px] tracking-wide uppercase">{s.trim()}</span>
                ))}
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Session Rate</p>
                  <p className="text-sm font-bold text-slate-800">GH₵{nurse.hourly_rate}<span className="text-[10px] text-slate-400 font-normal"> /day</span></p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Status</p>
                  <p className="text-sm font-bold text-emerald-500 uppercase flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Schedule</p>
                  <p className="text-sm font-bold text-slate-800">{nurse.availability}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Section */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Tabs Control */}
            <div className="flex gap-6 border-b border-slate-200">
              {['clinical', 'philosophy', 'credentials'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-3 text-xs font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${activeTab === t ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t}
                  {activeTab === t && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="min-h-[220px] text-left">
              <AnimatePresence mode="wait">
                {activeTab === 'clinical' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-bold text-slate-800">Weekly Availability Schedule</h3>
                      <div className="grid grid-cols-7 gap-2">
                        {DAYS_OF_WEEK.map(d => {
                          const active = checkDayActive(d.key, nurse.availability);
                          return (
                            <div key={d.key} className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${active ? 'border-brand-primary/20 bg-brand-primary/5 text-brand-primary shadow-sm' : 'border-slate-100 bg-slate-50/50 opacity-40'}`}>
                              <span className="text-[10px] font-bold">{d.key}</span>
                              {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5 text-slate-300" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {nurse.specialties.split(',').map((s, i) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">{s.trim()}</h4>
                          <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{SPECIALTY_DESCRIPTIONS[s.trim()] || "Professional clinical support tailored to patient needs."}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'philosophy' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                    {CARE_PHILOSOPHIES.map((p, i) => (
                      <div key={i} className="glass-card-premium rounded-xl overflow-hidden border-slate-100">
                        <button onClick={() => setOpenPhilosophyIndex(i)} className="w-full p-4 text-left flex items-center justify-between group cursor-pointer">
                          <h4 className="font-semibold text-slate-800 text-xs uppercase tracking-wide">{p.title}</h4>
                          <ChevronDown className={`h-4 w-4 text-slate-400 group-hover:text-brand-primary transition-transform ${openPhilosophyIndex === i ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openPhilosophyIndex === i && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                              <p className="px-4 pb-4 text-xs text-slate-500 font-medium leading-relaxed border-t border-slate-100 pt-3">{p.desc}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'credentials' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3.5">
                    {[
                      { icon: ShieldCheck, text: "Active Registry Nurse Registration" },
                      { icon: Award, text: "Certified CPR & Basic Life Support" },
                      { icon: Shield, text: "Criminal Background Check Cleared" },
                      { icon: Star, text: "Platform Competency Assessment Passed" }
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-white border border-slate-100 shadow-sm">
                        <div className="h-8 w-8 rounded-lg bg-brand-primary/5 flex items-center justify-center text-brand-primary shrink-0">
                          <c.icon className="h-4.5 w-4.5" />
                        </div>
                        <span className="font-semibold text-slate-700 text-xs">{c.text}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Review Section */}
            <div className="space-y-6 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 text-left">
                <Heart className="h-4.5 w-4.5 text-rose-500 fill-current" /> Patient Feedback
              </h3>
              
              {reviews.length === 0 ? (
                <div className="glass-card-premium p-10 rounded-xl text-center text-slate-400 font-medium italic text-xs">No reviews yet. Be the first to share your experience!</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card-premium p-5 rounded-xl space-y-3 text-left border border-slate-100 shadow-inner">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-bold uppercase text-xs">{r.client_name.charAt(0)}</div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{r.client_name}</p>
                            <p className="text-[9px] font-semibold text-slate-400">{new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: r.rating }).map((_, s) => <Star key={s} className="h-3 w-3 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic">"{r.comment}"</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Messenger */}
          <aside className="lg:col-span-1 space-y-6">
            <div className="glass-card rounded-2xl flex flex-col h-[500px] shadow-sm relative overflow-hidden border border-slate-100">
              <div className="p-4 bg-brand-primary/[0.03] border-b border-slate-100 flex items-center gap-3 text-left">
                <div className="h-9 w-9 rounded-lg overflow-hidden shimmer">
                  <img src={nurse.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'} alt={nurse.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 leading-none">{nurse.name}</p>
                  <p className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wide flex items-center gap-1 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available
                  </p>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-4 space-y-3 no-scrollbar">
                {chatMessages.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={`flex ${m.sender === 'nurse' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-3 rounded-xl text-xs font-medium leading-relaxed text-left ${m.sender === 'nurse' ? 'bg-slate-50 text-slate-600 rounded-tl-none border border-slate-100' : 'bg-brand-primary text-white rounded-tr-none'}`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 p-3 rounded-xl rounded-tl-none flex gap-1 border border-slate-100">
                      <div className="h-1 w-1 bg-slate-300 rounded-full animate-bounce" />
                      <div className="h-1 w-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="h-1 w-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-3 bg-white border-t border-slate-100 space-y-3">
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {["CPR Certified?", "Availability?", "Rates?"].map(q => (
                    <button 
                      key={q} 
                      onClick={() => handleSendMessage(q)} 
                      className="px-2.5 py-1 rounded-md bg-brand-primary/[0.04] text-brand-primary text-[9px] font-semibold tracking-wider whitespace-nowrap border border-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }} className="relative flex gap-1.5 items-center">
                  <input 
                    value={chatInput} 
                    onChange={e => setChatInput(e.target.value)} 
                    placeholder="Type a message..." 
                    className="input-field pr-10 text-[11px] py-2" 
                  />
                  <button 
                    type="submit" 
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary-dark transition-all cursor-pointer"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            </div>

            <button 
              onClick={() => navigate(`/booking/${nurse.id}`)} 
              className="btn-primary w-full py-3.5 text-xs shadow-md shadow-brand-primary/10"
            >
              Book Care Session
            </button>
          </aside>

        </div>
      </div>
    </div>
  );
}
