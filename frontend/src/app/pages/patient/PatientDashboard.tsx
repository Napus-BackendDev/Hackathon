import React from 'react';
import { FileText, CreditCard, Activity, Calendar } from 'lucide-react';

export const PatientDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 rounded-xl p-8 text-white shadow-lg shadow-teal-900/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Welcome back, James!</h2>
          <p className="opacity-90">Your next appointment is scheduled for Oct 24, 2023 with Dr. Emily Stones.</p>
          <button className="mt-6 bg-slate-700 text-teal-300 px-5 py-2.5 rounded-lg font-semibold shadow-sm hover:bg-slate-600 transition-colors">
            View Appointment Details
          </button>
        </div>
        {/* Abstract Background Shapes */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute right-40 bottom-0 w-32 h-32 bg-emerald-400 opacity-20 rounded-full pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg shadow-black/10 border border-slate-700/50 hover:border-slate-600 hover:shadow-xl transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mb-4 text-teal-400 group-hover:bg-teal-500/30 transition-colors">
            <FileText size={24} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-lg">Medical Records</h3>
          <p className="text-sm text-slate-400 mb-6">Access your history, lab results, and diagnoses.</p>
          <button className="text-sm font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 group-hover:gap-2 transition-all">
            View Records →
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg shadow-black/10 border border-slate-700/50 hover:border-slate-600 hover:shadow-xl transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4 text-emerald-400 group-hover:bg-emerald-500/30 transition-colors">
            <CreditCard size={24} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-lg">Billing & Insurance</h3>
          <p className="text-sm text-slate-400 mb-6">View statements and manage payments.</p>
          <button className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 group-hover:gap-2 transition-all">
            Manage Billing →
          </button>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg shadow-black/10 border border-slate-700/50 hover:border-slate-600 hover:shadow-xl transition-all cursor-pointer group">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-4 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
            <Activity size={24} />
          </div>
          <h3 className="font-semibold text-white mb-1 text-lg">Health Vitals</h3>
          <p className="text-sm text-slate-400 mb-6">Track your blood pressure, weight, and more.</p>
          <button className="text-sm font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 group-hover:gap-2 transition-all">
            View Trends →
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg shadow-black/10 border border-slate-700/50 p-6">
        <h3 className="font-semibold text-white mb-6 flex items-center gap-2">
           <Calendar className="text-teal-400" size={20} />
           Recent Timeline
        </h3>
        <div className="space-y-8 pl-2">
          <div className="flex gap-4 relative">
            {/* Connecting Line */}
            <div className="absolute top-8 left-[5.5px] bottom-[-32px] w-0.5 bg-slate-700/50" />

            <div className="flex flex-col items-center z-10">
              <div className="w-3 h-3 bg-teal-500 rounded-full ring-4 ring-slate-800" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Cardiology Consultation</p>
              <p className="text-xs text-slate-500 mb-1 font-mono">Oct 15, 2023 • Dr. Emily Stones</p>
              <p className="text-sm text-slate-400 bg-slate-700/30 p-3 rounded-lg mt-2 border border-slate-700">
                Follow-up for chest pain. ECG performed.
              </p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center z-10">
              <div className="w-3 h-3 bg-slate-600 rounded-full ring-4 ring-slate-800" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Lab Results Available</p>
              <p className="text-xs text-slate-500 mb-1 font-mono">Oct 14, 2023</p>
              <p className="text-sm text-slate-400">Complete Blood Count (CBC) results are ready.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
