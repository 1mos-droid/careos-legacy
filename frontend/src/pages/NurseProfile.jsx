import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Award, Clock, Star, ArrowLeft, ShieldAlert, Heart, Calendar, 
  ShieldCheck, CheckCircle2, ChevronDown, Send, MessageSquare, Sparkles, Shield
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
    <div className="mx-auto max-w-5xl w-full space-y-12">
      <div className="h-4 w-32 shimmer rounded-full"></div>
      <div className="glass-card rounded-[40px] p-8 lg:p-12 space-y-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <div className="h-48 w-48 rounded-[32px] shimmer shrink-0"></div>
          <div className="space-y-4 w-full">
            <div className="h-10 w-1/3 shimmer rounded-lg"></div>
            <div className="h-6 w-1/4 shimmer rounded-lg"></div>
            <div className="h-24 w-full shimmer rounded-[24px]"></div>
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

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const profileData = await api.get(`/nurses/${id}`);
      setNurse(profileData);
      setChatMessages([
        { sender: 'nurse', text: `Hi there! I'm ${profileData.name}. Feel free to ask me any questions about my specialties, credentials, or availability.` }
      ]);
      try {
        const reviewsData = await api.get(`/nurses/${id}/reviews`);
        setReviews(reviewsData);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
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
      <ShieldAlert className="h-16 w-16 text-rose-500" />
      <h2 className="text-2xl font-black text-slate-900">Profile Not Found</h2>
      <Link to="/directory" className="btn-primary">Return to Registry</Link>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-6xl space-y-12 relative z-10">
        
        <Link to="/directory" className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-brand-primary transition-colors uppercase tracking-widest">
          <ArrowLeft className="h-4 w-4" /> Registry Directory
        </Link>

        {/* Profile Hero Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-[40px] p-8 lg:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-64 w-64 bg-brand-primary/5 rounded-full blur-3xl -z-10" />
          
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="relative shrink-0 mx-auto lg:mx-0">
              <img src={nurse.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'} alt={nurse.name} className="h-48 w-48 rounded-[32px] object-cover border-8 border-white shadow-2xl" />
              <div className="absolute -bottom-4 -right-4 h-14 w-14 rounded-2xl bg-brand-primary flex flex-col items-center justify-center text-white shadow-xl">
                <span className="text-lg font-black leading-none">{nurse.experience_years}</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">Years</span>
              </div>
            </div>

            <div className="flex-grow space-y-6 text-center lg:text-left">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">{nurse.name}</h1>
                  <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-black text-sm">
                    <Star className="h-4 w-4 fill-current" /> {nurse.rating || '5.0'}
                  </div>
                </div>
                <p className="text-brand-primary font-black uppercase tracking-[0.2em] text-xs">Verified Care Specialist</p>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                {nurse.specialties.split(',').map((s, i) => (
                  <span key={i} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider">{s.trim()}</span>
                ))}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4 border-t border-slate-100">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rate</p>
                  <p className="text-lg font-black text-slate-900">GH₵{nurse.hourly_rate}<span className="text-[10px] text-slate-400">/session</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                  <p className="text-lg font-black text-emerald-500 uppercase flex items-center gap-1.5 justify-center lg:justify-start">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Available
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Schedule</p>
                  <p className="text-lg font-black text-slate-900">{nurse.availability}</p>
                </div>
                <div className="lg:block hidden">
                  <button onClick={() => navigate(`/booking/${nurse.id}`)} className="btn-primary w-full py-4 shadow-xl shadow-brand-primary/20">Book Now</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Tabs Section */}
        <div className="grid lg:grid-cols-3 gap-12 items-start">
          
          <div className="lg:col-span-2 space-y-12">
            
            {/* Tabs Control */}
            <div className="flex gap-8 border-b border-slate-200">
              {['clinical', 'philosophy', 'credentials'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t)}
                  className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative cursor-pointer ${activeTab === t ? 'text-brand-primary' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {t}
                  {activeTab === t && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-t-full" />}
                </button>
              ))}
            </div>

            <div className="min-h-[300px] text-left">
              <AnimatePresence mode="wait">
                {activeTab === 'clinical' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                    <div className="space-y-6">
                      <h3 className="text-xl font-black text-slate-900">Weekly Availability Heatmap</h3>
                      <div className="grid grid-cols-7 gap-3">
                        {DAYS_OF_WEEK.map(d => {
                          const active = checkDayActive(d.key, nurse.availability);
                          return (
                            <div key={d.key} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${active ? 'border-brand-primary bg-brand-primary/5 text-brand-primary shadow-sm' : 'border-slate-100 bg-slate-50 opacity-40'}`}>
                              <span className="text-[10px] font-black uppercase">{d.key}</span>
                              {active ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4 text-slate-300" />}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      {nurse.specialties.split(',').map((s, i) => (
                        <div key={i} className="p-6 rounded-[24px] bg-slate-50 border border-slate-100 space-y-3">
                          <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">{s.trim()}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{SPECIALTY_DESCRIPTIONS[s.trim()] || "Professional clinical support tailored to patient needs."}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'philosophy' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                    {CARE_PHILOSOPHIES.map((p, i) => (
                      <div key={i} className="glass-card rounded-[24px] overflow-hidden border-slate-100">
                        <button onClick={() => setOpenPhilosophyIndex(i)} className="w-full p-6 text-left flex items-center justify-between group cursor-pointer">
                          <h4 className="font-black text-slate-900 uppercase tracking-widest text-sm">{p.title}</h4>
                          <ChevronDown className={`h-5 w-5 text-slate-400 group-hover:text-brand-primary transition-transform ${openPhilosophyIndex === i ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {openPhilosophyIndex === i && (
                            <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                              <p className="px-6 pb-6 text-sm text-slate-500 font-medium leading-relaxed border-t border-slate-50 pt-4">{p.desc}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === 'credentials' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-3">
                    {[
                      { icon: ShieldCheck, text: "Active Registry Nurse Registration" },
                      { icon: Award, text: "Certified CPR & Basic Life Support" },
                      { icon: Shield, text: "Criminal Background Check Cleared" },
                      { icon: Star, text: "Platform Competency Assessment Passed" }
                    ].map((c, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                        <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <c.icon className="h-5 w-5" />
                        </div>
                        <span className="font-black text-slate-800 text-sm">{c.text}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Review Section */}
            <div className="space-y-8 pt-12 border-t border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 text-left">
                <Heart className="h-6 w-6 text-rose-500 fill-current" /> Patient Feedback
              </h3>
              
              {reviews.length === 0 ? (
                <div className="glass-card p-12 rounded-[32px] text-center text-slate-400 font-medium italic">No reviews yet. Be the first to share your experience!</div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-6 rounded-[28px] space-y-4 text-left">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black uppercase text-xs">{r.client_name.charAt(0)}</div>
                          <div>
                            <p className="text-sm font-black text-slate-900">{r.client_name}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase">{new Date(r.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-0.5 text-amber-400">
                          {Array.from({ length: r.rating }).map((_, s) => <Star key={s} className="h-3.5 w-3.5 fill-current" />)}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed italic">"{r.comment}"</p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Messenger */}
          <aside className="lg:col-span-1 space-y-8 sticky top-24">
            <div className="glass-card rounded-[40px] flex flex-col h-[550px] shadow-2xl relative overflow-hidden border-brand-primary/10">
              <div className="p-6 bg-brand-primary/5 border-b border-brand-primary/10 flex items-center gap-4 text-left">
                <div className="h-10 w-10 rounded-xl overflow-hidden shimmer">
                  <img src={nurse.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'} alt={nurse.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-900">{nurse.name}</p>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Available
                  </p>
                </div>
              </div>

              <div className="flex-grow overflow-y-auto p-6 space-y-4 no-scrollbar">
                {chatMessages.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`flex ${m.sender === 'nurse' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[85%] p-4 rounded-[20px] text-xs font-medium leading-relaxed shadow-sm text-left ${m.sender === 'nurse' ? 'bg-slate-50 text-slate-600 rounded-tl-none' : 'bg-brand-primary text-white rounded-tr-none'}`}>
                      {m.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-50 p-4 rounded-[20px] rounded-tl-none flex gap-1">
                      <div className="h-1 w-1 bg-slate-300 rounded-full animate-bounce" />
                      <div className="h-1 w-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="h-1 w-1 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-slate-100 space-y-4">
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {["CPR Certified?", "Schedule?", "Rates?"].map(q => (
                    <button key={q} onClick={() => handleSendMessage(q)} className="px-3 py-1.5 rounded-lg bg-brand-primary/5 text-brand-primary text-[10px] font-black uppercase tracking-widest whitespace-nowrap border border-brand-primary/10 hover:bg-brand-primary hover:text-white transition-all cursor-pointer">{q}</button>
                  ))}
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(chatInput); }} className="relative">
                  <input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Type a message..." className="input-field pr-12 text-xs" />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary-dark transition-all cursor-pointer">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>

            <button onClick={() => navigate(`/booking/${nurse.id}`)} className="btn-primary w-full py-5 text-base shadow-2xl shadow-brand-primary/30">Book Care Session</button>
          </aside>

        </div>
      </div>
    </div>
  );
}
