import React, { useState, useEffect } from 'react';
import { 
  Users, ShieldCheck, Clock, FileText, Check, X, 
  ExternalLink, ShieldAlert, Award, Search, LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

function AdminStatCard({ label, value, icon: Icon, color }) {
  return (
    <div className="glass-card p-6 rounded-[32px] flex items-center gap-5 text-left border-slate-100/50">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${color} shadow-lg shadow-current/5`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <h4 className="text-2xl font-black text-slate-900">{value}</h4>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pendingNurses, setPendingNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('verifications');

  const [selectedNurse, setSelectedNurse] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [verifying, setVerifying] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, nursesData] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/pending-nurses')
      ]);
      setStats(statsData);
      setPendingNurses(nursesData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleVerify = async (id, status) => {
    setVerifying(true);
    try {
      await api.patch(`/admin/verify-nurse/${id}`, { status, rejection_reason: rejectionReason });
      setSelectedNurse(null);
      setRejectionReason('');
      fetchAdminData();
    } catch (err) {
      alert(err);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6"><div className="h-12 w-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="relative min-h-screen bg-brand-bg px-6 py-12 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="text-left space-y-2">
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight flex items-center gap-4">
              Registry <span className="text-gradient">Oversight</span>
              <span className="text-xs px-3 py-1 bg-slate-900 text-white rounded-full uppercase tracking-widest font-black">Admin</span>
            </h1>
            <p className="text-slate-500 font-medium italic">Administrative console for credential verification and system health.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard label="Total Users" value={stats?.totalUsers} icon={Users} color="text-brand-primary bg-brand-primary/10" />
          <AdminStatCard label="Verified Professionals" value={stats?.verifiedNurses} icon={ShieldCheck} color="text-emerald-500 bg-emerald-500/10" />
          <AdminStatCard label="Pending Approval" value={stats?.pendingVerifications} icon={Clock} color="text-amber-500 bg-amber-500/10" />
          <AdminStatCard label="Total Bookings" value={stats?.totalBookings} icon={FileText} color="text-blue-500 bg-blue-500/10" />
        </div>

        <div className="grid lg:grid-cols-4 gap-12 items-start">
          
          <aside className="lg:col-span-1 space-y-4 text-left">
            {[
              { id: 'verifications', label: 'Verify Requests', icon: ShieldCheck },
              { id: 'users', label: 'Manage Users', icon: Users },
              { id: 'reports', label: 'Incident Reports', icon: ShieldAlert }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-[20px] font-black text-sm uppercase tracking-widest transition-all cursor-pointer ${activeTab === item.id ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-[1.02]' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </aside>

          <div className="lg:col-span-3 min-h-[500px] text-left">
            <AnimatePresence mode="wait">
              {activeTab === 'verifications' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-900">Pending Credential Reviews</h3>
                  
                  {pendingNurses.length === 0 ? (
                    <div className="glass-card p-12 rounded-[40px] text-center text-slate-400 font-medium">No pending verifications at this time. All caught up!</div>
                  ) : (
                    <div className="space-y-4">
                      {pendingNurses.map(nurse => (
                        <div key={nurse.id} className="glass-card p-6 rounded-[32px] border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 group">
                          <div className="flex items-center gap-5 w-full">
                            <img src={nurse.avatar_url} className="h-16 w-16 rounded-2xl object-cover border-4 border-white shadow-md" alt="" />
                            <div className="space-y-1">
                              <p className="font-black text-slate-900 text-lg leading-none">{nurse.name}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{nurse.email}</p>
                              <div className="flex gap-1 pt-1">
                                {nurse.specialties.split(',').map((s, i) => (
                                  <span key={i} className="text-[8px] font-black px-2 py-0.5 bg-slate-100 rounded-md text-slate-500 uppercase">{s.trim()}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {nurse.verification_document_url ? (
                              <a 
                                href={nurse.verification_document_url} 
                                target="_blank" 
                                rel="noreferrer"
                                className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-brand-primary hover:text-white transition-all cursor-pointer"
                                title="View Document"
                              >
                                <ExternalLink className="h-5 w-5" />
                              </a>
                            ) : (
                              <div className="p-3 rounded-xl bg-slate-50 text-slate-300" title="No document uploaded">
                                <FileText className="h-5 w-5" />
                              </div>
                            )}
                            
                            <button 
                              onClick={() => handleVerify(nurse.id, 'verified')}
                              className="p-3 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                              title="Approve"
                            >
                              <Check className="h-5 w-5" />
                            </button>
                            
                            <button 
                              onClick={() => { setSelectedNurse(nurse); setRejectionReason(''); }}
                              className="p-3 rounded-xl bg-rose-100 text-rose-600 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                              title="Reject"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {selectedNurse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-card w-full max-w-md p-8 rounded-[40px] relative text-left">
              <button onClick={() => setSelectedNurse(null)} className="absolute top-6 right-6 text-slate-400"><X className="h-6 w-6" /></button>
              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-900">Reject Verification</h3>
                <p className="text-sm text-slate-500">Provide a reason for rejecting <strong>{selectedNurse.name}'s</strong> credentials. This will be shown on their dashboard.</p>
                <textarea 
                  value={rejectionReason} 
                  onChange={e => setRejectionReason(e.target.value)}
                  className="input-field min-h-[120px] resize-none" 
                  placeholder="e.g. Expired medical license, unclear documentation..." 
                />
                <div className="flex gap-4">
                  <button onClick={() => setSelectedNurse(null)} className="btn-outline flex-1">Cancel</button>
                  <button onClick={() => handleVerify(selectedNurse.id, 'rejected')} disabled={!rejectionReason || verifying} className="btn-primary flex-1 bg-rose-500 hover:bg-rose-600 border-none shadow-rose-500/20">Confirm Rejection</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
