import React, { useState } from 'react';
import { 
  CreditCard,
  Download,
  Eye,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  FileText,
  ChevronRight,
  Printer,
  Mail,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import { clsx } from 'clsx';

interface BillingStatement {
  id: string;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue' | 'Partially Paid';
  service: string;
  department: string;
  doctor: string;
  items: BillingItem[];
}

interface BillingItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const mockBillings: BillingStatement[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-1015',
    date: '2024-10-15',
    dueDate: '2024-10-30',
    amount: 8500,
    status: 'Paid',
    service: 'Annual Health Check-up',
    department: 'General Medicine',
    doctor: 'Dr. Sarah Mitchell',
    items: [
      { description: 'Consultation Fee', quantity: 1, unitPrice: 1500, total: 1500 },
      { description: 'Complete Blood Count (CBC)', quantity: 1, unitPrice: 800, total: 800 },
      { description: 'Lipid Panel', quantity: 1, unitPrice: 1200, total: 1200 },
      { description: 'Chest X-Ray', quantity: 1, unitPrice: 2500, total: 2500 },
      { description: 'ECG', quantity: 1, unitPrice: 1500, total: 1500 },
      { description: 'General Health Screening', quantity: 1, unitPrice: 1000, total: 1000 }
    ]
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-0925',
    date: '2024-09-25',
    dueDate: '2024-10-10',
    amount: 3200,
    status: 'Paid',
    service: 'Cardiology Consultation',
    department: 'Cardiology',
    doctor: 'Dr. James Wilson',
    items: [
      { description: 'Specialist Consultation', quantity: 1, unitPrice: 2000, total: 2000 },
      { description: 'Electrocardiogram (ECG)', quantity: 1, unitPrice: 1200, total: 1200 }
    ]
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-0820',
    date: '2024-08-20',
    dueDate: '2024-09-05',
    amount: 5600,
    status: 'Pending',
    service: 'Follow-up & Lab Tests',
    department: 'General Medicine',
    doctor: 'Dr. Sarah Mitchell',
    items: [
      { description: 'Follow-up Consultation', quantity: 1, unitPrice: 1200, total: 1200 },
      { description: 'Thyroid Function Test', quantity: 1, unitPrice: 1500, total: 1500 },
      { description: 'Vitamin D Test', quantity: 1, unitPrice: 1800, total: 1800 },
      { description: 'HbA1c Test', quantity: 1, unitPrice: 1100, total: 1100 }
    ]
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-0715',
    date: '2024-07-15',
    dueDate: '2024-07-30',
    amount: 12500,
    status: 'Paid',
    service: 'Minor Procedure',
    department: 'General Surgery',
    doctor: 'Dr. Emily Stones',
    items: [
      { description: 'Procedure Fee', quantity: 1, unitPrice: 8000, total: 8000 },
      { description: 'Anesthesia', quantity: 1, unitPrice: 2000, total: 2000 },
      { description: 'Medical Supplies', quantity: 1, unitPrice: 1500, total: 1500 },
      { description: 'Post-op Consultation', quantity: 1, unitPrice: 1000, total: 1000 }
    ]
  }
];

export const PatientBilling = () => {
  const [selectedBilling, setSelectedBilling] = useState<BillingStatement | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const getStatusColor = (status: BillingStatement['status']) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Overdue': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Partially Paid': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getStatusIcon = (status: BillingStatement['status']) => {
    switch (status) {
      case 'Paid': return CheckCircle;
      case 'Pending': return Clock;
      case 'Overdue': return AlertCircle;
      default: return FileText;
    }
  };

  const totalAmount = mockBillings.reduce((sum, bill) => sum + bill.amount, 0);
  const paidAmount = mockBillings.filter(b => b.status === 'Paid').reduce((sum, bill) => sum + bill.amount, 0);
  const pendingAmount = mockBillings.filter(b => b.status === 'Pending' || b.status === 'Overdue').reduce((sum, bill) => sum + bill.amount, 0);

  const filteredBillings = filterStatus === 'All' 
    ? mockBillings 
    : mockBillings.filter(b => b.status === filterStatus);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Billing & Payments</h1>
          <p className="text-slate-400 text-sm mt-1">Manage your medical bills and payment history</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white text-sm font-bold rounded-xl hover:bg-slate-600 transition-colors border border-slate-600">
            <Printer size={16} />
            Print
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-500 transition-colors shadow-lg shadow-teal-900/20">
            <Download size={16} />
            Download All
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-teal-900/50 to-slate-900 p-6 rounded-xl border border-teal-500/30 shadow-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-teal-500/20 rounded-lg">
                <DollarSign className="text-teal-400" size={24} />
              </div>
              <TrendingUp className="text-teal-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white mb-1">฿{totalAmount.toLocaleString()}</p>
            <p className="text-xs text-teal-300/70 font-medium uppercase tracking-wider">Total Billed</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="text-emerald-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">฿{paidAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Paid</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/50"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <Clock className="text-amber-400" size={24} />
            </div>
          </div>
          <p className="text-3xl font-bold text-white mb-1">฿{pendingAmount.toLocaleString()}</p>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Pending</p>
        </motion.div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-xl text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs text-indigo-200/70 font-medium uppercase tracking-wider mb-2">Primary Payment Method</p>
              <p className="text-lg font-bold">•••• •••• •••• 4582</p>
            </div>
            <CreditCard size={32} className="text-white/80" />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-indigo-200/70 mb-1">Cardholder</p>
              <p className="font-bold">John Doe</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-200/70 mb-1">Expires</p>
              <p className="font-bold">12/26</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {['All', 'Paid', 'Pending', 'Overdue'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={clsx(
              "px-4 py-2 rounded-lg text-xs font-bold transition-all",
              filterStatus === status
                ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700'
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Billing List */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
        <div className="divide-y divide-slate-700/30">
          {filteredBillings.map((billing, index) => {
            const StatusIcon = getStatusIcon(billing.status);
            return (
              <motion.div
                key={billing.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedBilling(billing)}
                className="p-5 hover:bg-slate-700/30 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={clsx("p-3 rounded-xl border", getStatusColor(billing.status))}>
                      <StatusIcon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-bold text-white text-sm group-hover:text-teal-400 transition-colors">
                          {billing.service}
                        </h3>
                        <span className={clsx("text-xs px-2 py-0.5 rounded-full border font-bold", getStatusColor(billing.status))}>
                          {billing.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        Invoice: {billing.invoiceNumber} • {billing.doctor} • {billing.department}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Issue Date: {format(new Date(billing.date), 'MMM dd, yyyy')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          Due: {format(new Date(billing.dueDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">฿{billing.amount.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">{billing.items.length} items</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors">
                        <Download size={16} />
                      </button>
                      {billing.status === 'Pending' && (
                        <button className="px-3 py-2 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-500 transition-colors">
                          Pay Now
                        </button>
                      )}
                      <ChevronRight size={20} className="text-slate-600" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* No Results */}
      {filteredBillings.length === 0 && (
        <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-slate-700/50">
          <Receipt size={48} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400">No billing statements found.</p>
        </div>
      )}

      {/* Help Section */}
      <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Mail size={20} className="text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Need help with billing?</p>
            <p className="text-xs text-slate-400">Contact our billing department at billing@hospital.com</p>
          </div>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};
