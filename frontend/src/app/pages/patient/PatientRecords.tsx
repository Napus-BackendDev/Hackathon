import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Calendar,
  Activity,
  Heart,
  Pill,
  Stethoscope,
  ClipboardCheck,
  ChevronRight,
  Search,
  Filter,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';

interface MedicalRecord {
  id: string;
  date: string;
  type: 'Consultation' | 'Lab Result' | 'Prescription' | 'Imaging' | 'Procedure';
  title: string;
  doctor: string;
  department: string;
  summary: string;
  status: 'Completed' | 'Pending' | 'In Progress';
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    date: '2024-10-15',
    type: 'Consultation',
    title: 'Annual Health Check-up',
    doctor: 'Dr. Sarah Mitchell',
    department: 'General Medicine',
    summary: 'Routine annual health examination. Overall health status is good. Blood pressure and vitals are within normal range.',
    status: 'Completed'
  },
  {
    id: '2',
    date: '2024-10-12',
    type: 'Lab Result',
    title: 'Complete Blood Count (CBC)',
    doctor: 'Dr. Sarah Mitchell',
    department: 'Laboratory',
    summary: 'CBC results show all parameters within normal limits. No abnormalities detected.',
    status: 'Completed'
  },
  {
    id: '3',
    date: '2024-10-10',
    type: 'Prescription',
    title: 'Medication Refill',
    doctor: 'Dr. James Wilson',
    department: 'Cardiology',
    summary: 'Prescribed: Lisinopril 10mg daily for blood pressure management. Continue for 3 months.',
    status: 'Completed'
  },
  {
    id: '4',
    date: '2024-10-08',
    type: 'Imaging',
    title: 'Chest X-Ray',
    doctor: 'Dr. Emily Stones',
    department: 'Radiology',
    summary: 'Chest X-ray shows clear lung fields. No acute cardiopulmonary disease.',
    status: 'Completed'
  },
  {
    id: '5',
    date: '2024-09-25',
    type: 'Procedure',
    title: 'ECG - Electrocardiogram',
    doctor: 'Dr. James Wilson',
    department: 'Cardiology',
    summary: 'ECG shows normal sinus rhythm. No significant abnormalities detected.',
    status: 'Completed'
  },
  {
    id: '6',
    date: '2024-09-20',
    type: 'Lab Result',
    title: 'Lipid Panel',
    doctor: 'Dr. Sarah Mitchell',
    department: 'Laboratory',
    summary: 'Cholesterol levels are slightly elevated. Dietary modifications recommended.',
    status: 'Completed'
  }
];

export const PatientRecords = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const getTypeIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'Consultation': return Stethoscope;
      case 'Lab Result': return Activity;
      case 'Prescription': return Pill;
      case 'Imaging': return Eye;
      case 'Procedure': return ClipboardCheck;
      default: return FileText;
    }
  };

  const getTypeColor = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'Consultation': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Lab Result': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Prescription': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Imaging': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Procedure': return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'All' || record.type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Medical Records</h1>
          <p className="text-slate-400 text-sm mt-1">View and download your medical history</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/20">
          <Download size={16} />
          Download All Records
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <FileText className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mockRecords.length}</p>
              <p className="text-xs text-slate-400">Total Records</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Activity className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-xs text-slate-400">Lab Results</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Pill className="text-purple-400" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">1</p>
              <p className="text-xs text-slate-400">Active Prescriptions</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <Calendar className="text-teal-400" size={20} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">Oct 15</p>
              <p className="text-xs text-slate-400">Last Visit</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" size={16} />
          <input
            type="text"
            placeholder="Search records, doctors, or departments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-200 rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-sm placeholder-slate-600"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Consultation', 'Lab Result', 'Prescription', 'Imaging', 'Procedure'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Records List */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="divide-y divide-slate-700/30">
          {filteredRecords.map((record, index) => {
            const Icon = getTypeIcon(record.type);
            return (
              <motion.div
                key={record.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedRecord(record)}
                className="p-5 hover:bg-slate-700/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`p-3 rounded-xl border ${getTypeColor(record.type)}`}>
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">
                          {record.title}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-bold ${getTypeColor(record.type)}`}>
                          {record.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        <Clock size={12} className="inline mr-1" />
                        {format(new Date(record.date), 'MMM dd, yyyy')} • {record.doctor} • {record.department}
                      </p>
                      <p className="text-sm text-slate-300 leading-relaxed">{record.summary}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors">
                      <Download size={16} />
                    </button>
                    <ChevronRight size={20} className="text-slate-600" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* No Results */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <FileText size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No records found matching your search.</p>
        </div>
      )}
    </div>
  );
};
