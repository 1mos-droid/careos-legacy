import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CalendarRange, ShieldCheck, ArrowLeft, CreditCard, Sparkles, Shield, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

export default function BookingPage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => { if (!token) navigate('/auth?tab=login'); }, [token, navigate]);

  const [nurse, setNurse] = useState(null);
  const [loadingNurse, setLoadingNurse] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const data = await api.get(`/nurses/${id}`);
        setNurse(data);
      } catch (err) { console.error(err); }
      finally { setLoadingNurse(false); }
    };
    fetchNurse();
  }, [id]);

  const calculateTotal = () => {
    if (!startDate || !endDate || !nurse) return { days: 0, price: 0 };
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end - start;
    const days = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1);
    return { days, price: days * nurse.hourly_rate };
  };

  const { days, price } = calculateTotal();

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/bookings', { nurse_id: nurse.id, start_date: startDate, end_date: endDate, hours_per_day: 1 });
      setSuccess('Care request confirmed!');
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) { setError(err); }
    finally { setLoading(false); }
  };

  if (loadingNurse) return <div className="min-h-screen bg-brand-bg flex items-center justify-center"><div className="h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-12 relative z-10">
        
        <Link to={`/profile/${id}`} className="inline-flex items-center gap-2 text-sm font-black text-slate-400 hover:text-brand-primary transition-colors uppercase tracking-widest">
          <ArrowLeft className="h-4 w-4" /> Provider Profile
        </Link>

        <div className="text-center space-y-4">
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Reserve <span className="text-gradient">Care Sessions</span></h1>
          <p className="text-slate-500 font-medium">Complete your reservation with {nurse?.name} safely through our registry.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          
          <div className="lg:col-span-3 space-y-8">
            <div className="glass-card p-8 lg:p-10 rounded-[40px] text-left space-y-8">
              <div className="flex gap-4 border-b border-slate-100 pb-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`flex items-center gap-2 ${currentStep === i ? 'text-brand-primary' : 'text-slate-300'}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center font-black text-xs border-2 ${currentStep === i ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-100'}`}>{i}</div>
                    <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">{i === 1 ? 'Schedule' : i === 2 ? 'Payment' : 'Confirm'}</span>
                  </div>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Start Date</label>
                        <input type="date" required value={startDate} onChange={e => setStartDate(e.target.value)} className="input-field" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">End Date</label>
                        <input type="date" required value={endDate} onChange={e => setEndDate(e.target.value)} className="input-field" />
                      </div>
                    </div>
                    <button disabled={!startDate || !endDate || days <= 0} onClick={() => setCurrentStep(2)} className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50">Continue to Payment <ChevronRight className="h-4 w-4" /></button>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Card Number</label>
                        <input type="text" className="input-field" placeholder="•••• •••• •••• ••••" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" className="input-field" placeholder="MM/YY" />
                        <input type="password" className="input-field" placeholder="CVV" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setCurrentStep(1)} className="btn-outline flex-1">Back</button>
                      <button onClick={() => setCurrentStep(3)} className="btn-primary flex-[2]">Review Order</button>
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-8">
                    <div className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 space-y-4">
                      <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs">Reservation Summary</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">Dates</span><span className="font-black text-slate-900">{startDate} to {endDate}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-400 font-medium">Total Sessions</span><span className="font-black text-slate-900">{days} Sessions</span></div>
                        <div className="flex justify-between text-lg pt-4 border-t border-slate-200"><span className="font-black text-slate-900 uppercase tracking-widest text-sm self-center">Total Amount</span><span className="font-black text-brand-primary text-2xl">GH₵{price.toLocaleString()}</span></div>
                      </div>
                    </div>
                    {success && <p className="text-emerald-500 font-bold text-center bg-emerald-50 p-4 rounded-2xl">{success}</p>}
                    <div className="flex gap-4">
                      <button onClick={() => setCurrentStep(2)} className="btn-outline flex-1">Modify</button>
                      <button onClick={handleCheckoutSubmit} disabled={loading} className="btn-primary flex-[2] flex items-center justify-center gap-2 shadow-xl shadow-brand-primary/20">{loading ? 'Processing...' : 'Confirm Reservation'}<ShieldCheck className="h-5 w-5" /></button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <aside className="lg:col-span-2 space-y-8">
            <div className="glass-card p-8 rounded-[40px] space-y-6 text-left border-brand-primary/10">
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs">Care Provider</h3>
              <div className="flex items-center gap-6">
                <img src={nurse?.avatar_url} className="h-20 w-20 rounded-[24px] object-cover border-4 border-white shadow-lg" alt="" />
                <div>
                  <p className="text-xl font-black text-slate-900">{nurse?.name}</p>
                  <p className="text-xs font-black text-brand-primary uppercase tracking-widest mt-1">Verified Registry</p>
                </div>
              </div>
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3 text-slate-500">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold">Credentialed Nursing Professional</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  <span className="text-xs font-bold">Flat-rate session pricing included</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-[40px] bg-slate-900 text-white space-y-4 text-left">
              <h4 className="font-black uppercase tracking-widest text-[10px] text-slate-400">Sandbox Notice</h4>
              <p className="text-xs text-slate-300 font-medium leading-relaxed">This is a simulation environment. No actual payment will be processed. Care requests are stored in your local registry database for demonstration.</p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
