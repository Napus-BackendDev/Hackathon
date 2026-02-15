import React, { useState, useMemo } from 'react';
import { 
  Users, 
  ClipboardList, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  FileText,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  UserCheck,
  Flag,
  ChevronRight,
  Zap,
  Calculator,
  Loader2,
  AlertCircle,
  Download
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useData } from '../../context/DataContext';

export const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { records, loading, error } = useData();

  // Calculate stats from real data
  const stats = useMemo(() => {
    const pendingCount = records.filter(r => r.status === 'PENDING').length;
    const inReviewCount = records.filter(r => r.status === 'IN_REVIEW').length;
    const completedCount = records.filter(r => r.status === 'COMPLETED').length;
    
    // Calculate average codes per record
    const totalCodes = records.reduce((sum, r) => sum + r.codes.length, 0);
    const avgCodes = records.length > 0 ? (totalCodes / records.length).toFixed(1) : '0';
    
    // Calculate accuracy based on code confidence
    const totalConfidence = records.reduce((sum, r) => {
      const recordConfidence = r.codes.reduce((cSum, c) => cSum + c.confidence, 0);
      return sum + (r.codes.length > 0 ? recordConfidence / r.codes.length : 0);
    }, 0);
    const aiConfidence = records.length > 0 ? Math.round((totalConfidence / records.length) * 100) : 94;
    
    return {
      casesToday: pendingCount + inReviewCount,
      casesWeek: records.length,
      pendingAI: pendingCount,
      awaitingReview: inReviewCount,
      approved: completedCount,
      timeSavedCase: "4.2m",
      hoursSavedMonth: 28,
      aiConfidence,
      humanOverride: 12,
      approvedNoChange: 88,
      adjRw: 1.42,
      claimReadiness: 92,
    };
  }, [records]);

  // Get priority cases from real data (pending and flagged records)
  const initialPriorityCases = useMemo(() => {
    return records
      .filter(r => r.status === 'PENDING' || r.status === 'FLAGGED')
      .slice(0, 3)
      .map((record, index) => ({
        id: parseInt(record.id.slice(-3), 16) || index + 101,
        patient: record.patientName,
        issue: record.status === 'FLAGGED' ? (record.flagReason || 'Flagged for review') : 
               record.codes.length === 0 ? 'Missing Documentation' : 'Low Confidence AI',
        time: record.status === 'FLAGGED' ? 'Urgent' : `${2 + index}h remaining`
      }));
  }, [records]);

  const highRiskCases = [
    { id: 1, type: 'Missing Specificity', count: 3, label: 'Missing diagnosis specificity' },
    { id: 2, type: 'Incomplete', count: 2, label: 'Incomplete procedure details' },
  ];

  // --- State ---
  const [priorityCases, setPriorityCases] = useState(initialPriorityCases);
  const [calculatingId, setCalculatingId] = useState<number | null>(null);

  // Update priority cases when records change
  React.useEffect(() => {
    setPriorityCases(initialPriorityCases);
  }, [initialPriorityCases]);

  // --- Actions ---
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

      // Prepare data for Excel
      const excelData = patients.map((patient: any, index: number) => {
        // Collect all diagnosis codes (PDX + SDX)
        const diagnosisCodes: string[] = [];
        if (patient.pdx) diagnosisCodes.push(patient.pdx);
        for (let i = 1; i <= 12; i++) {
          const sdx = patient[`sdx${i}`];
          if (sdx) diagnosisCodes.push(sdx);
        }

        // Collect all procedure codes
        const procedureCodes: string[] = [];
        for (let i = 1; i <= 20; i++) {
          const proc = patient[`proc${i}`];
          if (proc) procedureCodes.push(proc);
        }

        return {
          'No.': index + 1,
          'AN (Admission Number)': patient.AN || '',
          'Patient Name': patient.name || '',
          'Age': patient.age || '',
          'Sex': patient.sex || '',
          'Date of Admission': patient.dateadm ? new Date(patient.dateadm).toLocaleDateString('th-TH') : '',
          'Date of Discharge': patient.datedsc ? new Date(patient.datedsc).toLocaleDateString('th-TH') : '',
          'Length of Stay': patient.lengthofstay || '',
          'Ward': patient.ward || '',
          'Doctor': patient.doctor || '',
          'Primary Diagnosis (PDX)': patient.pdx || '',
          'All Diagnosis Codes': diagnosisCodes.join(', '),
          'All Procedure Codes': procedureCodes.join(', '),
          'DRG': patient.drg || '',
          'RW (Relative Weight)': patient.rw || '',
          'Adj RW': patient.adjrw || '',
          'CC (Complication)': patient.cc || '',
          'Death': patient.death || '',
          'Discharge Type': patient.typedsc || '',
          'Refer In': patient.referin || '',
          'Refer Out': patient.referout || '',
        };
      });

      // Create worksheet and workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Patient Records');

      // Set column widths for better readability
      const columnWidths = [
        { wch: 5 },  // No.
        { wch: 15 }, // AN
        { wch: 25 }, // Patient Name
        { wch: 8 },  // Age
        { wch: 6 },  // Sex
        { wch: 15 }, // Date of Admission
        { wch: 15 }, // Date of Discharge
        { wch: 12 }, // Length of Stay
        { wch: 15 }, // Ward
        { wch: 20 }, // Doctor
        { wch: 15 }, // PDX
        { wch: 40 }, // All Diagnosis Codes
        { wch: 40 }, // All Procedure Codes
        { wch: 10 }, // DRG
        { wch: 10 }, // RW
        { wch: 10 }, // Adj RW
        { wch: 10 }, // CC
        { wch: 8 },  // Death
        { wch: 15 }, // Discharge Type
        { wch: 10 }, // Refer In
        { wch: 10 }, // Refer Out
      ];
      worksheet['!cols'] = columnWidths;

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0];
      const filename = `Patient_Records_${date}.xlsx`;

      // Download the file
      XLSX.writeFile(workbook, filename);
      
      toast.success(`Excel file downloaded successfully! (${patients.length} records)`);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export data to Excel');
    }
  };

  const handleAutoCalculate = (caseId: number) => {
    setCalculatingId(caseId);
    
    // Simulate AI Processing
    toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
      loading: 'AI analyzing clinical documentation...',
      success: () => {
        setCalculatingId(null);
        setPriorityCases(prev => prev.filter(c => c.id !== caseId));

        return 'Coding calculated & optimized successfully';
      },
      error: () => {
        setCalculatingId(null);
        return 'Calculation failed. Please review manually.';
      }
    });
  };

  // --- Components ---

  const StatCard = ({ title, value, subtext, icon: Icon, colorClass, trend }: any) => (
    <div className="bg-slate-800/50 backdrop-blur-sm p-5 rounded-xl shadow-lg shadow-black/10 border border-slate-700/50 flex flex-col justify-between h-full hover:border-slate-600 hover:shadow-xl transition-all group">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">{title}</h3>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-20`}>
          <Icon className={colorClass.replace('bg-', 'text-').replace('500', '400')} size={18} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <div className="flex items-center gap-2 mt-1">
          {trend && (
            <span className={`text-xs font-medium flex items-center ${trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            </span>
          )}
          <p className="text-xs text-slate-500">{subtext}</p>
        </div>
      </div>
    </div>
  );

  const SectionHeader = ({ title, icon: Icon }: any) => (
    <div className="flex items-center gap-2 mb-4 mt-8 first:mt-0">
      <div className="p-1.5 bg-slate-800 rounded-md text-slate-400 border border-slate-700">
        <Icon size={16} />
      </div>
      <h2 className="text-lg font-semibold text-white tracking-tight">{title}</h2>
    </div>
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
    <div className="space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* Header with Download Button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Doctor Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Overview of patient documentation and coding status</p>
        </div>
      </div>
      
      {/* 1. Core Operational Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Cases Today" 
          value={stats.casesToday} 
          subtext={`${stats.casesWeek} this week`} 
          icon={ClipboardList} 
          colorClass="bg-blue-500" 
          trend="up"
        />
        <StatCard 
          title="Pending AI Coding" 
          value={stats.pendingAI} 
          subtext="Processing now" 
          icon={Brain} 
          colorClass="bg-purple-500" 
          trend="up"
        />
        <StatCard 
          title="Avg Time Saved" 
          value={stats.timeSavedCase} 
          subtext={`${stats.hoursSavedMonth}h total this month`} 
          icon={Zap} 
          colorClass="bg-amber-500" 
          trend="up"
        />
        <StatCard 
          title="Approved & Exported" 
          value={stats.approved} 
          subtext="Ready for billing" 
          icon={CheckCircle} 
          colorClass="bg-teal-500" 
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: AI Performance & Priority */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 2. AI Performance & Trust */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-6">
            <div className="flex justify-between items-center mb-6">
              <SectionHeader title="AI Performance & Trust" icon={ShieldCheck} />
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                System Healthy
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Confidence Meter */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <span className="text-sm font-medium text-slate-400">Avg. Confidence Score</span>
                   <span className="text-2xl font-bold text-white">{stats.aiConfidence}%</span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_#10b981]" 
                    style={{ width: `${stats.aiConfidence}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500">Consistent with last week's performance.</p>
              </div>

              {/* Flagged Issues */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Flagged Issues</h4>
                {highRiskCases.map(issue => (
                  <div key={issue.id} className="flex justify-between items-center p-3 bg-red-500/5 rounded-lg border border-red-500/10 cursor-pointer hover:bg-red-500/10 hover:border-red-500/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <AlertTriangle size={16} className="text-red-400 group-hover:text-red-300 transition-colors" />
                      <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{issue.label}</span>
                    </div>
                    <span className="text-xs font-bold bg-slate-800 text-red-400 px-2 py-1 rounded border border-red-500/20 shadow-sm">
                      {issue.count} cases
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. User-Centric Productivity */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-6">
            <div className="flex justify-between items-center mb-4">
              <SectionHeader title="My Priority Cases" icon={Flag} />
              <button 
                onClick={() => navigate('/doctor/patients')}
                className="text-sm text-teal-400 font-medium hover:text-teal-300 hover:underline flex items-center gap-1 transition-colors"
              >
                View All <ChevronRight size={16} />
              </button>
            </div>
            <div className="space-y-3">
              {priorityCases.length > 0 ? (
                priorityCases.map(c => (
                  <div key={c.id} className="flex items-center justify-between p-4 border border-slate-700/50 rounded-lg hover:border-teal-500/30 hover:bg-slate-800/80 transition-all bg-slate-900/30 group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-teal-400 font-bold border border-slate-700 shadow-sm group-hover:border-teal-500/30 transition-colors">
                        {c.patient.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">{c.patient}</h4>
                        <p className="text-xs text-red-400 font-medium flex items-center gap-1">
                          <AlertTriangle size={12} /> {c.issue}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                        {c.time}
                      </span>
                      
                      {/* Auto Calculate Button */}
                      <button 
                        onClick={() => handleAutoCalculate(c.id)}
                        disabled={calculatingId === c.id}
                        className={`
                          flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border transition-all
                          ${calculatingId === c.id 
                            ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-wait' 
                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20 hover:border-indigo-500/40 hover:text-indigo-300'
                          }
                        `}
                      >
                        <Calculator size={14} className={calculatingId === c.id ? "animate-pulse" : ""} />
                        {calculatingId === c.id ? 'Calculating...' : 'Auto-Code'}
                      </button>

                      <button className="px-3 py-1.5 text-xs font-medium bg-teal-600 text-white rounded-lg hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/20">
                        Review
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-500 bg-slate-900/20 rounded-lg border border-dashed border-slate-800">
                  <CheckCircle size={24} className="mx-auto mb-2 text-teal-500/30" />
                  <p className="text-sm">All priority cases resolved.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Compliance & Financial */}
        <div className="space-y-6">
          
          {/* 3. Human-in-the-Loop */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-6">
            <SectionHeader title="Human Oversight" icon={UserCheck} />
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-indigo-500/5 rounded-lg border border-indigo-500/20 text-center">
                <div className="text-xl font-bold text-indigo-400">{stats.approvedNoChange}%</div>
                <div className="text-xs text-indigo-300/70 font-medium">Auto-Approved</div>
              </div>
              <div className="p-3 bg-orange-500/5 rounded-lg border border-orange-500/20 text-center">
                <div className="text-xl font-bold text-orange-400">{stats.humanOverride}%</div>
                <div className="text-xs text-orange-300/70 font-medium">Human Override</div>
              </div>
            </div>
            
          </div>

          {/* 4. Compliance Status */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-slate-700/50 p-6">
            <SectionHeader title="Compliance Status" icon={ShieldCheck} />
            <div className="space-y-4">
               <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-400">Audit Trail Completeness</span>
                 <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">100%</span>
               </div>
               <div className="flex items-center justify-between">
                 <span className="text-sm text-slate-400">Locked Records</span>
                 <span className="text-xs font-bold text-slate-300 bg-slate-700 px-2 py-1 rounded border border-slate-600">45/45</span>
               </div>
               <div className="mt-4 pt-4 border-t border-slate-700/50">
                 <p className="text-xs text-slate-500 mb-2">Recent Activity</p>
                 <div className="flex items-start gap-2 text-xs text-slate-400">
                   <div className="w-1.5 h-1.5 rounded-full bg-teal-500 mt-1.5 shadow-[0_0_5px_#14b8a6]"></div>
                   <span>Coder approved Batch #8821</span>
                 </div>
               </div>
            </div>
          </div>

          {/* 5. Financial Impact */}
          <div className="bg-gradient-to-br from-teal-900/80 to-slate-900 rounded-xl shadow-lg border border-teal-500/30 p-6 text-white relative overflow-hidden">
            {/* Glossy effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/20 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
            
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <TrendingUp size={18} className="text-teal-400" />
              <h3 className="font-semibold text-lg text-white">Impact</h3>
            </div>
            
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-teal-300/70 text-xs font-medium uppercase tracking-wider mb-1">Adj. RW Optimization</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-white">{stats.adjRw}</span>
                  <span className="text-xs text-emerald-400 font-bold mb-1 flex items-center">
                    <ArrowUpRight size={12} /> +0.12
                  </span>
                </div>
              </div>

              <div>
                 <p className="text-teal-300/70 text-xs font-medium uppercase tracking-wider mb-2">Claim Readiness Score</p>
                 <div className="w-full bg-slate-900/50 rounded-full h-2 mb-1 border border-slate-700/30">
                   <div className="bg-emerald-400 h-2 rounded-full transition-all duration-1000 shadow-[0_0_10px_#34d399]" style={{ width: `${stats.claimReadiness}%` }}></div>
                 </div>
                 <p className="text-xs text-teal-400 text-right">{stats.claimReadiness}% Ready</p>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* 7. Learning & Improvement */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-4 flex items-center justify-between text-sm text-slate-400">
        <div className="flex items-center gap-3">
          <Brain size={16} className="text-teal-400" />
          <span><span className="font-semibold text-slate-200">AI Learning:</span> Your recent correction on "Fracture Laterality" has improved model accuracy for future cases.</span>
        </div>
        <span className="text-xs text-slate-600">Passive Learning Active</span>
      </div>

    </div>
  );
};
