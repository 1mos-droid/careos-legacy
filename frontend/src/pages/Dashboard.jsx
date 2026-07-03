import React from 'react';
import FamilyDashboard from './FamilyDashboard';
import NurseDashboard from './NurseDashboard';
import AdminDashboard from './AdminDashboard';

export default function Dashboard({ token, user }) {
  if (user?.role === 'family') {
    return <FamilyDashboard user={user} token={token} />;
  }
  
  if (user?.role === 'nurse') {
    return <NurseDashboard user={user} token={token} />;
  }
  
  if (user?.role === 'admin' || user?.is_admin === 1) {
    return <AdminDashboard user={user} token={token} />;
  }

  // Fallback view in case of missing or unrecognized role
  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-left">
      <div className="glass-card p-8 rounded-[32px] border-slate-100 text-center space-y-4 max-w-md shadow-xl bg-white">
        <h3 className="text-xl font-black text-slate-900">CareOS Routing Failure</h3>
        <p className="text-sm text-slate-500">
          Your account role "{user?.role || 'anonymous'}" is unrecognized. Please sign out and sign in with a family, nurse, or admin account.
        </p>
      </div>
    </div>
  );
}
