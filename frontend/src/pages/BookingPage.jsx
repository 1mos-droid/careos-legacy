import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Sparkles, Shield, AlertCircle, Award, CalendarDays, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';
import Input from '../components/ui/Input';
import { calculateBookingTotal } from '../utils/booking';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

export default function BookingPage({ token }) {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => { 
    if (!token) navigate('/auth?tab=login'); 
  }, [token, navigate]);

  const [nurse, setNurse] = useState(null);
  const [loadingNurse, setLoadingNurse] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchNurse = async () => {
      try {
        const data = await api.get(`/nurses/${id}`);
        setNurse(data);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoadingNurse(false); 
      }
    };
    fetchNurse();
  }, [id]);

  const { days, price } = calculateBookingTotal(startDate, endDate, nurse?.hourly_rate);

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (days <= 0) {
      setError('Please select valid dates where the end date is after or equal to the start date.');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await api.post('/bookings', { 
        nurse_id: nurse.id, 
        start_date: startDate, 
        end_date: endDate, 
        hours_per_day: 1 
      });
      setSuccess('Your care request has been submitted successfully! Redirecting you...');
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err) { 
      setError(typeof err === 'string' ? err : 'An error occurred while confirming your reservation. Please try again.'); 
    } finally { 
      setLoading(false); 
    }
  };

  if (loadingNurse) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(15,118,110,0.2)]" />
      </div>
    );
  }

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-5xl space-y-10 relative z-10">
        
        {/* Navigation */}
        <Link 
          to={`/profile/${id}`} 
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Profile
        </Link>

        {/* Header */}
        <div className="text-left space-y-3 max-w-2xl">
          <h1 className="text-3xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-tight">
            Book a <span className="text-gradient">Care Visit</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium leading-relaxed">
            Choose your dates to book this caregiver. Every caregiver on our registry is background-checked and credential-verified.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          
          {/* Main Booking Form */}
          <div className="lg:col-span-3">
            <form onSubmit={handleCheckoutSubmit}>
              <Card isPremium={true} isNeumorphic={true} className="p-8 lg:p-10 text-left space-y-8">
              
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900 tracking-tight">Choose Dates</h2>
                <p className="text-xs text-slate-400 font-medium">Select when you need the caregiver to start and end.</p>
              </div>

              {/* Date pickers */}
              <div className="grid sm:grid-cols-2 gap-6">
                <Input
                  isNeumorphic={true}
                  label="Start Date"
                  type="date"
                  required
                  value={startDate}
                  min={todayStr}
                  onChange={e => {
                    setStartDate(e.target.value);
                    setError('');
                  }}
                  leftIcon={CalendarDays}
                />
                <Input
                  isNeumorphic={true}
                  label="End Date"
                  type="date"
                  required
                  value={endDate}
                  min={startDate || todayStr}
                  onChange={e => {
                    setEndDate(e.target.value);
                    setError('');
                  }}
                  leftIcon={CalendarDays}
                />
              </div>

              {/* Dynamic Price Summary */}
              <AnimatePresence initial={false}>
                {days > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 rounded-xl bg-brand-bg border border-transparent neumorphic-concave space-y-4">
                      <h4 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                        Price Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Total Days</span>
                          <span className="text-slate-800">{days} {days === 1 ? 'Day' : 'Days'}</span>
                        </div>
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500">Price per day</span>
                          <span className="text-slate-800">GH₵{nurse?.hourly_rate?.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-sm pt-3 border-t border-slate-200/60 font-bold">
                          <span className="text-slate-900 uppercase tracking-wider text-[10px] self-center">Total Price</span>
                          <span className="text-brand-primary text-xl font-black">GH₵{price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Messages / Status */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-start gap-3 p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100"
                  >
                    <AlertCircle className="h-5 w-5 shrink-0 text-rose-500 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="flex items-start gap-3 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100"
                  >
                    <CheckCircle className="h-5 w-5 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{success}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Buttons */}
              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={loading || !startDate || !endDate || days <= 0} 
                  isLoading={loading}
                  rightIcon={ShieldCheck}
                  className="w-full"
                >
                  Book Visit
                </Button>

                {/* Subdued Sandbox Notice */}
                <p className="text-[10px] text-center text-slate-400 font-semibold leading-relaxed px-4">
                  Note: This is a demo booking. No actual payment is required, and no real caregivers will visit.
                </p>
              </div>

              </Card>
            </form>
          </div>

          {/* Sidebar / Care Provider Card */}
          <aside className="lg:col-span-2">
            <Card isPremium={true} isNeumorphic={true} className="p-8 space-y-6">
              
              <h3 className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                Your Caregiver
              </h3>
              
              <div className="flex items-center gap-5">
                <img 
                  src={nurse?.avatar_url} 
                  className="h-16 w-16 rounded-xl object-cover border-2 border-white shadow-md" 
                  alt={nurse?.name} 
                />
                <div>
                  <p className="text-lg font-bold text-slate-900 leading-snug">
                    {nurse?.name}
                  </p>
                  <p className="text-[10px] font-semibold text-brand-primary uppercase tracking-wide mt-0.5">
                    Verified Professional
                  </p>
                </div>
              </div>

              {/* Details table / badges */}
              <div className="space-y-3 pt-5 border-t border-slate-100">
                
                {nurse?.license_number && (
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Nursing License</span>
                    <span className="text-slate-800 font-mono">{nurse.license_number}</span>
                  </div>
                )}
                
                {nurse?.experience_years !== undefined && (
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Experience</span>
                    <span className="text-slate-800">{nurse.experience_years} Years</span>
                  </div>
                )}

                {nurse?.availability && (
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-400">Available Days</span>
                    <span className="text-slate-800 bg-brand-primary-light text-brand-primary px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">
                      {nurse.availability === 'Weekdays' ? 'Mon - Fri' : nurse.availability === 'Weekends' ? 'Sat & Sun' : '24/7'}
                    </span>
                  </div>
                )}

              </div>

              {/* Badges / Clinical Safety */}
              <div className="space-y-3 pt-5 border-t border-slate-100 text-slate-500">
                <div className="flex items-start gap-3">
                  <Shield className="h-4.5 w-4.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold leading-relaxed">
                    Background checked and fully licensed.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="h-4.5 w-4.5 text-brand-primary shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold leading-relaxed">
                    Flat rate session pricing includes primary assessment.
                  </span>
                </div>
              </div>

            </Card>
          </aside>

        </div>
      </div>
    </div>
  );
}
