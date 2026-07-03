import React, { useState, useEffect } from 'react';
import { 
  Award, Clock, CheckCircle2, AlertTriangle, FileText, 
  Send, User, ShieldCheck, DollarSign, Calendar, Edit3, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

export default function NurseDashboard({ user, token }) {
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('bookings'); // bookings, profile, verify

  // Form States for Profile Edit
  const [specialties, setSpecialties] = useState('');
  const [hourlyRate, setHourlyRate] = useState(25);
  const [availability, setAvailability] = useState('Weekdays');
  const [experienceYears, setExperienceYears] = useState(1);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [bio, setBio] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Form States for Document Submission
  const [docUrl, setDocUrl] = useState('');
  const [submittingDoc, setSubmittingDoc] = useState(false);

  const fetchNurseData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileData, bookingsData] = await Promise.all([
        api.get('/nurses/profile'),
        api.get('/bookings')
      ]);
      
      setProfile(profileData);
      setBookings(bookingsData);

      // Initialize form fields
      setSpecialties(profileData.specialties || '');
      setHourlyRate(profileData.hourly_rate || 25);
      setAvailability(profileData.availability || 'Weekdays');
      setExperienceYears(profileData.experience_years || 1);
      setAvatarUrl(profileData.avatar_url || '');
      setBio(profileData.bio || '');
      setLicenseNumber(profileData.license_number || '');

    } catch (err) {
      setError(err || 'Failed to retrieve profile data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNurseData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await api.put('/nurses/profile', {
        specialties,
        hourly_rate: parseFloat(hourlyRate) || 0,
        availability,
        experience_years: parseInt(experienceYears) || 0,
        avatar_url: avatarUrl,
        bio,
        license_number: licenseNumber
      });
      alert('Profile updated successfully.');
      fetchNurseData();
    } catch (err) {
      alert(err || 'Failed to update profile settings.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSubmitVerification = async (e) => {
    e.preventDefault();
    if (!docUrl.trim()) return alert('Please enter a document URL.');
    setSubmittingDoc(true);
    try {
      await api.post('/nurses/verify', { document_url: docUrl });
      alert('Credentials submitted for review.');
      setDocUrl('');
      fetchNurseData();
    } catch (err) {
      alert(err || 'Failed to submit verification.');
    } finally {
      setSubmittingDoc(false);
    }
  };

  const handleUpdateBookingStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}`, { status });
      fetchNurseData();
    } catch (err) {
      alert(err || 'Failed to update schedule status.');
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

  const getVerificationBadgeColor = (status) => {
    switch (status) {
      case 'verified': return 'text-emerald-500 bg-emerald-500/10 border-emerald-100';
      case 'under_review': return 'text-amber-500 bg-amber-500/10 border-amber-100';
      case 'rejected': return 'text-rose-500 bg-rose-50/10 border-rose-100';
      default: return 'text-slate-500 bg-slate-100 border-slate-200';
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
              Nurse <span className="text-gradient">Console</span>
              <span className={`text-[10px] px-3 py-1 border rounded-full uppercase tracking-wider font-black ${getVerificationBadgeColor(profile?.verification_status)}`}>
                {profile?.verification_status}
              </span>
            </h1>
            <p className="text-slate-500 font-medium italic">Welcome, {user?.name.split(' ')[0]}. Manage patient requests, verify clinical documents, and configure profile parameters.</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center gap-3 text-sm">
            <AlertTriangle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100/50 rounded-2xl max-w-lg border border-slate-200/50">
          {[
            { id: 'bookings', label: 'Booking Requests', icon: Calendar },
            { id: 'profile', label: 'Profile Setup', icon: Edit3 },
            { id: 'verify', label: 'Credentials Verify', icon: Award }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${activeTab === tab.id ? 'bg-brand-primary text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content Display */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            
            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Active Client Requests</h3>
                
                {bookings.length === 0 ? (
                  <div className="glass-card rounded-[40px] p-12 text-center space-y-4 max-w-2xl mx-auto border-dashed border-2 border-slate-200">
                    <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                      <FileText className="h-8 w-8" />
                    </div>
                    <h4 className="text-lg font-black text-slate-900">No Booking Log Active</h4>
                    <p className="text-sm text-slate-500 max-w-md mx-auto">
                      Patients have not submitted scheduling requests for your profile yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6">
                    {bookings.map(b => (
                      <div 
                        key={b.id}
                        className="glass-card rounded-[32px] p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 hover:shadow-xl transition-all duration-300 border-slate-100/50"
                      >
                        <div className="space-y-1">
                          <h4 className="text-base font-black text-slate-900 flex items-center gap-2">
                            Client: {b.client_name}
                          </h4>
                          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{b.client_email}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1.5 text-xs text-slate-500">
                            <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-slate-400" /> {b.start_date} to {b.end_date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-slate-400" /> {b.hours_per_day} hr/day</span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between lg:justify-center w-full lg:w-auto border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-100 gap-4 shrink-0">
                          <div className="text-left lg:text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Calculated Compensation</p>
                            <p className="text-xl font-black text-slate-900">${b.total_price}</p>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-wider ${getStatusColor(b.status)}`}>
                              {b.status}
                            </span>

                            {b.status === 'pending' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'approved')}
                                className="btn-primary !py-2.5 !px-5 text-xs shadow-md cursor-pointer"
                              >
                                Accept Booking
                              </button>
                            )}

                            {b.status === 'approved' && (
                              <button
                                onClick={() => handleUpdateBookingStatus(b.id, 'completed')}
                                className="px-4 py-2.5 border border-brand-primary text-brand-primary hover:bg-brand-primary/5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                Mark Completed
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                  
                  {/* Left Column: Form Info */}
                  <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Clinical Metadata</h3>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Configure your hour rate pricing, checkable clinical specialties, bio summary, and credential license identifier. Keeping these parameters active makes your profile searchable in the Registry.
                    </p>
                    
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt="Profile Avatar" className="h-44 w-44 rounded-3xl object-cover border-4 border-white shadow-xl shadow-slate-100" />
                    ) : (
                      <div className="h-44 w-44 rounded-3xl bg-slate-100 flex items-center justify-center text-slate-300 font-black border border-slate-200">NO AVATAR</div>
                    )}
                  </div>

                  {/* Right Column: Form Panel */}
                  <form onSubmit={handleUpdateProfile} className="lg:col-span-2 glass-card rounded-[40px] p-8 lg:p-10 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">License Number</label>
                        <input type="text" required value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} className="input-field" placeholder="RN-776655" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Hourly Billing Rate ($)</label>
                        <input type="number" required min={10} max={250} value={hourlyRate} onChange={e => setHourlyRate(e.target.value)} className="input-field" />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Clinical Availability</label>
                        <select value={availability} onChange={e => setAvailability(e.target.value)} className="input-field">
                          <option value="Weekdays">Weekdays Only</option>
                          <option value="Weekends">Weekends Only</option>
                          <option value="24/7">24/7 Active</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Clinical Experience (Years)</label>
                        <input type="number" required min={0} value={experienceYears} onChange={e => setExperienceYears(e.target.value)} className="input-field" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Avatar Image URL</label>
                      <input type="url" value={avatarUrl} onChange={e => setAvatarUrl(e.target.value)} className="input-field" placeholder="https://example.com/avatar.jpg" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Clinical Specialty Tags (Comma-separated)</label>
                      <input type="text" required value={specialties} onChange={e => setSpecialties(e.target.value)} className="input-field" placeholder="Dementia Care, Palliative Care, Wound Care" />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Short Professional Bio</label>
                      <textarea rows={4} value={bio} onChange={e => setBio(e.target.value)} className="input-field py-3 text-sm" placeholder="Summarize your nursing specialties and patient philosophy..." />
                    </div>

                    <button 
                      type="submit" 
                      disabled={savingProfile}
                      className="btn-primary w-full !py-4 text-xs disabled:opacity-50"
                    >
                      {savingProfile ? 'Saving Changes...' : 'Save Settings'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}

            {/* VERIFY TAB */}
            {activeTab === 'verify' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Board Verification Credentials</h3>
                
                <div className="grid lg:grid-cols-3 gap-12 items-start">
                  
                  <div className="lg:col-span-1 space-y-4">
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      To activate your profile inside the public nursing directory, you must verify your credentials. Submit proof of nursing board licensure (e.g. PDF link or credentials registry link).
                    </p>
                    <div className="p-4 rounded-2xl bg-white border border-slate-100 text-left space-y-2">
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-emerald-500" /> Active Badging</h5>
                      <p className="text-[10px] text-slate-400 font-medium leading-normal">Verified nursing accounts receive a permanent green badge next to their name and are prioritized in directory search logs.</p>
                    </div>
                  </div>

                  <div className="lg:col-span-2 glass-card rounded-[40px] p-8 lg:p-10 text-left space-y-6">
                    <div className="space-y-2 border-b border-slate-100 pb-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Current Verification Status</p>
                      <h4 className="text-lg font-black text-slate-900 capitalize">{profile?.verification_status}</h4>
                      
                      {profile?.verification_status === 'under_review' && (
                        <div className="mt-2 p-3 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl text-xs flex items-center gap-2">
                          <Clock className="h-4 w-4 shrink-0" /> Credentials submitted. Administrators will verify within 24 hours.
                        </div>
                      )}
                      {profile?.verification_status === 'verified' && (
                        <div className="mt-2 p-3 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-xl text-xs flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" /> Your account credentials are verified. You are active in the search directory.
                        </div>
                      )}
                      {profile?.verification_status === 'rejected' && (
                        <div className="mt-2 p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs space-y-1">
                          <p className="font-bold flex items-center gap-2"><AlertTriangle className="h-4 w-4 shrink-0" /> License credentials rejected.</p>
                          <p className="text-[11px] font-medium text-rose-500">Reason: {profile.rejection_reason || 'License number could not be validated on the state registry.'}</p>
                        </div>
                      )}
                    </div>

                    {(profile?.verification_status === 'pending' || profile?.verification_status === 'rejected') && (
                      <form onSubmit={handleSubmitVerification} className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Proof Document URL (License Registry or PDF Proof)</label>
                          <input 
                            type="url" 
                            required 
                            value={docUrl} 
                            onChange={e => setDocUrl(e.target.value)} 
                            className="input-field" 
                            placeholder="https://example.com/nurse_license_verification.pdf" 
                          />
                        </div>
                        <button 
                          type="submit" 
                          disabled={submittingDoc}
                          className="btn-primary w-full !py-4 text-xs disabled:opacity-50"
                        >
                          {submittingDoc ? 'Submitting Documents...' : 'Submit Licensing Credentials'}
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
