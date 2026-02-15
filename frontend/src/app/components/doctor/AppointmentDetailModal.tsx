import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CreditCard, 
  FileText, 
  CheckCircle,
  Phone,
  Mail,
  Shield,
  Stethoscope
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'motion/react';

interface AppointmentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: any;
}

export const AppointmentDetailModal = ({ isOpen, onClose, patient }: AppointmentDetailModalProps) => {
  if (!patient) return null;

  // Mock extended details
  const appointmentDetails = {
    type: 'Follow-up Visit',
    duration: '30 min',
    room: 'Exam Room 3B',
    provider: 'Dr. Sarah Wilson',
    insurance: {
      payer: 'Blue Cross Blue Shield',
      plan: 'PPO Gold',
      id: 'XEP992839102',
      status: 'Verified'
    },
    contact: {
      phone: '(555) 123-4567',
      email: patient.name.toLowerCase().replace(' ', '.') + '@example.com'
    },
    reason: patient.lastVisitSummary || 'Routine check-up and medication review.',
    referral: 'None',
    copay: '$25.00'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-slate-800/50">
              <div className="flex items-center gap-2">
                <Calendar className="text-teal-400" size={20} />
                <h2 className="text-lg font-bold text-white">Appointment Details</h2>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[80vh]">
              
              {/* Patient Header Card */}
              <div className="flex items-start gap-4 p-4 bg-teal-500/10 rounded-xl border border-teal-500/20 mb-6">
                <div className="w-16 h-16 rounded-full bg-slate-800 text-teal-400 flex items-center justify-center font-bold text-2xl border border-slate-700 shadow-sm">
                  {patient.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-white">{patient.name}</h3>
                      <p className="text-sm text-slate-400 font-mono mt-1">{patient.mrn} • {patient.age} yrs • {patient.gender}</p>
                    </div>
                    <span className={clsx(
                      "px-3 py-1 rounded-full text-xs font-bold border",
                      patient.notesStatus === 'Completed' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                      patient.notesStatus === 'In Progress' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                      "bg-slate-700/50 text-slate-400 border-slate-600"
                    )}>
                      {patient.notesStatus}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-500" />
                      {appointmentDetails.contact.phone}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="text-slate-500" />
                      {appointmentDetails.contact.email}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Column: Logistics */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Clock size={14} /> Time & Location
                    </h4>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Date</span>
                        <span className="text-sm font-semibold text-slate-200">{patient.visitDate}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Time</span>
                        <span className="text-sm font-semibold text-slate-200">09:30 AM</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Duration</span>
                        <span className="text-sm font-semibold text-slate-200">{appointmentDetails.duration}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Location</span>
                        <span className="text-sm font-medium text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                          {patient.department}, {appointmentDetails.room}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Shield size={14} /> Insurance & Billing
                    </h4>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-3 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Payer</span>
                        <span className="text-sm font-semibold text-slate-200">{appointmentDetails.insurance.payer}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-400">Plan Status</span>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          {appointmentDetails.insurance.status}
                        </span>
                      </div>
                      <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                        <span className="text-sm text-slate-400">Copay Due</span>
                        <span className="text-sm font-bold text-white">{appointmentDetails.copay}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Clinical Context */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Stethoscope size={14} /> Visit Information
                    </h4>
                    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 space-y-4 shadow-sm">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Provider</p>
                        <div className="flex items-center gap-2">
                           <User size={16} className="text-slate-400" />
                           <span className="text-sm font-medium text-slate-200">{appointmentDetails.provider}</span>
                        </div>
                      </div>
                      <div>
                         <p className="text-xs text-slate-500 mb-1">Visit Type</p>
                         <span className="text-sm font-medium text-slate-200 block">{appointmentDetails.type}</span>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Chief Complaint / Reason</p>
                        <p className="text-sm text-slate-300 bg-slate-900 p-2 rounded-lg border border-slate-700 leading-relaxed">
                          "{appointmentDetails.reason}"
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                     <h5 className="text-sm font-bold text-blue-400 mb-2 flex items-center gap-2">
                       <FileText size={16} /> Pre-Visit Notes
                     </h5>
                     <p className="text-xs text-blue-300/80 leading-relaxed">
                       Patient requested refill of Lisinopril. Please review BP logs from home monitoring (available in chart).
                     </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-slate-700 bg-slate-800 flex justify-end gap-3">
              <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
              >
                Close
              </button>
              <button className="px-4 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 rounded-lg shadow-lg shadow-teal-900/20 transition-colors flex items-center gap-2">
                <CheckCircle size={16} />
                Check-In Patient
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
