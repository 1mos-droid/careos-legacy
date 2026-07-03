import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  FileText, Calendar, DollarSign, Star, AlertTriangle, 
  CheckCircle2, Clock, X, MessageSquare, ArrowRight, Activity, Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

export default function FamilyDashboard({ user, token }) {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Review Modal state
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      setError(err || 'Failed to retrieve booking logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this care reservation?')) return;
    try {
      await api.patch(`/bookings/${id}`, { status: 'cancelled' });
      fetchBookings();
    } catch (err) {
      alert(err || 'Failed to cancel reservation.');
    }
  };

  const handleOpenReview = (booking) => {
    setSelectedBooking(booking);
    setRating(5);
    setComment('');
  };

  const handleCloseReview = () => {
    setSelectedBooking(null);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return alert('Please enter a review comment.');
    setSubmittingReview(true);
    try {
      await api.post('/nurses/reviews', {
        booking_id: selectedBooking.id,
        rating,
        comment
      });
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      alert(err || 'Failed to post review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-100';
      case 'completed': return 'text-blue-500 bg-blue-500/10 border-blue-100';
      case 'cancelled': return 'text-slate-400 bg-slate-100 border-slate-200';
      default: return 'text-amber-500 bg-amber-500/10 border-amber-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return CheckCircle2;
      case 'completed': return CheckCircle2;
      case 'cancelled': return X;
      default: return Clock;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:px-12 text-left">
      <div className="mx-auto max-w-7xl space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              My Care <span className="text-gradient">Console</span>
            </h1>
            <p className="text-slate-500 font-medium italic">Welcome back, {user?.name.split(' ')[0]}. Manage your active care schedules and reviews here.</p>
          </div>
          <button 
            onClick={() => navigate('/directory')}
            className="btn-primary !py-4 !px-8 text-sm flex items-center gap-3 group shadow-md"
          >
            <Search className="h-4 w-4" /> Book New Caregiver
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Bookings Table / List */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Care Schedules Logs</h3>

          {bookings.length === 0 ? (
            <div className="glass-card rounded-[40px] p-12 text-center space-y-6 max-w-2xl mx-auto border-dashed border-2">
              <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <FileText className="h-8 w-8" />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-slate-900">No Care Bookings Found</h4>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  You have not requested any care sessions yet. Check our registered database to book a professional nurse.
                </p>
              </div>
              <button 
                onClick={() => navigate('/directory')}
                className="btn-primary !py-4 !px-8 text-xs inline-flex items-center gap-2 cursor-pointer"
              >
                Browse Registered Nurses <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                return (
                  <motion.div 
                    layoutId={`booking-${booking.id}`}
                    key={booking.id}
                    className="glass-card rounded-[32px] p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-xl transition-all duration-300 border-slate-100/50"
                  >
                    <div className="flex gap-5 items-center">
                      <div className="h-16 w-16 rounded-[22px] bg-brand-primary/10 flex items-center justify-center text-brand-primary text-xl font-black shrink-0 border border-brand-primary/10">
                        {booking.nurse_name?.charAt(0) || 'N'}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                          {booking.nurse_name}
                        </h4>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{booking.nurse_specialties || 'General Care'}</p>
                        
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-500">
                          <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {booking.start_date} to {booking.end_date}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> {booking.hours_per_day} hr/day</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-4 shrink-0">
                      <div className="text-left lg:text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Compensation</p>
                        <p className="text-xl font-black text-slate-900">${booking.total_price}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {booking.status}
                        </span>

                        {(booking.status === 'pending' || booking.status === 'approved') && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 border border-rose-100 text-rose-500 hover:bg-rose-50 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        )}

                        {booking.status === 'completed' && booking.has_reviewed === 0 && (
                          <button
                            onClick={() => handleOpenReview(booking)}
                            className="btn-primary !py-2.5 !px-5 text-xs inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                          >
                            <MessageSquare className="h-3.5 w-3.5" /> Write Review
                          </button>
                        )}

                        {booking.status === 'completed' && booking.has_reviewed === 1 && (
                          <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Testimonial Submitted
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Review Dialog Modal */}
      <AnimatePresence>
        {selectedBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseReview}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass-card rounded-[40px] p-8 lg:p-10 shadow-2xl relative z-10 bg-white"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="text-left space-y-1">
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Submit Testimonial</h3>
                  <p className="text-xs text-slate-500 font-medium">Rate your experience with {selectedBooking.nurse_name}.</p>
                </div>
                <button 
                  onClick={handleCloseReview}
                  className="p-2 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitReview} className="space-y-6 text-left">
                {/* Rating selection */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Overall Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 rounded-lg text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star className={`h-8 w-8 ${star <= rating ? 'fill-current' : 'text-slate-200'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Comment textarea */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Comment / Feedback</label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="input-field py-3 text-sm focus:ring-brand-primary"
                    placeholder="Provide details on clinical expertise, communication, and responsiveness..."
                  />
                </div>

                <div className="flex gap-3">
                  <button 
                    type="button" 
                    onClick={handleCloseReview}
                    className="btn-glass flex-1 !py-3.5 !px-4 text-xs"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="btn-primary flex-1 !py-3.5 !px-4 text-xs disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Testimonial'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
