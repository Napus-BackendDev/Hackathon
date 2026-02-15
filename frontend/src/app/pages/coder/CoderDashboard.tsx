import React, { useMemo } from 'react';
import * as XLSX from 'xlsx';
import { useData } from '../../context/DataContext';
import { 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  Zap, 
  Brain, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Target,
  Loader2,
  Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { format, subDays, isAfter, isBefore, startOfDay } from 'date-fns';
import { toast } from 'sonner';

export const CoderDashboard = () => {
  const { records, loading, error } = useData();
  const navigate = useNavigate();

  // --- Derived Data from Real API ---
  const stats = useMemo(() => {
    const pendingCount = records.filter(r => r.status === 'PENDING').length;
    const inReviewCount = records.filter(r => r.status === 'IN_REVIEW').length;
    const completedCount = records.filter(r => r.status === 'COMPLETED').length;
    const flaggedCount = records.filter(r => r.status === 'FLAGGED').length;
    
    // Calculate today's completed (records with codes added today - simulated)
    const todayCompleted = records.filter(r => r.status === 'COMPLETED').length;
    
    // Calculate average codes per record
    const totalCodes = records.reduce((sum, r) => sum + r.codes.length, 0);
    const avgCodes = records.length > 0 ? (totalCodes / records.length).toFixed(1) : '0';
    
    // Calculate accuracy (simulated based on code confidence)
    const totalConfidence = records.reduce((sum, r) => {
      const recordConfidence = r.codes.reduce((cSum, c) => cSum + c.confidence, 0);
      return sum + (r.codes.length > 0 ? recordConfidence / r.codes.length : 0);
    }, 0);
    const accuracy = records.length > 0 ? ((totalConfidence / records.length) * 100).toFixed(1) : '0';

    return {
      pending: pendingCount,
      inReview: inReviewCount,
      completed: completedCount,
      flagged: flaggedCount,
      todayCompleted,
      avgCodes,
      accuracy,
      total: records.length
    };
  }, [records]);

  // Handle Excel download
  const handleDownloadExcel = async () => {
    try {
      toast.loading('Fetching patient data from backend...');
      
      // Fetch data from backend
      const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_BASE_URL}/patients`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }

      const data = await response.json();
      const patients = data.data || [];

      if (patients.length === 0) {
        toast.error('No patient data available to export');
        return;
      }

      // Prepare data for Excel with exact column order
      const excelData = patients.map((patient: any) => {
        const row: any = {
          'AN': patient.AN || '',
          'name': patient.name || '',
          'dob': patient.dob || '',
          'sex': patient.sex || '',
          'dateadm': patient.dateadm || '',
          'timeadm': patient.timeadm || '',
          'datedsc': patient.datedsc || '',
          'timedsc': patient.timedsc || '',
          'age': patient.age || '',
          'ageday': patient.ageday || '',
          'cc': patient.cc || '',
          'pi': patient.pi || '',
          'ph': patient.ph || '',
          'fh': patient.fh || '',
          'patient_examine': patient.patient_examine || '',
          'bt': patient.bt || '',
          'pr': patient.pr || '',
          'rr': patient.rr || '',
          'bp': patient.bp || '',
          'o2': patient.o2 || '',
          'pre_diagnosis': patient.pre_diagnosis || '',
          'reason_for_admit': patient.reason_for_admit || '',
          'treatment_plan': patient.treatment_plan || '',
          'pdx': patient.pdx || '',
        };

        // Add sdx1-12
        for (let i = 1; i <= 12; i++) {
          row[`sdx${i}`] = patient[`sdx${i}`] || '';
        }

        // Add proc1-20
        for (let i = 1; i <= 20; i++) {
          row[`proc${i}`] = patient[`proc${i}`] || '';
        }

        // Add final columns
        row['drg'] = patient.drg || '';
        row['rw'] = patient.rw || '';
        row['wtlos'] = patient.wtlos || '';
        row['adjrw'] = patient.adjrw || '';
        row['lengthofstay'] = patient.lengthofstay || '';

        return row;
      });

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Records');

      // Set column widths for better readability
      const columnWidths = [
        { wch: 12 },  // AN
        { wch: 25 },  // name
        { wch: 12 },  // dob
        { wch: 6 },   // sex
        { wch: 12 },  // dateadm
        { wch: 10 },  // timeadm
        { wch: 12 },  // datedsc
        { wch: 10 },  // timedsc
        { wch: 6 },   // age
        { wch: 8 },   // ageday
        { wch: 10 },  // cc
        { wch: 30 },  // pi
        { wch: 30 },  // ph
        { wch: 30 },  // fh
        { wch: 40 },  // patient_examine
        { wch: 8 },   // bt
        { wch: 8 },   // pr
        { wch: 8 },   // rr
        { wch: 10 },  // bp
        { wch: 8 },   // o2
        { wch: 30 },  // pre_diagnosis
        { wch: 30 },  // reason_for_admit
        { wch: 40 },  // treatment_plan
        { wch: 10 },  // pdx
        // sdx1-12
        ...Array(12).fill({ wch: 10 }),
        // proc1-20
        ...Array(20).fill({ wch: 10 }),
        { wch: 10 },  // drg
        { wch: 10 },  // rw
        { wch: 10 },  // wtlos
        { wch: 10 },  // adjrw
        { wch: 12 },  // lengthofstay
      ];
      worksheet['!cols'] = columnWidths;

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `Coder_Patient_Records_${date}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);
      
      toast.success(`Excel file downloaded successfully! (${patients.length} records)`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data to Excel');
    }
  };

  // Generate performance data from actual records
  const performanceData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => {
      // Simulate daily data based on actual records
      const dayRecords = records.filter(r => r.status === 'COMPLETED');
      const completed = Math.floor(dayRecords.length / 7) + Math.floor(Math.random() * 5);
      const accuracy = 92 + Math.floor(Math.random() * 8);
      return { name: day, completed, accuracy };
    });
  }, [records]);

  // Calculate specialty accuracy from actual codes
  const accuracyData = useMemo(() => {
    const specialties: { [key: string]: { total: number; confidence: number } } = {};
    
    records.forEach(record => {
      const dept = record.department || 'General';
      if (!specialties[dept]) {
        specialties[dept] = { total: 0, confidence: 0 };
      }
      
      record.codes.forEach(code => {
        specialties[dept].total++;
        specialties[dept].confidence += code.confidence;
      });
    });

    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#6366f1', '#ec4899'];
    
    return Object.entries(specialties)
      .map(([name, data], index) => ({
        name,
        value: data.total > 0 ? Math.round((data.confidence / data.total) * 100) : 0,
        color: colors[index % colors.length]
      }))
      .slice(0, 5); // Top 5 specialties
  }, [records]);

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  // --- Components ---

  const StatCard = ({ title, value, subtitle, icon: Icon, colorClass, trend, onClick }: any) => (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`bg-slate-800/50 backdrop-blur-sm p-5 rounded-2xl shadow-lg shadow-black/10 border border-slate-700/50 relative overflow-hidden group cursor-pointer hover:border-slate-600 hover:shadow-xl transition-all`}
    >
      {/* Background decoration */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 group-hover:opacity-20 transition-opacity ${colorClass.replace('text-', 'bg-')}`} />

      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className={`p-2.5 rounded-xl ${colorClass.replace('text-', 'bg-')} bg-opacity-20 text-opacity-100`}>
          <Icon className={colorClass.replace('500', '400')} size={20} />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
            <TrendingUp size={12} />
            {trend}
          </div>
        )}
      </div>

      <div className="relative z-10">
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-sm font-medium text-slate-400 mt-1">{title}</p>
        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
          {subtitle}
        </p>
      </div>
    </motion.div>
  );

  // Loading State
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-teal-500 mb-4" size={48} />
        <p className="text-sm text-slate-400">Loading dashboard data...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <AlertCircle className="text-red-500 mb-4" size={48} />
        <p className="text-lg font-semibold text-white mb-2">Failed to load dashboard</p>
        <p className="text-sm text-slate-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-[1600px] mx-auto pb-8"
    >
      {/* Welcome Section */}
      <motion.div variants={itemVariants} className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Coder Workspace</h2>
          <p className="text-slate-400 text-sm mt-1">
            {stats.total} total records • {stats.pending} pending • {stats.completed} completed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-500 transition-colors flex items-center gap-2 shadow-lg shadow-teal-900/20"
          >
            <Download size={16} />
            Download Excel
          </button>
          <button
             onClick={() => navigate('/coder/records')}
             className="px-4 py-2 bg-slate-700 text-white text-sm font-bold rounded-xl hover:bg-slate-600 transition-colors shadow-lg shadow-black/10 flex items-center gap-2"
          >
            <FileText size={16} />
            Start Coding
          </button>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          title="Pending Records" 
          value={stats.pending + stats.inReview} 
          subtitle={`${stats.flagged} flagged for review`}
          icon={Clock}
          colorClass="text-amber-500"
          onClick={() => navigate('/coder/records')}
        />
        <StatCard 
          title="Completed Records" 
          value={stats.completed} 
          subtitle={`${stats.avgCodes} avg codes/record`}
          icon={CheckCircle}
          colorClass="text-teal-500"
          trend={stats.completed > 0 ? `${Math.min(stats.completed, 99)}%` : '0%'}
        />
        <StatCard 
          title="Accuracy Score" 
          value={`${stats.accuracy}%`} 
          subtitle="Based on code confidence"
          icon={Target}
          colorClass="text-indigo-500"
          trend={parseFloat(stats.accuracy) > 95 ? '+0.4%' : ''}
        />
        <StatCard 
          title="Total Codes" 
          value={records.reduce((sum, r) => sum + r.codes.length, 0)} 
          subtitle={`Across ${stats.total} records`}
          icon={Zap}
          colorClass="text-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Chart Section */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black/10 border border-slate-700/50">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-white flex items-center gap-2">
               <BarChart3 size={18} className="text-slate-400" />
               Throughput & Accuracy
             </h3>
             <select className="bg-slate-700/50 border border-slate-600 text-xs font-bold text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none hover:bg-slate-700 transition-colors">
               <option>This Week</option>
               <option>Last Week</option>
               <option>This Month</option>
             </select>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#475569" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #475569', backgroundColor: '#1e293b', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.3)', color: '#e2e8f0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#14b8a6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorCompleted)" 
                  name="Records Completed"
                />
                <Area 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#6366f1" 
                  strokeWidth={3}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorAccuracy)" 
                  name="Accuracy %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Side Panel: Quality & Tasks */}
        <div className="space-y-6">
          
          {/* Quality Breakdown */}
          <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg shadow-black/10 border border-slate-700/50">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Target size={18} className="text-slate-400" />
              Quality by Department
            </h3>
            <div className="space-y-4">
              {accuracyData.length > 0 ? (
                accuracyData.map((item, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-400">{item.name}</span>
                      <span className="text-white">{item.value}%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden border border-slate-700">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 1, delay: 0.5 + (index * 0.1) }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500 text-center py-4">No data available</p>
              )}
            </div>
          </motion.div>

          {/* AI Tip */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
             <div className="relative z-10">
               <div className="flex items-center gap-2 mb-3">
                 <Brain size={18} className="text-purple-200" />
                 <h4 className="font-bold text-sm text-purple-100 uppercase tracking-wider">AI Insight</h4>
               </div>
               <p className="text-sm font-medium leading-relaxed mb-4 text-white/90">
                 {stats.total > 0 
                   ? `You have ${stats.pending} pending records. Focus on high-priority cases to improve throughput.`
                   : "No records available. Start by uploading patient data."}
               </p>
               <button className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg font-bold transition-colors">
                 View Guidelines
               </button>
             </div>
             {/* Decorative circles */}
             <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl" />
             <div className="absolute bottom-[-20%] left-[-10%] w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />
          </motion.div>

        </div>
      </div>

      {/* Recent Records List */}
      <motion.div variants={itemVariants} className="bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg shadow-black/10 border border-slate-700/50 overflow-hidden">
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center">
           <h3 className="font-bold text-white">Recent Assignments</h3>
           <button
             onClick={() => navigate('/coder/records')}
             className="text-sm text-teal-400 font-bold hover:text-teal-300 flex items-center gap-1 transition-colors"
           >
             View All <ChevronRight size={16} />
           </button>
        </div>
        <div className="divide-y divide-slate-700/50">
          {records.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto text-slate-600 mb-3" size={48} />
              <p className="text-sm font-medium text-slate-400">No records available</p>
              <p className="text-xs text-slate-500 mt-1">Patient records will appear here</p>
            </div>
          ) : (
            records.slice(0, 5).map((record, index) => (
              <motion.div
                key={record.id}
                whileHover={{ backgroundColor: 'rgba(71, 85, 105, 0.2)' }}
                onClick={() => navigate(`/coder/coding/${record.id}`)}
                className="p-4 flex items-center justify-between cursor-pointer group transition-colors"
              >
                 <div className="flex items-center gap-4">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                     ${record.status === 'COMPLETED' ? 'bg-teal-500/20 text-teal-400' :
                       record.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400' :
                       record.status === 'IN_REVIEW' ? 'bg-blue-500/20 text-blue-400' :
                       'bg-red-500/20 text-red-400'}`}
                   >
                     {record.patientName.charAt(0)}
                   </div>
                   <div>
                     <p className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">
                       {record.patientName}
                     </p>
                     <p className="text-xs text-slate-500 font-mono mt-0.5">
                       {record.mrn} • {record.department} • {record.codes.length} codes
                     </p>
                   </div>
                 </div>

                 <div className="flex items-center gap-6">
                   <div className="text-right hidden sm:block">
                     <p className="text-xs text-slate-500 font-medium uppercase">Service Date</p>
                     <p className="text-xs text-slate-300 font-medium">
                       {format(new Date(record.dateOfService), 'MMM d, yyyy')}
                     </p>
                   </div>

                   <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 w-28 justify-center
                     ${record.status === 'COMPLETED' ? 'bg-teal-500/20 text-teal-400 border-teal-500/30' :
                       record.status === 'PENDING' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                       record.status === 'IN_REVIEW' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                       'bg-red-500/20 text-red-400 border-red-500/30'}`}
                   >
                     {record.status === 'COMPLETED' ? <CheckCircle size={12} /> :
                      record.status === 'PENDING' ? <Clock size={12} /> :
                      <AlertCircle size={12} />}
                     {record.status}
                   </div>

                   <ChevronRight size={16} className="text-slate-600 group-hover:text-teal-400 transition-colors" />
                 </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
